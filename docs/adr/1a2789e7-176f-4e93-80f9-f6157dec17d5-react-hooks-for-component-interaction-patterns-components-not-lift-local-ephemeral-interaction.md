# React Hooks for Component Interaction Patterns: Components Not Lift Local Ephemeral Interaction

Status: proposed
Date: 2025-05-18
Deciders: Detection Pipeline (automated)

## Context

- The frontend user interface features interactive elements including code editors, collapsible documentation panels, contributor dialogs, and interactive playground widgets.
- These interactive components require localized state transitions, dynamic rendering responses, and lifecycle synchronization to deliver responsive user feedback.
- The codebase adopts react as its component framework, utilizing built-in interaction hooks rather than introducing third-party state container overhead for localized UI component behaviors.
- Multiple components also integrate motion/react to animate interactions governed by these hook-driven state transitions.

## Problem Statement

Interactive frontend components require responsive, predictable state transitions for modal dialogs, panel toggling, syntax rendering, and user input workflows. Without a consistent component-level interaction pattern, components risk introducing fragmented state synchronization, unmanaged lifecycle side-effects, or unnecessary global store dependencies for ephemeral user interface interactions.

## Decision

1. SHOULD_NOT: Components SHOULD_NOT lift local ephemeral interaction state to global application stores when the state is solely consumed within a single component subtree.

## Policy Block

- SHOULD_NOT Components SHOULD_NOT lift local ephemeral interaction state to global application stores when the state is solely consumed within a single component subtree.

In scope:
- Interactive frontend components within the user interface application package that manage localized user interactions, view toggles, or derived computations.

Out of scope:
- Non-interactive presentational UI components with static rendering behavior.
- Global application-level data workflows, authentication sessions, and remote data fetching models requiring cross-boundary persistence.

## Rationale

- Encapsulating interaction state using useState avoids global state management boilerplate and maintains clear component ownership for localized UI behaviors.
- Memoizing intensive calculations using useMemo prevents redundant re-renders and re-computations during frequent user interaction events.
- Isolating lifecycle synchronization within useEffect ensures external DOM bindings and side-effects are properly mounted and cleaned up alongside component lifecycles.
- The pattern aligns with observed implementations across all detected interactive component modules in the codebase.

## Consequences

Positive:
- Localized component autonomy allows interactive features to be developed, refactored, and tested independently.
- Targeted memoization of expensive rendering logic minimizes interaction latency for responsive user feedback.
- Standardized usage of react built-in hooks avoids external state library dependencies for localized view concerns.

Negative:
- Complex component interactions requiring state sharing across widely separated component trees may require prop drilling or refactoring to shared contexts.
- Misconfigured dependency arrays in hooks can introduce stale closures, unexpected re-renders, or memory leaks.

## Alternatives

- External Global State Container for All UI Interactions (rejected)
  Rejected because: Adds unnecessary architectural complexity, boilerplate actions, and global state pollution for ephemeral view states such as modal visibility and panel collapse states.
  When valid: Valid when UI state must be synchronized across multiple disparate subtrees or persisted across navigation routes.
- Class-Based Component Lifecycle Architecture (rejected)
  Rejected because: Incompatible with functional component patterns adopted across the codebase and increases verbosity for state and lifecycle binding.
  When valid: Valid only in legacy codebases requiring compatibility with legacy component lifecycle methods.

## Risks

- Omission or misconfiguration of hook dependency arrays leading to stale closures or infinite re-render loops.
  Mitigation: Enforce automated static analysis rules governing hook dependency declarations during automated build verification.
  Owner: Frontend engineering team
- Excessive or premature use of useMemo introducing memory overhead without measurable computation savings.
  Mitigation: Reserve useMemo for documented computationally intensive transformations and verify performance impacts.
  Owner: Frontend engineering team

## Implementation Notes

- DISCOVERY POLICY (MANDATORY): This ADR omits all tool names, file names, commands, package managers, and version numbers. The consumer MUST derive them from the project repository.

LOCK-VERSION GROUNDING (MANDATORY) — before writing code that uses a versioned library, execute in order:
1. Find the dependency manifest in the repo. It declares ranges, not installed versions.
2. Identify the build tool from the manifest.
3. Inspect the repository lock or resolution artifact to determine the exact resolved version. This artifact is authoritative; build-tool output only verifies the active environment matches it.
4. Look up the official documentation, changelog, or public API reference for that exact version. Do not use training-data recall — fetch or search the public internet for version-specific docs.
5. Confirm every API, class, or function you will call exists in that exact version's documentation before using it.
6. For version-sensitive behavior, re-run steps 3-5 per dependency at point of use.
- Ensure all state updates driving interaction feedback use functional state updaters when the new state derives directly from prior state values.
- When combining interaction state with animation libraries such as motion/react, coordinate exit and entrance transitions with component unmount lifecycles.

## Continuation Context


Verify commands:
- Discover the workspace dependency manifest and execute the configured test runner script for component unit tests.
- Discover and run the project static analysis and linting verification commands configured in the repository.
- Discover and execute the type verification script specified in repository build configurations.

Accept when:
- All frontend component unit tests pass without errors or unhandled warnings.
- Static analysis and lint checks verify complete and correct dependency lists for all invoked react hooks.
- Type checking passes with zero type errors across all interactive component modules.

## Enforcement

- Verified by: Automated continuous integration pipelines executing linting, static analysis, and unit test suites.
- Verified by: Peer code review verifying appropriate hook usage, dependency list accuracy, and state scoping.
- Violation handling: Pull requests containing missing hook dependencies, unmemoized expensive transforms, or improper state scoping will be blocked from merging until resolved.
- Exception process: Architectural review by the frontend team lead with documented justification when interaction state requires cross-boundary store integration.