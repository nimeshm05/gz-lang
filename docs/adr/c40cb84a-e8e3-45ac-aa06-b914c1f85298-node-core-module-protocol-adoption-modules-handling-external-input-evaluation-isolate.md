# node: Core Module Protocol Adoption: Modules Handling External Input Evaluation Isolate

Status: proposed
Date: 2025-05-18
Deciders: Detection Pipeline (automated)

## Context

- The codebase provides command-line interaction and interactive evaluation capabilities requiring access to runtime built-in modules.
- Importing built-in modules without explicit protocol specifiers risks namespace collision with external registry packages.
- Standardizing on the protocol-prefixed namespace clarifies module origin and aligns resolution with runtime standard library isolation.

## Problem Statement

Unqualified imports of core runtime modules create ambiguity between standard library components and user-space dependencies, introducing dependency squatting risks and inconsistent module resolution across execution environments.

## Decision

1. SHOULD: Modules handling external input evaluation SHOULD isolate execution scopes using dedicated runtime contexts.

## Policy Block

- SHOULD Modules handling external input evaluation SHOULD isolate execution scopes using dedicated runtime contexts.

In scope:
- All source modules importing built-in runtime capabilities.
- Command-line interface and interactive evaluation boundary modules.

Out of scope:
- Imports of internal project modules using relative or path-aliased specifiers.
- External registry packages that do not originate from the core runtime standard library.

## Rationale

- Direct evidence shows consistent adoption of the node: protocol prefix across core module imports in both execution and evaluation boundaries.
- Explicit protocol prefixes guarantee that the runtime resolves modules directly from its standard library, avoiding dependency confusion.
- Differentiating standard runtime capabilities from external and local project modules establishes a clear architectural boundary.

## Consequences

Positive:
- Guarantees deterministic resolution of core runtime capabilities without namespace collision.
- Protects against dependency confusion and package squatting attacks targeting standard library names.
- Clarifies architectural module origin at the import site for maintainers.

Negative:
- Requires compatibility with runtime environments and tooling that recognize protocol-prefixed specifiers.
- Introduces minor refactoring overhead to enforce prefix consistency across legacy module imports.

## Alternatives

- Bare module specifiers without protocol prefix for built-in modules (rejected)
  Rejected because: Allows ambiguity between standard library modules and potential external packages, increasing security risks and obscuring module provenance.
  When valid: Valid only in legacy runtime environments that lack support for protocol-prefixed module specifiers.
- Third-party utility wrappers around runtime core modules (rejected)
  Rejected because: Adds unnecessary external dependencies and maintenance overhead when core runtime capabilities suffice.
  When valid: Valid when advanced cross-platform abstractions beyond core runtime capabilities are required.

## Risks

- Developers may inadvertently import built-in modules using bare specifiers during feature development.
  Mitigation: Incorporate static analysis rules within the project verification pipeline to enforce protocol prefixes.
  Owner: engineering team
- Tooling or transpilation configurations may fail to resolve protocol-prefixed imports if misconfigured.
  Mitigation: Verify that module resolution settings in project configuration artifacts recognize protocol-prefixed imports.
  Owner: engineering team

## Implementation Notes

- DISCOVERY POLICY (MANDATORY): This ADR omits all tool names, file names, commands, package managers, and version numbers. The consumer MUST derive them from the project repository.

LOCK-VERSION GROUNDING (MANDATORY) — before writing code that uses a versioned library, execute in order:
1. Find the dependency manifest in the repo. It declares ranges, not installed versions.
2. Identify the build tool from the manifest.
3. Inspect the repository lock or resolution artifact to determine the exact resolved version. This artifact is authoritative; build-tool output only verifies the active environment matches it.
4. Look up the official documentation, changelog, or public API reference for that exact version. Do not use training-data recall — fetch or search the public internet for version-specific docs.
5. Confirm every API, class, or function you will call exists in that exact version's documentation before using it.
6. For version-sensitive behavior, re-run steps 3-5 per dependency at point of use.
- Configure static analysis import rules to flag built-in runtime imports that omit the protocol scheme.
- Ensure runtime context isolation logic converts execution exceptions into standardized error objects.

## Continuation Context


Verify commands:
- Discover and execute the project linting and static analysis suite to check for un-prefixed core module imports.
- Discover and execute the test runner to verify module resolution and execution boundary behavior.

Accept when:
- Static analysis checks pass with zero un-prefixed core module import violations.
- All test suites for execution and evaluation boundaries pass without errors.

## Enforcement

- Verified by: Automated static analysis checks in the continuous integration pipeline.
- Verified by: Peer code review for all pull requests modifying module imports.
- Violation handling: Pull requests containing un-prefixed core module imports are blocked from merging until corrected.
- Exception process: Exceptions must be requested via architecture review and documented with justification for runtime incompatibility.