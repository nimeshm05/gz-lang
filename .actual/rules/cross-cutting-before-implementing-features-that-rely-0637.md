# Adoption of Core Parser Module for Source Processing: Before Implementing Features That Rely Any

These rules are ALWAYS ACTIVE for modules that ingest raw language source strings for compilation, transformation, or evaluation.

### Rules

- **R-PAR-001** MUST: Before implementing features that rely on any versioned parser dependency, consumers MUST inspect the repository lock artifact to determine the exact resolved version and verify API compatibility against official documentation.

### Verify

```bash
# Discover and run the project's static analysis suite to verify parser module usage across entry points.
# Discover and execute unit tests asserting that invalid source inputs are rejected at the parsing boundary.
```

**Accept when:**
- All consumer components invoke the shared parser module exclusively for AST generation before code generation or evaluation.
- Verification routines validate that syntax and parsing errors are intercepted before downstream execution.

<enforcement>
Claude Code MUST NOT skip or defer verification. Verification is mandatory.
</enforcement>