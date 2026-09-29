# gzlang Core Library Adoption for Language Tooling and Interactive Playground: Components Utilities Not Reimplement Custom Language

Status: proposed
Date: 2025-05-18
Deciders: Detection Pipeline (automated)

## Context

- Interactive web documentation and playground interfaces require accurate parsing and evaluation of domain language constructs.
- Decentralized or duplicate grammar definitions risk semantic drift between documented keyword definitions and actual syntax execution.
- Static analysis detected consistent dependency on gzlang across keyword documentation modules, syntax highlighting utilities, and playground components.

## Problem Statement

Applications presenting domain-specific languages require consistent grammar parsing, keyword definitions, and code execution capabilities across documentation, syntax highlighting utilities, and interactive evaluation playgrounds. Implementing ad-hoc parsers or diverging grammar models introduces inconsistencies and maintenance overhead across client interfaces.

## Decision

1. MUST_NOT: Components and utilities MUST NOT reimplement custom language tokenizers or duplicate language grammar rules independently of gzlang.

## Policy Block

- MUST_NOT Components and utilities MUST NOT reimplement custom language tokenizers or duplicate language grammar rules independently of gzlang.

In scope:
- Language documentation metadata modules
- Syntax highlighting utilities and tokenizers
- Interactive code playground interfaces and execution runners

Out of scope:
- Generic application layout components
- Static asset management and icon rendering modules
- Unrelated third-party UI state and interaction primitives

## Rationale

- Centralizing language parsing and syntax interpretation in the gzlang library ensures uniform language semantics across documentation and interactive interfaces.
- Reusing core language definitions prevents keyword drift and ensures that syntax highlighting mirrors the official language grammar.
- Providing client-side language evaluation via gzlang enables direct playground execution without reliance on external execution services.

## Consequences

Positive:
- Single authoritative source of truth for language keywords, token definitions, and syntax interpretation.
- Consistent semantics and execution behavior between documentation examples and interactive playground environments.
- Simplified maintenance by consuming upstream language updates through a single dependency boundary.

Negative:
- Client application bundles inherit the size and parsing footprint of the gzlang core engine.
- Interactive components become coupled to the release cadences and API stability of the gzlang library.
- Breaking changes in gzlang grammar or exported APIs require synchronized updates across documentation, highlighters, and playgrounds.

## Alternatives

- Custom regular-expression tokenizers and isolated manual keyword definitions (rejected)
  Rejected because: Manual tokenizers diverge from actual language grammar specifications over time and fail to provide interactive evaluation capabilities.
  When valid: When displaying purely static text where language execution and syntax fidelity are not required.
- Remote backend API service for syntax parsing and code execution (rejected)
  Rejected because: Introduces network latency, server operational costs, and offline unavailability for interactive web documentation and playgrounds.
  When valid: When language compilation or execution exceeds client-side runtime resource constraints.

## Risks

- Client bundle size increase resulting from packaging the complete gzlang parser and runtime into client assets.
  Mitigation: Employ dynamic code splitting and lazy loading so gzlang modules load only when entering documentation or playground routes.
  Owner: Frontend Engineering
- Interactive playground execution of complex gzlang scripts causing main UI thread stalls.
  Mitigation: Isolate language execution using dedicated background workers or scheduled execution slices to keep the UI responsive.
  Owner: Web Platform Team

## Implementation Notes

- DISCOVERY POLICY (MANDATORY): This ADR omits all tool names, file names, commands, package managers, and version numbers. The consumer MUST derive them from the project repository.

LOCK-VERSION GROUNDING (MANDATORY) — before writing code that uses a versioned library, execute in order:
1. Find the dependency manifest in the repo. It declares ranges, not installed versions.
2. Identify the build tool from the manifest.
3. Inspect the repository lock or resolution artifact to determine the exact resolved version. This artifact is authoritative; build-tool output only verifies the active environment matches it.
4. Look up the official documentation, changelog, or public API reference for that exact version. Do not use training-data recall — fetch or search the public internet for version-specific docs.
5. Confirm every API, class, or function you will call exists in that exact version's documentation before using it.
6. For version-sensitive behavior, re-run steps 3-5 per dependency at point of use.
- Encapsulate gzlang integration behind dedicated module boundaries to isolate language runtime changes from view layer presentation logic.
- Utilize dynamic code splitting and lazy loading strategies for routes importing gzlang to optimize initial application load performance.

## Continuation Context


Verify commands:
- Discover and run the project static analysis and linting suites to verify compliant dependency imports across language modules.
- Discover and run the project automated test suite to validate that highlighting and playground execution match expected gzlang behavior.
- Discover and run the project production build script to verify bundle chunking and export boundaries for the language dependency.

Accept when:
- All language keyword documentation and syntax highlighters import directly from gzlang without ad-hoc grammar duplication.
- Playground components successfully execute and evaluate code snippets via the resolved gzlang library interfaces.
- All automated test suites, type validation checks, and production build scripts pass without unresolved symbol or dependency errors.

## Enforcement

- Verified by: Automated dependency import checks and static analysis rules enforced during continuous integration pipelines.
- Verified by: Mandatory peer code reviews on all modifications affecting language highlighting, documentation, or playground execution.
- Verified by: Lock artifact consistency verification during build automation.
- Violation handling: Automated build failure on introducing duplicate language parsing utilities or unpinned dependency versions.
- Violation handling: Pull request rejection when changes bypass the gzlang core library for language tokenization or evaluation.
- Exception process: Submit an architectural change request detailing the justification for bypassing gzlang, reviewed and approved by language and platform leads.
- Exception process: Document approved exceptions with a clear migration or deprecation roadmap in repository decision tracking.