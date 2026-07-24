import { parse } from "./parser/parser.js";
import { generate } from "./codegen/codegen.js";

export { tokenize } from "./tokenizer/tokenizer.js";
export type { Token, TokenType } from "./tokenizer/tokens.js";
export { parse } from "./parser/parser.js";
export type * as AST from "./parser/ast.js";
export { generate } from "./codegen/codegen.js";
export { KEYWORDS, BUILTINS } from "./keywords.js";
export { GzSyntaxError } from "./errors.js";

/** Transpiles gzlang source code to JavaScript. */
export function transpile(source: string): string {
  return generate(parse(source));
}
