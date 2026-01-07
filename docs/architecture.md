# Architecture

How the site is structured and deployed so contributors can navigate the stack quickly.

## Site shell

- `src/layouts/BaseLayout.astro` wraps every page with SEO tags, fonts, and `src/styles/global.css`.
- The layout renders the skip link, `Navigation` component, and a focusable `<main>` target for
  keyboard users.
- `Navigation.astro` is server-rendered and keeps its DOM mounted between navigations.

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

## Middleware, headers, and redirects

- `src/middleware.ts` normalizes legacy `ethotechnics.com` hosts to `ethotechnics.org` with a 301
  redirect.
- The middleware appends security headers (HSTS, CSP, Referrer-Policy, X-Content-Type-Options, and
  Permissions-Policy) to every response, including redirects.

## Cloudflare adapter and deployment

- `astro.config.mjs` uses `@astrojs/cloudflare` with `output: "server"` and excludes `/_astro/*` and
  `/assets/*` from the server function so static assets bypass the Worker.
- `npm run build` emits the Worker entry at `dist/_worker.js` plus static assets in `dist/`.
- `wrangler.toml` sets the Worker main script, compatibility flags, and binds `dist` as the assets
  bucket; deploy with `npm run deploy` to publish the bundle via Wrangler.
