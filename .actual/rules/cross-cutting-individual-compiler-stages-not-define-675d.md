# Adopt Keywords Core Module for Cross-Stage Lexical Mapping: Individual Compiler Stages Not Define Local

These rules are ALWAYS ACTIVE for all compiler pipeline stages that inspect, tokenize, validate, or emit language keywords or dialect mappings.

### Rules

- **R-KW-001** MUST_NOT: Individual compiler stages MUST NOT define local, duplicate, or shadow keyword tables or slang-to-target translation mappings.

### Verify

```bash
# Discover and execute the project dependency verification and static analysis suite to check module import boundaries.
# Discover and run the compiler test suite covering lexical analysis, tokenization, and code generation passes.
```

**Accept when:**
- Automated static analysis and pipeline test suites confirm all keyword references and slang translations import exclusively from the shared keywords module.
- No compiler pipeline stage maintains independent or duplicate keyword symbol tables or translation mappings.

<enforcement>
Claude Code MUST NOT skip or defer verification.
</enforcement>