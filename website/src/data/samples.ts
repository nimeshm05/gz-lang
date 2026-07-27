import calculatorIcon from "../../assets/icons/calculator.svg";
import listIcon from "../../assets/icons/list-todo.svg";
import capIcon from "../../assets/icons/hat-glasses.svg";
import sparklesIcon from "../../assets/icons/sparkles.svg";
import plantIcon from "../../assets/icons/clover.svg";
import handshakeIcon from "../../assets/icons/handshake.svg";
import hourglassIcon from "../../assets/icons/hourglass.svg";

export type Sample = {
  id: string;
  label: string;
  icon: string;
  source: string;
};

export const SAMPLES: Sample[] = [
  {
    id: "aura-calculator",
    label: "Aura Calculator",
    icon: calculatorIcon,
    source: `chef aura(drip) {
    lowkey (drip > 9000) {
        bet "god tier"
    }
    deadass {
        bet "mid"
    }
}

spill(aura(9500))
`,
  },
  {
    id: "w-or-l",
    label: "W or L checker",
    icon: listIcon,
    source: `chef check(result) {
    lowkey (result === noCap) {
        bet "W"
    }
    deadass {
        bet "L"
    }
}

spill(check(noCap))
spill(check(cap))
`,
  },
  {
    id: "is-this-cap",
    label: "Is this cap?",
    icon: capIcon,
    source: `lockedIn claim = "I touched grass"

lowkey (claim.includes("grass")) {
    spill("no cap")
}
deadass {
    spill("cap")
}
`,
  },
  {
    id: "rizz-calculator",
    label: "Rizz calculator",
    icon: sparklesIcon,
    source: `chef rizz(score) {
    bet score * 1.5 + 7
}

spill("rizz level: " + rizz(12))
`,
  },
  {
    id: "touch-grass",
    label: "Touch grass reminder",
    icon: plantIcon,
    source: `grind (cook i = 0; i < 3; i = i + 1) {
    spill("touch grass fr")
}
`,
  },
  {
    id: "vibe-check",
    label: "Vibe check",
    icon: handshakeIcon,
    source: `lockedIn vibes = ["chill", "fire", "mid"]

grind (lockedIn vibe of vibes) {
    spill("vibe check: " + vibe)
}
`,
  },
  {
    id: "sigma-countdown",
    label: "Sigma countdown",
    icon: hourglassIcon,
    source: `cook n = 5

stillCookin (n > 0) {
    spill(n)
    n = n - 1
}

spill("sigma mode unlocked")
`,
  },
];
