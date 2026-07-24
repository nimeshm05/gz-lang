import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { transpileForRepl, isRecoverable } from "../src/repl.js";
import { GzSyntaxError } from "../src/errors.js";

const cliPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "dist", "cli.js");

/** Pipes input lines into the built CLI's REPL and returns combined output. */
function runRepl(input: string): string {
  const result = spawnSync(process.execPath, [cliPath], {
    input,
    encoding: "utf8",
    timeout: 15_000,
  });
  return `${result.stdout}${result.stderr}`;
}

describe("transpileForRepl", () => {
  it("rewrites cook/lockedIn to var so bindings persist across lines", () => {
    expect(transpileForRepl("cook x = 1").js).toBe("var x = 1;\n");
    expect(transpileForRepl("lockedIn y = 2").js).toBe("var y = 2;\n");
  });

  it("rewrites squad declarations to var class expressions", () => {
    const { js } = transpileForRepl("squad Person {\n}");
    expect(js).toBe("var Person = class Person {};\n");
  });

  it("leaves other statements alone", () => {
    expect(transpileForRepl("spill(1)").js).toBe("console.log(1);\n");
  });

  it("wraps the final expression in a return for the async variant", () => {
    const { asyncJs } = transpileForRepl("holdUp Promise.resolve(7)");
    expect(asyncJs).toContain("return await Promise.resolve(7);");
    expect(asyncJs).toMatch(/^\(async \(\) => \{\n/);
  });
});

describe("isRecoverable", () => {
  function syntaxErrorFor(source: string): GzSyntaxError {
    try {
      transpileForRepl(source);
    } catch (error) {
      if (error instanceof GzSyntaxError) return error;
    }
    throw new Error(`Expected '${source}' to fail parsing`);
  }

  it("treats unbalanced blocks as incomplete input", () => {
    expect(isRecoverable("lowkey (noCap) {", syntaxErrorFor("lowkey (noCap) {"))).toBe(true);
    expect(isRecoverable("chef f() {", syntaxErrorFor("chef f() {"))).toBe(true);
  });

  it("treats dangling expressions as incomplete input", () => {
    expect(isRecoverable("cook x =", syntaxErrorFor("cook x ="))).toBe(true);
  });

  it("treats genuinely bad syntax as a real error", () => {
    expect(isRecoverable("lowkey noCap) {}", syntaxErrorFor("lowkey noCap) {}"))).toBe(false);
  });
});

describe("REPL integration (built CLI)", () => {
  // Assertion values are distinctive so digits inside incidental stack
  // traces can never produce a false pass.
  it("evaluates expressions and persists variables across lines", () => {
    const output = runRepl("cook x = 40000\nx + 2042\n");
    expect(output).toContain("42042");
  });

  it("handles multiline blocks", () => {
    const output = runRepl('lowkey (noCap) {\n    spill("fr fr bestie")\n}\n');
    expect(output).toContain("fr fr bestie");
  });

  it("persists classes and supports spawn", () => {
    const output = runRepl(
      "squad P {\n    constructor(n) {\n        me.n = n\n    }\n}\nspawn P(31337).n\n",
    );
    expect(output).toContain("31337");
  });

  it("supports top-level holdUp", () => {
    const output = runRepl('holdUp Promise.resolve("async vibes received")\n');
    expect(output).toContain("async vibes received");
    expect(output).not.toContain("await is only valid");
  });

  it("suggests slang for raw JavaScript keywords without a stack trace", () => {
    const output = runRepl("let x = 1\n");
    expect(output).toContain("Use 'cook' instead");
    expect(output).not.toContain("at Parser");
  });
});
