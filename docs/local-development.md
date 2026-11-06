# Local development

Setup, run, and troubleshoot the site locally using the repository's supported toolchain.

## Prerequisites

- Node.js 22.x (`nvm use`).
- Bun 1.3+ (`bun --version`).
- Optional: Playwright browser dependencies for end-to-end tests.

## Setup

1. `nvm use`.
2. `bun install`.
3. Copy `.env.example` to `.env.local` if needed for local overrides. No variables are required
   today; add new entries to `.env.example` if the project adopts an external service.

## Daily commands

- Start development server: `bun dev`.
- Build production bundle: `bun run build`.
- Preview production build: `bun run preview`.
- Preview Cloudflare Worker build: `bun run preview:cf`.
- Generate the Pagefind search index in `dist/pagefind`: `bun run build:search`.
- Build and deploy the Worker: `bun run deploy`.

## Quality and validation commands

### Required before committing code or mixed changes

- `bun run check`.

[`agents/workflow-and-checks.md`](agents/workflow-and-checks.md) lists what it runs.

### Common focused checks

- `bun run lint`.
- `bun run lint:fix`.
- `bun run typecheck`.
- `bun run test:unit`.
- `bun run format`.
- `bun run format:check`.
- `bun run check:full` (default checks plus the SEO audit and coverage; for release prep or
  periodic deep validation).
- `bun run test:e2e` (requires Playwright browsers; Chromium, Firefox, and WebKit).
- `bun run test:e2e:smoke` (Chromium only).
- `bun run test:e2e:ci` (Chromium only, as CI runs it).

## Playwright setup

Install browsers once before running E2E tests:

- `bunx playwright install --with-deps`.

- Use `bun run preview:cf` to validate Worker runtime behavior (bindings or Workers KV) locally.
- Override the preview target with `PLAYWRIGHT_BASE_URL` (default `http://127.0.0.1:4321`).
- Run the full three-browser matrix locally before a release.

If browser downloads fail:

- Reuse cached downloads with `PLAYWRIGHT_BROWSERS_PATH=~/.cache/playwright`.
- Confirm proxies or firewalls are not blocking `https://playwright.azureedge.net`.
- Use a mirror with `PLAYWRIGHT_DOWNLOAD_HOST=https://your-mirror.example.com`.

If tests fail in CI-specific environments, see `docs/cloudflare-playwright.md`.

## Safe local cleanup

These paths are generated and safe to delete:

- `dist/`, `.astro/`, `.vercel/`, `coverage/`
- `test-results/`, `playwright-report/`, `blob-report/`, `playwright/.cache/`, `playwright/.auth/`
- `astro_check_log.txt`
- `node_modules/` (recreated with `bun install`)

`bun run clean` removes build and test output. `bun run clean:all` also removes dependencies and
Playwright caches.

## Troubleshooting

- Toolchain drift:
  - Verify versions with `node -v` and `bun -v`.
  - Reinstall dependencies: `rm -rf node_modules bun.lock && bun install`.
- Astro cache issues:
  - Remove `.astro/` and rerun the failing command.
- Worker preview issues:
  - Ensure `bun run build` produced `dist/server/entry.mjs` and `dist/server/wrangler.json`
    before `bun run preview:cf`.
  - If preview serves `[object Object]`, rerun `bun run build` and confirm the output includes
    `Patched Cloudflare worker streaming mode`.
