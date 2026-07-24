import { KEYWORDS, PASSTHROUGH_KEYWORDS, JS_TO_SLANG } from "../keywords.js";
import { GzSyntaxError } from "../errors.js";
import type { Token, TokenType } from "./tokens.js";

const PUNCTUATORS = [
  ">>>=",
  "===", "!==", "**=", "<<=", ">>=", ">>>", "&&=", "||=", "??=", "...",
  "=>", "==", "!=", "<=", ">=", "&&", "||", "??", "?.", "++", "--",
  "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=", "**", "<<", ">>",
  "{", "}", "(", ")", "[", "]", ";", ",", "<", ">", "+", "-", "*", "/",
  "%", "&", "|", "^", "!", "~", "?", ":", "=", ".",
];

const MAX_PUNCT_LENGTH = 4;
const PUNCT_SET = new Set(PUNCTUATORS);

const isIdStart = (ch: string) => /[A-Za-z_$]/.test(ch);
const isIdPart = (ch: string) => /[A-Za-z0-9_$]/.test(ch);
const isDigit = (ch: string) => ch >= "0" && ch <= "9";

export function tokenize(source: string): Token[] {
  return new Tokenizer(source).tokenize();
}

class Tokenizer {
  private pos = 0;
  private line = 1;
  private column = 1;
  private newlineBefore = false;
  private tokens: Token[] = [];
  /**
   * Tracks `{`/`}` nesting inside template interpolations so a closing
   * `}` can resume template scanning instead of being a punctuator.
   */
  private templateBraceDepths: number[] = [];

  constructor(private readonly source: string) {}

  tokenize(): Token[] {
    while (true) {
      this.skipWhitespaceAndComments();
      if (this.pos >= this.source.length) {
        this.push("eof", "", "", this.line, this.column);
        return this.tokens;
      }

      const ch = this.source[this.pos]!;
      const startLine = this.line;
      const startColumn = this.column;

      if (isIdStart(ch)) {
        this.readWord(startLine, startColumn);
      } else if (isDigit(ch) || (ch === "." && isDigit(this.peek(1)))) {
        this.readNumber(startLine, startColumn);
      } else if (ch === '"' || ch === "'") {
        this.readString(startLine, startColumn);
      } else if (ch === "`") {
        this.readTemplate(startLine, startColumn);
      } else if (ch === "}" && this.templateDepth() === 0 && this.templateBraceDepths.length > 0) {
        this.readTemplateContinuation(startLine, startColumn);
      } else {
        this.readPunctuator(startLine, startColumn);
      }
    }
  }

  // --- scanning helpers ---

  private peek(offset = 0): string {
    return this.source[this.pos + offset] ?? "";
  }

