export const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_OUT_CUBIC = [0.33, 1, 0.68, 1] as const;

/** Shared logo/wordmark travel after hero hold. */
export const SHARED_LAYOUT_TRANSITION = {
  delay: 0.1,
  duration: 0.65,
  ease: PREMIUM_EASE,
};

export const INTRO_HOLD_MS = 800;

export const REVEAL_DELAYS = {
  playground: 0.25,
  sidebar: 0.35,
  runButton: 0.45,
  contrib: 0.55,
} as const;

export const SIDEBAR_ITEM_SPRING = {
  type: "spring" as const,
  stiffness: 80,
  damping: 8,
  mass: 0.6,
};

export const SIDEBAR_BLUR = "8px";

export const SIDEBAR_TAB_PANEL_TRANSITION = {
  duration: 0.25,
  ease: EASE_OUT_CUBIC,
};

export const SIDEBAR_TAB_PANEL_VARIANTS = {
  hidden: { opacity: 0, filter: `blur(${SIDEBAR_BLUR})` },
  show: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: `blur(${SIDEBAR_BLUR})` },
};

export const SIDEBAR_LIST_VARIANTS = {
  hidden: {},
  show: (delayChildren: number) => ({
    transition: {
      staggerChildren: 0.03,
      delayChildren,
    },
  }),
};

export const SIDEBAR_ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 60, filter: `blur(${SIDEBAR_BLUR})` },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: SIDEBAR_ITEM_SPRING,
  },
};
