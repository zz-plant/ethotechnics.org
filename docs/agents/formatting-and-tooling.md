# Agent formatting and tooling

Reference for contributor-safe commands and formatting expectations.

## Runtime and package manager

- Use Node.js 20 (`nvm use`).
- Use Bun for dependency management and scripts.
- Do not replace Bun commands with npm or yarn commands in docs.

## Core commands

- Install: `bun install`.
- Full check: `bun run check`.
- Lint: `bun run lint`.
- Type check: `bun run typecheck`.
- Unit tests: `bun run test:unit`.
- Install git hooks: `bun run hooks:install`.
- Format write: `bun run format`.
- Format verify: `bun run format:check`.

## Formatting rules

- Keep Markdown concise and action-oriented.
- Wrap lines near 100 characters.
- Prefer short bullet lists over long paragraphs.
- Use fenced code blocks for command snippets.

## Docs formatting

- Whole repo: `bun run format`
- Docs-only quick formatting (example): `bunx prettier --write "docs/**/*.md"`
- Docs-only verification (example): `bunx prettier --check "docs/**/*.md"`

Use file-scoped formatting when you want faster docs iteration, then rely on `bun run format`
for full consistency before major merges.
