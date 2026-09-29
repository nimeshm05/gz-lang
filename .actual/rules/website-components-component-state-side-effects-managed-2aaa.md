# React UI Framework Adoption: Component State Side Effects Managed Through

These rules are ALWAYS ACTIVE for interactive frontend user interface components requiring local state management, lifecycle synchronization, or memoized rendering, as well as presentation views and dialogue structures rendered within the client web application.

### Rules

- **R-REACT-001** MUST: Component state and side effects MUST be managed through functional React hooks rather than class component lifecycle methods.
- **R-REACT-002** MUST: Functional hooks MUST adhere to standard execution rules by declaring them only at the top level of component functions.
- **R-REACT-003** MUST: Structure state management to keep state local to consuming components, elevating state to common ancestors only when shared across sibling modules.
- **R-REACT-004** MUST: Execute lock-version grounding before writing code that uses a versioned library by inspecting the dependency manifest, identifying the build tool, inspecting the repository lock or resolution artifact for the exact resolved version, looking up official docs for that version, and confirming every API/class/function exists in that version.

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