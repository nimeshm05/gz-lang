import { GzSyntaxError } from "../errors.js";
import { JS_TO_SLANG } from "../keywords.js";
import type { Token } from "../tokenizer/tokens.js";
import { tokenize } from "../tokenizer/tokenizer.js";
import type * as ast from "./ast.js";

/** Binary operator precedence; higher binds tighter. */
const BINARY_PRECEDENCE: Record<string, number> = {
  "??": 1,
  "||": 2,
  "&&": 3,
  "|": 4,
  "^": 5,
  "&": 6,
  "==": 7,
  "!=": 7,
  "===": 7,
  "!==": 7,
  "<": 8,
  ">": 8,
  "<=": 8,
  ">=": 8,
  instanceof: 8,
  in: 8,
  "<<": 9,
  ">>": 9,
  ">>>": 9,
  "+": 10,
  "-": 10,
  "*": 11,
  "/": 11,
  "%": 11,
  "**": 12,
};

const ASSIGNMENT_OPERATORS = new Set([
  "=", "+=", "-=", "*=", "/=", "%=", "**=", "<<=", ">>=", ">>>=",
  "&=", "|=", "^=", "&&=", "||=", "??=",
]);

export function parse(source: string): ast.Program {
  return new Parser(source).parseProgram();
}

class Parser {
  private readonly tokens: Token[];
  private index = 0;

  constructor(private readonly source: string) {
    this.tokens = tokenize(source);
  }

  // --- token helpers ---

  private peek(offset = 0): Token {
    return this.tokens[Math.min(this.index + offset, this.tokens.length - 1)]!;
  }

  private get current(): Token {
    return this.peek();
  }

  private next(): Token {
    const token = this.current;
    if (token.type !== "eof") this.index++;
    return token;
  }

  private atEof(): boolean {
    return this.current.type === "eof";
  }

  private atPunct(value: string): boolean {
    return this.current.type === "punct" && this.current.value === value;
  }

  private atKeyword(value: string): boolean {
    return this.current.type === "keyword" && this.current.value === value;
  }

  private atContextual(name: string): boolean {
    return this.current.type === "identifier" && this.current.value === name;
  }

  private expectPunct(value: string): Token {
    if (!this.atPunct(value)) {
      this.unexpected(`Expected '${value}'`);
    }
    return this.next();
  }

  private expectKeyword(value: string): Token {
    if (!this.atKeyword(value)) {
      const slang = JS_TO_SLANG[value] ?? value;
      this.unexpected(`Expected '${slang}'`);
    }
    return this.next();
  }

  private unexpected(expected?: string): never {
    const token = this.current;
    const found = token.type === "eof" ? "end of file" : `'${token.raw}'`;
    const message = expected ? `${expected} but found ${found}` : `Unexpected ${found}`;
    throw new GzSyntaxError(message, { line: token.line, column: token.column }, this.source);
  }

  private startPos(token: Token): { line: number; column: number } {
    return { line: token.line, column: token.column };
  }

  /**
   * Consumes an explicit `;`, or accepts an implicit statement end at a
   * newline, closing brace, or end of file (ASI-lite).
   */
  private consumeStatementEnd(): void {
    if (this.atPunct(";")) {
      this.next();
      return;
    }
    const token = this.current;
    if (token.type === "eof" || token.newlineBefore || (token.type === "punct" && token.value === "}")) {
      return;
    }
    this.unexpected("Expected end of statement");
  }

  private atStatementEnd(): boolean {
    const token = this.current;
    return (
      token.type === "eof" ||
      token.newlineBefore ||
      (token.type === "punct" && (token.value === ";" || token.value === "}"))
    );
  }

  // --- program & statements ---

  parseProgram(): ast.Program {
    const start = this.current;
    const body: ast.Statement[] = [];
    while (!this.atEof()) {
      body.push(this.parseStatement());
    }
    return { type: "Program", body, ...this.startPos(start) };
  }

