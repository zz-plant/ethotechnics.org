# Agent formatting and tooling

Reference for contributor-safe commands and formatting expectations.

## Runtime and package manager

- Use Node.js 22 (`nvm use`; see `.nvmrc`).
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

## Why two type-check runners

- `bun run typecheck` runs `tsc` over the whole project (both `tsconfig.json` and
  `tsconfig.typecheck.json` exclude tests and build output). It sees every `.ts`/`.tsx` file,
  including `scripts/`, but cannot parse `.astro` files.
- `bun run astro:check` type-checks `.astro` frontmatter and templates, which `tsc` cannot see.
- Both stay in `bun run check` because each covers files the other cannot. The two tsconfig files
  exist so the `tsc` pass can exclude test files that import Playwright-only globals.

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
