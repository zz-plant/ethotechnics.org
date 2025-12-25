# Local development

Guidelines to spin up the site locally, run checks, and troubleshoot build issues.

## Setup

- Use Node.js 20.x (run `nvm use` to align with the pinned toolchain).
- Copy `.env.example` to `.env.local`; no variables are required yet, but the file keeps future
  additions discoverable.
- Install dependencies with `npm install` and keep `npm` on your PATH.

## Running the dev server

- Start Astro locally with `npm run dev`.
  - Expected log: `[@astrojs/compiler] ready` and `Local  http://localhost:4321/`.
  - The server binds to `0.0.0.0`; use `npm run dev -- --port 4322` if another process already
    occupies port 4321.
- Stop and restart the server after dependency upgrades so Vite picks up plugin changes.

## Building and previewing

- Build the Cloudflare Worker bundle with `npm run build`; success logs include `Built in` timings
  and emit `dist/_worker.js`.
- Preview locally with `npm run preview` to mimic the deployed output.
- Combine both steps to sanity-check production output: `npm run build && npm run preview`.

## Checks and tests

- Run `npm run check` before sending changes; it chains linting, tests, type checks, and Astro's
  analyzer where configured.
- Targeted runs when iterating:
  - `npm run lint` for Astro and TypeScript sources under `src/`.
  - `npm run typecheck` for strict TypeScript validation.
  - `npm run test` for Vitest watch mode or `npm run test:ci` for a single pass with coverage.
- End-to-end tests require browsers: install them once with `npx playwright install --with-deps`
  before running `npm run e2e`.

## Troubleshooting

- Verify Node version with `node -v`; reinstall dependencies if versions drift: `rm -rf node_modules`
  and `npm install`.
- Clear Astro's cache when layout or config changes behave oddly: remove the `.astro/` directory
  before rebuilding.
- If preview requests fail, confirm the Worker build emitted `dist/_worker.js` and that
  `wrangler.toml` points to it.
