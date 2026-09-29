# React Hooks for Component Interaction Patterns: Components Manage Interactive View State Such

These rules are ALWAYS ACTIVE for all interactive frontend components within the user interface application package that manage localized user interactions, view toggles, or derived computations.

### Rules

- **R-REACT-001** MUST: Components MUST manage interactive view state such as toggles, expansion panels, and modal visibility using useState isolated to the component or its immediate parent.

### Verify

```bash
# Discover workspace dependency manifest and execute the configured test runner script for component unit tests
# Discover and run the project static analysis and linting verification commands configured in the repository
# Discover and execute the type verification script specified in repository build configurations
```

**Accept when:**
- All frontend component unit tests pass without errors or unhandled warnings.
- Static analysis and lint checks verify complete and correct dependency lists for all invoked react hooks.
- Type checking passes with zero type errors across all interactive component modules.

<enforcement>
Claude Code MUST NOT skip or defer verification.
</enforcement>