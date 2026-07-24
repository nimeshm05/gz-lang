import { describe, expect, it } from "vitest";
import { tokenize } from "../src/tokenizer/tokenizer.js";
import { GzSyntaxError } from "../src/errors.js";

function kinds(source: string): string[] {
  return tokenize(source).map((t) => `${t.type}:${t.value}`);
}

describe("tokenizer", () => {
  it("maps slang words to canonical JavaScript keywords", () => {
    expect(kinds("cook x = 1")).toEqual([
      "keyword:let",
      "identifier:x",
      "punct:=",
      "number:1",
      "eof:",
    ]);
  });

  it("keeps the original slang in the token raw", () => {
    const [token] = tokenize("lockedIn");
    expect(token).toMatchObject({ type: "keyword", value: "const", raw: "lockedIn" });
  });

  it("tracks line and column positions", () => {
    const tokens = tokenize("cook a = 1\ncook b = 2");
    const secondCook = tokens.find((t) => t.raw === "cook" && t.line === 2);
    expect(secondCook).toMatchObject({ line: 2, column: 1, newlineBefore: true });
  });

  it("skips line and block comments", () => {
    expect(kinds("// yap\n/* more\nyap */ 42")).toEqual(["number:42", "eof:"]);
  });

  it("tokenizes strings with escapes", () => {
    expect(kinds(`"say \\"less\\""`)).toEqual([`string:"say \\"less\\""`, "eof:"]);
  });

  it("splits interpolated template literals into chunks", () => {
    expect(kinds("`yo ${name} fr`")).toEqual([
      "templateStart:`yo ${",
      "identifier:name",
      "templateEnd:} fr`",
      "eof:",
    ]);
  });

  it("handles nested braces inside template interpolations", () => {
    expect(kinds("`v ${obj({ a: 1 })} end`")).toEqual([
      "templateStart:`v ${",
      "identifier:obj",
      "punct:(",
      "punct:{",
      "identifier:a",
      "punct::",
      "number:1",
      "punct:}",
      "punct:)",
      "templateEnd:} end`",
      "eof:",
    ]);
  });

  it("rejects raw JavaScript keywords with a slang suggestion", () => {
    expect(() => tokenize("let x = 1")).toThrowError(/Use 'cook' instead/);
    expect(() => tokenize("return 5")).toThrowError(/Use 'bet' instead/);
  });

  it("allows raw JavaScript keywords as property names", () => {
    expect(kinds("promise.catch")).toEqual([
      "identifier:promise",
      "punct:.",
      "identifier:catch",
      "eof:",
    ]);
  });

  it("reports position info on errors", () => {
    try {
      tokenize("cook x = @");
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(GzSyntaxError);
      expect((error as GzSyntaxError).line).toBe(1);
      expect((error as GzSyntaxError).column).toBe(10);
    }
  });
});
