/**
 * The single source of truth for gzlang vocabulary.
 *
 * Add a new slang keyword here and the tokenizer, parser, and code
 * generator pick it up automatically -- no compiler changes needed.
 */

/** Slang keyword -> the JavaScript keyword it stands for. */
export const KEYWORDS: Record<string, string> = {
  cook: "let",
  lockedIn: "const",
  legacy: "var",
  lowkey: "if",
  deadass: "else",
  vibeCheck: "switch",
  itsGiving: "case",
  fr: "default",
  grind: "for",
  stillCookin: "while",
  firstOff: "do",
  imOut: "break",
  keepCookin: "continue",
  chef: "function",
  bet: "return",
  squad: "class",
  spawn: "new",
  me: "this",
  noCap: "true",
  cap: "false",
  ghosted: "null",
  idk: "undefined",
  yolo: "try",
  caughtIn4K: "catch",
  crashOut: "throw",
  waitForIt: "async",
  holdUp: "await",
  yoink: "import",
  putOn: "export",
  whatIsThis: "typeof",
  yeet: "delete",
  og: "super",
};

/** Built-in identifiers rewritten during code generation. */
export const BUILTINS: Record<string, string> = {
  spill: "console.log",
};

/**
 * JavaScript words that gzlang keeps as-is because the spec defines no
 * slang for them. They are tokenized as keywords so the parser can use
 * them structurally.
 */
export const PASSTHROUGH_KEYWORDS = new Set([
  "extends",
  "finally",
  "instanceof",
  "in",
  "of",
  "void",
]);

/** JavaScript keyword -> the slang word that must be used instead. */
export const JS_TO_SLANG: Record<string, string> = Object.fromEntries(
  Object.entries(KEYWORDS).map(([slang, js]) => [js, slang]),
);
