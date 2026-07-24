# gzlang --- Gen Z Programming Language

## Vision

**gzlang** is a fun programming language that lets developers write
JavaScript using Gen Z internet slang.

Rather than building a new compiler, runtime, or virtual machine,
**gzlang transpiles Gen Z syntax into standard JavaScript**, allowing
programs to run anywhere JavaScript runs (Node.js, Bun, Deno, or modern
browsers).

The project is inspired by joke languages like Bhailang, but is designed
as a real learning project for programming language implementation.

------------------------------------------------------------------------

# Project Goals

## Primary Goal

Build a source-to-source transpiler that converts `.gz` files into
JavaScript.

``` text
.gz source
    ↓
Tokenizer
    ↓
Parser
    ↓
Abstract Syntax Tree (AST)
    ↓
JavaScript Code Generator
    ↓
Node.js / Browser
```

------------------------------------------------------------------------

## Objectives

### 1. Design a Fun Language

Replace JavaScript keywords with Gen Z vocabulary while keeping
JavaScript semantics.

Example:

``` gz
cook age = 24

lowkey (age >= 18) {
    spill("adult fr")
}
```

Compiles to:

``` js
let age = 24;

if (age >= 18) {
    console.log("adult fr");
}
```

### 2. Build a Transpiler

Implement:

-   Tokenizer (Lexer)
-   Parser
-   AST Generator
-   JavaScript Code Generator
-   CLI

### 3. Keep JavaScript Compatibility

-   JavaScript operators remain unchanged
-   Variables behave the same
-   Functions behave the same
-   Only keywords are replaced

### 4. Easy to Extend

Store keywords in a single mapping file.

``` json
{
  "cook": "let",
  "lockedIn": "const",
  "lowkey": "if"
}
```

Contributors can add new slang without changing compiler logic.

------------------------------------------------------------------------

# Non-Goals

This project does **not** aim to:

-   Build a JavaScript engine
-   Create a virtual machine
-   Replace Node.js
-   Add a new type system
-   Optimize JavaScript

------------------------------------------------------------------------

# Roadmap

## Phase 1 --- Language Design

Define:

-   Keywords
-   Grammar
-   File extension (`.gz`)
-   Standard library

------------------------------------------------------------------------

## Phase 2 --- Tokenizer

Convert source code into tokens.

------------------------------------------------------------------------

## Phase 3 --- Parser

Build an Abstract Syntax Tree (AST).

------------------------------------------------------------------------

## Phase 4 --- JavaScript Generator

Generate readable JavaScript.

------------------------------------------------------------------------

## Phase 5 --- CLI

Commands:

``` bash
gzlang run app.gz
gzlang build app.gz
```

------------------------------------------------------------------------

## Phase 6 --- Tooling

-   VS Code syntax highlighting
-   Formatter
-   Playground
-   Documentation

------------------------------------------------------------------------

# Suggested Gen Z Keywords

  JavaScript      gzlang          Why
  --------------- --------------- ----------------------------------
  `let`           `cook`          Start cooking (create something)
  `const`         `lockedIn`      Value is locked in
  `var`           `legacy`        Nobody should use it anymore
  `if`            `lowkey`        "Lowkey true"
  `else`          `deadass`       Otherwise, deadass
  `switch`        `vibeCheck`     Check the vibe
  `case`          `itsGiving`     It's giving...
  `default`       `fr`            For real fallback
  `for`           `grind`         Keep grinding
  `while`         `stillCookin`   Keep cooking
  `do`            `firstOff`      Do first
  `break`         `imOut`         I'm out
  `continue`      `keepCookin`    Continue looping
  `function`      `chef`          The chef makes things happen
  `return`        `bet`           Bet, here's the result
  `class`         `squad`         A squad of behaviors
  `new`           `spawn`         Spawn an object
  `this`          `me`            Refers to me
  `true`          `noCap`         True, no cap
  `false`         `cap`           That's cap
  `null`          `ghosted`       Nothing there
  `undefined`     `idk`           Unknown
  `try`           `yolo`          Give it a shot
  `catch`         `caughtIn4K`    Caught the error
  `throw`         `crashOut`      Throw an exception
  `async`         `waitForIt`     Async function
  `await`         `holdUp`        Wait here
  `import`        `yoink`         Bring it in
  `export`        `putOn`         Share it
  `console.log`   `spill`         Spill the tea
  `typeof`        `whatIsThis`    Inspect type
  `delete`        `yeet`          Throw it away
  `super`         `og`            Original/base class

------------------------------------------------------------------------

# Example

``` gz
chef greet(name) {
    spill("yo " + name)
}

cook user = "Nimesh"

greet(user)
```

Compiles to:

``` js
function greet(name) {
    console.log("yo " + name);
}

let user = "Nimesh";

greet(user);
```

------------------------------------------------------------------------

# Future Ideas

-   Multiple slang packs (Gen Alpha, Pirate, Shakespeare, Corporate)
-   Source maps
-   Interactive playground
-   Auto formatter (`gzfmt`)
-   AI-assisted keyword suggestions
