# Input Validation via Parser Module and Built-In Deserialization: Components Not Evaluate Execute Bind Raw

These rules are ALWAYS ACTIVE for external entry points, interactive interfaces, and command-line execution boundaries ingesting raw input strings.

### Rules

- **R-INP-001** MUST_NOT: Components MUST NOT evaluate, execute, or bind raw input strings into execution environments without preceding validation or syntactic parsing.

### Verify

```bash
# Discover and run the project test suite to verify input parsing boundary behavior and error handling.
# Discover and run the repository static analysis and linting scripts to verify compliance with boundary validation rules.
```

**Accept when:**
- All boundary parsing tests pass with expected error handling for malformed input strings.
- Static analysis checks complete with zero boundary validation rule violations.

<enforcement>
Claude Code MUST NOT skip or defer verification. Continuous integration test suites and peer code reviews validate input parsing error boundaries.
</enforcement>