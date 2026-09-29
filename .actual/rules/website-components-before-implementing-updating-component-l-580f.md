# React UI Framework Adoption: Before Implementing Updating Component Logic React

These rules are ALWAYS ACTIVE for interactive frontend presentation modules, presentation views, and dialogue structures requiring local state management, lifecycle synchronization, or memoized rendering.

### Rules

- **R-REACT-001** MUST: Before implementing or updating component logic with React, engineers MUST inspect the repository lock artifact to determine the exact resolved version and verify that all invoked APIs exist in that version documentation.

### Verify

```bash
# Discover and run project dependency audit, type validation, automated tests, and linter routines
```

**Accept when:**
- All interactive user interface components compile without type errors and pass automated component tests.
- Static analysis passes with zero violations regarding hook rules and dependency arrays.
- The resolved library version matches the authoritative repository lock artifact.

<enforcement>
Claude Code MUST NOT skip or defer verification.
</enforcement>