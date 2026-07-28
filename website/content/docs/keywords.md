# Keywords

gzlang replaces JavaScript keywords with slang. Everything else — operators, literals, calls — stays JavaScript.

## Variables

- **cook** → `let`
  - Creates a variable you can reassign later.
  - Same as let — use it for values that change, like a score or counter.
- **lockedIn** → `const`
  - Creates a variable that can't be reassigned.
  - Same as const — use it for values that should stay fixed.
- **legacy** → `var`
  - Creates a variable scoped to the whole function.
  - Same as var — old-school; prefer cook or lockedIn instead.

## Control flow

- **lowkey** → `if`
  - Runs code only when a condition is true.
  - Same as if — the check goes in parentheses after the keyword.
- **deadass** → `else`
  - Runs when the lowkey condition is false.
  - Same as else — the fallback branch.
- **vibeCheck** → `switch`
  - Picks a code path based on a value.
  - Same as switch — compare one expression against multiple cases.
- **itsGiving** → `case`
  - Labels a branch inside a vibeCheck.
  - Same as case — each itsGiving matches a specific value.
- **fr** → `default`
  - Runs when no itsGiving value matches.
  - Same as default — the catch-all option.

## Loops

- **grind** → `for`
  - Repeats code with a classic for-loop setup.
  - Same as for — init, condition, and step in parentheses.
- **stillCookin** → `while`
  - Repeats code while a condition stays true.
  - Same as while — checks the condition before each iteration.
- **firstOff** → `do`
  - Runs the loop body once, then checks the condition.
  - Same as do...while — always executes at least one time.
- **imOut** → `break`
  - Stops a loop or vibeCheck immediately.
  - Same as break — jumps out of the current block.
- **keepCookin** → `continue`
  - Skips the rest of this loop round and starts the next one.
  - Same as continue — goes back to the loop condition.

## Functions

- **chef** → `function`
  - Defines a reusable block of code.
  - Same as function — give it a name and parameters.
- **bet** → `return`
  - Sends a value back from a chef.
  - Same as return — exits the function with that result.

## Classes

- **squad** → `class`
  - Defines a blueprint for objects with methods and properties.
  - Same as class — use spawn to create instances from it.
- **spawn** → `new`
  - Creates a new instance from a squad.
  - Same as new — calls the squad's constructor.
- **me** → `this`
  - Refers to the current object inside a squad method.
  - Same as this — whatever instance the method was called on.
- **og** → `super`
  - Calls a method or constructor from the parent squad.
  - Same as super — use it inside a subclass.

## Values

- **noCap** → `true`
  - The boolean value for true.
  - Same as true — conditions and comparisons that succeed.
- **cap** → `false`
  - The boolean value for false.
  - Same as false — conditions and comparisons that fail.
- **ghosted** → `null`
  - Represents an intentional empty value.
  - Same as null — "nothing here on purpose."
- **idk** → `undefined`
  - Represents a value that hasn't been set.
  - Same as undefined — the default when nothing was assigned.

## Errors

- **yolo** → `try`
  - Wraps risky code so errors don't crash your whole program.
  - Same as try — pair it with caughtIn4K to handle what goes wrong.
- **caughtIn4K** → `catch`
  - Catches an error thrown inside a yolo block.
  - Same as catch — receives the error so you can recover or log it.
- **crashOut** → `throw`
  - Stops execution and signals that something went wrong.
  - Same as throw — pass an error message or object.

## Async

- **waitForIt** → `async`
  - Marks a chef that returns a Promise.
  - Same as async — lets you use holdUp inside it.
- **holdUp** → `await`
  - Pauses until a Promise finishes and gives you its result.
  - Same as await — only works inside a waitForIt chef.

## Modules

- **yoink** → `import`
  - Brings code from another file into this one.
  - Same as import — pull in functions, classes, or values.
- **putOn** → `export`
  - Makes code from this file available to others.
  - Same as export — share a chef, squad, or variable.

## Operators

- **whatIsThis** → `typeof`
  - Returns a string describing the type of a value.
  - Same as typeof — e.g. "string", "number", "object".
- **yeet** → `delete`
  - Deletes a property from an object.
  - Same as delete — removes the key entirely.

## Built-ins

- **spill** → `console.log`
  - Prints a value to the browser or terminal console.
  - Same as console.log — your go-to for debugging output.

## JS passthrough

These stay as standard JavaScript (no slang equivalent):

- `extends`, `finally`, `instanceof`, `in`, `of`, `void`

---

Using a raw JS keyword where slang exists is a compile error. Property access is fine — e.g. `promise.catch` works.
