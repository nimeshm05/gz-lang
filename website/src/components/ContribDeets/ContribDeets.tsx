import { useState } from "react";
import { motion } from "motion/react";
import { ContribDeetsDialog } from "../ContribDeetsDialog/ContribDeetsDialog";
import { PREMIUM_EASE, REVEAL_DELAYS } from "../../motion";
import "./ContribDeets.css";

type ContribDeetsProps = {
  reveal?: boolean;
};

export function ContribDeets({ reveal = false }: ContribDeetsProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        type="button"
        className="contrib-deets"
        onClick={() => setOpen(true)}
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
      </motion.button>

      <ContribDeetsDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
