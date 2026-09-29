# Internal Errors Module Lexical Diagnostic Logging: Lexical Error Reporting Format Diagnostic Messages

These rules are ALWAYS ACTIVE for all files matching lexical analysis and token scanning components responsible for source text parsing.

### Rules

- **R-LEX-001** SHOULD: Lexical error reporting SHOULD format diagnostic error messages with domain-specific remediation guidance when invalid keywords are encountered.

### Verify

```bash
# Discover and run the project test runner to execute lexical analysis test suites.
# Discover and execute the repository static analysis and linting scripts to verify diagnostic logging compliance.
```

**Accept when:**
- All tokenizer diagnostic logging tests execute successfully with expected coordinate metadata.
- Static analysis checks pass without unhandled error or missing coordinate violations.

<enforcement>
Claude Code MUST NOT skip or defer verification. Verified by automated continuous integration test suites covering lexical analysis and peer code review during changes to parsing and error reporting components. Violation handling: Pull requests omitting coordinate metadata or bypassing internal error reporting will fail review and build verification.
</enforcement>