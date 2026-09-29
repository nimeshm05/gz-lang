# Adoption of SharedBrand Module for Centralized Brand Presentation: Consuming Components Pass Layout Specific Positioning

These rules are ALWAYS ACTIVE for user-facing UI presentation components requiring brand identity, logo, or corporate visual marks, navigation bars, hero sections, headers, and footer components.

### Rules

- **R-BRD-001** MAY: Consuming components MAY pass layout-specific positioning and orientation properties to SharedBrand when permitted by the module component contract.

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
Claude Code MUST NOT skip or defer verification. Verified by automated CI pipeline executing repository test and type-checking suites, and peer code review.
</enforcement>