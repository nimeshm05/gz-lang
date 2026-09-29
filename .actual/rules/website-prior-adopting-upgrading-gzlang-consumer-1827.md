# gzlang Core Library Adoption for Language Tooling and Interactive Playground: Prior Adopting Upgrading Gzlang Consumers Inspect

These rules are ALWAYS ACTIVE for language documentation metadata modules, syntax highlighting utilities, tokenizers, and interactive code playground interfaces.

### Rules

- **R-GZ-001** MUST: Prior to adopting or upgrading gzlang, consumers MUST inspect the repository lock artifact to determine the exact resolved version and verify that all invoked interfaces exist in that version specification.
- **R-GZ-002** MANDATORY: Execute in order before writing code using a versioned library: find the dependency manifest, identify the build tool, inspect the repository lock/resolution artifact, look up official documentation for that exact version, and confirm every API/class/function exists in that version.
- **R-GZ-003** MUST: Encapsulate gzlang integration behind dedicated module boundaries to isolate language runtime changes from view layer presentation logic.
- **R-GZ-004** SHOULD: Utilize dynamic code splitting and lazy loading strategies for routes importing gzlang to optimize initial application load performance.

### Verify

```bash
# Discover and run static analysis and linting suites to verify compliant dependency imports
# Discover and run automated test suites to validate highlighting and playground execution
# Discover and run production build script to verify bundle chunking and export boundaries
```

**Accept when:**
- All language keyword documentation and syntax highlighters import directly from gzlang without ad-hoc grammar duplication.
- Playground components successfully execute and evaluate code snippets via the resolved gzlang library interfaces.
- All automated test suites, type validation checks, and production build scripts pass without unresolved symbol or dependency errors.

<enforcement>
Claude Code MUST NOT skip or defer verification. Automated dependency import checks, static analysis rules, and lock artifact consistency verification are enforced during continuous integration pipelines.
</enforcement>