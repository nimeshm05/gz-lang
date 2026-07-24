export type TokenType =
  /** A gzlang keyword; `value` holds the canonical JavaScript keyword. */
  | "keyword"
  | "identifier"
  | "number"
  | "string"
  /** A template literal with no interpolation: `hello`. */
  | "template"
  /** The opening chunk of an interpolated template: `hello ${ */
  | "templateStart"
  /** A middle chunk between two interpolations: } and ${ */
  | "templateMiddle"
  /** The closing chunk of an interpolated template: } world` */
  | "templateEnd"
  | "punct"
  | "eof";

export interface Token {
  type: TokenType;
  /**
   * Canonical value. For keywords this is the JavaScript keyword
   * (e.g. `let` for `cook`); for everything else it matches `raw`.
   */
  value: string;
  /** The exact source text of the token. */
  raw: string;
  /** 1-based line where the token starts. */
  line: number;
  /** 1-based column where the token starts. */
  column: number;
  /** True when a line break separates this token from the previous one. */
  newlineBefore: boolean;
}
