# gzlang Architecture & Code Flow Guide

*A beginner-friendly explanation of how the project works*

**Project:** gzlang · **Version:** 0.1.0 · For new contributors and learners

---

## 1. What is gzlang? (In plain English)

gzlang is a fun programming language that lets you write code using Gen Z slang words instead of normal JavaScript keywords. For example, you write `cook` instead of `let`, `spill` instead of `console.log`, and `chef` instead of `function`.

Important: gzlang is not a brand-new computer language with its own engine. It is a **transpiler**. That means it translates your `.gz` source file into regular JavaScript, and then Node.js (or a browser) runs that JavaScript like any other JS program.

Think of it like this:

- You write slang (gzlang).
- gzlang rewrites it into normal JavaScript.
- JavaScript runs the result.

Tiny example:

```text
gzlang input:
  cook name = "Nimesh"
  spill("yo " + name)

JavaScript output:
  let name = "Nimesh";
  console.log("yo " + name);
```

---

## 2. Big picture: the four-stage pipeline

Almost every compiler and transpiler follows a similar pipeline. gzlang uses four stages. Each stage takes input from the previous one and produces something more structured.

```text
.gz source code
      ↓
1. Tokenizer  (Lexer)
      ↓
2. Parser
      ↓
3. Abstract Syntax Tree (AST)
      ↓
4. Code Generator
      ↓
JavaScript output
```

A helpful analogy: cooking a meal.

- **Tokenizer** = chopping ingredients into small pieces (words/tokens).
- **Parser** = following a recipe to assemble those pieces into a meal plan (the AST).
- **Code generator** = plating the dish as JavaScript that a computer can serve.

The main function that runs this whole pipeline is `transpile()` in `src/index.ts`. It is only one line of logic: parse the source, then generate JavaScript from the tree.

```text
transpile(source)  →  generate(parse(source))
```

---

## 3. Project folder map

You do not need to memorize every file. Start with these locations:

- **`src/index.ts`** — the public API: `transpile`, `tokenize`, `parse`, `generate`
- **`src/cli.ts`** — command-line tool (`run` / `build` / help / version)
- **`src/repl.ts`** — interactive prompt (like `python` or `node`)
- **`src/keywords.ts`** — slang dictionary (`cook` → `let`, `spill` → `console.log`, …)
- **`src/tokenizer/`** — splits source text into tokens
- **`src/parser/`** — builds the AST from tokens
- **`src/codegen/`** — walks the AST and prints JavaScript
- **`src/errors.ts`** — friendly error messages with line/column
- **`examples/`** — sample `.gz` programs
- **`tests/`** — automated checks for each stage

Design rule of this project: almost all slang lives in `keywords.ts`. If you want to add a new slang word, you usually edit that one file — not the tokenizer, parser, and generator separately.

---

## 4. Stage 1 — Tokenizer (breaking text into tokens)

### 4.1 What problem does it solve?

A computer cannot understand a whole file of text at once the way humans do. The tokenizer reads the source character by character and groups characters into meaningful chunks called **tokens**.

Example input:

```text
cook x = 10
```

Rough token list:

```text
keyword(let)     ← from slang word 'cook'
identifier(x)
punct(=)
number(10)
eof
```

### 4.2 Where the code lives

- **`src/tokenizer/tokens.ts`** — the `Token` and `TokenType` types
- **`src/tokenizer/tokenizer.ts`** — the `Tokenizer` class and `tokenize()` function

### 4.3 What kinds of tokens exist?

- **`keyword`** — slang or special language words (`cook`, `lowkey`, …)
- **`identifier`** — variable/function names you invent (`x`, `greet`, …)
- **`number`** — numeric literals (`10`, `3.14`)
- **`string`** — quoted text (`"yo"`)
- **`template*`** — backtick strings, including `${...}` pieces
- **`punct`** — punctuation and operators (`{` `}` `(` `)` `=` `+` `=>` …)
- **`eof`** — end of file marker

### 4.4 The clever slang trick

When the tokenizer sees `cook`, it does not keep the token value as `cook`. It looks up `cook` in `KEYWORDS` and stores the JavaScript meaning `let` as the token's `value`. The original spelling is kept in `raw` for error messages.

So later stages mostly think in JavaScript keywords already. That keeps the parser simpler: it can ask “is this a `let` keyword?” even though the user typed `cook`.

If someone writes the real JavaScript word `let` by mistake, the tokenizer rejects it and suggests the slang alternative (`cook`). Property names after a dot are allowed, so things like `promise.catch` still work.

---

## 5. Stage 2 — Parser (understanding structure)

