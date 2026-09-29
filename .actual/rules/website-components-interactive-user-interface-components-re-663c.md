# Adoption of motion/react for Component Animation: Interactive User Interface Components Requiring Declarative

These rules are ALWAYS ACTIVE for all files matching the configured scope.

### Rules

- **R-ANIM-001** MUST: Interactive user interface components requiring declarative animations MUST use motion/react as the primary animation library.

### Verify

```bash
# Discover and run the project static analysis and linting scripts to verify compliance with animation import constraints.
# Discover and execute the project test suite to ensure animated components render and transition without runtime errors.
```

**Accept when:**
- All interactive component animations import motion/react without introducing secondary animation runtimes.
- Verification test suites and static analysis pass cleanly across all animated component modules.

<enforcement>
Claude Code MUST NOT skip or defer verification. Automated static analysis checks and peer reviews verify compliance, and violations block pull requests.
</enforcement>