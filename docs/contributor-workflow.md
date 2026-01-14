# Contributor workflow

Practical guidance for keeping changes small, consistent, and easy to review.

## Before you start

- Read the root `README.md` for project goals and high-level commands.
- Use Node.js 20 (`nvm use`) and Bun (`bun install`) to match the repo toolchain.
- Check for scoped `AGENTS.md` files near the files you plan to touch.

## Typical change loop

1. Create or update content under `src/pages` or shared UI under `src/components` and
   `src/layouts`.
2. Run targeted commands while you work:
   - `bun run lint` for source edits.
   - `bun test` for unit and component coverage.
   - `bun run validate:json` when editing JSON data files.
   - `bun run validate:glossary` when glossary terms or references change.
3. Run `bun run check` before committing for code or mixed changes.
4. Record any manual UI review notes when visuals or layout change.

## Formatting and structure

- Format Markdown and code with `bunx prettier --write .` before committing.
- Keep Markdown line wraps near 100 characters for readability.
- Prefer short, focused files. Link to existing docs instead of repeating long guidance.

## Content and data updates

- Site routes live in `src/pages`. Keep page content close to the route when practical.
- Shared layout and UI building blocks live in `src/layouts` and `src/components`.
- Global design tokens and styles live in `src/styles`. Update them for site-wide changes.
- When editing JSON or glossary entries, update related docs or examples that reference them.

## Checks and troubleshooting

- `bun run check` runs linting, tests, TypeScript, the Astro checker, and content validation.
- If `bun run check` fails, run the individual command that failed to get focused output.
- For Playwright issues, see `docs/cloudflare-playwright.md` and `docs/local-development.md`.

## When you change docs

- Update `docs/README.md` if you add, remove, or rename a guide.
- Keep docs concise and instructional, following `docs/AGENTS.md` tone guidance.
- Mention skipped checks in the PR body for docs-only updates.

## Pre-commit checklist

- `git status` shows only the intended files.
- `bun run check` passes for code or mixed changes.
- Docs and commands match the current scripts in `package.json`.
- New workflows are captured in the closest README or `AGENTS.md` file.
