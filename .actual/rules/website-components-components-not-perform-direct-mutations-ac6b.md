# React UI Framework Adoption: Components Not Perform Direct Mutations Browser

These rules are ALWAYS ACTIVE for all interactive frontend user interface components requiring local state management, lifecycle synchronization, or memoized rendering, as well as presentation views and dialogue structures rendered within the client web application.

### Rules

- **R-REACT-001** MUST_NOT: Components MUST_NOT perform direct mutations on the browser Document Object Model outside of React rendering lifecycles.

### Verify

```bash
# Discover and run the project dependency audit and type validation scripts defined in the project configuration.
# Discover and run the project automated test suite and linter routines to verify hook compliance and component rendering integrity.
```

**Accept when:**
- All interactive user interface components compile without type errors and pass automated component tests.
- Static analysis passes with zero violations regarding hook rules and dependency arrays.
- The resolved library version matches the authoritative repository lock artifact.

<enforcement>
Claude Code MUST NOT skip or defer verification.
</enforcement>