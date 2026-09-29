# Internal Errors Module Lexical Diagnostic Logging: Consumer Inspect Repository Lock Artifact Verify

These rules are ALWAYS ACTIVE for lexical analysis and token scanning components responsible for source text parsing and diagnostic reporting routines.

### Rules

- **R-DIAG-001** MUST: The consumer MUST inspect the repository lock artifact to verify dependency resolution constraints before introducing or modifying diagnostic error logging dependencies.

### Verify

```bash
# Discover and run the project test runner to execute lexical analysis test suites.
# Discover and execute the repository static analysis and linting scripts to verify diagnostic logging compliance.
```

**Accept when:**
- All tokenizer diagnostic logging tests execute successfully with expected coordinate metadata.
- Static analysis checks pass without unhandled error or missing coordinate violations.

<enforcement>
Claude Code MUST NOT skip or defer verification. All pull requests omitting coordinate metadata or bypassing internal error reporting will fail review and build verification.
</enforcement>