---
name: qa
description: Run full quality assurance checks before committing or merging.
required_tools:
  - run_command
version: 1.0.0
---

# Quality Assurance Skill

Ensures the project meets stability, styling, and testing standards before code is shipped.

## Checkpoints

1. **Linting**: Catch formatting and static analysis rules.
   ```powershell
   bun run lint
   ```

2. **Types**: Verify TypeScript integrity.
   ```powershell
   bun run typecheck
   ```

3. **Astro**: Check component and route validity.
   ```powershell
   bun run astro:check
   ```

4. **Testing**: Run the unit test suite.
   ```powershell
   bun test
   ```

5. **Consolidated Check**: Run the full suite if time permits.
   ```powershell
   bun run check
   ```

## When to Use

- Mandatory before committing logic changes.
- Required before opening any Pull Request.
- Recommended after upgrading project dependencies.

## Skip Policy

- Documentation-only (`.md`) changes may skip full QA, but should still be formatted with Prettier.
