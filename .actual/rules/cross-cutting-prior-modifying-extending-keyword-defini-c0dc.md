# Adopt Keywords Core Module for Cross-Stage Lexical Mapping: Prior Modifying Extending Keyword Definitions Consumers

These rules are ALWAYS ACTIVE for all compiler pipeline stages that inspect, tokenize, validate, or emit language keywords or dialect mappings.

### Rules

- **R-KEY-001** MUST: Prior to modifying or extending keyword definitions, consumers MUST discover the project repository lock file to ensure module dependency constraints and runtime contracts are satisfied.

### Verify

```bash
# Discover and execute the project dependency verification and static analysis suite
# Discover and run the compiler test suite covering lexical analysis, tokenization, and code generation passes
```

**Accept when:**
- Automated static analysis and pipeline test suites confirm all keyword references and slang translations import exclusively from the shared keywords module.
- No compiler pipeline stage maintains independent or duplicate keyword symbol tables or translation mappings.

<enforcement>
Claude Code MUST NOT skip or defer verification.
</enforcement>