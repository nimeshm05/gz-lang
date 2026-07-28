---
name: Keywords MD Documentation
overview: Create a single, minimal markdown reference file mapping gzlang keywords to JavaScript equivalents with one-line descriptions. No website wiring, no component changes, no new dependencies.
todos:
  - id: write-keywords-md
    content: Create website/content/docs/keywords.md with minimal keyword reference content
    status: completed
isProject: false
---

# Keywords Documentation (MD file only)

## Scope

- **Deliverable:** One markdown file with keyword reference content
- **Out of scope:** Sidebar integration, new dependencies, changes to [`website/src/components/SamplesSidebar/SamplesSidebar.tsx`](website/src/components/SamplesSidebar/SamplesSidebar.tsx) or any other code

## File location

Create [`website/content/docs/keywords.md`](website/content/docs/keywords.md)

This keeps docs colocated with the playground for when you wire the tab later, without touching any existing files now.

## Content source

All mappings come from [`src/keywords.ts`](src/keywords.ts) (32 keywords + `spill` builtin + 6 passthrough JS keywords). Descriptions are adapted from the README vocabulary table, trimmed to one functional line each.

## Format (sidebar-friendly)

- Short intro (2 lines max)
- Grouped sections (Variables, Control flow, Loops, Functions, Classes, Values, Errors, Async, Modules, Built-ins, JS passthrough)
- Each entry: **`gzlang`** → `js` — what it does
- No wide tables, no long examples, no architecture notes
- Brief footer note: raw JS keywords with slang equivalents are compile errors; operators/punctuation stay as JS

## Full file content

```markdown
# Keywords

gzlang replaces JavaScript keywords with slang. Everything else — operators, literals, calls — stays JavaScript.

## Variables

- **cook** → `let` — Declare a block-scoped variable
- **lockedIn** → `const` — Declare a constant binding
- **legacy** → `var` — Declare a function-scoped variable

## Control flow

- **lowkey** → `if` — Conditional branch
- **deadass** → `else` — Alternative branch
- **vibeCheck** → `switch` — Multi-way branch
- **itsGiving** → `case` — Match a switch value
- **fr** → `default` — Switch fallback

## Loops

- **grind** → `for` — Loop with init, condition, and step
- **stillCookin** → `while` — Loop while condition is true
- **firstOff** → `do` — Run once, then loop while true
- **imOut** → `break` — Exit a loop or switch
- **keepCookin** → `continue` — Skip to the next loop iteration

## Functions

- **chef** → `function` — Define a function
- **bet** → `return` — Return a value from a function

## Classes

- **squad** → `class` — Define a class
- **spawn** → `new` — Create an instance
- **me** → `this` — Reference the current instance
- **og** → `super` — Reference the parent class

## Values

- **noCap** → `true` — Boolean true
- **cap** → `false` — Boolean false
- **ghosted** → `null` — Null value
- **idk** → `undefined` — Undefined value

## Errors

- **yolo** → `try` — Run code that may throw
- **caughtIn4K** → `catch` — Handle a thrown error
- **crashOut** → `throw` — Raise an exception

## Async

- **waitForIt** → `async` — Mark a function as async
- **holdUp** → `await` — Wait for a promise to settle

## Modules

- **yoink** → `import` — Import from another module
- **putOn** → `export` — Export from this module

## Operators

- **whatIsThis** → `typeof` — Get the type of a value
- **yeet** → `delete` — Remove a property

## Built-ins

- **spill** → `console.log` — Print to the console

## JS passthrough

These stay as standard JavaScript (no slang equivalent):

- `extends`, `finally`, `instanceof`, `in`, `of`, `void`

---

Using a raw JS keyword where slang exists is a compile error. Property access is fine — e.g. `promise.catch` works.
```

## Execution step

When approved, create the directory `website/content/docs/` if needed and write `keywords.md` with the content above. No other files touched.
