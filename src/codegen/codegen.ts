import { BUILTINS } from "../keywords.js";
import type * as ast from "../parser/ast.js";

const INDENT = "    ";

export function generate(program: ast.Program): string {
  return new CodeGenerator().generateProgram(program);
}

class CodeGenerator {
  private depth = 0;

  generateProgram(program: ast.Program): string {
    const code = program.body.map((stmt) => this.genStatement(stmt)).join("\n");
    return code.length > 0 ? `${code}\n` : "";
  }

  private indent(): string {
    return INDENT.repeat(this.depth);
  }

  // --- statements ---

  private genStatement(stmt: ast.Statement): string {
    const pad = this.indent();
    switch (stmt.type) {
      case "VariableDeclaration":
        return `${pad}${this.genVariableDeclaration(stmt)};`;
      case "FunctionDeclaration":
        return `${pad}${this.genFunction(stmt, "function")}`;
      case "ReturnStatement":
        return `${pad}return${stmt.argument ? ` ${this.genExpression(stmt.argument)}` : ""};`;
      case "IfStatement":
        return `${pad}${this.genIf(stmt)}`;
      case "SwitchStatement":
        return `${pad}${this.genSwitch(stmt)}`;
      case "ForStatement":
        return `${pad}${this.genFor(stmt)}`;
      case "ForInStatement":
        return `${pad}${this.genForInOf(stmt, "in")}`;
      case "ForOfStatement":
        return `${pad}${this.genForInOf(stmt, "of")}`;
      case "WhileStatement":
        return `${pad}while (${this.genExpression(stmt.test)}) ${this.genBody(stmt.body)}`;
      case "DoWhileStatement":
        return `${pad}do ${this.genBody(stmt.body)} while (${this.genExpression(stmt.test)});`;
      case "BreakStatement":
        return `${pad}break;`;
      case "ContinueStatement":
        return `${pad}continue;`;
      case "ClassDeclaration":
        return `${pad}${this.genClass(stmt)}`;
      case "TryStatement":
        return `${pad}${this.genTry(stmt)}`;
      case "ThrowStatement":
        return `${pad}throw ${this.genExpression(stmt.argument)};`;
      case "ImportDeclaration":
        return `${pad}${this.genImport(stmt)}`;
      case "ExportNamedDeclaration":
        return `${pad}${this.genExportNamed(stmt)}`;
      case "ExportDefaultDeclaration":
        return `${pad}${this.genExportDefault(stmt)}`;
      case "ExpressionStatement":
        return `${pad}${this.genExpression(stmt.expression)};`;
      case "BlockStatement":
        return `${pad}${this.genBlock(stmt)}`;
      case "EmptyStatement":
        return `${pad};`;
    }
  }

  private genBlock(block: ast.BlockStatement): string {
    if (block.body.length === 0) return "{}";
    this.depth++;
    const body = block.body.map((stmt) => this.genStatement(stmt)).join("\n");
    this.depth--;
    return `{\n${body}\n${this.indent()}}`;
  }

  /** Renders a statement used as a loop/if body, wrapping non-blocks inline. */
  private genBody(stmt: ast.Statement): string {
    if (stmt.type === "BlockStatement") return this.genBlock(stmt);
    // Keep single-statement bodies readable by placing them on their own line.
    this.depth++;
    const inner = this.genStatement(stmt);
    this.depth--;
    return `{\n${inner}\n${this.indent()}}`;
  }

  private genVariableDeclaration(decl: ast.VariableDeclaration): string {
    const declarations = decl.declarations
      .map((d) => `${d.id.name}${d.init ? ` = ${this.genExpression(d.init)}` : ""}`)
      .join(", ");
    return `${decl.kind} ${declarations}`;
  }

