import { Analytics } from "@vercel/analytics/react";
import { LayoutGroup } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { BrandHero } from "./components/BrandHero/BrandHero";
import { Navbar } from "./components/Navbar/Navbar";
import { Playground } from "./components/Playground/Playground";
import { useIntroTransition } from "./hooks/useIntroTransition";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function App() {
  const [assetsReady, setAssetsReady] = useState(false);
  const [traveling, setTraveling] = useState(() => !prefersReducedMotion());
  const phase = useIntroTransition(assetsReady);

  const handleMascotLoad = useCallback(() => {
    setAssetsReady(true);
  }, []);

  const handleTravelComplete = useCallback(() => {
    setTraveling(false);
  }, []);

  useEffect(() => {
    if (phase === "app" && prefersReducedMotion()) {
      setTraveling(false);
    }
  }, [phase]);

  // Fallback if image onLoad never fires (e.g. broken asset).
  useEffect(() => {
    if (assetsReady || phase === "app") {
      return;
    }

    const timer = window.setTimeout(() => setAssetsReady(true), 1500);
    return () => window.clearTimeout(timer);
  }, [assetsReady, phase]);

  // If the cached image is already complete, onLoad may not fire.
  const handleHeroMount = useCallback((node: HTMLElement | null) => {
    if (!node) {
      return;
    }

    const img = node.querySelector("img");
    if (img?.complete) {
      setAssetsReady(true);
    }
  }, []);

  return (
    <LayoutGroup>
      {phase === "hero" ? (
        <div ref={handleHeroMount}>
          <BrandHero onMascotLoad={handleMascotLoad} />
          <Navbar showBrand={false} traveling={false} />
        </div>
      ) : (
        <div className="app-shell">
          <Navbar
            showBrand
            traveling={traveling}
            onTravelComplete={handleTravelComplete}
          />
          <Playground reveal={!prefersReducedMotion()} />
        </div>
      )}
      <Analytics />
    </LayoutGroup>
  );
}
