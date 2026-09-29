# Internal Errors Module Lexical Diagnostic Logging: Diagnostic Error Logging Calls Supply Exact

Status: proposed
Date: 2025-05-18
Deciders: Detection Pipeline (automated)

## Context

- Lexical analysis requires structured diagnostic reporting to capture syntax anomalies, unterminated literals, and unrecognized tokens during source code parsing.
- Emitting error diagnostics directly with line and column coordinate metadata ensures that downstream diagnostic consumers receive precise source location context.
- Integration with internal error and token definitions centralizes parsing diagnostic messages across tokenizer operations.

## Problem Statement

Lexical analysis components require a consistent mechanism to log and report scanning anomalies, such as unterminated string literals or invalid keywords, while preserving exact line and column coordinates without fragmenting error dispatch across disparate reporting mechanisms.

## Decision

1. MUST: Diagnostic error logging calls MUST supply exact source line and column coordinates alongside diagnostic error messages.

## Policy Block

- MUST Diagnostic error logging calls MUST supply exact source line and column coordinates alongside diagnostic error messages.

In scope:
- Lexical analysis and token scanning components responsible for source text parsing.
- Diagnostic reporting routines capturing syntax errors and unexpected characters.

Out of scope:
- Runtime execution logging and operational server monitoring outside compiler frontend phases.
- Downstream abstract syntax tree generation and semantic analysis phases.

## Rationale

- Binding diagnostic error reporting directly to the tokenizer internal error mechanism ensures immediate reporting at the point of lexical discovery.
- Passing explicit line and column coordinates guarantees deterministic error attribution for developer-facing diagnostic tools.
- Relying on dedicated internal error definitions standardizes error formatting and taxonomy across token scanning operations.

## Consequences

Positive:
- Provides granular, coordinate-accurate diagnostics for syntax errors encountered during lexical analysis.
- Maintains unified diagnostic emission through internal error reporting abstractions.
- Facilitates clear developer remediation by surfacing structured syntax messages.

Negative:
- Couples token scanning logic to the synchronous invocation of error logging routines.
- Increases memory and call overhead when processing heavily malformed input streams containing numerous errors.

## Alternatives

- Generic console logging for lexical syntax errors (rejected)
  Rejected because: Unstructured console output lacks source coordinate fidelity and decouples diagnostics from internal compiler error handling pipelines.
  When valid: Ad-hoc debugging during initial prototyping when internal diagnostic modules are unavailable.
- Silent error suppression with sentinel token emission (rejected)
  Rejected because: Suppression conceals syntax errors from parsing consumers and degrades developer feedback.
  When valid: Fault-tolerant language server preview modes where partial parse trees must be generated without interruption.

## Risks

- High error volume in malformed files may flood diagnostic logs.
  Mitigation: Implement error threshold throttling or recovery routines to truncate diagnostic logging after a configured failure limit.
  Owner: engineering team
- Inaccurate coordinate offsets if line or column tracking becomes desynchronized during multiline token processing.
  Mitigation: Enforce automated test validation verifying coordinate calculation against multiline string and comment fixtures.
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
- Ensure that diagnostic error emission methods capture both line and column metrics immediately prior to advancing scanner cursors.
- Consolidate error formatting logic within the internal errors module to keep tokenizer logic focused on character streaming and keyword matching.

## Continuation Context


Verify commands:
- Discover and run the project test runner to execute lexical analysis test suites.
- Discover and execute the repository static analysis and linting scripts to verify diagnostic logging compliance.

Accept when:
- All tokenizer diagnostic logging tests execute successfully with expected coordinate metadata.
- Static analysis checks pass without unhandled error or missing coordinate violations.

## Enforcement

- Verified by: Automated continuous integration test suites covering lexical analysis.
- Verified by: Peer code review during changes to parsing and error reporting components.
- Violation handling: Pull requests omitting coordinate metadata or bypassing internal error reporting will fail review and build verification.
- Exception process: Architectural review and documentation sign-off for performance-critical parsing pathways that require custom error buffering.