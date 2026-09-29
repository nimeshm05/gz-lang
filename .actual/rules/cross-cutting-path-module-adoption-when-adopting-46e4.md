# node:path Module Adoption: When Adopting Updating Runtime Module Dependencies

These rules are ALWAYS ACTIVE for execution entrypoints, command-line interfaces, and modules parsing, formatting, or normalizing filesystem paths and package locations.

### Rules

- **R-PATH-001** MUST: When adopting or updating runtime module dependencies, the consumer MUST inspect the repository lock artifact to determine the exact resolved runtime environment version before implementing path resolution logic.

### Verify

```bash
# Discover and execute the project's static analysis and test suites
# (Commands must be derived from the project repository configuration)
```

**Accept when:**
- All filesystem path operations across execution entrypoints utilize the protocol-scoped module without syntax or lint errors.
- Automated test suites pass across all supported environments with zero cross-platform path resolution regressions.

<enforcement>
Claude Code MUST NOT skip or defer verification. All pull requests and code modifications must conform to static analysis and import specifier checks enforced by CI.
</enforcement>