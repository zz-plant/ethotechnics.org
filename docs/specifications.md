# Specifications

High-level reference for the site’s purpose, structure, and delivery flow.

## Site purpose

- Content-first site on ethical technology and sociotechnical systems.
- Optimized for readability, fast loads, and minimal client JavaScript.

## Architecture snapshot

- See [Architecture](architecture.md) for the layout shell, navigation, and adapters.
- Astro 5 with TypeScript strictness and Cloudflare Worker output.
- `src/layouts/BaseLayout.astro` wraps pages with shared SEO, styles, and navigation.

## Routing and navigation

- File-based routing under `src/pages`; follow [Adding pages](adding-pages.md) when extending.
- Navigation renders on the server without view transitions, relying on native page loads and the
  skip link for focus management.

## Middleware and security

- `src/middleware.ts` normalizes legacy hosts and enforces security headers (HSTS, CSP,
  Referrer-Policy, X-Content-Type-Options, Permissions-Policy) on every response.
- Keep header updates centralized in middleware and mirror any new redirects there.

## Delivery and discovery

- Cloudflare adapter excludes static asset routes (`/_astro/*`, `/assets/*`) from the Worker so assets serve directly from the binding.
- Sitemap and robots.txt are generated via Astro integrations; keep the canonical site URL in `astro.config.mjs` in sync with deployments.
- RSS feed at `/rss.xml` uses cached responses (`Cache-Control: public, max-age=3600`) and falls back to `https://ethotechnics.org` when the runtime origin is missing.

## Build and performance defaults

- Server output targets Cloudflare Workers and binds the dev server to `0.0.0.0:4321` for forwarded connections.
- Vite uses Lightning CSS and esbuild for minification with compressed size reporting disabled to keep builds fast.
- Session storage defaults to the in-memory driver; revisit before adding authenticated or persistent flows.

## Feature islands

- Most routes render server-only; islands are limited to diagnostics tooling.
- `src/features/capacity-forecaster` powers the charting flow documented in
  [Diagnostics capacity forecaster](diagnostics-capacity-forecaster.md).

## Content model

- Structured content lives in `src/content` modules (home, research, library, glossary, footer) and
  feeds Astro pages rather than inline copy.
- Add new content types as typed exports to keep pages thin and reusable.

## Testing commands

- `bun run check`: lint, type-check, tests, and Astro diagnostics; run before committing.
- `bun test` or `bun run test:unit:ci`: Bun test suites (watch or single pass with coverage).
- `bun run test:e2e`: build then execute Playwright against the preview server; install browsers
  via `bunx playwright install --with-deps` first.

## Deployment flow

- `bun run build` emits the Worker bundle at `dist/_worker.js` plus static assets in `dist/`
  (see [Architecture](architecture.md) for adapter details).
- Deploy to Cloudflare Workers with `bun run deploy`; `wrangler.toml` carries the Worker settings
  and assets binding.
