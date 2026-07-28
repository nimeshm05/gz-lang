import { motion } from "motion/react";
import { MoveHorizontal } from "lucide-react";
import { useState } from "react";
import chevronUpIcon from "../../../assets/icons/chevron-up.svg";
import { KEYWORD_CATEGORIES } from "../../data/keywordDocs";
import {
  SIDEBAR_ITEM_VARIANTS,
  SIDEBAR_LIST_VARIANTS,
} from "../../motion";
import { ScrollArea } from "../ScrollArea/ScrollArea";
import "./DocumentationPanel.css";

export function DocumentationPanel() {
  const [expandedId, setExpandedId] = useState("");

  return (
    <ScrollArea
      as={motion.div}
      className="documentation-panel"
      variants={SIDEBAR_LIST_VARIANTS}
      initial="hidden"
      animate="show"
      custom={0.04}
    >
      {KEYWORD_CATEGORIES.map((category, index) => {
        const isExpanded = expandedId === category.id;

        return (
          <motion.section
            key={category.id}
            className={`documentation-section ${isExpanded ? "documentation-section-expanded" : ""}`}
            variants={SIDEBAR_ITEM_VARIANTS}
          >
            <button
              type="button"
              className="documentation-section-header"
              aria-expanded={isExpanded}
              onClick={() =>
                setExpandedId(isExpanded ? "" : category.id)
              }
            >
              <span className="documentation-section-heading">
                <span className="documentation-section-index">
                  {index + 1}
                </span>
                <span className="documentation-section-label">
                  {category.label}
                </span>
              </span>
              <img
                className={`documentation-chevron ${isExpanded ? "" : "documentation-chevron-collapsed"}`}
                src={chevronUpIcon}
                alt=""
                width={20}
                height={20}
              />
            </button>

            {isExpanded ? (
              <div className="documentation-section-body">
                {category.entries.map((entry, entryIndex) => (
                  <div key={entry.slang} className="documentation-entry">
                    <div className="documentation-entry-mapping">
                      <span className="documentation-pill documentation-pill-slang">
                        {entry.slang}
                      </span>
                      <MoveHorizontal
                        className="documentation-arrow"
                        size={20}
                        aria-hidden="true"
                      />
                      <span className="documentation-pill documentation-pill-js">
                        {entry.js}
                      </span>
                    </div>
                    <div className="documentation-entry-description">
                      <p>{entry.description[0]}</p>
                      <p>{entry.description[1]}</p>
                    </div>
                    {entryIndex < category.entries.length - 1 ? (
                      <hr className="documentation-divider" />
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </motion.section>
        );
      })}
    </ScrollArea>
  );
}
