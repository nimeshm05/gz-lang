---
name: Smooth sidebar spring stagger
overview: "Replace the rigid ease-based sidebar list stagger with a smooth spring animation: each item slides from y:60 to y:0 with opacity fade, staggered 0.05s apart."
todos:
  - id: spring-variants
    content: Update itemVariants to y:60 spring and listVariants staggerChildren:0.05 in SamplesSidebar.tsx
    status: completed
  - id: verify-spring
    content: Remove unused PREMIUM_EASE import and verify build + animation feel
    status: completed
isProject: false
---

# Smooth Spring Stagger for Samples Sidebar

## Goal

Replace the current rigid 0.1s ease animation with a **smooth spring stagger** on list items in [`website/src/components/SamplesSidebar/SamplesSidebar.tsx`](website/src/components/SamplesSidebar/SamplesSidebar.tsx).

## Current state

```14:34:website/src/components/SamplesSidebar/SamplesSidebar.tsx
const listVariants = {
  hidden: {},
  show: (delayChildren: number) => ({
    transition: {
      staggerChildren: 0.1,
      delayChildren,
    },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.1,
      ease: PREMIUM_EASE,
    },
  },
};
```

Uses fixed `duration` + cubic-bezier easing — feels abrupt/snappy rather than fluid.

## Changes (single file)

Update variants in [`website/src/components/SamplesSidebar/SamplesSidebar.tsx`](website/src/components/SamplesSidebar/SamplesSidebar.tsx):

| Property | Current | New |
|----------|---------|-----|
| `hidden.y` | `24` | `60` |
| `staggerChildren` | `0.1` | `0.05` |
| Transition type | `duration` + `ease` | `type: "spring"` |
| Opacity | `0 → 1` | `0 → 1` (unchanged) |

### Proposed spring config

Use a **soft, low-bounce spring** so it feels smooth rather than bouncy:

```tsx
const ITEM_SPRING = {
  type: "spring" as const,
  stiffness: 100,
  damping: 16,
  mass: 0.8,
};

const listVariants = {
  hidden: {},
  show: (delayChildren: number) => ({
    transition: {
      staggerChildren: 0.05,
      delayChildren,
    },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: ITEM_SPRING,
  },
};
```

- `y: 60` — items start 60px below final position, slide up to `0`
- `staggerChildren: 0.05` — 50ms between each child (14 items ≈ **0.7s** total cascade)
- Spring with moderate stiffness + damping — natural deceleration without harsh snapping

### Cleanup

Remove unused `PREMIUM_EASE` import from this file (parent `<motion.aside>` still uses `EASE_OUT_CUBIC`).

## What stays the same

- Parent sidebar reveal (`opacity` + `x: 12`, 350ms ease) — unchanged
- `delayChildren` intro logic — unchanged
- No CSS changes
- Tab switch behavior — unchanged

## Note on animation rules

[`docs/animation-rules.md`](docs/animation-rules.md) says "No spring animations" for the landing transition. This change applies **only to sidebar list items** per your request — no doc update needed unless you want the rules revised globally.

## Verification

1. Run `npm run dev` in `website/`
2. Trigger intro transition
3. Confirm list items glide up from 60px with a soft spring feel, cascading every 50ms
