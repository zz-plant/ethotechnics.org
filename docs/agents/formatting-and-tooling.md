# Formatting and tooling

Maintain consistent code style with automated formatters and linters.

## Prettier (formatting)

- Format all files with: `bunx prettier --write .`
- Check formatting without modifying: `bunx prettier --check .`
- Prettier handles Markdown, TypeScript, JavaScript, JSON, and Astro files.
- Keep line wraps near 100 characters in Markdown to match existing docs.

## ESLint (linting)

- Run linting: `bun run lint`
- Auto-fix issues: `bun run lint:fix`
- ESLint checks TypeScript and Astro files under `src/`.
- The config uses `typescript-eslint` with strict type-aware rules.

## Astro check

- Run `bun run astro:check` for Astro-specific diagnostics.
- This catches template errors, prop type mismatches, and component issues.

## Editor integration

- Install recommended VS Code extensions from `.vscode/extensions.json`.
- Workspace settings in `.vscode/settings.json` enable format-on-save.
- Use the workspace TypeScript version for consistent diagnostics.

## Pre-commit validation

- The project uses lint-staged with husky for pre-commit hooks.
- Staged files are automatically formatted and linted before commit.
- If pre-commit fails, fix issues and re-stage files before committing.

## Quick reference

| Task             | Command                |
| ---------------- | ---------------------- |
| Format all       | `bun run format`       |
| Check formatting | `bun run format:check` |
| Lint             | `bun run lint`         |
| Lint + fix       | `bun run lint:fix`     |
| Full check       | `bun run check`        |
