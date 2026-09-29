# gzlang Core Library Adoption for Language Tooling and Interactive Playground: Interactive Playground Components Isolate Gzlang Runtime

These rules are ALWAYS ACTIVE for all files matching the configured scope.

### Rules

- **R-GZLANG-001** SHOULD: Interactive playground components SHOULD isolate gzlang runtime execution and state handling to prevent UI thread blocking during complex evaluation.

### Verify

```bash
# Discover and run the project static analysis and linting suites to verify compliant dependency imports across language modules
# Discover and run the project automated test suite to validate that highlighting and playground execution match expected gzlang behavior
# Discover and run the project production build script to verify bundle chunking and export boundaries for the language dependency
```

**Accept when:**
- All language keyword documentation and syntax highlighters import directly from gzlang without ad-hoc grammar duplication.
- Playground components successfully execute and evaluate code snippets via the resolved gzlang library interfaces.
- All automated test suites, type validation checks, and production build scripts pass without unresolved symbol or dependency errors.

<enforcement>
Claude Code MUST NOT skip or defer verification.
</enforcement>