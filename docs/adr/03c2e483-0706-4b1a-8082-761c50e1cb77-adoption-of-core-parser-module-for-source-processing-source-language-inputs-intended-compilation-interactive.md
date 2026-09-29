# Adoption of Core Parser Module for Source Processing: Source Language Inputs Intended Compilation Interactive

Status: proposed
Date: 2025-05-18
Deciders: Detection Pipeline (automated)

## Context

- The system requires consistent language syntax ingestion and parsing across both compilation and interactive execution components.
- Multiple operational modules must process raw source input into structured intermediate representations before generation or evaluation.

## Problem Statement

Inconsistent source parsing across compilation targets and interactive runtime environments causes divergence in syntax validation and grammar processing.

## Decision

1. MUST: All source language inputs intended for compilation or interactive execution MUST be validated and processed through the shared internal parser module.

## Policy Block

- MUST All source language inputs intended for compilation or interactive execution MUST be validated and processed through the shared internal parser module.

In scope:
- Modules that ingest raw language source strings for compilation, transformation, or evaluation.

Out of scope:
- Lower-level code generation utilities receiving pre-parsed abstract syntax trees.
- Runtime evaluation environments executing pre-compiled target artifacts.

## Rationale

- Centralizing input parsing in an internal parser module ensures identical syntax validation rules across batch and interactive environments.
- Decoupling parsing from code generation and runtime evaluation isolates syntax analysis from target emission.

## Consequences

Positive:
- Guarantees uniform syntax validation and parsing semantics across all entry points.
- Decouples input validation and AST generation from runtime code evaluation.

Negative:
- Direct coupling of runtime execution and compilation pipelines to the internal parser contract.
- Changes to AST structures require synchronized updates across compiler and interactive runtime components.

## Alternatives

- Ad-hoc token parsing or direct evaluation within execution contexts (rejected)
  Rejected because: Bypasses structured parsing validation and duplicates AST construction logic across boundaries.
  When valid: Simple single-expression runtime evaluations with minimal syntax overhead.
- Independent third-party parser integration without a shared internal facade (rejected)
  Rejected because: Tightly couples disparate compiler sub-systems directly to external parser grammar implementations.
  When valid: When standardizing entirely on an off-the-shelf universal grammar without custom dialect support.

## Risks

- Parser grammar changes can introduce breaking contract modifications in downstream compiler stages.
  Mitigation: Expose stable AST definitions and wrap parser invocations in standardized error-handling routines.
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
- Consume the shared parse API to transform source strings into intermediate representations before delegating to downstream evaluation contexts.
- Structure parsing invocations to handle syntax errors synchronously or with explicit error mapping before initiating runtime pipelines.

## Continuation Context


Verify commands:
- Discover and run the project's static analysis suite to verify parser module usage across entry points.
- Discover and execute unit tests asserting that invalid source inputs are rejected at the parsing boundary.

Accept when:
- All consumer components invoke the shared parser module exclusively for AST generation before code generation or evaluation.
- Verification routines validate that syntax and parsing errors are intercepted before downstream execution.

## Enforcement

- Verified by: Static analysis checks verifying source compilation pipelines route input through the core parser.
- Verified by: Automated test suites asserting parsing failure handling prior to runtime execution.
- Violation handling: Build verification failures for modules that directly evaluate unparsed source or bypass parser validation.
- Exception process: Submit an architectural review request demonstrating why source parsing cannot be delegated to the shared parser module.