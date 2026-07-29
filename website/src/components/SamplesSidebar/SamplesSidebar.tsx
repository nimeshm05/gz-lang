import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { DocumentationPanel } from "../DocumentationPanel/DocumentationPanel";
import { ScrollArea } from "../ScrollArea/ScrollArea";
import { SAMPLES, type Sample } from "../../data/samples";
import {
  EASE_OUT_CUBIC,
  REVEAL_DELAYS,
  SIDEBAR_BLUR,
  SIDEBAR_ITEM_VARIANTS,
  SIDEBAR_LIST_VARIANTS,
  SIDEBAR_TAB_PANEL_TRANSITION,
  SIDEBAR_TAB_PANEL_VARIANTS,
} from "../../motion";
import "./SamplesSidebar.css";

type SidebarTab = "samples" | "documentation";

type SamplesSidebarProps = {
  reveal?: boolean;
  onSelectSample: (sample: Sample) => void;
};

const SIDEBAR_TABS: { id: SidebarTab; label: string }[] = [
  { id: "samples", label: "Cookbooks" },
  { id: "documentation", label: "Documentation" },
];

const listVariants = SIDEBAR_LIST_VARIANTS;
const itemVariants = SIDEBAR_ITEM_VARIANTS;
const tabPanelVariants = SIDEBAR_TAB_PANEL_VARIANTS;

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
      initial={
        reveal ? { opacity: 0, x: 12, filter: `blur(${SIDEBAR_BLUR})` } : false
      }
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
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
        {SIDEBAR_TABS.map(({ id, label }) => {
          const isActive = tab === id;

          return (
            <button
              key={id}
              type="button"
              role="tab"
              className={`samples-tab ${isActive ? "samples-tab-selected" : ""}`}
              aria-selected={isActive}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {tab === "samples" ? (
          <motion.div
            key="samples"
            className="samples-sidebar-panel"
            variants={tabPanelVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            transition={SIDEBAR_TAB_PANEL_TRANSITION}
          >
            <ScrollArea
              as={motion.ul}
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
            </ScrollArea>
          </motion.div>
        ) : (
          <motion.div
            key="documentation"
            className="samples-sidebar-panel"
            variants={tabPanelVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            transition={SIDEBAR_TAB_PANEL_TRANSITION}
          >
            <DocumentationPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
