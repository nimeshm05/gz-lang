# Adoption of motion/react for Component Animation: Interactive State Driving Animations Synchronize Component

These rules are ALWAYS ACTIVE for frontend interactive user interface components requiring visual animations, transitions, or gesture handling.

### Rules

- **R-MOTION-001** SHOULD: Interactive UI state driving animations SHOULD synchronize with component state management primitives to preserve deterministic render behavior.
- **R-MOTION-002** MANDATORY: The consumer MUST discover tool names, file names, commands, package managers, and version numbers from the project repository.
- **R-MOTION-003** MANDATORY: Before writing code that uses a versioned library, execute in order: find dependency manifest, identify build tool, inspect repository lock or resolution artifact, look up official documentation for that exact version, confirm every API/class/function exists in that version's documentation, and re-run steps per dependency at point of use.
- **R-MOTION-004** SHOULD: Isolate shared transition configurations into designated internal motion helper modules to maximize reuse.
- **R-MOTION-005** MANDATORY: Verify that component animation state aligns cleanly with reactive component lifecycle updates.

### Verify

```bash
# Discover and run the project static analysis and linting scripts to verify compliance with animation import constraints.
# Discover and execute the project test suite to ensure animated components render and transition without runtime errors.
```

**Accept when:**
- All interactive component animations import motion/react without introducing secondary animation runtimes.
- Verification test suites and static analysis pass cleanly across all animated component modules.

<enforcement>
Claude Code MUST NOT skip or defer verification. Automated static analysis checks and peer review enforce compliance during continuous integration pipelines.
</enforcement>