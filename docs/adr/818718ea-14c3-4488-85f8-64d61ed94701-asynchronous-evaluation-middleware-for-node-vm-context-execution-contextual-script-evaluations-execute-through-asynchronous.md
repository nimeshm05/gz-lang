# Asynchronous Evaluation Middleware for node:vm Context Execution: Contextual Script Evaluations Execute Through Asynchronous

Status: proposed
Date: 2025-05-14
Deciders: Detection Pipeline (automated)

## Context

- Interactive evaluation environments require execution of dynamic code snippets within isolated runtime contexts to prevent global scope contamination.
- Evaluation routines using vm.runInContext execute promises that must bridge into asynchronous callback-driven lifecycle handlers.
- Input validation through parser parsing ensures that malformed syntax is intercepted prior to context execution.

## Problem Statement

Asynchronous execution within contextualized environments can leak uncaught promise rejections or unhandled runtime exceptions across subsystem boundaries if evaluation and callback translation are uncoordinated.

## Decision

1. MUST: All contextual script evaluations MUST execute through an asynchronous middleware wrapper that encapsulates vm.runInContext invocations and standardizes error mapping.

## Policy Block

- MUST All contextual script evaluations MUST execute through an asynchronous middleware wrapper that encapsulates vm.runInContext invocations and standardizes error mapping.

In scope:
- Runtime evaluation boundaries executing dynamically parsed expressions within contextualized virtual machine environments.

Out of scope:
- Static source transformations and build-time compilation workflows operating outside the interactive execution boundary.

## Rationale

- Encapsulating vm.runInContext inside an asynchronous boundary function unifies error handling across synchronous throws and asynchronous promise rejections.
- Pre-validating expressions through the parser module prevents malformed syntax from entering the runtime context.
- Direct callback dispatch ensures seamless integration between promise-yielding virtual machine executions and callback-oriented host interfaces.

## Consequences

Positive:
- Isolates context execution errors and unhandled promise rejections at the evaluation boundary.
- Provides deterministic error transformation for both synchronous parse or execution failures and asynchronous promise rejections.
- Prevents global scope mutation by enforcing execution within dedicated virtual machine contexts.

Negative:
- Introduces boilerplate translation overhead between promise returns and callback notifications.
- Limits evaluation ergonomics by forcing execution through a predefined context middleware signature.

## Alternatives

- Direct synchronous evaluation via global execution primitives (rejected)
  Rejected because: Bypasses context isolation, allowing untrusted expressions to pollute process-level global state.
  When valid: Valid only in standalone scripts without multi-tenant state or isolation requirements.
- Native async/await evaluation without callback adapter middleware (rejected)
  Rejected because: Incompatible with host interfaces that require traditional error-first callback completion signatures.
  When valid: Valid when the entire evaluation host natively supports modern asynchronous resolution semantics.

## Risks

- Uncaught exceptions within asynchronous promises could trigger unhandled rejection events if callback error translation fails.
  Mitigation: Enforce dual error handling across synchronous try-catch blocks and promise rejection callbacks with normalized error conversions.
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
- Ensure the context object passed to vm.runInContext is properly initialized with required runtime primitives and context options.
- Map unknown thrown entities to concrete error types before forwarding to callback listeners.

## Continuation Context


Verify commands:
- Discover the project test runner configuration from the repository manifest and execute the test suite covering evaluation boundaries.
- Inspect the project scripts to identify and run the static type checking and linting suites across runtime modules.

Accept when:
- All test suites verifying asynchronous evaluation and error trapping in contextual execution pass with zero errors.
- Type validation confirms correct signatures for context middleware functions and error-first callbacks.

## Enforcement

- Verified by: Continuous integration test pipeline executing test suites on pull requests.
- Verified by: Peer code review verifying adherence to evaluation boundary patterns.
- Violation handling: Pull requests bypassing the asynchronous context middleware or omitting input validation will be blocked until remediated.
- Exception process: Exceptions require documented architectural review and sign-off by runtime platform maintainers.