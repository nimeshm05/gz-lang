# React UI Framework Adoption: Derived Values Expensive Computations Use Usememo

These rules are ALWAYS ACTIVE for interactive frontend user interface components requiring local state management, lifecycle synchronization, or memoized rendering within the client web application.

### Rules

- **R-REACT-001** SHOULD: Derived values and expensive computations SHOULD use useMemo to prevent unnecessary recalculations across render cycles.
- **R-REACT-002** MANDATORY: The consumer MUST derive tool names, file names, commands, package managers, and version numbers from the project repository.
- **R-REACT-003** MANDATORY: Before writing code that uses a versioned library, execute in order: (1) Find dependency manifest in the repo. (2) Identify build tool. (3) Inspect repository lock or resolution artifact for exact resolved version. (4) Look up official documentation, changelog, or public API reference for that exact version. (5) Confirm every API, class, or function exists in that version. (6) Re-run steps 3-5 per dependency at point of use for version-sensitive behavior.
- **R-REACT-004** MANDATORY: Functional hooks MUST adhere to standard execution rules by declaring them only at the top level of component functions.
- **R-REACT-005** MANDATORY: Structure state management to keep state local to consuming components, elevating state to common ancestors only when shared across sibling modules.

### Verify

```bash
# Discover and run project dependency audit and type validation scripts
# Discover and run project automated test suite and linter routines
```

**Accept when:**
- All interactive user interface components compile without type errors and pass automated component tests.
- Static analysis passes with zero violations regarding hook rules and dependency arrays.
- The resolved library version matches the authoritative repository lock artifact.

<enforcement>
Claude Code MUST NOT skip or defer verification. Verified by automated continuous integration pipelines executing static analysis, type checking, and unit tests, and by peer code reviews.
</enforcement>