import calculatorIcon from "../../assets/icons/calculator.svg";
import listIcon from "../../assets/icons/list-todo.svg";
import capIcon from "../../assets/icons/hat-glasses.svg";
import sparklesIcon from "../../assets/icons/sparkles.svg";
import plantIcon from "../../assets/icons/clover.svg";
import handshakeIcon from "../../assets/icons/handshake.svg";
import hourglassIcon from "../../assets/icons/hourglass.svg";
import messageCircleIcon from "../../assets/icons/message-circle.svg";
import flameIcon from "../../assets/icons/flame.svg";
import crownIcon from "../../assets/icons/crown.svg";
import toggleLeftIcon from "../../assets/icons/toggle-left.svg";
import cameraIcon from "../../assets/icons/camera.svg";
import usersIcon from "../../assets/icons/users.svg";
import timerIcon from "../../assets/icons/timer.svg";

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
  {
    id: "yo-bestie",
    label: "Yo bestie",
    icon: messageCircleIcon,
    source: `chef greet(name) {
    spill("yo " + name)
}

cook bestie = "fam"
greet(bestie)
`,
  },
  {
    id: "fizzbuzz-fr",
    label: "Fizzbuzz fr",
    icon: flameIcon,
    source: `grind (cook i = 1; i <= 15; i++) {
    lowkey (i % 15 === 0) {
        spill("fizzbuzz")
    }
    deadass lowkey (i % 3 === 0) {
        spill("fizz")
    }
    deadass lowkey (i % 5 === 0) {
        spill("buzz")
    }
    deadass {
        spill(i)
    }
}
`,
  },
  {
    id: "main-character",
    label: "Main character check",
    icon: crownIcon,
    source: `lockedIn roster = ["main character", "npc", "side quest"]
cook name = "main character"

lowkey (roster.includes(name)) {
    spill("main character energy detected")
}
deadass {
    spill("npc behavior")
}
`,
  },
  {
    id: "mood-switch",
    label: "Mood vibe switch",
    icon: toggleLeftIcon,
    source: `lockedIn mood = "fire"

vibeCheck (mood) {
    itsGiving "fire":
        spill("its giving heat")
        imOut
    itsGiving "mid":
        spill("mid vibes only")
        imOut
    fr:
        spill("unknown mood")
}
`,
  },
  {
    id: "caught-in-4k",
    label: "Caught in 4K",
    icon: cameraIcon,
    source: `yolo {
    crashOut spawn Error("you were caught in 4k")
} caughtIn4K (err) {
    spill("caught in 4k: " + err.message)
}
`,
  },
  {
    id: "squad-goals",
    label: "Squad goals",
    icon: usersIcon,
    source: `squad Bestie {
    constructor(name) {
        me.name = name
    }
    intro() {
        bet "its giving " + me.name
    }
}

lockedIn homie = spawn Bestie("fam")
spill(homie.intro())
`,
  },
  {
    id: "hold-up-vibes",
    label: "Hold up vibes",
    icon: timerIcon,
    source: `waitForIt chef fetchVibe(ms) {
    bet holdUp spawn Promise((resolve) => setTimeout(() => resolve("vibes received"), ms))
}

waitForIt chef main() {
    lockedIn vibe = holdUp fetchVibe(10)
    spill(vibe)
}

holdUp main()
`,
  },
];
