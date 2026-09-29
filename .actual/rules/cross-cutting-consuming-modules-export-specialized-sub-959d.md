# Adopt Keywords Core Module for Cross-Stage Lexical Mapping: Consuming Modules Export Specialized Subsets Keyword

These rules are ALWAYS ACTIVE for all compiler pipeline stages that inspect, tokenize, validate, or emit language keywords or dialect mappings.

### Rules

- **R-KW-001** MAY: Consuming modules MAY re-export specialized subsets of keyword contracts when exposing phase-specific syntactic interfaces.
- **R-KW-002** MANDATORY: Export immutable keyword dictionaries and dialect mappings from the core module to prevent runtime mutation by consuming stages.
- **R-KW-003** MANDATORY: Co-locate error diagnostic identifiers and slang translation maps within the core module to preserve uniform user-facing diagnostic messages.
- **R-KW-004** MANDATORY: Enforce comprehensive test suites verifying both token recognition and code generation on all keyword schema updates.

### Verify

```bash
# Discover and execute the project dependency verification and static analysis suite to check module import boundaries.
# Discover and run the compiler test suite covering lexical analysis, tokenization, and code generation passes.
# (Note: Specific tool names, commands, and package managers must be derived from the project repository per discovery policy).
```

**Accept when:**
- Automated static analysis and pipeline test suites confirm all keyword references and slang translations import exclusively from the shared keywords module.
- No compiler pipeline stage maintains independent or duplicate keyword symbol tables or translation mappings.

<enforcement>
Claude Code MUST NOT skip or defer verification. Static analysis and peer review enforce that unapproved keyword definitions or duplicate translation maps cause pipeline failure, and violations must be refactored to import from the centralized core module prior to merge.
</enforcement>