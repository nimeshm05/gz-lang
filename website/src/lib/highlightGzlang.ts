import { BUILTINS, KEYWORDS, PASSTHROUGH_KEYWORDS } from "gzlang";

const KEYWORD_SET = new Set([
  ...Object.keys(KEYWORDS),
  ...PASSTHROUGH_KEYWORDS,
]);

const BUILTIN_SET = new Set(Object.keys(BUILTINS));

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrap(className: string, text: string): string {
  return `<span class="${className}">${escapeHtml(text)}</span>`;
}

function isIdStart(ch: string): boolean {
  return /[A-Za-z_$]/.test(ch);
}

function isIdPart(ch: string): boolean {
  return /[A-Za-z0-9_$]/.test(ch);
}

function isDigit(ch: string): boolean {
  return ch >= "0" && ch <= "9";
}

function readQuotedString(
  source: string,
  start: number,
  quote: '"' | "'",
): number {
  let i = start + 1;
  while (i < source.length) {
    const ch = source[i]!;
    if (ch === "\\") {
      i += 2;
      continue;
    }
    if (ch === quote) {
      return i + 1;
    }
    i++;
  }
  return source.length;
}

function readTemplateLiteral(source: string, start: number): number {
  let i = start + 1;
  while (i < source.length) {
    const ch = source[i]!;
    if (ch === "\\") {
      i += 2;
      continue;
    }
    if (ch === "`") {
      return i + 1;
    }
    if (ch === "$" && source[i + 1] === "{") {
      i += 2;
      let depth = 1;
      while (i < source.length && depth > 0) {
        if (source[i] === "{") depth++;
        else if (source[i] === "}") depth--;
        i++;
      }
      continue;
    }
    i++;
  }
  return source.length;
}

function readNumber(source: string, start: number): number {
  let i = start;
  if (source[i] === "0" && i + 1 < source.length && /[xXbBoO]/.test(source[i + 1]!)) {
    i += 2;
    while (i < source.length && /[0-9a-fA-F_]/.test(source[i]!)) i++;
    return i;
  }

  while (i < source.length && isDigit(source[i]!)) i++;

  if (source[i] === "." && i + 1 < source.length && isDigit(source[i + 1]!)) {
    i++;
    while (i < source.length && isDigit(source[i]!)) i++;
  }

  if (/[eE]/.test(source[i] ?? "")) {
    i++;
    if (source[i] === "+" || source[i] === "-") i++;
    while (i < source.length && isDigit(source[i]!)) i++;
  }

  if (source[i] === "n") i++;

  return i;
}

function readWord(source: string, start: number): number {
  let i = start;
  while (i < source.length && isIdPart(source[i]!)) i++;
  return i;
}

/** Fault-tolerant HTML highlighter for gzlang source (safe while typing). */
export function highlightGzlang(source: string): string {
  if (source.length === 0) {
    return "";
  }

  const parts: string[] = [];
  let i = 0;

  while (i < source.length) {
    const ch = source[i]!;

    if (ch === "/" && source[i + 1] === "*") {
      const end = source.indexOf("*/", i + 2);
      const sliceEnd = end === -1 ? source.length : end + 2;
      parts.push(wrap("token-comment", source.slice(i, sliceEnd)));
      i = sliceEnd;
      continue;
    }

    if (ch === "/" && source[i + 1] === "/") {
      const end = source.indexOf("\n", i);
      const sliceEnd = end === -1 ? source.length : end;
      parts.push(wrap("token-comment", source.slice(i, sliceEnd)));
      i = sliceEnd;
      continue;
    }

    if (ch === '"' || ch === "'") {
      const end = readQuotedString(source, i, ch);
      parts.push(wrap("token-string", source.slice(i, end)));
      i = end;
      continue;
    }

    if (ch === "`") {
      const end = readTemplateLiteral(source, i);
      parts.push(wrap("token-string", source.slice(i, end)));
      i = end;
      continue;
    }

    if (
      isDigit(ch) ||
      (ch === "." && i + 1 < source.length && isDigit(source[i + 1]!))
    ) {
      const end = readNumber(source, i);
      parts.push(wrap("token-number", source.slice(i, end)));
      i = end;
      continue;
    }

    if (isIdStart(ch)) {
      const end = readWord(source, i);
      const word = source.slice(i, end);

      if (KEYWORD_SET.has(word)) {
        parts.push(wrap("token-keyword", word));
      } else if (BUILTIN_SET.has(word)) {
        parts.push(wrap("token-builtin", word));
      } else {
        parts.push(escapeHtml(word));
      }

      i = end;
      continue;
    }

    parts.push(escapeHtml(ch));
    i++;
  }

  return parts.join("");
}
