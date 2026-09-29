# node:path Module Adoption: Modules Resolving Package Metadata Execution Scripts

Status: proposed
Date: 2025-05-14
Deciders: Detection Pipeline (automated)

## Context

- Runtime entrypoints require consistent filesystem path resolution to locate package metadata, configuration, and source files.
- Execution boundaries in CLI and REPL modules coordinate file system operations that must behave deterministically across different host operating systems.
- Core module imports utilize protocol-scoped identifiers to distinguish standard runtime libraries from external package dependencies.

## Problem Statement

Entrypoint modules and command-line interfaces require robust, platform-independent filesystem path manipulation and package resolution without introducing unneeded third-party dependencies or risking namespace collisions.

## Decision

1. SHOULD: Modules resolving package metadata or execution scripts SHOULD isolate path resolution logic at boundary interfaces to decouple file system resolution from core execution logic.

## Policy Block

- SHOULD Modules resolving package metadata or execution scripts SHOULD isolate path resolution logic at boundary interfaces to decouple file system resolution from core execution logic.

In scope:
- Execution entrypoints and command-line interfaces resolving file and directory paths.
- Modules parsing, formatting, or normalizing filesystem paths and package locations.

Out of scope:
- In-memory data structures and purely computational routines with no filesystem interaction.
- Network URL parsing and remote protocol URI resolution.

## Rationale

- The node:path module provides standardized path operations across disparate host operating systems without external package overhead.
- Explicit protocol-scoped specifiers prevent accidental resolution against third-party packages with matching names.
- Centralizing path handling through runtime core utilities ensures consistent resolution behavior across entrypoint boundaries.

## Consequences

Positive:
- Eliminates external third-party dependencies for path manipulation and directory navigation.
- Ensures consistent cross-platform path normalization and separator handling across CLI and REPL modules.
- Prevents specifier collision by explicitly designating the core module protocol namespace.

Negative:
- Couples path manipulation code directly to the runtime built-in module interface.
- Requires strict enforcement of protocol import specifiers across all codebase contributors.

## Alternatives

- Manual string concatenation for filesystem paths (rejected)
  Rejected because: Fails to account for platform-specific path separators and segment normalization, introducing cross-platform defects.
  When valid: Valid only when formatting non-filesystem strings that do not represent file system hierarchies.
- Third-party filesystem path manipulation library (rejected)
  Rejected because: Introduces external package dependencies for capabilities that are natively provided by the core runtime.
  When valid: Valid when advanced cross-engine abstractions beyond runtime core capabilities are required.

## Risks

- Inconsistent path separator handling across differing operating system environments.
  Mitigation: Use standard path resolution and normalization functions rather than platform-specific string operations.
  Owner: engineering team
- Inadvertent omission of protocol-scoped prefixes in newly introduced modules.
  Mitigation: Enforce automated static analysis checks in continuous integration to catch unadorned specifiers.
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
- Use delimiter-agnostic path join and resolve functions instead of manual string concatenation for all file resolution tasks.
- Verify path normalization when receiving user-supplied input paths prior to invoking downstream filesystem operations.

## Continuation Context


Verify commands:
- Discover and execute the project's static analysis suite to verify that path resolution imports conform to the protocol-scoped identifier standard.
- Discover and execute the project's automated test suite to validate cross-platform path resolution behavior across entrypoint modules.

Accept when:
- All filesystem path operations across execution entrypoints utilize the protocol-scoped module without syntax or lint errors.
- Automated test suites pass across all supported environments with zero cross-platform path resolution regressions.

## Enforcement

- Verified by: Continuous integration static analysis rules checking import specifier compliance.
- Verified by: Automated unit and integration test runs across multiple operating system environments.
- Verified by: Code review checklists for module entrypoints and filesystem interactions.
- Violation handling: Automated build pipeline rejects pull requests containing unadorned or non-standard path import specifiers.
- Violation handling: Pull requests with manual path delimiter manipulation are flagged for remediation.
- Exception process: Exceptions require an architecture review request demonstrating why standard core module path resolution is inadequate.
- Exception process: Deviations must be approved by the engineering architecture review team before integration.