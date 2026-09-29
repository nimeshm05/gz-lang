# Asynchronous Evaluation Middleware for node:vm Context Execution: Contextual Script Evaluations Execute Through Asynchronous

These rules are ALWAYS ACTIVE for runtime evaluation boundaries executing dynamically parsed expressions within contextualized virtual machine environments.

### Rules

- **R-VM-001** MUST: All contextual script evaluations MUST execute through an asynchronous middleware wrapper that encapsulates vm.runInContext invocations and standardizes error mapping.

### Verify

```bash
# Discover the project test runner configuration from the repository manifest and execute the test suite covering evaluation boundaries.
# Inspect the project scripts to identify and run the static type checking and linting suites across runtime modules.
```

**Accept when:**
- All test suites verifying asynchronous evaluation and error trapping in contextual execution pass with zero errors.
- Type validation confirms correct signatures for context middleware functions and error-first callbacks.

<enforcement>
Claude Code MUST NOT skip or defer verification. Continuous integration test pipeline executes test suites on pull requests, and peer code review verifies adherence to evaluation boundary patterns.
</enforcement>