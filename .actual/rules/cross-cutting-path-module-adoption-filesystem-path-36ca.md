# node:path Module Adoption: Filesystem Path Manipulation Normalization Resolution Across

These rules are ALWAYS ACTIVE for all files matching the configured scope.

### Rules

- **R-PATH-001** MUST: All filesystem path manipulation, path normalization, and path resolution across runtime entrypoints MUST use the node:path module via explicit protocol-scoped imports.

### Verify

```bash
# Discover and execute the project's static analysis suite to verify that path resolution imports conform to the protocol-scoped identifier standard.
# Discover and execute the project's automated test suite to validate cross-platform path resolution behavior across entrypoint modules.
```

**Accept when:**
- All filesystem path operations across execution entrypoints utilize the protocol-scoped module without syntax or lint errors.
- Automated test suites pass across all supported environments with zero cross-platform path resolution regressions.

<enforcement>
Claude Code MUST NOT skip or defer verification.
</enforcement>