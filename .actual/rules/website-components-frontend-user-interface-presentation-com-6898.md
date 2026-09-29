# React UI Framework Adoption: Frontend User Interface Presentation Components Adopt

These rules are ALWAYS ACTIVE for all interactive frontend user interface presentation components requiring local state management, lifecycle synchronization, or memoized rendering, as well as presentation views and dialogue structures rendered within the client web application.

### Rules

- **R-REACT-001** MUST: Frontend user interface presentation components MUST adopt React as the foundational library for declarative component rendering and lifecycle management.
- **R-REACT-002** MUST: Follow lock-version grounding by finding the dependency manifest, identifying the build tool, inspecting the repository lock or resolution artifact for the exact resolved version, looking up official docs for that exact version, confirming APIs exist, and re-running per dependency at point of use.
- **R-REACT-003** MUST: Adhere to standard execution rules for functional hooks by declaring them only at the top level of
 component functions.
- **R-REACT-004** SHOULD: Structure state management to keep state local to consuming components, elevating state to common ancestors only when shared across sibling modules.

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
Claude Code MUST NOT skip or defer verification. Verification is mandatory via automated continuous integration pipelines, static analysis, type checking, unit tests, and peer code reviews.
</enforcement>