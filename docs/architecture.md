# Architecture

How the site is structured and deployed so contributors can navigate the stack quickly.

## Site shell

- `src/layouts/BaseLayout.astro` wraps every page with SEO tags, fonts, and `src/styles/global.css`.
- The layout renders the skip link, `Navigation` component, and a focus helper that listens for
  `astro:after-swap` to keep the main content reachable after transitions.
- `Navigation.astro` is server-rendered and keeps its DOM mounted with
  `data-astro-transition-persist` so menus stay stable across page swaps.

## Routing and transitions

- Astro's file-based routes live in `src/pages`, with `astro.config.mjs` enabling
  `viewTransitions: true`.
- `<ClientRouter fallback="swap" />` in `BaseLayout` lets navigation reuse the current DOM while
  applying view transitions; routing falls back to a full swap when needed.

## Islands and hydration boundaries

- Most pages stay server-rendered. React islands are limited to diagnostics tooling:
  - `src/components/DiagnosticsSnapshot.tsx` powers the `/diagnostics/ssr` refreshable panel.
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
