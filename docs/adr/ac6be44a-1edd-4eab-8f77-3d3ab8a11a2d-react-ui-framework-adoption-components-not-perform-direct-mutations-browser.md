# React UI Framework Adoption: Components Not Perform Direct Mutations Browser

Status: proposed
Date: 2025-05-15
Deciders: Detection Pipeline (automated)

## Context

- Interactive frontend presentation modules require a consistent structure for state tracking, memoization, and rendering lifecycles.
- Multiple components across the application consistently import React and utilize functional hooks to coordinate view rendering.
- Consolidating component definitions around a single declarative library ensures predictable updates across the user interface hierarchy.

## Problem Statement

Building complex interactive user interfaces without a standardized component library leads to fragmented state management, error-prone direct DOM mutations, and inconsistent rendering lifecycles across views.

## Decision

1. MUST_NOT: Components MUST_NOT perform direct mutations on the browser Document Object Model outside of React rendering lifecycles.

## Policy Block

- MUST_NOT Components MUST_NOT perform direct mutations on the browser Document Object Model outside of React rendering lifecycles.

In scope:
- Interactive frontend user interface components requiring local state management, lifecycle synchronization, or memoized rendering.
- Presentation views and dialogue structures rendered within the client web application.

Out of scope:
- Backend services, command-line utilities, and standalone data transformation scripts that execute outside the browser environment.
- Static assets and pure stylesheet definitions requiring no runtime interactivity or reactive state.

## Rationale

- Static analysis confirms consistent adoption of React across multiple user interface components, establishing a unified architectural pattern.
- Functional hooks such as useState, useMemo, and useEffect provide granular state tracking and compute memoization without class hierarchy complexity.
- Declarative rendering decouples view descriptions from low-level DOM mutations, reducing state synchronization defects.

## Consequences

Positive:
- Provides a unified, declarative component model with predictable unidirectional data flow across all views.
- Enables fine-grained state and lifecycle handling via functional hooks without class component overhead.
- Facilitates performance optimization through selective memoization and isolated side-effect execution.

Negative:
- Introduces runtime execution overhead and bundle dependencies tied to the component library runtime.
- Requires strict adherence to hook execution rules and dependency tracking to avoid stale closures or unnecessary re-renders.

## Alternatives

- Native DOM manipulation and imperative script event handling (rejected)
  Rejected because: Lacks structured component abstractions and reactive state synchronization, leading to imperative mutation defects across complex interactive views.
  When valid: Static pages with minimal interactive elements and zero local state requirements.
- Alternative component framework with two-way data binding (rejected)
  Rejected because: Inconsistent with the project existing component ecosystem and hook-based functional architecture.
  When valid: Greenfield applications where two-way binding or alternative reactivity paradigms are formally standardized.

## Risks

- Unintended re-renders or stale closures caused by incorrect dependency arrays in hooks
  Mitigation: Enforce static analysis rules and automated linting checks during continuous integration to validate hook dependencies.
  Owner: Frontend Engineering Team
- Drift between declared dependency ranges and runtime version behavior
  Mitigation: Strictly enforce lock artifact version verification before utilizing library APIs as mandated by the discovery policy.
  Owner: Frontend Engineering Team

## Implementation Notes

- DISCOVERY POLICY (MANDATORY): This ADR omits all tool names, file names, commands, package managers, and version numbers. The consumer MUST derive them from the project repository.

LOCK-VERSION GROUNDING (MANDATORY) — before writing code that uses a versioned library, execute in order:
1. Find the dependency manifest in the repo. It declares ranges, not installed versions.
2. Identify the build tool from the manifest.
3. Inspect the repository lock or resolution artifact to determine the exact resolved version. This artifact is authoritative; build-tool output only verifies the active environment matches it.
4. Look up the official documentation, changelog, or public API reference for that exact version. Do not use training-data recall — fetch or search the public internet for version-specific docs.
5. Confirm every API, class, or function you will call exists in that exact version's documentation before using it.
6. For version-sensitive behavior, re-run steps 3-5 per dependency at point of use.
- Verify that functional hooks adhere to standard execution rules by declaring them only at the top level of component functions.
- Structure state management to keep state local to consuming components, elevating state to common ancestors only when shared across sibling modules.

## Continuation Context


Verify commands:
- Discover and run the project dependency audit and type validation scripts defined in the project configuration.
- Discover and run the project automated test suite and linter routines to verify hook compliance and component rendering integrity.

Accept when:
- All interactive user interface components compile without type errors and pass automated component tests.
- Static analysis passes with zero violations regarding hook rules and dependency arrays.
- The resolved library version matches the authoritative repository lock artifact.

## Enforcement

- Verified by: Automated continuous integration pipelines executing static analysis, type checking, and unit tests.
- Verified by: Peer code reviews requiring verification of hook usage, memoization necessity, and state encapsulation.
- Violation handling: Pull requests failing static analysis, hook lint rules, or automated test suites are blocked from merging.
- Violation handling: Direct DOM manipulation or missing hook dependency violations require code revision before acceptance.
- Exception process: Architectural exceptions must be documented in a project decision record and approved by the frontend engineering lead.
- Exception process: Temporary bypasses require an issue tracking the remediation and must pass manual review before merging.