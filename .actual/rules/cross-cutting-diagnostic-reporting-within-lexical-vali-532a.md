# Adopt Keywords Core Module for Cross-Stage Lexical Mapping: Diagnostic Reporting Within Lexical Validation Stages

These rules are ALWAYS ACTIVE for all compiler pipeline stages that inspect, tokenize, validate, or emit language keywords or dialect mappings.

### Rules

- **R-KW-001** SHOULD: Diagnostic reporting within lexical validation stages SHOULD reference the keywords core module translation mappings when suggesting language corrections.

### Verify

```bash
# Discover and execute the project dependency verification and static analysis suite to check module import boundaries.
# Discover and run the compiler test suite covering lexical analysis, tokenization, and code generation passes.
```

**Accept when:**
- Automated static analysis and pipeline test suites confirm all keyword references and slang translations import exclusively from the shared keywords module.
- No compiler pipeline stage maintains independent or duplicate keyword symbol tables or translation mappings.

<enforcement>
Claude Code MUST NOT skip or defer verification. Verified by automated static dependency analysis, linter import boundaries, and peer review. Violation handling requires refactoring to import from the centralized core module prior to merge.
</enforcement>