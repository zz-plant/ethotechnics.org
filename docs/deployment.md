# Deployment

Guidance for shipping the site to Cloudflare Workers and verifying production output.

## Prerequisites

- Access to the Cloudflare account and target Worker/Pages project.
- Node.js 20 and Bun installed (`nvm use`, then `bun install`).
- `.env.local` present if you rely on local-only secrets; deployment uses Cloudflare-bound
  environment variables instead of `.env` files.

## Standard deploy flow

1. Build the Worker bundle: `bun run build`.
2. Preview the production output locally (optional but recommended):
   - `bun run preview` for the Astro preview server.
   - `bun run preview:cf` when you need to exercise Cloudflare bindings.
3. Deploy with Wrangler: `bun run deploy`.

The deploy script runs `wrangler deploy --no-bundle` because Astro already emits the Worker
bundle; the output lives in `dist/_worker.js`.

## Configuration files to know

- `wrangler.toml` defines the Worker name, compatibility date, bindings, and deployment target.
- `astro.config.mjs` controls the Cloudflare adapter and output mode.
- `public/` assets are copied to the Worker bundle during `bun run build`.

## Verification checklist

- Confirm the deploy output reports the expected Worker name and environment.
- Load the homepage and a representative content page to verify layout, navigation, and metadata.
- If you touched JSON-backed content, spot-check the affected pages for missing copy.

## Rollback and recovery

- Re-deploy the last known good bundle by checking out the previous commit and running
  `bun run build && bun run deploy`.
- If the deploy failed before upload, keep the previous Worker version published and resolve the
  local build error first.

## Troubleshooting

- If Wrangler fails to find the bundle, re-run `bun run build` and confirm `dist/_worker.js`
  exists.
- If routes 404 in production but not locally, confirm the route is present in `src/pages` and
  that the adapter settings in `astro.config.mjs` match the deployment target.
- For Playwright failures in CI, see `docs/cloudflare-playwright.md` for Cloudflare Pages
  specifics.
