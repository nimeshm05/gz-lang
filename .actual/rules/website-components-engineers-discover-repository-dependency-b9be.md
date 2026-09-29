# Adoption of SharedBrand Module for Centralized Brand Presentation: Engineers Discover Repository Dependency Manifest Inspect

These rules are ALWAYS ACTIVE for all user-facing UI presentation components requiring brand identity, logo, or corporate visual marks, including navigation bars, hero sections, headers, and footer components.

### Rules

- **R-BRD-001** MUST: Engineers MUST discover the repository dependency manifest and inspect lock resolution artifacts to verify module resolution rules before integrating shared module dependencies.

### Verify

```bash
# Discover and execute the repository type-checking script to verify interface compliance between SharedBrand and consuming components.
# Discover and run the repository component test suite to ensure consuming presentation components render SharedBrand without visual regressions.
# Discover and execute the project verification scripts to detect unapproved inline brand asset duplication across presentation modules.
```

**Accept when:**
- All presentation components requiring brand identity elements import and render SharedBrand without local brand mark duplication.
- Repository type verification and component unit test suites execute with zero failures.
- Project verification scripts pass with no violations of shared module consumption policies.

<enforcement>
Claude Code MUST NOT skip or defer verification.
</enforcement>