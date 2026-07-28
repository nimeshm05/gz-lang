import { motion } from "motion/react";
import { EASE_OUT_CUBIC, PREMIUM_EASE, REVEAL_DELAYS } from "../../motion";
import "./Button.css";

type ButtonProps = {
  label: string;
  variant?: "primary" | "secondary";
  reveal?: boolean;
  onClick?: () => void;
  className?: string;
};

export function Button({
  label,
  variant = "primary",
  reveal = false,
  className = "",
  onClick,
}: ButtonProps) {
  return (
    <motion.button
      type="button"
      className={`ui-button ui-button-${variant} ${className}`.trim()}
      onClick={onClick}
      initial={reveal ? { opacity: 0, scale: 0.94 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={
        reveal
          ? {
              delay: REVEAL_DELAYS.runButton,
              duration: 0.25,
              ease: PREMIUM_EASE,
            }
          : { duration: 0.15, ease: EASE_OUT_CUBIC }
      }
    >
      {label}
    </motion.button>
  );
}
