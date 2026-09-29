# Internal Errors Module Lexical Diagnostic Logging: Lexical Analysis Component Record Syntax Scanning

These rules are ALWAYS ACTIVE for all lexical analysis and token scanning components responsible for source text parsing.

### Rules

- **R-LEX-001** MUST: The lexical analysis component MUST record all syntax and scanning anomalies using the internal errors module diagnostic reporting interface.

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