  private genFunction(
    fn: ast.FunctionDeclaration | ast.FunctionExpression,
    keyword: "function",
  ): string {
    const asyncPrefix = fn.isAsync ? "async " : "";
    const name = fn.id ? ` ${fn.id.name}` : "";
    return `${asyncPrefix}${keyword}${name}(${this.genParams(fn.params)}) ${this.genBlock(fn.body)}`;
  }

  private genParams(params: ast.Param[]): string {
    return params.map((param) => this.genParam(param)).join(", ");
  }

  private genParam(param: ast.Param): string {
    switch (param.type) {
      case "Identifier":
        return param.name;
      case "AssignmentPattern":
        return `${param.left.name} = ${this.genExpression(param.right)}`;
      case "RestElement":
        return `...${param.argument.name}`;
    }
  }

  private genIf(stmt: ast.IfStatement): string {
    let out = `if (${this.genExpression(stmt.test)}) ${this.genBody(stmt.consequent)}`;
    if (stmt.alternate) {
      if (stmt.alternate.type === "IfStatement") {
        out += ` else ${this.genIf(stmt.alternate)}`;
      } else {
        out += ` else ${this.genBody(stmt.alternate)}`;
      }
    }
    return out;
  }

  private genSwitch(stmt: ast.SwitchStatement): string {
    let out = `switch (${this.genExpression(stmt.discriminant)}) {\n`;
    this.depth++;
    for (const switchCase of stmt.cases) {
      const label = switchCase.test ? `case ${this.genExpression(switchCase.test)}:` : "default:";
      out += `${this.indent()}${label}\n`;
      this.depth++;
      for (const inner of switchCase.consequent) {
        out += `${this.genStatement(inner)}\n`;
      }
      this.depth--;
    }
    this.depth--;
    return `${out}${this.indent()}}`;
  }

  private genFor(stmt: ast.ForStatement): string {
    const init =
      stmt.init === null
        ? ""
        : stmt.init.type === "VariableDeclaration"
          ? this.genVariableDeclaration(stmt.init)
          : this.genExpression(stmt.init);
    const test = stmt.test ? this.genExpression(stmt.test) : "";
    const update = stmt.update ? this.genExpression(stmt.update) : "";
    return `for (${init}; ${test}; ${update}) ${this.genBody(stmt.body)}`;
  }

  private genForInOf(stmt: ast.ForInStatement | ast.ForOfStatement, kind: "in" | "of"): string {
    const left =
      stmt.left.type === "VariableDeclaration"
        ? this.genVariableDeclaration(stmt.left)
        : this.genExpression(stmt.left);
    return `for (${left} ${kind} ${this.genExpression(stmt.right)}) ${this.genBody(stmt.body)}`;
  }

  private genClass(node: ast.ClassDeclaration | ast.ClassExpression): string {
    const name = node.id ? ` ${node.id.name}` : "";
    const heritage = node.superClass ? ` extends ${this.genExpression(node.superClass)}` : "";
    if (node.body.length === 0) return `class${name}${heritage} {}`;

    this.depth++;
    const members = node.body.map((member) => this.genClassMember(member)).join("\n");
    this.depth--;
    return `class${name}${heritage} {\n${members}\n${this.indent()}}`;
  }

  private genClassMember(member: ast.ClassMember): string {
    const pad = this.indent();
    const staticPrefix = member.isStatic ? "static " : "";
    const key = this.genPropertyKey(member.key, member.computed);

    if (member.type === "PropertyDefinition") {
      return `${pad}${staticPrefix}${key}${member.value ? ` = ${this.genExpression(member.value)}` : ""};`;
    }

    const asyncPrefix = member.isAsync ? "async " : "";
    const accessorPrefix = member.kind === "get" || member.kind === "set" ? `${member.kind} ` : "";
    return `${pad}${staticPrefix}${asyncPrefix}${accessorPrefix}${key}(${this.genParams(member.params)}) ${this.genBlock(member.body)}`;
  }

