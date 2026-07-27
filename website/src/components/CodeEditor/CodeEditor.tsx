import { useMemo, useRef } from "react";
import { highlightGzlang } from "../../lib/highlightGzlang";
import "./CodeEditor.css";

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  lineCount: number;
  placeholder?: string;
  "aria-label"?: string;
};

export function CodeEditor({
  value,
  onChange,
  lineCount,
  placeholder = "Type your code here",
  "aria-label": ariaLabel,
}: CodeEditorProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const highlighted = useMemo(() => highlightGzlang(value), [value]);

  const editorHeight = `calc(${lineCount} * var(--editor-line-height) + 2 * var(--editor-padding))`;

  function syncScroll() {
    const textarea = textareaRef.current;
    const pre = preRef.current;
    if (!textarea || !pre) {
      return;
    }
    pre.scrollTop = textarea.scrollTop;
    pre.scrollLeft = textarea.scrollLeft;
  }

  return (
    <div className="code-editor">
      <pre
        ref={preRef}
        className="code-editor-highlight"
        aria-hidden="true"
      >
        <code>
          {value.length > 0 ? (
            <span dangerouslySetInnerHTML={{ __html: highlighted }} />
          ) : (
            <span className="code-editor-placeholder">{placeholder}</span>
          )}
        </code>
      </pre>
      <textarea
        ref={textareaRef}
        className="code-editor-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onScroll={syncScroll}
        spellCheck={false}
        aria-label={ariaLabel}
        rows={lineCount}
        style={{ height: editorHeight }}
      />
    </div>
  );
}
