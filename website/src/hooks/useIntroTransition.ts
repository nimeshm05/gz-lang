import { useEffect, useState } from "react";
import { INTRO_HOLD_MS } from "../motion";

export type IntroPhase = "hero" | "app";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useIntroTransition(assetsReady: boolean): IntroPhase {
  const [phase, setPhase] = useState<IntroPhase>(() =>
    typeof window !== "undefined" && prefersReducedMotion() ? "app" : "hero",
  );

  useEffect(() => {
    if (phase === "app") {
      return;
    }

    if (prefersReducedMotion()) {
      setPhase("app");
      return;
    }

    if (!assetsReady) {
      return;
    }

    const timer = window.setTimeout(() => {
      setPhase("app");
    }, INTRO_HOLD_MS);

    return () => window.clearTimeout(timer);
  }, [assetsReady, phase]);

  return phase;
}
