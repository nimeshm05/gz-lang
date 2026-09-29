# Asynchronous Evaluation Middleware for node:vm Context Execution: Source Input Undergo Syntax Validation Through

These rules are ALWAYS ACTIVE for runtime evaluation boundaries executing dynamically parsed expressions within contextualized virtual machine environments.

### Rules

- **R-VM-001** MUST: Source input MUST undergo syntax validation through the parser boundary prior to dispatching evaluation to the contextual runtime environment.

### Verify

```bash
# Discover and run the project test runner configuration covering evaluation boundaries
# Discover and run static type checking and linting suites across runtime modules
```

**Accept when:**
- All test suites verifying asynchronous evaluation and error trapping in contextual execution pass with zero errors.
- Type validation confirms correct signatures for context middleware functions and error-first callbacks.

<enforcement>
Claude Code MUST NOT skip or defer verification. Continuous integration test pipeline and peer code review enforce these patterns; pull requests bypassing the asynchronous context middleware or omitting input validation will be blocked.
</enforcement>