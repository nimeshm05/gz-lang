import { motion } from "motion/react";
import { useRef, useState } from "react";
import { SAMPLES, type Sample } from "../../data/samples";
import { EASE_OUT_CUBIC, REVEAL_DELAYS } from "../../motion";
import "./SamplesSidebar.css";

type SidebarTab = "samples" | "documentation";

type SamplesSidebarProps = {
  reveal?: boolean;
  onSelectSample: (sample: Sample) => void;
};

const ITEM_SPRING = {
  type: "spring" as const,
  stiffness: 80,
  damping: 8,
  mass: 0.6,
};

const listVariants = {
  hidden: {},
  show: (delayChildren: number) => ({
    transition: {
      staggerChildren: 0.03,
      delayChildren,
    },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: ITEM_SPRING,
  },
};

export function SamplesSidebar({
  reveal = false,
  onSelectSample,
}: SamplesSidebarProps) {
  const [tab, setTab] = useState<SidebarTab>("samples");
  const introPending = useRef(reveal);
  const listDelay = introPending.current ? REVEAL_DELAYS.sidebar + 0.12 : 0.04;

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
        <motion.ul
          className="samples-list"
          variants={listVariants}
          initial={reveal || introPending.current ? "hidden" : false}
          animate="show"
          custom={listDelay}
          onAnimationComplete={() => {
            introPending.current = false;
          }}
        >
          {SAMPLES.map((sample) => (
            <motion.li key={sample.id} variants={itemVariants}>
              <button
                type="button"
                className="samples-list-item"
                onClick={() => onSelectSample(sample)}
              >
                <span className="samples-list-icon">
                  <img src={sample.icon} alt="" width={20} height={20} />
                </span>
                <span className="samples-list-label">{sample.label}</span>
              </button>
            </motion.li>
          ))}
        </motion.ul>
      ) : (
        <div className="samples-docs">
          <p>Docs coming soon. For now, cook with the samples.</p>
        </div>
      )}
    </motion.aside>
  );
}
