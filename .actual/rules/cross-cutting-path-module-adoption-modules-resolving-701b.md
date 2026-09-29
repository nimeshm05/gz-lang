# node:path Module Adoption: Modules Resolving Package Metadata Execution Scripts

These rules are ALWAYS ACTIVE for execution entrypoints, command-line interfaces, and modules resolving package metadata, configuration, or execution scripts.

### Rules

- **R-PATH-001** SHOULD: Modules resolving package metadata or execution scripts SHOULD isolate path resolution logic at boundary interfaces to decouple file system resolution from core execution logic.

### Verify

```bash
# Discover and execute the project's static analysis suite to verify protocol-scoped path imports
npm run lint
# Discover and execute the project's automated test suite to validate cross-platform path resolution
npm test
```

**Accept when:**
- All filesystem path operations across execution entrypoints utilize the protocol-scoped module without syntax or lint errors.
- Automated test suites
 pass across all supported environments with zero cross-platform path resolution regressions.

<enforcement>
Claude Code MUST NOT skip or defer verification.
</enforcement>