### 5.1 What problem does it solve?

Tokens are still a flat list. The parser turns that list into a **tree** that shows how pieces relate — which expression is inside which `if`, which statements belong to which function, and so on.

### 5.2 Where the code lives

- **`src/parser/ast.ts`** — node type definitions (`Program`, `IfStatement`, …)
- **`src/parser/parser.ts`** — the `Parser` class and `parse()` function

### 5.3 How parsing works (simple version)

The parser walks through tokens from left to right. At each point it asks: “What kind of statement or expression starts here?” Then it consumes the tokens needed for that construct and builds an AST node.

For example, when it sees a `let` keyword token (which came from `cook`), it knows a variable declaration is starting.

Expressions use **operator precedence**. That means `*` binds tighter than `+`, so `1 + 2 * 3` becomes addition of `1` and `(2 * 3)`, not `(1 + 2) * 3`. This lives in the `BINARY_PRECEDENCE` table inside the parser.

### 5.4 Semicolons are optional

JavaScript often inserts semicolons automatically. gzlang has a simple version of that: a statement can end with `;`, a newline, a closing `}`, or the end of the file.

---

## 6. Stage 3 — The AST (the tree in the middle)

AST stands for **Abstract Syntax Tree**. “Abstract” means it keeps the meaning, not every detail of spacing or comments.

For this code:

```text
lowkey (age >= 18) {
    spill("adult fr")
}
```

The AST (simplified) looks conceptually like:

```text
IfStatement
├── test: BinaryExpression (>=)
│     ├── left: Identifier(age)
│     └── right: NumericLiteral(18)
└── consequent: BlockStatement
      └── ExpressionStatement
            └── CallExpression(spill, "adult fr")
```

Why bother with a tree? Because find-and-replace on slang words would break easily (for example inside strings, or with nested code). A real parser understands structure, so the rewrite is safe and correct.

---

## 7. Stage 4 — Code generator (printing JavaScript)

### 7.1 What problem does it solve?

The AST is a data structure in memory. The code generator walks that tree and writes readable JavaScript text — with indentation and semicolons.

### 7.2 Where the code lives

- **`src/codegen/codegen.ts`** — `CodeGenerator` class and `generate()` function

### 7.3 How generation works

For each AST node type (`VariableDeclaration`, `IfStatement`, `ClassDeclaration`, …) there is a method that prints the matching JavaScript syntax. Child nodes are generated recursively.

One special case: **builtins**. The identifier `spill` is rewritten to `console.log` during generation using the `BUILTINS` map from `keywords.ts`. Most other identifiers print unchanged.

---

## 8. How a file travels through the tools

### 8.1 Programmatic API

Other JavaScript/TypeScript code can import the package and call `transpile()`:

```js
import { transpile } from "gzlang";

const js = transpile('spill("yo")');
// js === 'console.log("yo");\n'
```

Lower-level pieces are also exported: `tokenize`, `parse`, `generate`, `KEYWORDS`, and `GzSyntaxError`. That lets people build editors, formatters, or playgrounds on top of gzlang.

### 8.2 CLI: `gzlang build`

Flow when you run: `gzlang build app.gz -o dist/app.js`

1. `cli.ts` reads the command-line arguments.
2. It reads the `.gz` file from disk.
3. It calls `transpile(source)`.
4. It writes the JavaScript string to the output file.

### 8.3 CLI: `gzlang run`

Flow when you run: `gzlang run app.gz`

1. Same transpile step as build.
2. Write a temporary `.mjs` file next to the source (so relative imports still work).
3. Start Node.js on that temp file.
4. Delete the temp file when finished.

### 8.4 CLI: interactive REPL

Running `gzlang` with no arguments (or `gzlang repl`) opens an interactive prompt. Each line (or multiline block) is parsed and generated, then evaluated in a Node.js VM context.

REPL extras beginners should know:

- Variables and classes persist across lines (with a small rewrite so `let`/`const`/`class` survive in the VM).
- Unfinished blocks (missing `}`) are treated as “keep typing,” not as hard errors.
- History is saved to `~/.gzlang_history`.

---

## 9. Errors: helping humans fix mistakes

When something is wrong, gzlang throws `GzSyntaxError` (`src/errors.ts`). Errors include:

- A clear message (often with slang-friendly wording).
- Line and column numbers.
- A small code frame that points at the bad spot with a `^` marker.

Example idea:

```text
'let' is not gzlang. Use 'cook' instead, bestie (line 1, column 1)

1 | let x = 1
  | ^
```

