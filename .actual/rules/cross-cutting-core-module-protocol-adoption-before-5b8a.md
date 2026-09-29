# node: Core Module Protocol Adoption: Before Implementing Code That Relies Version

These rules are ALWAYS ACTIVE for all source modules importing built-in runtime capabilities and command-line interface/interactive evaluation boundary modules.

### Rules

- **R-NODE-001** MUST: Before implementing code that relies on version-governed dependencies, consumers MUST inspect the project dependency manifest and authoritative lock artifact to confirm target version compatibility.
- **R-NODE-002** MUST: All built-in runtime module imports MUST use explicit protocol specifiers (e.g., node:) to clarify module origin and align resolution with runtime standard library isolation.

### Verify

```bash
# Discover and execute the project linting and static analysis suite to check for un-prefixed core module imports.
# Discover and execute the test runner to verify module resolution and execution boundary behavior.
```

**Accept when:**
- Static analysis checks pass with zero un-prefixed core module import violations.
- All test suites for execution and evaluation boundaries pass without errors.

<enforcement>
Claude Code MUST NOT skip or defer verification.
</enforcement>