export interface SourcePosition {
  /** 1-based line number. */
  line: number;
  /** 1-based column number. */
  column: number;
}

/**
 * A syntax error in gzlang source, with a code frame pointing at the
 * offending line and column.
 */
export class GzSyntaxError extends Error {
  readonly line: number;
  readonly column: number;

  constructor(message: string, pos: SourcePosition, source?: string) {
    super(formatError(message, pos, source));
    this.name = "GzSyntaxError";
    this.line = pos.line;
    this.column = pos.column;
  }
}

function formatError(message: string, pos: SourcePosition, source?: string): string {
  let out = `${message} (line ${pos.line}, column ${pos.column})`;
  if (source !== undefined) {
    const frame = codeFrame(source, pos);
    if (frame) out += `\n\n${frame}`;
  }
  return out;
}

function codeFrame(source: string, pos: SourcePosition): string | undefined {
  const lines = source.split(/\r\n|\r|\n/);
  const lineText = lines[pos.line - 1];
  if (lineText === undefined) return undefined;

  const gutter = String(pos.line);
  const before = pos.line > 1 ? `${String(pos.line - 1).padStart(gutter.length)} | ${lines[pos.line - 2]}\n` : "";
  const marker = `${" ".repeat(gutter.length)} | ${" ".repeat(pos.column - 1)}^`;
  return `${before}${gutter} | ${lineText}\n${marker}`;
}