  private parseStatement(): ast.Statement {
    const token = this.current;

    if (token.type === "keyword") {
      switch (token.value) {
        case "let":
        case "const":
        case "var":
          return this.parseVariableDeclaration();
        case "function":
          return this.parseFunctionDeclaration(false);
        case "async":
          if (this.peek(1).type === "keyword" && this.peek(1).value === "function") {
            this.next();
            return this.parseFunctionDeclaration(true);
          }
          break;
        case "return":
          return this.parseReturnStatement();
        case "if":
          return this.parseIfStatement();
        case "switch":
          return this.parseSwitchStatement();
        case "for":
          return this.parseForStatement();
        case "while":
          return this.parseWhileStatement();
        case "do":
          return this.parseDoWhileStatement();
        case "break": {
          const t = this.next();
          this.consumeStatementEnd();
          return { type: "BreakStatement", ...this.startPos(t) };
        }
        case "continue": {
          const t = this.next();
          this.consumeStatementEnd();
          return { type: "ContinueStatement", ...this.startPos(t) };
        }
        case "class":
          return this.parseClassDeclaration();
        case "try":
          return this.parseTryStatement();
        case "throw":
          return this.parseThrowStatement();
        case "import":
          return this.parseImportDeclaration();
        case "export":
          return this.parseExportDeclaration();
      }
    }

    if (this.atPunct("{")) return this.parseBlock();
    if (this.atPunct(";")) {
      const t = this.next();
      return { type: "EmptyStatement", ...this.startPos(t) };
    }

    const expression = this.parseExpression();
    this.consumeStatementEnd();
    return { type: "ExpressionStatement", expression, ...this.startPos(token) };
  }

  private parseBlock(): ast.BlockStatement {
    const start = this.expectPunct("{");
    const body: ast.Statement[] = [];
    while (!this.atPunct("}") && !this.atEof()) {
      body.push(this.parseStatement());
    }
    this.expectPunct("}");
    return { type: "BlockStatement", body, ...this.startPos(start) };
  }

  private parseVariableDeclaration(consumeEnd = true, noIn = false): ast.VariableDeclaration {
    const start = this.next();
    const kind = start.value as "let" | "const" | "var";
    const declarations: ast.VariableDeclarator[] = [];
    do {
      const id = this.parseIdentifier();
      let init: ast.Expression | null = null;
      if (this.atPunct("=")) {
        this.next();
        init = this.parseAssignment(noIn);
      }
      declarations.push({ type: "VariableDeclarator", id, init, ...this.startPos(start) });
    } while (this.atPunct(",") && (this.next(), true));
    if (consumeEnd) this.consumeStatementEnd();
    return { type: "VariableDeclaration", kind, declarations, ...this.startPos(start) };
  }

  private parseFunctionDeclaration(isAsync: boolean): ast.FunctionDeclaration {
    const start = this.expectKeyword("function");
    const id = this.parseIdentifier();
    const params = this.parseParams();
    const body = this.parseBlock();
    return { type: "FunctionDeclaration", id, params, body, isAsync, ...this.startPos(start) };
  }

  private parseReturnStatement(): ast.ReturnStatement {
    const start = this.next();
    let argument: ast.Expression | null = null;
    if (!this.atStatementEnd()) {
      argument = this.parseExpression();
    }
    this.consumeStatementEnd();
    return { type: "ReturnStatement", argument, ...this.startPos(start) };
  }

  private parseIfStatement(): ast.IfStatement {
    const start = this.next();
    this.expectPunct("(");
    const test = this.parseExpression();
    this.expectPunct(")");
    const consequent = this.parseStatement();
    let alternate: ast.Statement | null = null;
    if (this.atKeyword("else")) {
      this.next();
      alternate = this.parseStatement();
    }
    return { type: "IfStatement", test, consequent, alternate, ...this.startPos(start) };
  }

  private parseSwitchStatement(): ast.SwitchStatement {
    const start = this.next();
    this.expectPunct("(");
    const discriminant = this.parseExpression();
    this.expectPunct(")");
    this.expectPunct("{");
    const cases: ast.SwitchCase[] = [];
    while (!this.atPunct("}") && !this.atEof()) {
      const caseStart = this.current;
      let test: ast.Expression | null = null;
      if (this.atKeyword("case")) {
        this.next();
        test = this.parseExpression();
      } else if (this.atKeyword("default")) {
        this.next();
      } else {
        this.unexpected("Expected 'itsGiving' or 'fr'");
      }
      this.expectPunct(":");
      const consequent: ast.Statement[] = [];
      while (
        !this.atPunct("}") &&
        !this.atKeyword("case") &&
        !this.atKeyword("default") &&
        !this.atEof()
      ) {
        consequent.push(this.parseStatement());
      }
      cases.push({ type: "SwitchCase", test, consequent, ...this.startPos(caseStart) });
    }
    this.expectPunct("}");
    return { type: "SwitchStatement", discriminant, cases, ...this.startPos(start) };
  }

