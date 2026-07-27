import { motion } from "motion/react";
import { useState } from "react";
import chevronRightIcon from "../../../assets/icons/chevron-right.svg";
import { SAMPLES, type Sample } from "../../data/samples";
import { EASE_OUT_CUBIC, REVEAL_DELAYS } from "../../motion";
import "./SamplesSidebar.css";

type SidebarTab = "samples" | "documentation";

type SamplesSidebarProps = {
  reveal?: boolean;
  onSelectSample: (sample: Sample) => void;
};

export function SamplesSidebar({
  reveal = false,
  onSelectSample,
}: SamplesSidebarProps) {
  const [tab, setTab] = useState<SidebarTab>("samples");

  return (
    <motion.aside
      className="samples-sidebar"
      initial={reveal ? { opacity: 0, x: 12 } : false}
      animate={{ opacity: 1, x: 0 }}
      transition={
        reveal
          ? {
              delay: REVEAL_DELAYS.sidebar,
              duration: 0.35,
              ease: EASE_OUT_CUBIC,
            }
          : undefined
      }
    >
      <div className="samples-sidebar-tabs">
        <button
          type="button"
          className={`samples-tab ${tab === "samples" ? "samples-tab-selected" : ""}`}
          onClick={() => setTab("samples")}
        >
          Samples
        </button>
        <button
          type="button"
          className={`samples-tab ${tab === "documentation" ? "samples-tab-selected" : ""}`}
          onClick={() => setTab("documentation")}
        >
          Documentation
        </button>
      </div>

      {tab === "samples" ? (
        <ul className="samples-list">
          {SAMPLES.map((sample) => (
            <li key={sample.id}>
              <button
                type="button"
                className="samples-list-item"
                onClick={() => onSelectSample(sample)}
              >
                <span className="samples-list-icon">
                  <img src={sample.icon} alt="" width={20} height={20} />
                </span>
                <span className="samples-list-label">{sample.label}</span>
                {/* <img
                  className="samples-list-chevron"
                  src={chevronRightIcon}
                  alt=""
                  width={20}
                  height={20}
                /> */}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="samples-docs">
          <p>Docs coming soon. For now, cook with the samples.</p>
        </div>
      )}
    </motion.aside>
  );
}
