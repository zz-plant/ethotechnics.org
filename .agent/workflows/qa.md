---
description: Run full quality assurance checks before committing
---

# Quality Assurance Workflow

Run these checks to validate code quality before commits.

## Steps

// turbo

1. Run linting to catch style issues:
   ```powershell
   bun run lint
   ```

// turbo 2. Run TypeScript type checking:

```powershell
bun run typecheck
```

// turbo 3. Run Astro component checks:

```powershell
bun run astro:check
```

// turbo 4. Run unit tests:

```powershell
bun test
```

// turbo 5. Run the full check suite (combines all above):

```powershell
bun run check
```

## When to use

- Before committing code or mixed changes
- After significant refactoring
- Before opening a pull request

## Skip conditions

- Docs-only changes can skip this workflow (note skip in PR body)
