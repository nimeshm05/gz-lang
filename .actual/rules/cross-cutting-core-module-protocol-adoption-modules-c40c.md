# node: Core Module Protocol Adoption: Modules Handling External Input Evaluation Isolate

These rules are ALWAYS ACTIVE for all source modules importing built-in runtime capabilities and command-line interface/interactive evaluation boundary modules.

### Rules

- **R-CORE-001** SHOULD: Modules handling external input evaluation SHOULD isolate execution scopes using dedicated runtime contexts.

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