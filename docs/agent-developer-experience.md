# Developer experience checklist for agents

This file summarizes agent-facing references so onboarding stays short and consistent.

## Current agent references

- Project context, commands, and contributor expectations live in
  [README.md](../README.md), especially [Quick start](../README.md#quick-start),
  [Common scripts](../README.md#common-scripts), [Testing](../README.md#testing), and
  [Contributing](../README.md#contributing).
- Docs-specific expectations live in [`docs/AGENTS.md`](./AGENTS.md).
- The docs map and when to add guidance live in [`docs/README.md`](./README.md).
- Repository-wide expectations live in [`AGENTS.md`](../AGENTS.md).
- File-level conventions live with the code in
  [`src/AGENTS.md`](../src/AGENTS.md),
  [`src/pages/AGENTS.md`](../src/pages/AGENTS.md), and
  [`src/components/AGENTS.md`](../src/components/AGENTS.md).
- Environment configuration, including `.env` loading, is covered in
  [README.md#environment-configuration](../README.md#environment-configuration).
- Playwright browser download troubleshooting sits near the
  [README.md#testing](../README.md#testing) e2e instructions.

## Agent workflow reminders

- Use the pinned toolchain: `nvm use` for Node 20 and Bun for all scripts.
- Run `bun run check` for code or mixed changes. Docs-only updates can skip it but note the skip
  in the PR body.
- Format docs with `bunx prettier --write docs/*.md` before committing.
- Keep changes small, readable, and scoped to the task.

## Picking work

- Start with the roadmap/specs hub in
  [`docs/page-specifications.md`](./page-specifications.md) for the current priority list.
- Prefer items marked “Now” or labeled “good first issue” when you want a bounded, high-confidence
  starting point.
- If multiple items are viable, pick the one with the clearest acceptance notes and required files.

## Editor and IDE helpers

- Workspace recommendations for VS Code live in `.vscode/extensions.json`; install them to pick up
  Astro IntelliSense, ESLint, and Prettier support.
- `.vscode/settings.json` pins format-on-save behavior and uses the workspace TypeScript version so
  diagnostics match the scripts in `package.json`.

## Improvements still needed

- None noted.
