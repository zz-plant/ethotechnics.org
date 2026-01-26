---
name: fix-types
description: Resolve TypeScript type errors systematically across the project.
inputs:
  path:
    description: Optional path to restrict the check (defaults to project root).
    required: false
required_tools:
  - run_command
version: 1.0.0
---

# Fix TypeScript Errors Skill

Systematic approach to resolving TypeScript type errors using Bun and standard TS practices.

## Workflow

1. **Initial Audit**: Run the type check to get the full error list.

   ```powershell
   bun run typecheck
   ```

2. **Pattern Identification**: Analyze the output for common issues:
   - Missing type annotations in exported functions.
   - Type mismatches in prop interfaces.
   - Implicit `any` usages in complex logic.
   - Missing module or type definition imports.

3. **Resolution Strategy**:
   - **Explicit Annotations**: Add types to parameters and return signatures.
   - **Type Guarding**: Use `typeof` or custom guards to narrow `unknown`.
   - **Refactoring**: Replace `any` with specific types or interfaces.
   - **Dependency Fixes**: Install missing `@types/*` if external packages are involved.

4. **Verification**: Re-run the check and ensure counts decrease.

   ```powershell
   bun run typecheck
   ```

## Best Practices

- Prefer `unknown` over `any` for uncertain external data.
- Co-locate local types with their primary usage files.
- Use explicit return types for all public API functions.
