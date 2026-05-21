# Architecture

How the site is structured and deployed so contributors can navigate the stack quickly.

## Site shell

- `src/layouts/BaseLayout.astro` wraps every page with SEO tags, fonts, and `src/styles/global.css`.
- The layout renders the skip link, `Navigation` component, and a focusable `<main>` target for
  keyboard users.
- `Navigation.astro` is server-rendered and keeps its DOM mounted between navigations.

## Project layout

- `src/pages` owns file-based routes; `src/layouts` keeps shared layout and metadata wiring.
- `src/components` groups reusable UI (navigation, footers, cards) used across pages.
- `src/features` houses larger feature slices, including the diagnostics tooling islands.
- `src/content` and `src/content.config.ts` define typed content sources and schemas.
- `src/styles` holds global styles and shared tokens; `public/` stores static assets copied as-is.
- `src/utils` centralizes shared helpers for formatting, metadata, and data transformations.

## Routing

- Astro's file-based routes live in `src/pages` with standard server-rendered navigation and no
  client transitions.

## Islands and hydration boundaries

- Most pages stay server-rendered. React islands are limited to diagnostics tooling:
  - `src/features/capacity-forecaster` hosts the charting flow used on
    `/diagnostics/capacity-forecaster`.
- Each island hydrates via `client:load` on its page; other components run without client bundles.

## Content modules

- `src/content` holds typed data for pages (home, research, library, glossary, and footer).
- Content modules export structured objects consumed by Astro pages and layouts instead of sourcing
  copy inline.
- Structured JSON content is validated by the JSON and glossary scripts described in
  [`content-data.md`](content-data.md).

## Middleware, headers, and redirects

- `src/middleware.ts` normalizes legacy `ethotechnics.com` hosts to `ethotechnics.org` with a 301
  redirect.
- The middleware appends security headers (HSTS, CSP, Referrer-Policy, X-Content-Type-Options, and
  Permissions-Policy) to every response, including redirects.

## Build outputs and assets

- Static assets from `public/` copy into the build output unchanged; Astro builds page HTML and
  island JavaScript into `dist/`.
- `/_astro/` and `/assets/` remain static so the Cloudflare Worker only handles HTML responses and
  middleware logic.

## Cloudflare adapter and deployment

- `astro.config.mjs` uses `@astrojs/cloudflare` with `output: "server"` and excludes `/_astro/*` and
  `/assets/*` from the server function so static assets bypass the Worker.
- `bun run build` emits the Worker entry at `dist/server/entry.mjs`, static assets in
  `dist/client`, and the generated deploy config at `dist/server/wrangler.json`.
- `patch:cf-worker` runs after `astro build` to force buffered Astro rendering in the generated
  Worker. This avoids Cloudflare Workers serializing Astro's Node-compatible async iterable body as
  `[object Object]` when `nodejs_compat` is enabled.
- `wrangler.toml` sets base Worker compatibility flags and asset binding settings; deploy with
  `bun run deploy` to publish the generated bundle via Wrangler.
