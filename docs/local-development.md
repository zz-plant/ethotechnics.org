# Local development

Setup, run, and troubleshoot the site locally using the repository's supported toolchain.

## Prerequisites

- Node.js 20.x (`nvm use`).
- Bun 1.3+ (`bun --version`).
- Optional: Playwright browser dependencies for end-to-end tests.

## Setup

1. `nvm use`
2. `bun install`
3. Copy `.env.example` to `.env.local` if needed for local overrides.

## Daily commands

- Start development server: `bun dev`.
- Build production bundle: `bun run build`.
- Preview production build: `bun run preview`.
- Preview Cloudflare Worker build: `bun run preview:cf`.

## Quality and validation commands

### Required before committing code or mixed changes

- `bun run check`

`bun run check` runs:

1. `bun run agent:doctor`
2. `bun run lint` and `bun run typecheck` (via `concurrently`)
3. `bun run astro:check`
4. `bun run validate:json`
5. `bun run validate:glossary`
6. `bun run test:unit:ci`

### Common focused checks

- `bun run lint`
- `bun run lint:fix`
- `bun run typecheck`
- `bun run test:unit`
- `bun run format`
- `bun run format:check`
- `bun run test:e2e` (requires Playwright browsers)

## Playwright setup

Install browsers once before running E2E tests:

- `bunx playwright install --with-deps`.

If tests fail in CI-specific environments, see `docs/cloudflare-playwright.md`.

## Troubleshooting

- Toolchain drift:
  - Verify versions with `node -v` and `bun -v`.
  - Reinstall dependencies: `rm -rf node_modules bun.lock && bun install`.
- Astro cache issues:
  - Remove `.astro/` and rerun the failing command.
- Worker preview issues:
  - Ensure `bun run build` produced `dist/_worker.js` before `bun run preview:cf`.
