import repl from "node:repl";
import vm from "node:vm";
import os from "node:os";
import path from "node:path";
import { parse } from "./parser/parser.js";
import { generate } from "./codegen/codegen.js";
import { tokenize } from "./tokenizer/tokenizer.js";
import { GzSyntaxError } from "./errors.js";
import type * as ast from "./parser/ast.js";

/** Starts the interactive gzlang REPL. */
export function startRepl(version: string): void {
  process.stdout.write(`gzlang ${version} -- type slang, get JavaScript (.exit or Ctrl+D to dip)\n`);
  const server = repl.start({
    prompt: "gz> ",
    eval: evalGz,
    ignoreUndefined: true,
  });
  server.setupHistory(path.join(os.homedir(), ".gzlang_history"), () => {});
}

export interface ReplCode {
  js: string;
  /** The same program wrapped in an async IIFE, for top-level holdUp. */
  asyncJs: string;
}

/**
 * Transpiles source for REPL evaluation. Top-level `cook`/`lockedIn` and
 * `squad` declarations are rewritten to `var` bindings because `let`,
 * `const`, and `class` don't attach to the vm context and would vanish
 * between REPL lines.
 */
export function transpileForRepl(source: string): ReplCode {
  const program = parse(source);
  const body = program.body.map(toReplStatement);
  const js = generate({ ...program, body });

  const asyncBody = [...body];
  const last = asyncBody[asyncBody.length - 1];
  if (last !== undefined && last.type === "ExpressionStatement") {
    // Return the final expression so `holdUp fetch(...)` prints its value.
    asyncBody[asyncBody.length - 1] = {
      type: "ReturnStatement",
      argument: last.expression,
      line: last.line,
      column: last.column,
    };
  }
  const asyncJs = `(async () => {\n${generate({ ...program, body: asyncBody })}})()`;
  return { js, asyncJs };
}

function toReplStatement(stmt: ast.Statement): ast.Statement {
  if (stmt.type === "VariableDeclaration") {
    return { ...stmt, kind: "var" };
  }
  if (stmt.type === "ClassDeclaration" && stmt.id !== null) {
    const cls: ast.ClassExpression = { ...stmt, type: "ClassExpression" };
    return {
      type: "VariableDeclaration",
      kind: "var",
      declarations: [
        {
          type: "VariableDeclarator",
          id: stmt.id,
          init: cls,
          line: stmt.line,
          column: stmt.column,
        },
      ],
      line: stmt.line,
      column: stmt.column,
    };
  }
  return stmt;
}

/**
 * Decides whether a syntax error means "the user isn't done typing yet"
 * (unbalanced brackets, dangling expression) rather than a real mistake.
 */
export function isRecoverable(source: string, error: GzSyntaxError): boolean {
  if (error.message.includes("end of file")) return true;
  try {
    let depth = 0;
    for (const token of tokenize(source)) {
      if (token.type !== "punct") continue;
      if (token.value === "(" || token.value === "[" || token.value === "{") depth++;
      else if (token.value === ")" || token.value === "]" || token.value === "}") depth--;
    }
    return depth > 0;
  } catch (err) {
    return err instanceof GzSyntaxError && /Unterminated (template literal|comment)/.test(err.message);
  }
}

function evalGz(
  this: repl.REPLServer,
  input: string,
  context: vm.Context,
  _file: string,
  callback: (err: Error | null, result?: unknown) => void,
): void {
  const source = input.trim();
  if (source === "") {
    callback(null);
    return;
  }

  let code: ReplCode;
  try {
    code = transpileForRepl(source);
  } catch (error) {
    if (error instanceof GzSyntaxError && isRecoverable(source, error)) {
      callback(new repl.Recoverable(error));
    } else if (error instanceof GzSyntaxError) {
      callback(withoutStackNoise(error));
    } else {
      callback(toError(error));
    }
    return;
  }

  try {
    callback(null, vm.runInContext(code.js, context, { filename: "gzlang-repl" }));
  } catch (error) {
    // V8 rejects bare top-level await; rerun inside an async wrapper.
    if (isTopLevelAwaitError(error)) {
      runAsync(code.asyncJs, context, callback);
      return;
    }
    callback(toError(error));
  }
}

/**
 * The vm compiles code in its own realm, so `instanceof` checks fail
 * across realms entirely; match on the error's shape instead.
 */
function isTopLevelAwaitError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const candidate = error as { name?: unknown; message?: unknown };
  return (
    candidate.name === "SyntaxError" &&
    typeof candidate.message === "string" &&
    candidate.message.includes("await is only valid")
  );
}

/** Rebuilds a syntax error so the REPL prints the code frame, not a stack trace. */
function withoutStackNoise(error: GzSyntaxError): Error {
  const clean = new Error(error.message);
  clean.name = error.name;
  clean.stack = `${error.name}: ${error.message}`;
  return clean;
}

function runAsync(
  js: string,
  context: vm.Context,
  callback: (err: Error | null, result?: unknown) => void,
): void {
  try {
    const promise = vm.runInContext(js, context, { filename: "gzlang-repl" }) as Promise<unknown>;
    promise.then(
      (value) => callback(null, value),
      (error: unknown) => callback(toError(error)),
    );
  } catch (error) {
    callback(toError(error));
  }
}

function toError(value: unknown): Error {
  if (value instanceof Error) return value;
  // Errors thrown inside the vm realm fail instanceof but are real errors;
  // pass them through, trimming REPL-internal frames from the stack.
  if (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "message" in value &&
    "stack" in value
  ) {
    const error = value as Error;
    if (typeof error.stack === "string") {
      const lines = error.stack.split("\n");
      const internal = lines.findIndex(
        (line) => line.includes("node:vm") || line.includes("REPLServer"),
      );
      if (internal !== -1) error.stack = lines.slice(0, internal).join("\n");
    }
    return error;
  }
  return new Error(String(value));
}
