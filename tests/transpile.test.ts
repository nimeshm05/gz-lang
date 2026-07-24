import { describe, expect, it } from "vitest";
import { transpile } from "../src/index.js";
import { GzSyntaxError } from "../src/errors.js";

describe("transpile", () => {
  it("transpiles the spec example", () => {
    const source = [
      "chef greet(name) {",
      '    spill("yo " + name)',
      "}",
      "",
      'cook user = "Nimesh"',
      "",
      "greet(user)",
    ].join("\n");

    expect(transpile(source)).toBe(
      [
        "function greet(name) {",
        '    console.log("yo " + name);',
        "}",
        'let user = "Nimesh";',
        "greet(user);",
        "",
      ].join("\n"),
    );
  });

  it.each([
    ["cook x = 1", "let x = 1;"],
    ["lockedIn y = 2", "const y = 2;"],
    ["legacy z = 3", "var z = 3;"],
    ["cook a = 1, b = 2", "let a = 1, b = 2;"],
    ["cook flag = noCap", "let flag = true;"],
    ["cook nah = cap", "let nah = false;"],
    ["cook nothing = ghosted", "let nothing = null;"],
    ["cook mystery = idk", "let mystery = undefined;"],
    ["spill(whatIsThis 42)", "console.log(typeof 42);"],
    ["yeet obj.prop", "delete obj.prop;"],
    ["cook t = a ? b : c", "let t = a ? b : c;"],
    ["cook s = `hi ${name}`", "let s = `hi ${name}`;"],
    ["cook arr = [1, ...rest]", "let arr = [1, ...rest];"],
    ["cook o = { a, b: 2, ...extra }", "let o = { a, b: 2, ...extra };"],
    ["cook v = data?.items?.[0]", "let v = data?.items?.[0];"],
    ["cook f = (a, b = 1) => a + b", "let f = (a, b = 1) => a + b;"],
    ["cook g = waitForIt x => x", "let g = async x => x;"],
    ["cook n = spawn Map()", "let n = new Map();"],
    ["cook p = (1 + 2) * 3", "let p = (1 + 2) * 3;"],
    ["x ??= fallback", "x ??= fallback;"],
    ["count **= 2", "count **= 2;"],
  ])("transpiles %s", (source, expected) => {
    expect(transpile(source)).toBe(`${expected}\n`);
  });

  it("transpiles if / else if / else chains", () => {
    const source = [
      "lowkey (a) {",
      "    spill(1)",
      "} deadass lowkey (b) {",
      "    spill(2)",
      "} deadass {",
      "    spill(3)",
      "}",
    ].join("\n");
    expect(transpile(source)).toBe(
      [
        "if (a) {",
        "    console.log(1);",
        "} else if (b) {",
        "    console.log(2);",
        "} else {",
        "    console.log(3);",
        "}",
        "",
      ].join("\n"),
    );
  });

  it("transpiles switch statements", () => {
    const source = [
      "vibeCheck (mood) {",
      '    itsGiving "good":',
      "        spill(1)",
      "        imOut",
      "    fr:",
      "        spill(2)",
      "}",
    ].join("\n");
    expect(transpile(source)).toBe(
      [
        "switch (mood) {",
        '    case "good":',
        "        console.log(1);",
        "        break;",
        "    default:",
        "        console.log(2);",
        "}",
        "",
      ].join("\n"),
    );
  });

  it("transpiles all loop forms", () => {
    expect(transpile("grind (cook i = 0; i < 3; i++) {\n    spill(i)\n}")).toContain(
      "for (let i = 0; i < 3; i++) {",
    );
    expect(transpile("grind (lockedIn item of list) {\n    spill(item)\n}")).toContain(
      "for (const item of list) {",
    );
    expect(transpile("grind (cook key in obj) {\n    spill(key)\n}")).toContain(
      "for (let key in obj) {",
    );
    expect(transpile("stillCookin (x < 5) {\n    x++\n}")).toContain("while (x < 5) {");
    expect(transpile("firstOff {\n    x--\n} stillCookin (x > 0)")).toContain(
      "do {\n    x--;\n} while (x > 0);",
    );
  });

  it("transpiles classes with inheritance, super, and modifiers", () => {
    const source = [
      "squad Dev extends Person {",
      "    static count = 0",
      "    constructor(name) {",
      "        og(name)",
      "        me.name = name",
      "    }",
      "    waitForIt ship() {",
      "        holdUp deploy()",
      "    }",
      "    get handle() {",
      '        bet "@" + me.name',
      "    }",
      "}",
    ].join("\n");
    expect(transpile(source)).toBe(
      [
        "class Dev extends Person {",
        "    static count = 0;",
        "    constructor(name) {",
        "        super(name);",
        "        this.name = name;",
        "    }",
        "    async ship() {",
        "        await deploy();",
        "    }",
        "    get handle() {",
        '        return "@" + this.name;',
        "    }",
        "}",
        "",
      ].join("\n"),
    );
  });

  it("transpiles try / catch / finally and throw", () => {
    const source = [
      "yolo {",
      '    crashOut spawn Error("nope")',
      "} caughtIn4K (e) {",
      "    spill(e)",
      "} finally {",
      "    spill('done')",
      "}",
    ].join("\n");
    expect(transpile(source)).toBe(
      [
        "try {",
        '    throw new Error("nope");',
        "} catch (e) {",
        "    console.log(e);",
        "} finally {",
        "    console.log('done');",
        "}",
        "",
      ].join("\n"),
    );
  });

  it("transpiles imports and exports", () => {
    expect(transpile('yoink fs from "node:fs"')).toBe('import fs from "node:fs";\n');
    expect(transpile('yoink { readFile as read, writeFile } from "node:fs"')).toBe(
      'import { readFile as read, writeFile } from "node:fs";\n',
    );
    expect(transpile('yoink * as path from "node:path"')).toBe('import * as path from "node:path";\n');
    expect(transpile('yoink "./side-effect.js"')).toBe('import "./side-effect.js";\n');
    expect(transpile("putOn lockedIn version = 1")).toBe("export const version = 1;\n");
    expect(transpile("putOn chef helper() {\n    bet 1\n}")).toBe(
      "export function helper() {\n    return 1;\n}\n",
    );
    expect(transpile("putOn { a, b as c }")).toBe("export { a, b as c };\n");
    expect(transpile("putOn fr chef main() {\n    bet 1\n}")).toBe(
      "export default function main() {\n    return 1;\n}\n",
    );
    expect(transpile("putOn fr 42")).toBe("export default 42;\n");
  });

  it("handles return with and without an argument (ASI)", () => {
    expect(transpile("chef f() {\n    bet 1\n}")).toBe("function f() {\n    return 1;\n}\n");
    expect(transpile("chef f() {\n    bet\n}")).toBe("function f() {\n    return;\n}\n");
  });

  it("keeps slang words literal when used as property names and keys", () => {
    expect(transpile("cook x = obj.me")).toBe("let x = obj.me;\n");
    expect(transpile("cook x = { cook: 1 }")).toBe("let x = { cook: 1 };\n");
  });

  it("throws GzSyntaxError with position on bad syntax", () => {
    try {
      transpile("lowkey age >= 18) {\n}");
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(GzSyntaxError);
      const gz = error as GzSyntaxError;
      expect(gz.line).toBe(1);
      expect(gz.message).toContain("Expected '('");
    }
  });

  it("suggests slang when raw JavaScript keywords are used", () => {
    expect(() => transpile("if (x) {}")).toThrowError(/Use 'lowkey' instead/);
    expect(() => transpile("const x = 1")).toThrowError(/Use 'lockedIn' instead/);
  });
});
