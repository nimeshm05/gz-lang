# Internal Errors Module Lexical Diagnostic Logging: Lexical Scanning Routines Not Silently Swallow

These rules are ALWAYS ACTIVE for all files matching the configured scope (Lexical analysis and token scanning components responsible for source text parsing; Diagnostic reporting routines capturing syntax errors and unexpected characters).

### Rules

- **R-LEX-001** MUST_NOT: Lexical scanning routines MUST NOT silently swallow syntax violations or character anomalies without recording a diagnostic event.

### Verify

```bash
# Discover and run the project test runner to execute lexical analysis test suites.
# Discover and execute the repository static analysis and linting scripts to verify diagnostic logging compliance.
```

**Accept when:**
- All tokenizer diagnostic logging tests execute successfully with expected coordinate metadata.
- Static analysis checks pass without unhandled error or missing coordinate violations.

<enforcement>
Claude Code MUST NOT skip or defer verification. Verified by automated continuous integration test suites covering lexical analysis and peer code review.
</enforcement>