  private parseForStatement(): ast.ForStatement | ast.ForInStatement | ast.ForOfStatement {
    const start = this.next();
    this.expectPunct("(");

    let init: ast.VariableDeclaration | ast.Expression | null = null;
    if (!this.atPunct(";")) {
      if (this.atKeyword("let") || this.atKeyword("const") || this.atKeyword("var")) {
        const declaration = this.parseVariableDeclaration(false, true);
        if (this.atKeyword("of") || this.atKeyword("in")) {
          return this.parseForInOf(start, declaration);
        }
        init = declaration;
      } else {
        const expression = this.parseExpression(true);
        if (this.atKeyword("of") || this.atKeyword("in")) {
          return this.parseForInOf(start, expression);
        }
        init = expression;
      }
    }

    this.expectPunct(";");
    const test = this.atPunct(";") ? null : this.parseExpression();
    this.expectPunct(";");
    const update = this.atPunct(")") ? null : this.parseExpression();
    this.expectPunct(")");
    const body = this.parseStatement();
    return { type: "ForStatement", init, test, update, body, ...this.startPos(start) };
  }

  private parseForInOf(
    start: Token,
    left: ast.VariableDeclaration | ast.Expression,
  ): ast.ForInStatement | ast.ForOfStatement {
    const kind = this.next().value as "of" | "in";
    const right = this.parseAssignment();
    this.expectPunct(")");
    const body = this.parseStatement();
    const type = kind === "of" ? "ForOfStatement" : "ForInStatement";
    return { type, left, right, body, ...this.startPos(start) } as
      | ast.ForInStatement
      | ast.ForOfStatement;
  }

  private parseWhileStatement(): ast.WhileStatement {
    const start = this.next();
    this.expectPunct("(");
    const test = this.parseExpression();
    this.expectPunct(")");
    const body = this.parseStatement();
    return { type: "WhileStatement", test, body, ...this.startPos(start) };
  }

  private parseDoWhileStatement(): ast.DoWhileStatement {
    const start = this.next();
    const body = this.parseStatement();
    this.expectKeyword("while");
    this.expectPunct("(");
    const test = this.parseExpression();
    this.expectPunct(")");
    this.consumeStatementEnd();
    return { type: "DoWhileStatement", body, test, ...this.startPos(start) };
  }

  private parseClassDeclaration(): ast.ClassDeclaration {
    const start = this.next();
    const id = this.parseIdentifier();
    let superClass: ast.Expression | null = null;
    if (this.atKeyword("extends")) {
      this.next();
      superClass = this.parseCallOrMember();
    }
    const body = this.parseClassBody();
    return { type: "ClassDeclaration", id, superClass, body, ...this.startPos(start) };
  }

  private parseClassBody(): ast.ClassMember[] {
    this.expectPunct("{");
    const members: ast.ClassMember[] = [];
    while (!this.atPunct("}") && !this.atEof()) {
      if (this.atPunct(";")) {
        this.next();
        continue;
      }
      members.push(this.parseClassMember());
    }
    this.expectPunct("}");
    return members;
  }

  private parseClassMember(): ast.ClassMember {
    const start = this.current;
    let isStatic = false;
    let isAsync = false;
    let kind: "method" | "get" | "set" = "method";

    if (this.atContextual("static") && !this.memberNameEndsHere(1)) {
      this.next();
      isStatic = true;
    }
    if (this.atKeyword("async") && !this.memberNameEndsHere(1)) {
      this.next();
      isAsync = true;
    }
    if ((this.atContextual("get") || this.atContextual("set")) && !this.memberNameEndsHere(1)) {
      kind = this.current.value as "get" | "set";
      this.next();
    }

    const { key, computed } = this.parsePropertyKey();

    if (this.atPunct("(")) {
      const params = this.parseParams();
      const body = this.parseBlock();
      const isConstructor =
        !isStatic && kind === "method" && !computed && key.type === "Identifier" && key.name === "constructor";
      return {
        type: "MethodDefinition",
        key,
        computed,
        params,
        body,
        kind: isConstructor ? "constructor" : kind,
        isStatic,
        isAsync,
        ...this.startPos(start),
      };
    }

    if (kind !== "method") this.unexpected("Expected '(' after accessor name");
    let value: ast.Expression | null = null;
    if (this.atPunct("=")) {
      this.next();
      value = this.parseAssignment();
    }
    this.consumeStatementEnd();
    return { type: "PropertyDefinition", key, computed, value, isStatic, ...this.startPos(start) };
  }

