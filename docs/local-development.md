# Local development

Guidelines to spin up the site locally, run checks, and troubleshoot build issues.

## Setup

- Use Bun 1.3+ (the project relies on Bun's runtime and package manager).
- Copy `.env.example` to `.env.local`; no variables are required yet, but the file keeps future
  additions discoverable.
- Install dependencies with `bun install`.

## Editor integration

- VS Code will prompt to install recommended extensions from `.vscode/extensions.json`; accept
  them to enable Astro language services, ESLint, and Prettier formatting.
- Workspace defaults format on save and expose ESLint quick fixes. Keep the `Format Document` and
  `Source: Fix All` commands available for other editors.
- The workspace pin to `node_modules/typescript/lib` keeps the TypeScript version consistent with
  the toolchain used by the scripts and checks.
- VS Code tasks are prewired for common flows (`dev`, `build`, `check`, `lint`, `format`, and
  testing). Use **Terminal → Run Task** to trigger them without leaving the editor.

## Running the dev server

- Start Astro locally with `bun dev`.
  - Expected log: `[@astrojs/compiler] ready` and `Local http://localhost:4321/`.
  - The server binds to `0.0.0.0`; use `bun dev --port 4322` if another process already
    occupies port 4321.
- Stop and restart the server after dependency upgrades so Vite picks up plugin changes.

## Building and previewing

- Build the Cloudflare Worker bundle with `bun run build`; success logs include `Built in` timings
  and emit `dist/_worker.js`.
- The build skips compressed-size reporting to avoid extra gzip/Brotli passes; re-enable it in
  `astro.config.mjs` if you need those numbers for an investigation.
- Preview locally with `bun run preview` to mimic the deployed output.
- Combine both steps to sanity-check production output: `bun run build && bun run preview`.

## Checks and tests

- Run `bun run check` before sending changes; it chains linting, tests, type checks, and Astro's
  analyzer where configured.
- Targeted runs when iterating:
  - `bun run lint` for Astro and TypeScript sources under `src/`.
  - `bun run lint:fix` to auto-fix lintable issues in Astro and TypeScript sources.
  - `bun run format` to apply Prettier formatting across the repo.
  - `bun run format:check` for a CI-friendly formatting check.
  - `bun run typecheck` for strict TypeScript validation.
  - `bun run test:unit` for the unit and component test suite.
  - `bun run test:unit:ci` to generate coverage with the lcov reporter.
    - Coverage reports land in `coverage/lcov.info`.
- End-to-end tests require browsers: install them once with `bunx playwright install --with-deps`
  before running `bun run test:e2e`.

## Troubleshooting

- Verify Bun version with `bun -v`; reinstall dependencies if versions drift: `rm -rf node_modules bun.lock`
  and `bun install`.
- Clear Astro's cache when layout or config changes behave oddly: remove the `.astro/` directory
  before rebuilding.
- If preview requests fail, confirm the Worker build emitted `dist/_worker.js` and that
  `wrangler.toml` points to it.
