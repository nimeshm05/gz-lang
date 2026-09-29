# node:path Module Adoption: Path Construction Operations Not Use Manual

These rules are ALWAYS ACTIVE for execution entry
points, command-line interfaces, and modules resolving file and directory paths.

### Rules

- **R-PATH-001** MUST_NOT: Path construction operations MUST NOT use manual string concatenation or custom delimiter manipulation when resolving directory or file paths.

### Verify

```bash
# Discover and execute the project's static analysis suite to verify protocol-scoped path imports
npm run lint || yarn lint || pnpm lint

# Discover and execute the project's automated test suite to validate cross-platform path resolution
npm test || yarn test || pnpm test
```

**Accept when:**
- All filesystem path operations across execution entrypoints utilize the protocol-scoped module without syntax or lint errors.
- Automated test suites pass across all supported environments with zero cross-platform path resolution regressions.

<enforcement>
Claude Code MUST NOT skip or defer verification. All filesystem path operations must use runtime core utilities.
</enforcement>