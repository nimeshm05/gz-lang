# Input Validation via Parser Module and Built-In Deserialization: Developers Discover Project Dependency Manifest Lock

These rules are ALWAYS ACTIVE for interactive interface entry points ingesting user-provided source strings and command-line execution boundaries loading external configuration or payload files.

### Rules

- **R-IV-001** MUST: Developers MUST discover the project dependency manifest and lock file to resolve and pin the exact version of any parsing or validation libraries prior to implementation.

### Verify

```bash
# Discover and run the project test suite to verify input parsing boundary behavior and error handling.
# Discover and run the repository static analysis and linting scripts to verify compliance with boundary validation rules.
```

**Accept when:**
- All boundary parsing tests pass with expected error handling for malformed input strings.
- Static analysis checks complete with zero boundary validation rule violations.

<enforcement>
Claude Code MUST NOT skip or defer verification. Continuous integration test suites and peer code reviews validate input parsing error boundaries, and pull requests lacking boundary input validation or error handling are blocked from merging.
</enforcement>