import { motion } from "motion/react";
import mirrorRoundIcon from "../../../assets/icons/mirror-round.svg";
import chevronRightIcon from "../../../assets/icons/chevron-right.svg";
import { PREMIUM_EASE, REVEAL_DELAYS } from "../../motion";
import "./ContribDeets.css";

const CONTRIB_HREF = "https://github.com/search?q=gzlang&type=repositories";

type ContribDeetsProps = {
  reveal?: boolean;
};

export function ContribDeets({ reveal = false }: ContribDeetsProps) {
  return (
    <motion.a
      className="contrib-deets"
      href={CONTRIB_HREF}
      target="_blank"
      rel="noreferrer"
      initial={reveal ? { opacity: 0, y: -8, scale: 0.98 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={
        reveal
          ? {
              delay: REVEAL_DELAYS.contrib,
              duration: 0.3,
              ease: PREMIUM_EASE,
            }
          : undefined
      }
    >
      <span className="contrib-deets-label">Contrib Deets</span>
      <img
        className="contrib-deets-chevron"
        src={chevronRightIcon}
        alt=""
        width={20}
        height={20}
      />
    </motion.a>
  );
}
