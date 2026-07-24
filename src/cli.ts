import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { transpile } from "./index.js";
import { GzSyntaxError } from "./errors.js";

const HELP = `gzlang -- the Gen Z programming language, no cap

Usage:
  gzlang run <file.gz> [args...]     Transpile and execute with Node.js
  gzlang build <file.gz> [-o out]    Transpile to a JavaScript file

Options:
  -o, --out <file>   Output path for build (default: <file>.js)
  -h, --help         Show this help
  -v, --version      Show version

Examples:
  gzlang run app.gz
  gzlang build app.gz -o dist/app.js
`;

main();

function main(): void {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === undefined || command === "-h" || command === "--help") {
    process.stdout.write(HELP);
    process.exit(command === undefined ? 1 : 0);
  }
  if (command === "-v" || command === "--version") {
    process.stdout.write(`${readVersion()}\n`);
    process.exit(0);
  }

  if (command === "run") {
    runCommand(args.slice(1));
  } else if (command === "build") {
    buildCommand(args.slice(1));
  } else {
    fail(`Unknown command '${command}'. That ain't it.\n\n${HELP}`);
  }
}

function runCommand(args: string[]): void {
  const file = args[0];
  if (file === undefined) fail("Usage: gzlang run <file.gz> [args...]");

  const code = transpileFile(file);
  // The temp file lives next to the source so relative imports resolve.
  const outFile = path.join(
    path.dirname(path.resolve(file)),
    `.${path.basename(file, ".gz")}.gzlang-run.mjs`,
  );
  writeFileSync(outFile, code);

  let status: number;
  try {
    const result = spawnSync(process.execPath, [outFile, ...args.slice(1)], {
      stdio: "inherit",
    });
    status = result.status ?? 1;
  } finally {
    rmSync(outFile, { force: true });
  }
  process.exit(status);
}

function buildCommand(args: string[]): void {
  let file: string | undefined;
  let out: string | undefined;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!;
    if (arg === "-o" || arg === "--out") {
      out = args[++i];
      if (out === undefined) fail(`Missing value for ${arg}`);
    } else if (file === undefined) {
      file = arg;
    } else {
      fail(`Unexpected argument '${arg}'`);
    }
  }
  if (file === undefined) fail("Usage: gzlang build <file.gz> [-o out.js]");

  const code = transpileFile(file);
  const outFile = out ?? replaceExtension(file);
  writeFileSync(outFile, code);
  process.stdout.write(`cooked ${file} -> ${outFile}\n`);
}

function transpileFile(file: string): string {
  let source: string;
  try {
    source = readFileSync(file, "utf8");
  } catch {
    fail(`Cannot read '${file}'. It ghosted us.`);
  }
  try {
    return transpile(source);
  } catch (error) {
    if (error instanceof GzSyntaxError) {
      fail(`${file}: ${error.message}`);
    }
    throw error;
  }
}

function replaceExtension(file: string): string {
  return file.endsWith(".gz") ? `${file.slice(0, -3)}.js` : `${file}.js`;
}

function readVersion(): string {
  const pkgPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as { version: string };
  return pkg.version;
}

function fail(message: string): never {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
