# Adoption of motion/react for Component Animation: Consumers Discover Project Dependency Lock Artifact

These rules are ALWAYS ACTIVE for frontend interactive user interface components requiring visual animations, transitions, or gesture handling.

### Rules

- **R-ANIM-001** MUST: Consumers MUST discover the project dependency lock artifact and resolve the exact locked version of motion/react before introducing new motion APIs.

### Verify

```bash
# Discover and run the project static analysis and linting scripts to verify compliance with animation import constraints.
# Discover and execute the project test suite to ensure animated components render and transition without runtime errors.
```

**Accept when:**
- All interactive component animations import motion/react without introducing secondary animation runtimes.
- Verification test suites and static analysis pass cleanly across all animated component modules.

<enforcement>
Claude Code MUST NOT skip or defer verification. Verified by automated static analysis checks during repository continuous integration pipelines and peer review during code integration.
</enforcement>