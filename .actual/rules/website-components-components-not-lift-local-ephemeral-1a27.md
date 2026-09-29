# React Hooks for Component Interaction Patterns: Components Not Lift Local Ephemeral Interaction

These rules are ALWAYS ACTIVE for interactive frontend components within the user interface application package that manage localized user interactions, view toggles, or derived computations.

### Rules

- **R-REACT-001** SHOULD_NOT: Components SHOULD_NOT lift local ephemeral interaction state to global application stores when the state is solely consumed within a single component subtree.

### Verify

```bash
# Discover workspace dependency manifest and run test runner for component unit tests
# Discover and run project static analysis, linting, and type verification commands
```

**Accept when:**
- All frontend component unit tests pass without errors or unhandled warnings.
- Static analysis and lint checks verify complete and correct dependency lists for all invoked react hooks.
- Type checking passes with zero type errors across all interactive component modules.

<enforcement>
Claude Code MUST NOT skip or defer verification.
</enforcement>