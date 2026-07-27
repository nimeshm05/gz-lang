import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { GzSyntaxError, transpile } from "gzlang";
import chevronUpIcon from "../../../assets/icons/chevron-up.svg";
import type { Sample } from "../../data/samples";
import { EASE_OUT_CUBIC, REVEAL_DELAYS } from "../../motion";
import { Button } from "../Button/Button";
import { SamplesSidebar } from "../SamplesSidebar/SamplesSidebar";
import "./Playground.css";

type PlaygroundProps = {
  reveal?: boolean;
};

function captureRun(source: string): string {
  const logs: string[] = [];
  const originalLog = console.log;

  try {
    const js = transpile(source);
    console.log = (...args: unknown[]) => {
      logs.push(
        args
          .map((arg) =>
            typeof arg === "string" ? arg : JSON.stringify(arg, null, 2),
          )
          .join(" "),
      );
    };

    const runner = new Function(js);
    const result = runner();

    if (result !== undefined) {
      logs.push(String(result));
    }

    return logs.length > 0 ? logs.join("\n") : "(no output)";
  } catch (error) {
    if (error instanceof GzSyntaxError) {
      return `error: ${error.message}`;
    }

    if (error instanceof Error) {
      return `error: ${error.message}`;
    }

    return "error: something went wrong";
  } finally {
    console.log = originalLog;
  }
}

export function Playground({ reveal = false }: PlaygroundProps) {
  const [source, setSource] = useState("");
  const [consoleOutput, setConsoleOutput] = useState("");
  const [consoleOpen, setConsoleOpen] = useState(false);

  const lineCount = useMemo(() => source.split("\n").length, [source]);
  const lineNumbers = useMemo(
    () => Array.from({ length: lineCount }, (_, index) => index + 1),
    [lineCount],
  );

  function handleSelectSample(sample: Sample) {
    setSource(sample.source.trimEnd() + "\n");
    setConsoleOutput("");
  }

  function handleRun() {
    setConsoleOpen(true);
    setConsoleOutput(captureRun(source));
  }

  return (
    <section className="playground-page">
      <div className="playground-shell">
        <motion.div
          className="playground-main"
          initial={
            reveal
              ? { opacity: 0, y: 24, filter: "blur(8px)" }
              : false
          }
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={
            reveal
              ? {
                  delay: REVEAL_DELAYS.playground,
                  duration: 0.5,
                  ease: EASE_OUT_CUBIC,
                }
              : undefined
          }
        >
          <div className="playground-toolbar">
            <h2 className="playground-title">Code Playground</h2>
            <Button label="Run Code" reveal={reveal} onClick={handleRun} />
          </div>

          <div className="playground-editor">
            <div className="playground-gutter" aria-hidden="true">
              {lineNumbers.map((line) => (
                <span key={line} className="playground-line-number">
                  {line}
                </span>
              ))}
            </div>
            <textarea
              className="playground-input"
              value={source}
              onChange={(event) => setSource(event.target.value)}
              placeholder="Type your code here"
              spellCheck={false}
              aria-label="Code playground editor"
              rows={lineCount}
              style={{ height: `calc(${lineCount} * var(--editor-line-height) + 2 * var(--editor-padding))` }}
            />
          </div>

          <div className="playground-console">
            <button
              type="button"
              className="playground-console-header"
              onClick={() => setConsoleOpen((open) => !open)}
              aria-expanded={consoleOpen}
            >
              <span className="playground-console-title">Output</span>
              <img
                className={`playground-console-chevron ${consoleOpen ? "" : "playground-console-chevron-collapsed"}`}
                src={chevronUpIcon}
                alt=""
                width={20}
                height={20}
              />
            </button>
            {consoleOpen ? (
              <div className="playground-console-output">
                {consoleOutput || " "}
              </div>
            ) : null}
          </div>
        </motion.div>

        <SamplesSidebar reveal={reveal} onSelectSample={handleSelectSample} />
      </div>
    </section>
  );
}
