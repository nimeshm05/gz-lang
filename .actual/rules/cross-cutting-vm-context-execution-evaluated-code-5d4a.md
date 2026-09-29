# Asynchronous Evaluation Middleware for node:vm Context Execution: Evaluated Code That Returns Promise Resolve

These rules are ALWAYS ACTIVE for runtime evaluation boundaries executing dynamically parsed expressions within contextualized virtual machine environments.

### Rules

- **R-VM-001** MUST: Evaluated code that returns a promise MUST resolve or reject through callback completion handlers, ensuring both synchronous exceptions and asynchronous promise rejections are converted into normalized error instances.

### Verify

```bash
# Discover and run the project test runner configuration covering evaluation boundaries
# Discover and run static type checking and linting suites across runtime modules
```

**Accept when:**
- All test suites verifying asynchronous evaluation and error trapping in contextual execution pass with zero errors.
- Type validation confirms correct signatures for context middleware functions and error-first callbacks.

<enforcement>
Claude Code MUST NOT skip or defer verification. Violation handling: Pull requests bypassing the asynchronous context middleware or omitting input validation will be blocked until remediated.
</enforcement>