The CLI catches these errors and prints them to stderr, then exits with a non-zero status. That keeps the experience friendly instead of dumping a raw stack trace for common mistakes.

---

## 10. End-to-end walkthrough (one example)

Source (`.gz`):

```text
chef greet(name) {
    spill("yo " + name)
}

cook user = "Nimesh"
greet(user)
```

### Step A — Tokenize

`chef` becomes `keyword(function)`, `spill` stays an identifier for now, `cook` becomes `keyword(let)`, strings and punctuation become their own tokens.

### Step B — Parse

The parser builds a `Program` with three top-level statements: a `FunctionDeclaration` named `greet`, a `VariableDeclaration` for `user`, and an `ExpressionStatement` that calls `greet(user)`.

### Step C — Generate

The generator prints `function greet(...)`, rewrites `spill(...)` to `console.log(...)`, prints `let user = ...`, and prints `greet(user);`.

Final JavaScript:

```js
function greet(name) {
    console.log("yo " + name);
}
let user = "Nimesh";
greet(user);
```

---

## 11. Architecture diagram (components)

```text
┌─────────────────────────────────────────────────────┐
│                     User tools                       │
│   CLI (cli.ts)     REPL (repl.ts)     npm API        │
└───────────────┬─────────────┬─────────────┬──────────┘
                │             │             │
                └──────┬──────┴──────┬──────┘
                       ▼             ▼
                 transpile()     tokenize/parse/generate
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
     Tokenizer      Parser     Codegen
          │            │            │
          └──── uses ──┴── keywords.ts (slang maps)
                       │
                       ▼
                 errors.ts (GzSyntaxError)
```

---

## 12. What gzlang intentionally does NOT do

Keeping the scope small makes the project easier to learn:

- It does not build a JavaScript engine or virtual machine.
- It does not add a new type system.
- It does not optimize your JavaScript for speed.
- Operators and most syntax stay normal JavaScript; mainly keywords/builtins change.

Current limitations (good to know): destructuring, generators, labeled statements, and regex literals are not supported yet. For regex, use `spawn RegExp("...")`.

---

## 13. How to explore the code as a beginner

1. Run examples: `gzlang run examples/hello.gz`
2. Open `src/keywords.ts` and notice how small the slang table is.
3. Open `src/index.ts` and see the one-line transpile pipeline.
4. Skim `tokenizer.ts`: find `readWord()` where `cook` becomes `let`.
5. Skim `parser.ts`: find `parseProgram()` and `parseStatement()`.
6. Skim `codegen.ts`: find `genStatement()` and the Identifier → `BUILTINS` rewrite.
7. Run `npm test` and read a failing test if you change something — tests explain expected behavior.

Suggested learning order: **keywords → tokenizer → parser AST types → codegen → CLI/REPL**.

---

## 14. Glossary (beginner dictionary)

- **Transpiler:** A program that translates source code from one language into another language at a similar level (here: gzlang → JavaScript).
- **Token:** A small meaningful piece of source text, such as a keyword, number, or operator.
- **Tokenizer / Lexer:** The stage that splits source text into tokens.
- **Parser:** The stage that turns tokens into a structured tree (AST).
- **AST:** Abstract Syntax Tree — a tree that represents the meaning of the program.
- **Code generation:** Walking the AST and printing target code (JavaScript).
- **CLI:** Command-line interface — the `gzlang` program you run in a terminal.
- **REPL:** Read-Eval-Print Loop — an interactive prompt for trying code line by line.
- **Keyword map:** The dictionary in `keywords.ts` that connects slang words to JavaScript words.
- **Builtin:** A special identifier rewritten during codegen, like `spill` → `console.log`.

---

## 15. Quick reference: main entry points

| You want to… | Start here | Key function / idea |
| --- | --- | --- |
| Transpile a string | `src/index.ts` | `transpile(source)` |
| Split into tokens | `src/tokenizer/tokenizer.ts` | `tokenize(source)` |
| Build an AST | `src/parser/parser.ts` | `parse(source)` |
| Emit JavaScript | `src/codegen/codegen.ts` | `generate(program)` |
| Add slang vocabulary | `src/keywords.ts` | `KEYWORDS` / `BUILTINS` |
| Change CLI behavior | `src/cli.ts` | `run` / `build` commands |
| Change the REPL | `src/repl.ts` | `startRepl` / `transpileForRepl` |
| Improve error messages | `src/errors.ts` | `GzSyntaxError` |

---

*Bottom line: gzlang is a small, real source-to-source compiler. Source text becomes tokens, tokens become a tree, and the tree becomes JavaScript. Once you can follow that path through the folders above, you understand the whole project.*
