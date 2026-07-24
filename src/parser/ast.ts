/** Simplified ESTree-flavored AST for the gzlang subset of JavaScript. */

export interface BaseNode {
  line: number;
  column: number;
}

export interface Program extends BaseNode {
  type: "Program";
  body: Statement[];
}

// --- statements ---

export type Statement =
  | VariableDeclaration
  | FunctionDeclaration
  | ReturnStatement
  | IfStatement
  | SwitchStatement
  | ForStatement
  | ForInStatement
  | ForOfStatement
  | WhileStatement
  | DoWhileStatement
  | BreakStatement
  | ContinueStatement
  | ClassDeclaration
  | TryStatement
  | ThrowStatement
  | ImportDeclaration
  | ExportNamedDeclaration
  | ExportDefaultDeclaration
  | ExpressionStatement
  | BlockStatement
  | EmptyStatement;

export interface VariableDeclaration extends BaseNode {
  type: "VariableDeclaration";
  kind: "let" | "const" | "var";
  declarations: VariableDeclarator[];
}

export interface VariableDeclarator extends BaseNode {
  type: "VariableDeclarator";
  id: Identifier;
  init: Expression | null;
}

export interface FunctionDeclaration extends BaseNode {
  type: "FunctionDeclaration";
  id: Identifier;
  params: Param[];
  body: BlockStatement;
  isAsync: boolean;
}

export interface ReturnStatement extends BaseNode {
  type: "ReturnStatement";
  argument: Expression | null;
}

export interface IfStatement extends BaseNode {
  type: "IfStatement";
  test: Expression;
  consequent: Statement;
  alternate: Statement | null;
}

export interface SwitchStatement extends BaseNode {
  type: "SwitchStatement";
  discriminant: Expression;
  cases: SwitchCase[];
}

export interface SwitchCase extends BaseNode {
  type: "SwitchCase";
  /** null for the `fr` (default) case. */
  test: Expression | null;
  consequent: Statement[];
}

export interface ForStatement extends BaseNode {
  type: "ForStatement";
  init: VariableDeclaration | Expression | null;
  test: Expression | null;
  update: Expression | null;
  body: Statement;
}

export interface ForInStatement extends BaseNode {
  type: "ForInStatement";
  left: VariableDeclaration | Expression;
  right: Expression;
  body: Statement;
}

export interface ForOfStatement extends BaseNode {
  type: "ForOfStatement";
  left: VariableDeclaration | Expression;
  right: Expression;
  body: Statement;
}

export interface WhileStatement extends BaseNode {
  type: "WhileStatement";
  test: Expression;
  body: Statement;
}

export interface DoWhileStatement extends BaseNode {
  type: "DoWhileStatement";
  body: Statement;
  test: Expression;
}

export interface BreakStatement extends BaseNode {
  type: "BreakStatement";
}

export interface ContinueStatement extends BaseNode {
  type: "ContinueStatement";
}

export interface ClassDeclaration extends BaseNode {
  type: "ClassDeclaration";
  id: Identifier | null;
  superClass: Expression | null;
  body: ClassMember[];
}

export type ClassMember = MethodDefinition | PropertyDefinition;

export interface MethodDefinition extends BaseNode {
  type: "MethodDefinition";
  key: PropertyKey_;
  computed: boolean;
  params: Param[];
  body: BlockStatement;
  kind: "method" | "constructor" | "get" | "set";
  isStatic: boolean;
  isAsync: boolean;
}

export interface PropertyDefinition extends BaseNode {
  type: "PropertyDefinition";
  key: PropertyKey_;
  computed: boolean;
  value: Expression | null;
  isStatic: boolean;
}

export interface TryStatement extends BaseNode {
  type: "TryStatement";
  block: BlockStatement;
  handler: CatchClause | null;
  finalizer: BlockStatement | null;
}

export interface CatchClause extends BaseNode {
  type: "CatchClause";
  param: Identifier | null;
  body: BlockStatement;
}

export interface ThrowStatement extends BaseNode {
  type: "ThrowStatement";
  argument: Expression;
}

export interface ImportDeclaration extends BaseNode {
  type: "ImportDeclaration";
  specifiers: ImportSpecifierNode[];
  source: StringLiteral;
}

export type ImportSpecifierNode =
  | ImportDefaultSpecifier
  | ImportNamespaceSpecifier
  | ImportSpecifier;

export interface ImportDefaultSpecifier extends BaseNode {
  type: "ImportDefaultSpecifier";
  local: Identifier;
}

export interface ImportNamespaceSpecifier extends BaseNode {
  type: "ImportNamespaceSpecifier";
  local: Identifier;
}

export interface ImportSpecifier extends BaseNode {
  type: "ImportSpecifier";
  imported: Identifier;
  local: Identifier;
}

export interface ExportNamedDeclaration extends BaseNode {
  type: "ExportNamedDeclaration";
  declaration: VariableDeclaration | FunctionDeclaration | ClassDeclaration | null;
  specifiers: ExportSpecifier[];
}

export interface ExportSpecifier extends BaseNode {
  type: "ExportSpecifier";
  local: Identifier;
  exported: Identifier;
}

export interface ExportDefaultDeclaration extends BaseNode {
  type: "ExportDefaultDeclaration";
  declaration: FunctionDeclaration | ClassDeclaration | Expression;
}

export interface ExpressionStatement extends BaseNode {
  type: "ExpressionStatement";
  expression: Expression;
}

export interface BlockStatement extends BaseNode {
  type: "BlockStatement";
  body: Statement[];
}

