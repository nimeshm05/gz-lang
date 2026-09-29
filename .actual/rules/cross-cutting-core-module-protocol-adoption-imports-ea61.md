# node: Core Module Protocol Adoption: Imports Referencing Runtime Built Standard Library

These rules are ALWAYS ACTIVE for all source modules importing built-in runtime capabilities, including command-line interface and interactive evaluation boundary modules.

### Rules

- **R-NODE-001** MUST: All imports referencing runtime built-in standard library capabilities MUST utilize the explicit node: protocol scheme prefix.

### Verify

```bash
# Discover and execute the project linting and static analysis suite to check for un-prefixed core module imports.
# Discover and execute the test runner to verify module resolution and execution boundary behavior.
```

**Accept when:**
- Static analysis checks pass with zero un-prefixed core module import violations.
- All test suites for execution and evaluation boundaries pass without errors.

<enforcement>
Claude Code MUST NOT skip or defer verification. Automated static analysis checks and peer code reviews enforce compliance.
</enforcement>