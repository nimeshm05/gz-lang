# node: Core Module Protocol Adoption: Source Modules Not Reference Built Runtime

These rules are ALWAYS ACTIVE for all source modules importing built-in runtime capabilities, and command-line interface and interactive evaluation boundary modules.

### Rules

- **R-CORE-001** MUST_NOT: Source modules MUST_NOT reference built-in runtime capabilities using un-prefixed bare specifiers.

### Verify

```bash
# Discover and execute the project linting and static analysis suite to check for un-prefixed core module imports.
npm run lint || npx eslint .

# Discover and execute the test runner to verify module resolution and execution boundary behavior.
npm test
```

**Accept when:**
- Static analysis checks pass with zero un-prefixed core module import violations.
- All test suites for execution and evaluation boundaries pass without errors.

<enforcement>
Claude Code MUST NOT skip or defer verification.
</enforcement>