export interface EmptyStatement extends BaseNode {
  type: "EmptyStatement";
}

// --- expressions ---

export type Expression =
  | Identifier
  | NumericLiteral
  | StringLiteral
  | BooleanLiteral
  | NullLiteral
  | UndefinedLiteral
  | ThisExpression
  | SuperExpression
  | TemplateLiteral
  | ArrayExpression
  | ObjectExpression
  | FunctionExpression
  | ArrowFunctionExpression
  | ClassExpression
  | UnaryExpression
  | UpdateExpression
  | BinaryExpression
  | LogicalExpression
  | AssignmentExpression
  | ConditionalExpression
  | CallExpression
  | NewExpression
  | MemberExpression
  | AwaitExpression
  | SequenceExpression
  | ParenthesizedExpression;

export interface Identifier extends BaseNode {
  type: "Identifier";
  name: string;
}

export interface NumericLiteral extends BaseNode {
  type: "NumericLiteral";
  raw: string;
}

export interface StringLiteral extends BaseNode {
  type: "StringLiteral";
  /** Includes the surrounding quotes. */
  raw: string;
}

export interface BooleanLiteral extends BaseNode {
  type: "BooleanLiteral";
  value: boolean;
}

export interface NullLiteral extends BaseNode {
  type: "NullLiteral";
}

export interface UndefinedLiteral extends BaseNode {
  type: "UndefinedLiteral";
}

export interface ThisExpression extends BaseNode {
  type: "ThisExpression";
}

export interface SuperExpression extends BaseNode {
  type: "SuperExpression";
}

export interface TemplateLiteral extends BaseNode {
  type: "TemplateLiteral";
  /**
   * Raw text chunks including their delimiters (backticks, `${`, `}`).
   * There is always exactly one more quasi than expression.
   */
  quasis: string[];
  expressions: Expression[];
}

export interface ArrayExpression extends BaseNode {
  type: "ArrayExpression";
  elements: (Expression | SpreadElement | null)[];
}

export interface ObjectExpression extends BaseNode {
  type: "ObjectExpression";
  properties: (ObjectProperty | ObjectMethod | SpreadElement)[];
}

export type PropertyKey_ = Identifier | StringLiteral | NumericLiteral | Expression;

export interface ObjectProperty extends BaseNode {
  type: "ObjectProperty";
  key: PropertyKey_;
  value: Expression;
  computed: boolean;
  shorthand: boolean;
}

export interface ObjectMethod extends BaseNode {
  type: "ObjectMethod";
  key: PropertyKey_;
  computed: boolean;
  params: Param[];
  body: BlockStatement;
  isAsync: boolean;
}

export interface SpreadElement extends BaseNode {
  type: "SpreadElement";
  argument: Expression;
}

export interface FunctionExpression extends BaseNode {
  type: "FunctionExpression";
  id: Identifier | null;
  params: Param[];
  body: BlockStatement;
  isAsync: boolean;
}

export interface ArrowFunctionExpression extends BaseNode {
  type: "ArrowFunctionExpression";
  params: Param[];
  body: BlockStatement | Expression;
  isAsync: boolean;
}

export interface ClassExpression extends BaseNode {
  type: "ClassExpression";
  id: Identifier | null;
  superClass: Expression | null;
  body: ClassMember[];
}

export type Param = Identifier | AssignmentPattern | RestElement;

export interface AssignmentPattern extends BaseNode {
  type: "AssignmentPattern";
  left: Identifier;
  right: Expression;
}

export interface RestElement extends BaseNode {
  type: "RestElement";
  argument: Identifier;
}

export interface UnaryExpression extends BaseNode {
  type: "UnaryExpression";
  operator: "!" | "~" | "+" | "-" | "typeof" | "delete" | "void";
  argument: Expression;
}

export interface UpdateExpression extends BaseNode {
  type: "UpdateExpression";
  operator: "++" | "--";
  prefix: boolean;
  argument: Expression;
}

export interface BinaryExpression extends BaseNode {
  type: "BinaryExpression";
  operator: string;
  left: Expression;
  right: Expression;
}

export interface LogicalExpression extends BaseNode {
  type: "LogicalExpression";
  operator: "&&" | "||" | "??";
  left: Expression;
  right: Expression;
}

export interface AssignmentExpression extends BaseNode {
  type: "AssignmentExpression";
  operator: string;
  left: Expression;
  right: Expression;
}

export interface ConditionalExpression extends BaseNode {
  type: "ConditionalExpression";
  test: Expression;
  consequent: Expression;
  alternate: Expression;
}

export interface CallExpression extends BaseNode {
  type: "CallExpression";
  callee: Expression;
  arguments: (Expression | SpreadElement)[];
  optional: boolean;
}

export interface NewExpression extends BaseNode {
  type: "NewExpression";
  callee: Expression;
  arguments: (Expression | SpreadElement)[];
}

export interface MemberExpression extends BaseNode {
  type: "MemberExpression";
  object: Expression;
  /** Identifier when not computed; arbitrary expression when computed. */
  property: Expression;
  computed: boolean;
  optional: boolean;
}

export interface AwaitExpression extends BaseNode {
  type: "AwaitExpression";
  argument: Expression;
}

export interface SequenceExpression extends BaseNode {
  type: "SequenceExpression";
  expressions: Expression[];
}

/** Preserves explicit parentheses from the source. */
export interface ParenthesizedExpression extends BaseNode {
  type: "ParenthesizedExpression";
  expression: Expression;
}