  /**
   * True when the token at `offset` terminates a member name, meaning the
   * word before it (static/async/get/set) is itself the member name.
   */
  private memberNameEndsHere(offset: number): boolean {
    const token = this.peek(offset);
    return (
      token.type === "eof" ||
      (token.type === "punct" && ["(", "=", ";", "}"].includes(token.value)) ||
      token.newlineBefore
    );
  }

  private parseTryStatement(): ast.TryStatement {
    const start = this.next();
    const block = this.parseBlock();
    let handler: ast.CatchClause | null = null;
    let finalizer: ast.BlockStatement | null = null;
    if (this.atKeyword("catch")) {
      const catchStart = this.next();
      let param: ast.Identifier | null = null;
      if (this.atPunct("(")) {
        this.next();
        param = this.parseIdentifier();
        this.expectPunct(")");
      }
      const body = this.parseBlock();
      handler = { type: "CatchClause", param, body, ...this.startPos(catchStart) };
    }
    if (this.atKeyword("finally")) {
      this.next();
      finalizer = this.parseBlock();
    }
    if (!handler && !finalizer) {
      this.unexpected("Expected 'caughtIn4K' or 'finally' after 'yolo' block");
    }
    return { type: "TryStatement", block, handler, finalizer, ...this.startPos(start) };
  }

  private parseThrowStatement(): ast.ThrowStatement {
    const start = this.next();
    const argument = this.parseExpression();
    this.consumeStatementEnd();
    return { type: "ThrowStatement", argument, ...this.startPos(start) };
  }

  private parseImportDeclaration(): ast.ImportDeclaration {
    const start = this.next();
    const specifiers: ast.ImportSpecifierNode[] = [];

    if (this.current.type === "string") {
      const source = this.parseStringLiteral();
      this.consumeStatementEnd();
      return { type: "ImportDeclaration", specifiers, source, ...this.startPos(start) };
    }

    if (this.current.type === "identifier") {
      const local = this.parseIdentifier();
      specifiers.push({ type: "ImportDefaultSpecifier", local, ...this.startPos(start) });
      if (this.atPunct(",")) this.next();
    }

    if (this.atPunct("*")) {
      const t = this.next();
      this.expectContextual("as");
      const local = this.parseIdentifier();
      specifiers.push({ type: "ImportNamespaceSpecifier", local, ...this.startPos(t) });
    } else if (this.atPunct("{")) {
      this.next();
      while (!this.atPunct("}")) {
        const imported = this.parseIdentifier();
        let local = imported;
        if (this.atContextual("as")) {
          this.next();
          local = this.parseIdentifier();
        }
        specifiers.push({ type: "ImportSpecifier", imported, local, line: imported.line, column: imported.column });
        if (!this.atPunct("}")) this.expectPunct(",");
      }
      this.expectPunct("}");
    }

    if (specifiers.length === 0) this.unexpected("Expected import specifiers or a module string");
    this.expectContextual("from");
    const source = this.parseStringLiteral();
    this.consumeStatementEnd();
    return { type: "ImportDeclaration", specifiers, source, ...this.startPos(start) };
  }

  private expectContextual(name: string): void {
    if (!this.atContextual(name)) this.unexpected(`Expected '${name}'`);
    this.next();
  }

  private parseExportDeclaration(): ast.ExportNamedDeclaration | ast.ExportDefaultDeclaration {
    const start = this.next();

    if (this.atKeyword("default")) {
      this.next();
      let declaration: ast.FunctionDeclaration | ast.ClassDeclaration | ast.Expression;
      if (this.atKeyword("function")) {
        declaration = this.parseFunctionDeclaration(false);
      } else if (this.atKeyword("async") && this.peek(1).type === "keyword" && this.peek(1).value === "function") {
        this.next();
        declaration = this.parseFunctionDeclaration(true);
      } else if (this.atKeyword("class")) {
        declaration = this.parseClassDeclaration();
      } else {
        declaration = this.parseAssignment();
        this.consumeStatementEnd();
      }
      return { type: "ExportDefaultDeclaration", declaration, ...this.startPos(start) };
    }

    if (this.atPunct("{")) {
      this.next();
      const specifiers: ast.ExportSpecifier[] = [];
      while (!this.atPunct("}")) {
        const local = this.parseIdentifier();
        let exported = local;
        if (this.atContextual("as")) {
          this.next();
          exported = this.parseIdentifier();
        }
        specifiers.push({ type: "ExportSpecifier", local, exported, line: local.line, column: local.column });
        if (!this.atPunct("}")) this.expectPunct(",");
      }
      this.expectPunct("}");
      this.consumeStatementEnd();
      return { type: "ExportNamedDeclaration", declaration: null, specifiers, ...this.startPos(start) };
    }

    let declaration: ast.VariableDeclaration | ast.FunctionDeclaration | ast.ClassDeclaration;
    if (this.atKeyword("let") || this.atKeyword("const") || this.atKeyword("var")) {
      declaration = this.parseVariableDeclaration();
    } else if (this.atKeyword("function")) {
      declaration = this.parseFunctionDeclaration(false);
    } else if (this.atKeyword("async") && this.peek(1).type === "keyword" && this.peek(1).value === "function") {
      this.next();
      declaration = this.parseFunctionDeclaration(true);
    } else if (this.atKeyword("class")) {
      declaration = this.parseClassDeclaration();
    } else {
      this.unexpected("Expected a declaration or '{' after 'putOn'");
    }
    return { type: "ExportNamedDeclaration", declaration, specifiers: [], ...this.startPos(start) };
  }

