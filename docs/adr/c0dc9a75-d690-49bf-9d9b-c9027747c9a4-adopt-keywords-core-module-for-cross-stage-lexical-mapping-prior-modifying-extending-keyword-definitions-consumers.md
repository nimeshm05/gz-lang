# Adopt Keywords Core Module for Cross-Stage Lexical Mapping: Prior Modifying Extending Keyword Definitions Consumers

Status: proposed
Date: 2025-05-18
Deciders: Detection Pipeline (automated)

## Context

- Compiler pipeline architectures require consistent token dictionaries across lexical scanning, parsing, and code generation stages.
- Multiple compiler phases share common language definitions, keywords, and slang-to-target translation mappings.
- Decentralized or duplicate keyword definitions risk drift between input validation diagnostics and emitted code artifacts.

## Problem Statement

When compiler stages independently maintain keyword lists and translation dictionaries, syntax evolution leads to synchronization failures where tokenizers accept constructs that code generators cannot emit, or diagnostics emit inaccurate vocabulary suggestions.

## Decision

1. MUST: Prior to modifying or extending keyword definitions, consumers MUST discover the project repository lock file to ensure module dependency constraints and runtime contracts are satisfied.

## Policy Block

- MUST Prior to modifying or extending keyword definitions, consumers MUST discover the project repository lock file to ensure module dependency constraints and runtime contracts are satisfied.

In scope:
- All compiler pipeline stages that inspect, tokenize, validate, or emit language keywords or dialect mappings.

Out of scope:
- Runtime components and external utilities that do not participate in lexical translation or code generation.

## Rationale

- Cross-referencing token definitions in a unified core module guarantees that tokenizer validation and code emission operate on identical keyword schemas.
- Sharing dialect translation tables ensures consistent error messages and deterministic code generation.
- Evidence demonstrates that both lexical analysis and code emission stages depend on the identical core keywords module.

## Consequences

Positive:
- Eliminates discrepancies between recognized lexical tokens and emitted target code.
- Centralizes slang and dialect vocabulary mappings into a single authoritative source.
- Simplifies adding or modifying language syntax by localizing changes to one core module.

Negative:
- Couples lexical analysis and code emission stages to a common internal core module contract.
- Modifications to keyword schemas or slang mappings require regression verification across all consuming pipeline stages.

## Alternatives

- Decentralized keyword declarations within individual compiler stages (rejected)
  Rejected because: Introduces divergence and synchronization overhead between lexical validation and code emission dictionaries.
  When valid: Valid only in prototype compilers with a single monolithic translation pass.
- External schema or metadata file generated at build time (rejected)
  Rejected because: Adds extraneous build pipeline complexity when language vocabulary can be directly exported as an internal core module.
  When valid: Valid when keyword specifications must be shared across heterogeneous language runtimes.

## Risks

- Breaking changes in the keywords module contract could simultaneously break lexical analysis and code generation.
  Mitigation: Enforce comprehensive test suites verifying both token recognition and code generation on all keyword schema updates.
  Owner: engineering team
- Keyword module bloat as additional language features and metadata accumulate over time.
  Mitigation: Structure the module into granular exports allowing consumers to import only necessary dictionary subsets without circular references.
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
- Export immutable keyword dictionaries and dialect mappings from the core module to prevent runtime mutation by consuming stages.
- Co-locate error diagnostic identifiers and slang translation maps within the core module to preserve uniform user-facing diagnostic messages.

## Continuation Context


Verify commands:
- Discover and execute the project dependency verification and static analysis suite to check module import boundaries.
- Discover and run the compiler test suite covering lexical analysis, tokenization, and code generation passes.

Accept when:
- Automated static analysis and pipeline test suites confirm all keyword references and slang translations import exclusively from the shared keywords module.
- No compiler pipeline stage maintains independent or duplicate keyword symbol tables or translation mappings.

## Enforcement

- Verified by: Automated static dependency analysis and linter import boundaries in continuous integration.
- Verified by: Peer review during code changes affecting compiler lexical analysis or emission stages.
- Violation handling: Static analysis failure on pull requests containing unapproved keyword definitions or duplicate translation maps.
- Violation handling: Flagged violations must be refactored to import from the centralized core module prior to merge.
- Exception process: Submit an architectural exception request detailing why a specialized compiler stage requires an isolated keyword vocabulary.
- Exception process: Obtain approval from compiler architecture maintainers before introducing independent token tables.