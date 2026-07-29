# gzlang

Online Playground: [https://gz-lang.vercel.app/](https://gz-lang.vercel.app/)

A Gen Z programming language that transpiles to JavaScript. no cap.

Write JavaScript using Gen Z slang -- `gzlang` converts `.gz` files into clean, readable JavaScript that runs anywhere JavaScript runs (Node.js, Bun, Deno, modern browsers).

```text
chef greet(name) {
    spill("yo " + name)
}

cook user = "Nimesh"

greet(user)
```

compiles to:

```js
function greet(name) {
    console.log("yo " + name);
}
let user = "Nimesh";
greet(user);
```

## Install

```bash
npm install -g gzlang
```

## Usage

```bash
# transpile and run in one go
gzlang run app.gz

# transpile to a JavaScript file
gzlang build app.gz
gzlang build app.gz -o dist/app.js
```



### Interactive REPL

Run `gzlang` with no arguments (or `gzlang repl`) to get an interactive prompt, just like `python` or `node`:

```text
$ gzlang
gzlang 0.1.0 -- type slang, get JavaScript (.exit or Ctrl+D to dip)
gz> cook vibes = ["fr", "sheesh"]
gz> vibes.map(v => v + "!")
[ 'fr!', 'sheesh!' ]
gz> lowkey (noCap) {
...     spill("multiline works too")
... }
multiline works too
gz> holdUp Promise.resolve("even top-level holdUp")
'even top-level holdUp'
```

Variables, functions, and squads persist across lines, multiline blocks are detected automatically, and history is saved to `~/.gzlang_history`.

### Programmatic API

```js
import { transpile } from "gzlang";

const js = transpile('spill("yo")');
// console.log("yo");
```

The package also exports the lower-level pieces (`tokenize`, `parse`, `generate`) and the `KEYWORDS` map if you want to build tooling on top.

## The vocabulary


| JavaScript    | gzlang        | Why                              |
| ------------- | ------------- | -------------------------------- |
| `let`         | `cook`        | Start cooking (create something) |
| `const`       | `lockedIn`    | Value is locked in               |
| `var`         | `legacy`      | Nobody should use it anymore     |
| `if`          | `lowkey`      | "Lowkey true"                    |
| `else`        | `deadass`     | Otherwise, deadass               |
| `switch`      | `vibeCheck`   | Check the vibe                   |
| `case`        | `itsGiving`   | It's giving...                   |
| `default`     | `fr`          | For real fallback                |
| `for`         | `grind`       | Keep grinding                    |
| `while`       | `stillCookin` | Keep cooking                     |
| `do`          | `firstOff`    | Do first                         |
| `break`       | `imOut`       | I'm out                          |
| `continue`    | `keepCookin`  | Continue looping                 |
| `function`    | `chef`        | The chef makes things happen     |
| `return`      | `bet`         | Bet, here's the result           |
| `class`       | `squad`       | A squad of behaviors             |
| `new`         | `spawn`       | Spawn an object                  |
| `this`        | `me`          | Refers to me                     |
| `true`        | `noCap`       | True, no cap                     |
| `false`       | `cap`         | That's cap                       |
| `null`        | `ghosted`     | Nothing there                    |
| `undefined`   | `idk`         | Unknown                          |
| `try`         | `yolo`        | Give it a shot                   |
| `catch`       | `caughtIn4K`  | Caught the error                 |
| `throw`       | `crashOut`    | Throw an exception               |
| `async`       | `waitForIt`   | Async function                   |
| `await`       | `holdUp`      | Wait here                        |
| `import`      | `yoink`       | Bring it in                      |
| `export`      | `putOn`       | Share it                         |
| `console.log` | `spill`       | Spill the tea                    |
| `typeof`      | `whatIsThis`  | Inspect type                     |
| `delete`      | `yeet`        | Throw it away                    |
| `super`       | `og`          | Original/base class              |


Everything else -- operators, literals, function calls, property access -- is plain JavaScript. Words like `extends`, `finally`, `of`, and `in` are kept as-is.

Using a raw JavaScript keyword is a compile error with a helpful hint:

```text
'let' is not gzlang. Use 'cook' instead, bestie (line 1, column 1)
```



## A bigger taste

```text
squad Dev extends Person {
    constructor(name, lang) {
        og(name)
        me.lang = lang
    }
    intro() {
        bet `its giving ${me.name} who codes ${me.lang}`
    }
}

waitForIt chef main() {
    yolo {
        lockedIn dev = spawn Dev("Nimesh", "gz")
        spill(dev.intro())
    } caughtIn4K (err) {
        spill("caught in 4k: " + err.message)
    }
}

holdUp main()
```

See the [examples](./examples) folder for more, including fizzbuzz and async/await.

## How it works

gzlang is a real source-to-source compiler, not a find-and-replace:

```text
.gz source -> Tokenizer -> Parser -> AST -> JavaScript Code Generator
```

- **Tokenizer** ([src/tokenizer](./src/tokenizer)) turns source into tokens with line/column info.
- **Parser** ([src/parser](./src/parser)) builds an abstract syntax tree with full operator precedence.
- **Code generator** ([src/codegen](./src/codegen)) walks the tree and emits readable, indented JavaScript.

All slang lives in a single mapping file, [src/keywords.ts](./src/keywords.ts), so adding new vocabulary never touches compiler logic.

## What's supported

Variables, functions (including arrow, async, defaults, rest), all loop forms, if/else, switch, classes (inheritance, static members, getters/setters, class fields), try/catch/finally, throw, imports/exports, template literals, spread, optional chaining, ternaries, and the full JavaScript operator set. Semicolons are optional.

Not supported yet: destructuring, generators, labeled statements, and regex literals (use `spawn RegExp("...")` instead).

## Development

```bash
npm install
npm test          # run the test suite
npm run build     # build dist/ with tsup
npm run typecheck
```



## License

MIT