  // --- expressions ---

  private parseExpression(noIn = false): ast.Expression {
    const start = this.current;
    const first = this.parseAssignment(noIn);
    if (!this.atPunct(",")) return first;
    const expressions = [first];
    while (this.atPunct(",")) {
      this.next();
      expressions.push(this.parseAssignment(noIn));
    }
    return { type: "SequenceExpression", expressions, ...this.startPos(start) };
  }

  private parseAssignment(noIn = false): ast.Expression {
    const arrow = this.tryParseArrowFunction();
    if (arrow) return arrow;

    const start = this.current;
    const left = this.parseConditional(noIn);

    if (this.current.type === "punct" && ASSIGNMENT_OPERATORS.has(this.current.value)) {
      if (left.type !== "Identifier" && left.type !== "MemberExpression") {
        this.unexpected("Invalid assignment target");
      }
      const operator = this.next().value;
      const right = this.parseAssignment(noIn);
      return { type: "AssignmentExpression", operator, left, right, ...this.startPos(start) };
    }
    return left;
  }

  /** Detects and parses arrow functions, returning null when not at one. */
  private tryParseArrowFunction(): ast.ArrowFunctionExpression | null {
    const start = this.current;
    let isAsync = false;
    let offset = 0;

    if (this.atKeyword("async") && !this.peek(1).newlineBefore) {
      const after = this.peek(1);
      if (
        (after.type === "identifier" && this.peek(2).type === "punct" && this.peek(2).value === "=>") ||
        (after.type === "punct" && after.value === "(" && this.parenAheadIsArrow(1))
      ) {
        isAsync = true;
        offset = 1;
      } else {
        return null;
      }
    }

    const first = this.peek(offset);
    const isPlainArrow =
      (first.type === "identifier" &&
        this.peek(offset + 1).type === "punct" &&
        this.peek(offset + 1).value === "=>") ||
      (first.type === "punct" && first.value === "(" && this.parenAheadIsArrow(offset));
    if (!isPlainArrow) return null;

    if (isAsync) this.next();

    let params: ast.Param[];
    if (this.current.type === "identifier") {
      params = [this.parseIdentifier()];
    } else {
      params = this.parseParams();
    }
    this.expectPunct("=>");
    const body = this.atPunct("{") ? this.parseBlock() : this.parseAssignment();
    return { type: "ArrowFunctionExpression", params, body, isAsync, ...this.startPos(start) };
  }

  /** From a `(` at `offset`, checks whether the matching `)` is followed by `=>`. */
  private parenAheadIsArrow(offset: number): boolean {
    let depth = 0;
    let i = offset;
    while (true) {
      const token = this.peek(i);
      if (token.type === "eof") return false;
      if (token.type === "punct") {
        if (token.value === "(" || token.value === "[" || token.value === "{") depth++;
        else if (token.value === ")" || token.value === "]" || token.value === "}") {
          depth--;
          if (depth === 0) {
            const after = this.peek(i + 1);
            return after.type === "punct" && after.value === "=>";
          }
        }
      }
      i++;
    }
  }

  private parseConditional(noIn: boolean): ast.Expression {
    const start = this.current;
    const test = this.parseBinary(1, noIn);
    if (!this.atPunct("?")) return test;
    this.next();
    const consequent = this.parseAssignment();
    this.expectPunct(":");
    const alternate = this.parseAssignment(noIn);
    return { type: "ConditionalExpression", test, consequent, alternate, ...this.startPos(start) };
  }

