# gzlang Core Library Adoption for Language Tooling and Interactive Playground: Components Utilities Not Reimplement Custom Language

These rules are ALWAYS ACTIVE for all code, components, utilities, documentation metadata modules, syntax highlighters, and interactive code playground interfaces dealing with domain-specific languages.

### Rules

- **R-GZLANG-001** MUST_NOT: Components and utilities MUST NOT reimplement custom language tokenizers or duplicate language grammar rules independently of gzlang.

### Verify

```bash
# Discover and run the project static analysis and linting suites
# Discover and run the project automated test suite
# Discover and run the project production build script
```

**Accept when:**
- All language keyword documentation and syntax highlighters import directly from gzlang without ad-hoc grammar duplication.
- Playground components successfully execute and evaluate code snippets via the resolved gzlang library interfaces.
- All automated test suites, type validation checks, and production build scripts pass without unresolved symbol or dependency errors.

<enforcement>
Claude Code MUST NOT skip or defer verification. Verification is mandatory via automated dependency import checks, static analysis rules, lock artifact consistency verification, and mandatory peer code reviews.
</enforcement>