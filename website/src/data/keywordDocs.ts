import { BUILTINS, KEYWORDS } from "gzlang";

export type KeywordEntry = {
  slang: string;
  js: string;
  description: [string, string];
};

export type KeywordCategory = {
  id: string;
  label: string;
  entries: KeywordEntry[];
};

const DESCRIPTIONS: Record<string, [string, string]> = {
  cook: [
    "Creates a variable you can reassign later.",
    "Same as let — use it for values that change, like a score or counter.",
  ],
  lockedIn: [
    "Creates a variable that can't be reassigned.",
    "Same as const — use it for values that should stay fixed.",
  ],
  legacy: [
    "Creates a variable scoped to the whole function.",
    "Same as var — old-school; prefer cook or lockedIn instead.",
  ],
  lowkey: [
    "Runs code only when a condition is true.",
    "Same as if — the check goes in parentheses after the keyword.",
  ],
  deadass: [
    "Runs when the lowkey condition is false.",
    "Same as else — the fallback branch.",
  ],
  vibeCheck: [
    "Picks a code path based on a value.",
    "Same as switch — compare one expression against multiple cases.",
  ],
  itsGiving: [
    "Labels a branch inside a vibeCheck.",
    "Same as case — each itsGiving matches a specific value.",
  ],
  fr: [
    "Runs when no itsGiving value matches.",
    "Same as default — the catch-all option.",
  ],
  grind: [
    "Repeats code with a classic for-loop setup.",
    "Same as for — init, condition, and step in parentheses.",
  ],
  stillCookin: [
    "Repeats code while a condition stays true.",
    "Same as while — checks the condition before each iteration.",
  ],
  firstOff: [
    "Runs the loop body once, then checks the condition.",
    "Same as do...while — always executes at least one time.",
  ],
  imOut: [
    "Stops a loop or vibeCheck immediately.",
    "Same as break — jumps out of the current block.",
  ],
  keepCookin: [
    "Skips the rest of this loop round and starts the next one.",
    "Same as continue — goes back to the loop condition.",
  ],
  chef: [
    "Defines a reusable block of code.",
    "Same as function — give it a name and parameters.",
  ],
  bet: [
    "Sends a value back from a chef.",
    "Same as return — exits the function with that result.",
  ],
  squad: [
    "Defines a blueprint for objects with methods and properties.",
    "Same as class — use spawn to create instances from it.",
  ],
  spawn: [
    "Creates a new instance from a squad.",
    "Same as new — calls the squad's constructor.",
  ],
  me: [
    "Refers to the current object inside a squad method.",
    "Same as this — whatever instance the method was called on.",
  ],
  og: [
    "Calls a method or constructor from the parent squad.",
    "Same as super — use it inside a subclass.",
  ],
  noCap: [
    "The boolean value for true.",
    "Same as true — conditions and comparisons that succeed.",
  ],
  cap: [
    "The boolean value for false.",
    "Same as false — conditions and comparisons that fail.",
  ],
  ghosted: [
    "Represents an intentional empty value.",
    'Same as null — "nothing here on purpose."',
  ],
  idk: [
    "Represents a value that hasn't been set.",
    "Same as undefined — the default when nothing was assigned.",
  ],
  yolo: [
    "Wraps risky code so errors don't crash your whole program.",
    "Same as try — pair it with caughtIn4K to handle what goes wrong.",
  ],
  caughtIn4K: [
    "Catches an error thrown inside a yolo block.",
    "Same as catch — receives the error so you can recover or log it.",
  ],
  crashOut: [
    "Stops execution and signals that something went wrong.",
    "Same as throw — pass an error message or object.",
  ],
  waitForIt: [
    "Marks a chef that returns a Promise.",
    "Same as async — lets you use holdUp inside it.",
  ],
  holdUp: [
    "Pauses until a Promise finishes and gives you its result.",
    "Same as await — only works inside a waitForIt chef.",
  ],
  yoink: [
    "Brings code from another file into this one.",
    "Same as import — pull in functions, classes, or values.",
  ],
  putOn: [
    "Makes code from this file available to others.",
    "Same as export — share a chef, squad, or variable.",
  ],
  whatIsThis: [
    "Returns a string describing the type of a value.",
    'Same as typeof — e.g. "string", "number", "object".',
  ],
  yeet: [
    "Deletes a property from an object.",
    "Same as delete — removes the key entirely.",
  ],
  spill: [
    "Prints a value to the browser or terminal console.",
    "Same as console.log — your go-to for debugging output.",
  ],
};

const CATEGORY_DEFS: { id: string; label: string; keywords: string[] }[] = [
  { id: "variables", label: "Variables", keywords: ["cook", "lockedIn", "legacy"] },
  {
    id: "control-flow",
    label: "Control Flow",
    keywords: ["lowkey", "deadass", "vibeCheck", "itsGiving", "fr"],
  },
  {
    id: "loops",
    label: "Loops",
    keywords: ["grind", "stillCookin", "firstOff", "imOut", "keepCookin"],
  },
  { id: "functions", label: "Functions", keywords: ["chef", "bet"] },
  { id: "classes", label: "Classes", keywords: ["squad", "spawn", "me", "og"] },
  { id: "values", label: "Values", keywords: ["noCap", "cap", "ghosted", "idk"] },
  { id: "errors", label: "Errors", keywords: ["yolo", "caughtIn4K", "crashOut"] },
  { id: "async", label: "Async", keywords: ["waitForIt", "holdUp"] },
  { id: "modules", label: "Modules", keywords: ["yoink", "putOn"] },
  { id: "operators", label: "Operators", keywords: ["whatIsThis", "yeet"] },
  { id: "built-ins", label: "Built-ins", keywords: ["spill"] },
];

function resolveKeyword(slang: string): KeywordEntry {
  const js = KEYWORDS[slang] ?? BUILTINS[slang];
  if (!js) {
    throw new Error(`Unknown keyword: ${slang}`);
  }

  return {
    slang,
    js,
    description: DESCRIPTIONS[slang] ?? ["", ""],
  };
}

export const KEYWORD_CATEGORIES: KeywordCategory[] = CATEGORY_DEFS.map(
  ({ id, label, keywords }) => ({
    id,
    label,
    entries: keywords.map(resolveKeyword),
  }),
);
