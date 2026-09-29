# Asynchronous Evaluation Middleware for node:vm Context Execution: Engineers Inspect Repository Lock Artifact Verify

These rules are ALWAYS ACTIVE for runtime evaluation boundaries executing dynamically parsed expressions within contextualized virtual machine environments.

### Rules

- **R-VM-001** MUST: Engineers MUST inspect the repository lock artifact to verify the exact resolved version of runtime dependencies prior to implementing or modifying evaluation boundary adapters.

### Verify

```bash
# Discover the project test runner configuration from the repository manifest and execute the test suite covering evaluation boundaries.
# Inspect the project scripts to identify and run the static type checking and linting suites across runtime modules.
```

**Accept when:**
- All test suites verifying asynchronous evaluation and error trapping in contextual execution pass with zero errors.
- Type validation confirms correct signatures for context middleware functions and error-first callbacks.

<enforcement>
Claude Code MUST NOT skip or defer verification. Enforcement is verified by continuous integration test pipeline executing test suites on pull requests and peer code review.
</enforcement>