  private parseBinary(minPrecedence: number, noIn: boolean): ast.Expression {
    const start = this.current;
    let left = this.parseUnary();

    while (true) {
      const token = this.current;
      const operator =
        token.type === "punct" || token.type === "keyword" ? token.value : undefined;
      if (operator === undefined) break;
      if (operator === "in" && noIn) break;
      const precedence = BINARY_PRECEDENCE[operator];
      if (precedence === undefined || precedence < minPrecedence) break;

      this.next();
      // `**` is right-associative; everything else is left-associative.
      const right = this.parseBinary(operator === "**" ? precedence : precedence + 1, noIn);
      if (operator === "&&" || operator === "||" || operator === "??") {
        left = {
          type: "LogicalExpression",
          operator,
          left,
          right,
          ...this.startPos(start),
        };
      } else {
        left = { type: "BinaryExpression", operator, left, right, ...this.startPos(start) };
      }
    }
    return left;
  }

  private parseUnary(): ast.Expression {
    const token = this.current;

    if (token.type === "punct" && ["!", "~", "+", "-"].includes(token.value)) {
      this.next();
      const argument = this.parseUnary();
      return {
        type: "UnaryExpression",
        operator: token.value as ast.UnaryExpression["operator"],
        argument,
        ...this.startPos(token),
      };
    }
    if (token.type === "punct" && (token.value === "++" || token.value === "--")) {
      this.next();
      const argument = this.parseUnary();
      return {
        type: "UpdateExpression",
        operator: token.value,
        prefix: true,
        argument,
        ...this.startPos(token),
      };
    }
    if (token.type === "keyword" && ["typeof", "delete", "void"].includes(token.value)) {
      this.next();
      const argument = this.parseUnary();
      return {
        type: "UnaryExpression",
        operator: token.value as ast.UnaryExpression["operator"],
        argument,
        ...this.startPos(token),
      };
    }
    if (token.type === "keyword" && token.value === "await") {
      this.next();
      const argument = this.parseUnary();
      return { type: "AwaitExpression", argument, ...this.startPos(token) };
    }

    return this.parsePostfix();
  }

  private parsePostfix(): ast.Expression {
    const start = this.current;
    const expression = this.parseCallOrMember();
    const token = this.current;
    if (
      token.type === "punct" &&
      (token.value === "++" || token.value === "--") &&
      !token.newlineBefore
    ) {
      this.next();
      return {
        type: "UpdateExpression",
        operator: token.value,
        prefix: false,
        argument: expression,
        ...this.startPos(start),
      };
    }
    return expression;
  }

  private parseCallOrMember(allowCalls = true): ast.Expression {
    const start = this.current;
    let expression = this.parsePrimary();

    while (true) {
      if (this.atPunct(".")) {
        this.next();
        const property = this.parseMemberName();
        expression = {
          type: "MemberExpression",
          object: expression,
          property,
          computed: false,
          optional: false,
          ...this.startPos(start),
        };
      } else if (this.atPunct("?.")) {
        this.next();
        if (this.atPunct("(")) {
          const args = this.parseArguments();
          expression = {
            type: "CallExpression",
            callee: expression,
            arguments: args,
            optional: true,
            ...this.startPos(start),
          };
        } else if (this.atPunct("[")) {
          this.next();
          const property = this.parseExpression();
          this.expectPunct("]");
          expression = {
            type: "MemberExpression",
            object: expression,
            property,
            computed: true,
            optional: true,
            ...this.startPos(start),
          };
        } else {
          const property = this.parseMemberName();
          expression = {
            type: "MemberExpression",
            object: expression,
            property,
            computed: false,
            optional: true,
            ...this.startPos(start),
          };
        }
      } else if (this.atPunct("[")) {
        this.next();
        const property = this.parseExpression();
        this.expectPunct("]");
        expression = {
          type: "MemberExpression",
          object: expression,
          property,
          computed: true,
          optional: false,
          ...this.startPos(start),
        };
      } else if (allowCalls && this.atPunct("(")) {
        const args = this.parseArguments();
        expression = {
          type: "CallExpression",
          callee: expression,
          arguments: args,
          optional: false,
          ...this.startPos(start),
        };
      } else {
        break;
      }
    }
    return expression;
  }

  /** Property names after `.` keep their raw text, so slang words stay literal. */
  private parseMemberName(): ast.Identifier {
    const token = this.current;
    if (token.type !== "identifier" && token.type !== "keyword") {
      this.unexpected("Expected a property name");
    }
    this.next();
    return { type: "Identifier", name: token.raw, ...this.startPos(token) };
  }

