# Deployment

Guidance for shipping the site to Cloudflare Workers and verifying production output.

## Prerequisites

- Access to the Cloudflare account and target Worker/Pages project.
- Node.js 20 and Bun installed (`nvm use`, then `bun install`).
- `.env.local` present if you rely on local-only secrets; deployment uses Cloudflare-bound
  environment variables instead of `.env` files.

## Standard deploy flow

1. Build the Worker bundle with `bun run build` when you need to preview or inspect the output.
2. Preview the production output locally (optional but recommended):
   - `bun run preview` for the Astro preview server.
   - `bun run preview:cf` when you need to exercise Cloudflare bindings.
3. Deploy with Wrangler: `bun run deploy`.

The deploy script runs `bun run build` and then
`wrangler deploy --config dist/server/wrangler.json`. Astro emits the Worker entry at
`dist/server/entry.mjs`, static assets under `dist/client`, and a generated Wrangler config at
`dist/server/wrangler.json` that ties those outputs together. Use the generated config for deploys;
plain `wrangler deploy` reads the root `wrangler.toml` and can publish an incomplete Worker.

The build also runs `patch:cf-worker` after `astro build`. This keeps `nodejs_compat` available for
the Node APIs used during build/prerender while forcing Astro's generated Cloudflare Worker bootstrap
to use `createApp({ streaming: false })`. Without that patch, the Worker can return a 200 response
whose body is the literal string `[object Object]`.

## Configuration files to know

- `wrangler.toml` defines the base Worker name, compatibility date, compatibility flags, bindings, and deployment target.
- `dist/server/wrangler.json` is generated during `bun run build` and is the config Wrangler deploys.
- `astro.config.mjs` controls the Cloudflare adapter and output mode.
- `public/` assets are copied to the Worker bundle during `bun run build`.

## Verification checklist

- Confirm the deploy output reports the expected Worker name and environment.
- Confirm `wrangler.toml` uses the intended `compatibility_date` for the current release window.
- Confirm `compatibility_flags` still match project expectations (notably `nodejs_compat`).
- Load the homepage and a representative content page to verify layout, navigation, and metadata.
- If you touched JSON-backed content, spot-check the affected pages for missing copy.

## Current binding posture

- Current binding usage is intentionally minimal: only `[assets]` with the `ASSETS` binding.
- The Worker currently does **not** declare KV, D1, R2, Queues, Durable Objects, or AI bindings.
- Revisit this section when introducing new platform services so deploy reviews catch binding drift.

## Rollback and recovery

- Re-deploy the last known good bundle by checking out the previous commit and running
  `bun run deploy`.
- If the deploy failed before upload, keep the previous Worker version published and resolve the
  local build error first.

## Troubleshooting

- If Wrangler fails to find the bundle, re-run `bun run build` and confirm
  `dist/server/entry.mjs` and `dist/server/wrangler.json` exist.
- If Cloudflare preview or production returns `[object Object]`, confirm `bun run build` printed
  `Patched Cloudflare worker streaming mode` before previewing or deploying.
- If routes 404 in production but not locally, confirm the route is present in `src/pages` and
  that the adapter settings in `astro.config.mjs` match the deployment target.
- For Playwright failures in CI, see `docs/cloudflare-playwright.md` for Cloudflare Pages
  specifics.