  private advance(): string {
    const ch = this.source[this.pos]!;
    this.pos++;
    if (ch === "\n") {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    return ch;
  }

  private push(type: TokenType, value: string, raw: string, line: number, column: number): void {
    this.tokens.push({ type, value, raw, line, column, newlineBefore: this.newlineBefore });
    this.newlineBefore = false;
  }

  private error(message: string, line = this.line, column = this.column): never {
    throw new GzSyntaxError(message, { line, column }, this.source);
  }

  private templateDepth(): number {
    return this.templateBraceDepths[this.templateBraceDepths.length - 1] ?? 0;
  }

  private skipWhitespaceAndComments(): void {
    while (this.pos < this.source.length) {
      const ch = this.peek();
      if (ch === "\n") {
        this.newlineBefore = true;
        this.advance();
      } else if (ch === " " || ch === "\t" || ch === "\r") {
        this.advance();
      } else if (ch === "/" && this.peek(1) === "/") {
        while (this.pos < this.source.length && this.peek() !== "\n") this.advance();
      } else if (ch === "/" && this.peek(1) === "*") {
        const line = this.line;
        const column = this.column;
        this.advance();
        this.advance();
        while (this.pos < this.source.length && !(this.peek() === "*" && this.peek(1) === "/")) {
          if (this.peek() === "\n") this.newlineBefore = true;
          this.advance();
        }
        if (this.pos >= this.source.length) this.error("Unterminated comment", line, column);
        this.advance();
        this.advance();
      } else {
        return;
      }
    }
  }

  // --- token readers ---

  private readWord(line: number, column: number): void {
    const start = this.pos;
    while (this.pos < this.source.length && isIdPart(this.peek())) this.advance();
    const word = this.source.slice(start, this.pos);

    const slangMeaning = KEYWORDS[word];
    if (slangMeaning !== undefined) {
      this.push("keyword", slangMeaning, word, line, column);
      return;
    }
    if (PASSTHROUGH_KEYWORDS.has(word)) {
      this.push("keyword", word, word, line, column);
      return;
    }

    // Reject raw JavaScript keywords that have a slang equivalent, except
    // after `.`/`?.` where they are ordinary property names (promise.catch).
    const slang = JS_TO_SLANG[word];
    if (slang !== undefined && !this.previousTokenIsDot()) {
      this.error(
        `'${word}' is not gzlang. Use '${slang}' instead, bestie`,
        line,
        column,
      );
    }

    this.push("identifier", word, word, line, column);
  }

  private previousTokenIsDot(): boolean {
    const prev = this.tokens[this.tokens.length - 1];
    return prev !== undefined && prev.type === "punct" && (prev.value === "." || prev.value === "?.");
  }

  private readNumber(line: number, column: number): void {
    const start = this.pos;
    if (this.peek() === "0" && /[xXbBoO]/.test(this.peek(1))) {
      this.advance();
      this.advance();
      while (/[0-9a-fA-F_]/.test(this.peek())) this.advance();
    } else {
      while (isDigit(this.peek()) || this.peek() === "_") this.advance();
      if (this.peek() === "." && isDigit(this.peek(1))) {
        this.advance();
        while (isDigit(this.peek()) || this.peek() === "_") this.advance();
      } else if (this.peek() === "." && !isIdStart(this.peek(1)) && this.peek(1) !== ".") {
        this.advance();
      }
      if (/[eE]/.test(this.peek()) && (isDigit(this.peek(1)) || (/[+-]/.test(this.peek(1)) && isDigit(this.peek(2))))) {
        this.advance();
        if (/[+-]/.test(this.peek())) this.advance();
        while (isDigit(this.peek())) this.advance();
      }
    }
    if (this.peek() === "n") this.advance();
    const raw = this.source.slice(start, this.pos);
    this.push("number", raw, raw, line, column);
  }

  private readString(line: number, column: number): void {
    const quote = this.advance();
    const start = this.pos - 1;
    while (this.pos < this.source.length) {
      const ch = this.peek();
      if (ch === "\\") {
        this.advance();
        if (this.pos < this.source.length) this.advance();
        continue;
      }
      if (ch === "\n") this.error("Unterminated string", line, column);
      this.advance();
      if (ch === quote) {
        const raw = this.source.slice(start, this.pos);
        this.push("string", raw, raw, line, column);
        return;
      }
    }
    this.error("Unterminated string", line, column);
  }

  /** Reads from an opening backtick to either a closing backtick or `${`. */
  private readTemplate(line: number, column: number): void {
    const start = this.pos;
    this.advance(); // `
    this.scanTemplateChunk(start, line, column, "template", "templateStart");
  }

  /** Resumes template scanning at the `}` that closes an interpolation. */
  private readTemplateContinuation(line: number, column: number): void {
    const start = this.pos;
    this.advance(); // }
    this.scanTemplateChunk(start, line, column, "templateEnd", "templateMiddle");
  }

  private scanTemplateChunk(
    start: number,
    line: number,
    column: number,
    closedType: TokenType,
    interpolatedType: TokenType,
  ): void {
    while (this.pos < this.source.length) {
      const ch = this.peek();
      if (ch === "\\") {
        this.advance();
        if (this.pos < this.source.length) this.advance();
        continue;
      }
      if (ch === "`") {
        this.advance();
        if (closedType === "templateEnd") this.templateBraceDepths.pop();
        const raw = this.source.slice(start, this.pos);
        this.push(closedType, raw, raw, line, column);
        return;
      }
      if (ch === "$" && this.peek(1) === "{") {
        this.advance();
        this.advance();
        if (interpolatedType === "templateStart") this.templateBraceDepths.push(0);
        const raw = this.source.slice(start, this.pos);
        this.push(interpolatedType, raw, raw, line, column);
        return;
      }
      this.advance();
    }
    this.error("Unterminated template literal", line, column);
  }

  private readPunctuator(line: number, column: number): void {
    for (let len = MAX_PUNCT_LENGTH; len >= 1; len--) {
      const candidate = this.source.slice(this.pos, this.pos + len);
      if (PUNCT_SET.has(candidate)) {
        for (let i = 0; i < len; i++) this.advance();
        if (this.templateBraceDepths.length > 0) {
          if (candidate === "{") {
            this.templateBraceDepths[this.templateBraceDepths.length - 1]!++;
          } else if (candidate === "}") {
            this.templateBraceDepths[this.templateBraceDepths.length - 1]!--;
          }
        }
        this.push("punct", candidate, candidate, line, column);
        return;
      }
    }
    this.error(`Unexpected character '${this.peek()}'`);
  }
}
