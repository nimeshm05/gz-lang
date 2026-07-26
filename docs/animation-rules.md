We are implementing the landing page transition using Motion.dev.

The animation should feel like a single continuous transformation rather than multiple unrelated animations.

## Overall Feeling

Think:

- Linear.app
- Raycast
- Vercel
- Apple keynote transitions

The logo and text should never disappear and reappear.

Instead, they should physically travel from the landing page into their final navbar positions using shared layout animations.

The animation should feel smooth, intentional, and premium.

---

## Initial State

Display ONLY:

• Pixel mascot centered horizontally.
• GZLANG wordmark directly beneath it.
• Everything else hidden.
• White background.

Navbar exists but is invisible.

---



## Animation Trigger

After approximately 800ms (or immediately after assets load), begin the transition.

Entire animation duration:
700–900ms.

Use:

ease: [0.22, 1, 0.36, 1]

No spring animations.

---



# STEP 1 — Shared Element Transition

Use Motion.dev shared layout animations (`layoutId`).

The center mascot and navbar mascot MUST be the same element.

layoutId="logo"

Likewise the landing GZLANG text and navbar GZLANG text.

layoutId="wordmark"

Do NOT fade these out.

Do NOT replace them.

Animate their actual position and scale.

---



# STEP 2 — Logo Movement

Duration:
650ms

The mascot should:

• move upward
• shrink from hero size to navbar size
• remain perfectly centered during movement
• end exactly in navbar center

Maintain pixel-perfect rendering.

CSS:

image-rendering: pixelated;

Avoid scaling artifacts.

Transform origin:

center center

The movement should follow a very slight arc rather than perfectly straight.

Approximately:

translateY
translateX
scale

No rotation.

---



# STEP 3 — Wordmark Movement

Simultaneously:

The GZLANG wordmark should:

• move toward the top-left navbar
• shrink proportionally
• maintain baseline alignment
• preserve typography

No fade.

No cross dissolve.

The user should perceive it as literally flying into place.

---



# STEP 4 — Playground Reveal

While the logo is moving...

Delay:
~150ms

Animate the playground container.

Initial:

opacity: 0
translateY: 24px
blur: 8px

Animate to:

opacity: 1
translateY: 0
blur: 0

Duration:

500ms

Ease:

easeOutCubic

---



# STEP 5 — Sidebar Reveal

Delay:
250ms

Samples sidebar should fade and slide independently.

Initial:

opacity: 0
x: 12px

Final:

opacity: 1
x: 0

Duration:

350ms

---



# STEP 6 — Run Button

Delay:
350ms

Run button should pop in.

Scale:

0.94 → 1

Opacity:

0 → 1

Duration:

250ms

---



# STEP 7 — Contrib Deets

This should appear LAST.

Delay:
500ms

Animate:

opacity:
0 → 1

translateY:
-8 → 0

scale:
0.98 → 1

Duration:

300ms

The navbar should feel like it finishes assembling itself.

---



## Layering

Landing logo should stay above everything while moving.

z-index:

100

Only after the animation finishes should it become part of the navbar.

---



## Motion Principles

Never teleport elements.

Never replace elements.

Everything should physically move.

No bouncing.

No elastic springs.

No overshoot.

Everything should ease smoothly into place.

---



## Motion.dev Requirements

Use:

- layoutId for shared elements
- AnimatePresence where appropriate
- motion.div
- variants
- staggerChildren for UI reveal
- transition={{ ease: [0.22, 1, 0.36, 1] }}

Avoid manual calculations if shared layout animations can handle them.

---



## Timeline

0ms
Landing visible

100ms
Logo begins moving

100ms
Wordmark begins moving

250ms
Playground fades/slides in

350ms
Sidebar appears

450ms
Run button appears

550ms
Contrib Deets fades in

800ms
Animation complete

---



## Goal

The experience should feel like the landing page morphs into the application.

The mascot and wordmark should appear to become the navbar.

Nothing should blink, pop, or teleport.

The final result should resemble the polished shared-element transitions seen in modern Apple interfaces, Linear, and Raycast.