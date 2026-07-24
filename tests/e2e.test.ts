import { describe, expect, it } from "vitest";
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { transpile } from "../src/index.js";

const examplesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "examples");

/** Transpiles a .gz example and executes the generated JavaScript with Node. */
function runExample(name: string): string {
  const source = readFileSync(path.join(examplesDir, name), "utf8");
  const code = transpile(source);
  const dir = mkdtempSync(path.join(tmpdir(), "gzlang-test-"));
  try {
    const file = path.join(dir, "out.mjs");
    writeFileSync(file, code);
    const result = spawnSync(process.execPath, [file], { encoding: "utf8" });
    if (result.status !== 0) {
      throw new Error(`Generated JS failed:\n${result.stderr}\n---\n${code}`);
    }
    return result.stdout;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

describe("end-to-end examples", () => {
  it("runs hello.gz", () => {
    expect(runExample("hello.gz")).toBe("yo Nimesh\n");
  });

  it("runs fizzbuzz.gz", () => {
    expect(runExample("fizzbuzz.gz")).toBe(
      "1\n2\nfizz\n4\nbuzz\nfizz\n7\n8\nfizz\nbuzz\n11\nfizz\n13\n14\nfizzbuzz\n",
    );
  });

  it("runs async.gz", () => {
    expect(runExample("async.gz")).toBe("vibes received after 10ms\n");
  });

  it("runs showcase.gz", () => {
    expect(runExample("showcase.gz")).toBe(
      [
        "yo bestie",
        "adult fr",
        "grinding 0",
        "grinding 2",
        "its giving Nimesh who codes gz",
        "caught in 4k: oops",
        "its a number",
        "[ 2, 4, 6 ]",
        "it ghosted us",
        "true false undefined",
        "n is 0",
        "fit",
        "vibe",
        "",
      ].join("\n"),
    );
  });
});
