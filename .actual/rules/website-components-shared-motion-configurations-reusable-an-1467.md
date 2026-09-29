# Adoption of motion/react for Component Animation: Shared Motion Configurations Reusable Animation Variants

These rules are ALWAYS ACTIVE for frontend interactive user interface components requiring visual animations, transitions, or gesture handling.

### Rules

- **R-MOTION-001** SHOULD: Shared motion configurations and reusable animation variants SHOULD be consolidated into centralized motion modules rather than duplicated across component definitions.
- **R-MOTION-002** MANDATORY: Discover and run the project static analysis and linting scripts to verify compliance with animation import constraints.
- **R-MOTION-003** MANDATORY: Discover and execute the project test suite to ensure animated components render and transition without runtime errors.

### Verify

```bash
# Discover and run the project static analysis and linting scripts
# Discover and execute the project test suite
```

**Accept when:**
- All interactive component animations import motion/react without introducing secondary animation runtimes.
- Verification test suites and static analysis pass cleanly across all animated component modules.

<enforcement>
Claude Code MUST NOT skip or defer verification. Automated static analysis and peer review verify compliance with animation import constraints.
</enforcement>