# node:path Module Adoption: Module Imports Referencing Path Resolution Capabilities

These rules are ALWAYS ACTIVE for execution entrypoints, command-line interfaces, and modules resolving, parsing, formatting, or normalizing filesystem paths and package locations.

### Rules

- **R-PATH-001** MUST: Module imports referencing path resolution capabilities MUST use the explicit protocol-scoped identifier rather than unadorned specifiers.

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