  private genPropertyKey(key: ast.PropertyKey_, computed: boolean): string {
    if (computed) return `[${this.genExpression(key)}]`;
    if (key.type === "Identifier") return key.name;
    if (key.type === "StringLiteral") return key.raw;
    if (key.type === "NumericLiteral") return key.raw;
    return this.genExpression(key);
  }

  private genTry(stmt: ast.TryStatement): string {
    let out = `try ${this.genBlock(stmt.block)}`;
    if (stmt.handler) {
      const param = stmt.handler.param ? ` (${stmt.handler.param.name})` : "";
      out += ` catch${param} ${this.genBlock(stmt.handler.body)}`;
    }
    if (stmt.finalizer) {
      out += ` finally ${this.genBlock(stmt.finalizer)}`;
    }
    return out;
  }

  private genImport(stmt: ast.ImportDeclaration): string {
    if (stmt.specifiers.length === 0) {
      return `import ${stmt.source.raw};`;
    }
    const parts: string[] = [];
    const named: string[] = [];
    for (const spec of stmt.specifiers) {
      if (spec.type === "ImportDefaultSpecifier") {
        parts.push(spec.local.name);
      } else if (spec.type === "ImportNamespaceSpecifier") {
        parts.push(`* as ${spec.local.name}`);
      } else {
        named.push(
          spec.imported.name === spec.local.name
            ? spec.imported.name
            : `${spec.imported.name} as ${spec.local.name}`,
        );
      }
    }
    if (named.length > 0) parts.push(`{ ${named.join(", ")} }`);
    return `import ${parts.join(", ")} from ${stmt.source.raw};`;
  }

  private genExportNamed(stmt: ast.ExportNamedDeclaration): string {
    if (stmt.declaration) {
      const decl =
        stmt.declaration.type === "VariableDeclaration"
          ? `${this.genVariableDeclaration(stmt.declaration)};`
          : stmt.declaration.type === "FunctionDeclaration"
            ? this.genFunction(stmt.declaration, "function")
            : this.genClass(stmt.declaration);
      return `export ${decl}`;
    }
    const specs = stmt.specifiers.map((spec) =>
      spec.local.name === spec.exported.name
        ? spec.local.name
        : `${spec.local.name} as ${spec.exported.name}`,
    );
    return `export { ${specs.join(", ")} };`;
  }

  private genExportDefault(stmt: ast.ExportDefaultDeclaration): string {
    const decl = stmt.declaration;
    if (decl.type === "FunctionDeclaration") {
      return `export default ${this.genFunction(decl, "function")}`;
    }
    if (decl.type === "ClassDeclaration") {
      return `export default ${this.genClass(decl)}`;
    }
    return `export default ${this.genExpression(decl)};`;
  }

  // --- expressions ---

