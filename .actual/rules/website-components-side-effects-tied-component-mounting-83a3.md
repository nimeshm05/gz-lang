# React Hooks for Component Interaction Patterns: Side Effects Tied Component Mounting Dom

These rules are ALWAYS ACTIVE for all interactive frontend components within the user interface application package that manage localized user interactions, view toggles, or derived computations.

### Rules

- **R-REACT-001** MUST: Side-effects tied to component mounting, DOM synchronization, or external event listener registration MUST be encapsulated within useEffect with explicitly declared dependency lists.

### Verify

```bash
# Discover the workspace dependency manifest and execute the configured test runner script for component unit tests.
npm test

# Discover and run the project static analysis and linting verification commands configured in the repository.
npm run lint

# Discover and execute the type verification script specified in repository build configurations.
npm run typecheck
```

**Accept when:**
- All frontend component unit tests pass without errors or unhandled warnings.
- Static analysis and lint checks verify complete and correct dependency lists for all invoked react hooks.
- Type checking passes with zero type errors across all interactive component modules.

<enforcement>
Claude Code MUST NOT skip or defer verification. Automated continuous integration pipelines executing linting, static analysis, and unit test suites will block pull requests containing missing hook dependencies, unmemoized expensive transforms, or improper state scoping until resolved.
</enforcement>