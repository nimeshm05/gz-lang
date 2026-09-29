# Adopt Keywords Core Module for Cross-Stage Lexical Mapping: Compiler Pipeline Components Consume Keyword Definitions

These rules are ALWAYS ACTIVE for all compiler pipeline stages that inspect, tokenize, validate, or emit language keywords or dialect mappings.

### Rules

- **R-KEY-001** MUST: Compiler pipeline components MUST consume keyword definitions, reserved identifiers, and dialect translation mappings exclusively from the centralized keywords core module.

### Verify

```bash
# Discover and execute the project dependency verification and static analysis suite to check module import boundaries.
# Discover and run the compiler test suite covering lexical analysis, tokenization, and code generation passes.
```

**Accept when:**
- Automated static analysis and pipeline test suites confirm all keyword references and slang translations import exclusively from the shared keywords module.
- No compiler pipeline stage maintains independent or duplicate keyword symbol tables or translation mappings.

<enforcement>
Claude Code MUST NOT skip or defer verification. Verified by automated static dependency analysis, linter import boundaries, and peer review.
</enforcement>