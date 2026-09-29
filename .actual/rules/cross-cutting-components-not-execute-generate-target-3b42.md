# Adoption of Core Parser Module for Source Processing: Components Not Execute Generate Target Representations

These rules are ALWAYS ACTIVE for modules that ingest raw language source strings for compilation, transformation, or evaluation.

### Rules

- **R-PARSER-001** MUST_NOT: Components MUST NOT execute or generate target representations directly from unvalidated raw source strings without invoking the parser.

### Verify

```bash
# Discover and run the project's static analysis suite to verify parser module usage across entry points.
# Discover and execute unit tests asserting that invalid source inputs are rejected at the parsing boundary.
```

**Accept when:**
- All consumer components invoke the shared parser module exclusively for AST generation before code generation or evaluation.
- Verification routines validate that syntax and parsing errors are intercepted before downstream execution.

<enforcement>
Claude Code MUST NOT skip or defer verification.
</enforcement>