  private parseArguments(): (ast.Expression | ast.SpreadElement)[] {
    this.expectPunct("(");
    const args: (ast.Expression | ast.SpreadElement)[] = [];
    while (!this.atPunct(")")) {
      if (this.atPunct("...")) {
        const t = this.next();
        args.push({ type: "SpreadElement", argument: this.parseAssignment(), ...this.startPos(t) });
      } else {
        args.push(this.parseAssignment());
      }
      if (!this.atPunct(")")) this.expectPunct(",");
    }
    this.expectPunct(")");
    return args;
  }

  private parsePrimary(): ast.Expression {
    const token = this.current;

    switch (token.type) {
      case "number":
        this.next();
        return { type: "NumericLiteral", raw: token.raw, ...this.startPos(token) };
      case "string":
        return this.parseStringLiteral();
      case "template":
      case "templateStart":
        return this.parseTemplateLiteral();
      case "identifier":
        return this.parseIdentifier();
      case "keyword":
        return this.parseKeywordExpression();
      case "punct":
        if (token.value === "(") {
          this.next();
          const expression = this.parseExpression();
          this.expectPunct(")");
          return { type: "ParenthesizedExpression", expression, ...this.startPos(token) };
        }
        if (token.value === "[") return this.parseArrayExpression();
        if (token.value === "{") return this.parseObjectExpression();
        break;
    }
    this.unexpected("Expected an expression");
  }

  private parseKeywordExpression(): ast.Expression {
    const token = this.current;
    switch (token.value) {
      case "true":
        this.next();
        return { type: "BooleanLiteral", value: true, ...this.startPos(token) };
      case "false":
        this.next();
        return { type: "BooleanLiteral", value: false, ...this.startPos(token) };
      case "null":
        this.next();
        return { type: "NullLiteral", ...this.startPos(token) };
      case "undefined":
        this.next();
        return { type: "UndefinedLiteral", ...this.startPos(token) };
      case "this":
        this.next();
        return { type: "ThisExpression", ...this.startPos(token) };
      case "super":
        this.next();
        return { type: "SuperExpression", ...this.startPos(token) };
      case "new":
        return this.parseNewExpression();
      case "function":
        return this.parseFunctionExpression(false);
      case "async":
        if (this.peek(1).type === "keyword" && this.peek(1).value === "function") {
          this.next();
          return this.parseFunctionExpression(true);
        }
        break;
      case "class": {
        const start = this.next();
        const id = this.current.type === "identifier" ? this.parseIdentifier() : null;
        let superClass: ast.Expression | null = null;
        if (this.atKeyword("extends")) {
          this.next();
          superClass = this.parseCallOrMember();
        }
        const body = this.parseClassBody();
        return { type: "ClassExpression", id, superClass, body, ...this.startPos(start) };
      }
    }
    this.unexpected("Expected an expression");
  }

  private parseNewExpression(): ast.NewExpression {
    const start = this.expectKeyword("new");
    const callee = this.parseCallOrMember(false);
    const args = this.atPunct("(") ? this.parseArguments() : [];
    return { type: "NewExpression", callee, arguments: args, ...this.startPos(start) };
  }

  private parseFunctionExpression(isAsync: boolean): ast.FunctionExpression {
    const start = this.expectKeyword("function");
    const id = this.current.type === "identifier" ? this.parseIdentifier() : null;
    const params = this.parseParams();
    const body = this.parseBlock();
    return { type: "FunctionExpression", id, params, body, isAsync, ...this.startPos(start) };
  }

  private parseArrayExpression(): ast.ArrayExpression {
    const start = this.expectPunct("[");
    const elements: (ast.Expression | ast.SpreadElement | null)[] = [];
    while (!this.atPunct("]")) {
      if (this.atPunct(",")) {
        this.next();
        elements.push(null);
        continue;
      }
      if (this.atPunct("...")) {
        const t = this.next();
        elements.push({ type: "SpreadElement", argument: this.parseAssignment(), ...this.startPos(t) });
      } else {
        elements.push(this.parseAssignment());
      }
      if (!this.atPunct("]")) this.expectPunct(",");
    }
    this.expectPunct("]");
    return { type: "ArrayExpression", elements, ...this.startPos(start) };
  }