  private genExpression(expr: ast.Expression): string {
    switch (expr.type) {
      case "Identifier":
        return BUILTINS[expr.name] ?? expr.name;
      case "NumericLiteral":
        return expr.raw;
      case "StringLiteral":
        return expr.raw;
      case "BooleanLiteral":
        return expr.value ? "true" : "false";
      case "NullLiteral":
        return "null";
      case "UndefinedLiteral":
        return "undefined";
      case "ThisExpression":
        return "this";
      case "SuperExpression":
        return "super";
      case "TemplateLiteral":
        return this.genTemplate(expr);
      case "ArrayExpression":
        return this.genArray(expr);
      case "ObjectExpression":
        return this.genObject(expr);
      case "FunctionExpression":
        return this.genFunction(expr, "function");
      case "ArrowFunctionExpression":
        return this.genArrow(expr);
      case "ClassExpression":
        return this.genClass(expr);
      case "UnaryExpression": {
        const space = expr.operator.length > 1 ? " " : "";
        return `${expr.operator}${space}${this.genExpression(expr.argument)}`;
      }
      case "UpdateExpression":
        return expr.prefix
          ? `${expr.operator}${this.genExpression(expr.argument)}`
          : `${this.genExpression(expr.argument)}${expr.operator}`;
      case "BinaryExpression":
      case "LogicalExpression":
        return `${this.genExpression(expr.left)} ${expr.operator} ${this.genExpression(expr.right)}`;
      case "AssignmentExpression":
        return `${this.genExpression(expr.left)} ${expr.operator} ${this.genExpression(expr.right)}`;
      case "ConditionalExpression":
        return `${this.genExpression(expr.test)} ? ${this.genExpression(expr.consequent)} : ${this.genExpression(expr.alternate)}`;
      case "CallExpression":
        return `${this.genExpression(expr.callee)}${expr.optional ? "?." : ""}(${this.genArguments(expr.arguments)})`;
      case "NewExpression":
        return `new ${this.genExpression(expr.callee)}(${this.genArguments(expr.arguments)})`;
      case "MemberExpression":
        return this.genMember(expr);
      case "AwaitExpression":
        return `await ${this.genExpression(expr.argument)}`;
      case "SequenceExpression":
        return expr.expressions.map((e) => this.genExpression(e)).join(", ");
      case "ParenthesizedExpression":
        return `(${this.genExpression(expr.expression)})`;
    }
  }

  private genTemplate(expr: ast.TemplateLiteral): string {
    let out = expr.quasis[0]!;
    for (let i = 0; i < expr.expressions.length; i++) {
      out += this.genExpression(expr.expressions[i]!);
      out += expr.quasis[i + 1]!;
    }
    return out;
  }

  private genArray(expr: ast.ArrayExpression): string {
    const elements = expr.elements.map((el) => {
      if (el === null) return "";
      if (el.type === "SpreadElement") return `...${this.genExpression(el.argument)}`;
      return this.genExpression(el);
    });
    return `[${elements.join(", ")}]`;
  }

  private genObject(expr: ast.ObjectExpression): string {
    if (expr.properties.length === 0) return "{}";
    const props = expr.properties.map((prop) => {
      if (prop.type === "SpreadElement") {
        return `...${this.genExpression(prop.argument)}`;
      }
      if (prop.type === "ObjectMethod") {
        const asyncPrefix = prop.isAsync ? "async " : "";
        return `${asyncPrefix}${this.genPropertyKey(prop.key, prop.computed)}(${this.genParams(prop.params)}) ${this.genBlock(prop.body)}`;
      }
      if (prop.shorthand) {
        return this.genPropertyKey(prop.key, false);
      }
      return `${this.genPropertyKey(prop.key, prop.computed)}: ${this.genExpression(prop.value)}`;
    });
    return `{ ${props.join(", ")} }`;
  }

  private genArrow(expr: ast.ArrowFunctionExpression): string {
    const asyncPrefix = expr.isAsync ? "async " : "";
    const params =
      expr.params.length === 1 && expr.params[0]!.type === "Identifier"
        ? (expr.params[0] as ast.Identifier).name
        : `(${this.genParams(expr.params)})`;
    const body =
      expr.body.type === "BlockStatement" ? this.genBlock(expr.body) : this.genExpression(expr.body);
    return `${asyncPrefix}${params} => ${body}`;
  }

  private genMember(expr: ast.MemberExpression): string {
    const object = this.genExpression(expr.object);
    if (expr.computed) {
      return `${object}${expr.optional ? "?." : ""}[${this.genExpression(expr.property)}]`;
    }
    // Property names are emitted raw; builtin renaming never applies here.
    const name = (expr.property as ast.Identifier).name;
    return `${object}${expr.optional ? "?." : "."}${name}`;
  }

  private genArguments(args: (ast.Expression | ast.SpreadElement)[]): string {
    return args
      .map((arg) =>
        arg.type === "SpreadElement" ? `...${this.genExpression(arg.argument)}` : this.genExpression(arg),
      )
      .join(", ");
  }
}
