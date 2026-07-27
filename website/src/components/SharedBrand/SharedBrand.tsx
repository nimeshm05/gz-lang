import { motion } from "motion/react";
import mascotUrl from "../../../assets/gzlang-mascot.svg";
import { SHARED_LAYOUT_TRANSITION } from "../../motion";
import "./SharedBrand.css";

type SharedLogoProps = {
  size: "hero" | "nav";
  traveling?: boolean;
  onTravelComplete?: () => void;
  onLoad?: () => void;
};

export function SharedLogo({
  size,
  traveling = false,
  onTravelComplete,
  onLoad,
}: SharedLogoProps) {
  return (
    <motion.div
      layoutId="logo"
      className={`shared-logo shared-logo-${size}`}
      transition={SHARED_LAYOUT_TRANSITION}
      style={{ zIndex: traveling ? "var(--z-shared-travel)" : undefined }}
      onLayoutAnimationComplete={onTravelComplete}
    >
      <img
        src={mascotUrl}
        alt="gzlang mascot"
        width={512}
        height={512}
        onLoad={onLoad}
      />
    </motion.div>
  );
}

type SharedWordmarkProps = {
  size: "hero" | "nav";
  traveling?: boolean;
};

export function SharedWordmark({ size, traveling = false }: SharedWordmarkProps) {
  const className = `shared-wordmark shared-wordmark-${size}`;
  const style = {
    zIndex: traveling ? ("var(--z-shared-travel)" as const) : undefined,
  };

  if (size === "hero") {
    return (
      <motion.h1
        layoutId="wordmark"
        className={className}
        transition={SHARED_LAYOUT_TRANSITION}
        style={style}
      >
        gzlang
      </motion.h1>
    );
  }

  return (
    <motion.p
      layoutId="wordmark"
      className={className}
      transition={SHARED_LAYOUT_TRANSITION}
      style={style}
    >
      gzlang
    </motion.p>
  );
}
