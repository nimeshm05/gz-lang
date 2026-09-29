# Internal Errors Module Lexical Diagnostic Logging: Diagnostic Error Logging Calls Supply Exact

These rules are ALWAYS ACTIVE for lexical analysis and token scanning components responsible for source text parsing and diagnostic reporting routines capturing syntax errors.

### Rules

- **R-LEGAL-001** MUST: Diagnostic error logging calls MUST supply exact source line and column coordinates alongside diagnostic error messages.

### Verify

```bash
# Discover and run the project test runner to execute lexical analysis test suites.
# Discover and execute the repository static analysis and linting scripts to verify diagnostic logging compliance.
```

**Accept when:**
- All tokenizer diagnostic logging tests execute successfully with expected coordinate metadata.
- Static analysis checks pass without unhandled error or missing coordinate violations.

<enforcement>
Claude Code MUST NOT skip or defer verification.
</enforcement>