  private parseObjectExpression(): ast.ObjectExpression {
    const start = this.expectPunct("{");
    const properties: (ast.ObjectProperty | ast.ObjectMethod | ast.SpreadElement)[] = [];
    while (!this.atPunct("}")) {
      if (this.atPunct("...")) {
        const t = this.next();
        properties.push({
          type: "SpreadElement",
          argument: this.parseAssignment(),
          ...this.startPos(t),
        });
      } else {
        properties.push(this.parseObjectMember());
      }
      if (!this.atPunct("}")) this.expectPunct(",");
    }
    this.expectPunct("}");
    return { type: "ObjectExpression", properties, ...this.startPos(start) };
  }

  private parseObjectMember(): ast.ObjectProperty | ast.ObjectMethod {
    const start = this.current;
    let isAsync = false;
    if (
      this.atKeyword("async") &&
      !(this.peek(1).type === "punct" && [":", ",", "}", "("].includes(this.peek(1).value))
    ) {
      this.next();
      isAsync = true;
    }

    const { key, computed } = this.parsePropertyKey();

    if (this.atPunct("(")) {
      const params = this.parseParams();
      const body = this.parseBlock();
      return { type: "ObjectMethod", key, computed, params, body, isAsync, ...this.startPos(start) };
    }

    if (this.atPunct(":")) {
      this.next();
      const value = this.parseAssignment();
      return { type: "ObjectProperty", key, value, computed, shorthand: false, ...this.startPos(start) };
    }

    if (key.type !== "Identifier" || computed) {
      this.unexpected("Expected ':' after property key");
    }
    return { type: "ObjectProperty", key, value: key, computed: false, shorthand: true, ...this.startPos(start) };
  }

  private parsePropertyKey(): { key: ast.PropertyKey_; computed: boolean } {
    const token = this.current;
    if (this.atPunct("[")) {
      this.next();
      const key = this.parseAssignment();
      this.expectPunct("]");
      return { key, computed: true };
    }
    if (token.type === "identifier" || token.type === "keyword") {
      this.next();
      // Keys keep their raw text: `{ me: 1 }` stays the literal key `me`.
      return { key: { type: "Identifier", name: token.raw, ...this.startPos(token) }, computed: false };
    }
    if (token.type === "string") {
      return { key: this.parseStringLiteral(), computed: false };
    }
    if (token.type === "number") {
      this.next();
      return { key: { type: "NumericLiteral", raw: token.raw, ...this.startPos(token) }, computed: false };
    }
    this.unexpected("Expected a property key");
  }

  private parseTemplateLiteral(): ast.TemplateLiteral {
    const start = this.current;
    if (start.type === "template") {
      this.next();
      return { type: "TemplateLiteral", quasis: [start.raw], expressions: [], ...this.startPos(start) };
    }

    const quasis: string[] = [this.next().raw]; // templateStart
    const expressions: ast.Expression[] = [];
    while (true) {
      expressions.push(this.parseExpression());
      const chunk = this.current;
      if (chunk.type === "templateMiddle") {
        quasis.push(this.next().raw);
      } else if (chunk.type === "templateEnd") {
        quasis.push(this.next().raw);
        break;
      } else {
        this.unexpected("Unterminated template literal");
      }
    }
    return { type: "TemplateLiteral", quasis, expressions, ...this.startPos(start) };
  }

  private parseParams(): ast.Param[] {
    this.expectPunct("(");
    const params: ast.Param[] = [];
    while (!this.atPunct(")")) {
      if (this.atPunct("...")) {
        const t = this.next();
        params.push({ type: "RestElement", argument: this.parseIdentifier(), ...this.startPos(t) });
      } else {
        const id = this.parseIdentifier();
        if (this.atPunct("=")) {
          this.next();
          const right = this.parseAssignment();
          params.push({ type: "AssignmentPattern", left: id, right, line: id.line, column: id.column });
        } else {
          params.push(id);
        }
      }
      if (!this.atPunct(")")) this.expectPunct(",");
    }
    this.expectPunct(")");
    return params;
  }

  private parseIdentifier(): ast.Identifier {
    const token = this.current;
    if (token.type !== "identifier") {
      this.unexpected("Expected an identifier");
    }
    this.next();
    return { type: "Identifier", name: token.value, ...this.startPos(token) };
  }

  private parseStringLiteral(): ast.StringLiteral {
    const token = this.current;
    if (token.type !== "string") {
      this.unexpected("Expected a string");
    }
    this.next();
    return { type: "StringLiteral", raw: token.raw, ...this.startPos(token) };
  }
}
