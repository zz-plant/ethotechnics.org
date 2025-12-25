# ethotechnics.org

This repository powers [ethotechnics.org](https://ethotechnics.org), a content-driven site exploring ethical technology, human-centered design, and the sociotechnical systems that shape them. The project favors lean, fast-loading pages and clear storytelling.

## Getting started

Use Node.js 20.x (the repo ships an `.nvmrc` file and matching `engines` in `package.json` to keep builds consistent).

1. Install dependencies: `npm install`
2. Run the dev server: `npm run dev`
3. Build the Worker bundle: `npm run build` (optionally preview with `npm run preview`).
4. For deeper setup and troubleshooting tips, see [`docs/local-development.md`](docs/local-development.md).

## Checks before committing

Use `npm run check` for a full pre-commit sweep. It will run linting, tests, TypeScript checks, and Astro's checker (skipping any step that is not configured).

- `npm run lint` checks Astro and TypeScript sources under `src/`; it runs first inside `npm run check`.

## Security headers

Requests pass through `src/middleware.ts`, which normalizes legacy ethotechnics.com hosts and appends a hardened header set to every response:

- **HSTS** (`Strict-Transport-Security`): one-year max age with subdomains and preload to enforce HTTPS everywhere.
- **Content-Security-Policy:** locks content to `self`, blocks frames and plug-ins, allows inline styles for existing design tokens, and permits images from the site, `https:` origins, or `data:` URLs.
- **Referrer-Policy:** `no-referrer` to avoid leaking navigation history.
- **X-Content-Type-Options:** `nosniff` to disable MIME-type sniffing.
- **Permissions-Policy:** disables camera, geolocation, microphone, and payment features.

## Testing

- After installing dependencies (`npm install`), run `npx playwright install --with-deps` to install the browsers required by the
  end-to-end suite.
  - If the install complains about missing system libraries, rerun the command with `--with-deps` (it pulls the Linux packages
    Playwright needs) and retry the suite.
- If Playwright browser downloads fail:
  - Reuse cached downloads with `PLAYWRIGHT_BROWSERS_PATH=~/.cache/playwright` to avoid fetching large archives again; rerun
    `npx playwright install --with-deps` after setting the variable.
  - Confirm proxies or firewalls are not blocking `https://playwright.azureedge.net` (the default download host) and retry once
    access is open.
  - Point to an alternative mirror via `PLAYWRIGHT_DOWNLOAD_HOST=https://your-mirror.example.com` when corporate networks block
    the default host.
- `npm run e2e` builds the Worker bundle and runs Playwright against `npm run preview`.
- Override the preview target with `PLAYWRIGHT_BASE_URL` (defaults to `http://127.0.0.1:4321`).
- Cloudflare Pages can run the suite using `CF_PAGES_URL`; enable testing in the dashboard to
  execute Playwright after the Worker build instead of GitHub Actions.

### Unit and component tests (Vitest)

- `npm test` runs Vitest in watch mode. Expect green checkmarks per suite and a summary such as `Test Files  3 passed` and `Tests  7 passed` when everything succeeds.
- Component rendering tests use the experimental Astro container (`src/test/astro-container.ts`) and run under Node with jsdom helpers, so no browser is required.
- CI uses `npm run test:ci` to execute once with coverage; mirror this locally to see the coverage table emitted at the end of the run.

### Environment configuration

- Copy `.env.example` to `.env.local` for local development. Astro automatically loads `.env`, `.env.local`, and environment-specific files (such as `.env.development`).
- No environment variables are required today, but add new entries to `.env.example` if the project adopts external services.

## Quickstart for agents

- **Prerequisites:** Node.js 20+ with npm (project uses `package-lock.json`), Git, and a shell with `npm` on PATH.
- **Node version:** Run `nvm use` to align with the pinned 20.x toolchain before installing dependencies.
- **Dev server:** `npm run dev`
  - Expected log snippet: `[@astrojs/compiler] ready` followed by `Local  http://localhost:4321/`.
  - Server binds to `0.0.0.0` on port `4321` so forwarded connections from tools (e.g., browsers for screenshots)
    work without extra flags.
- **Production check:** `npm run build && npm run preview`
  - Build output should include `Built in` timing lines and emit `dist/_worker.js`; preview logs start with `[@astrojs/preview] Server running` and the same localhost URL.
- If commands are slow or fail, confirm Node version with `node -v` and reinstall dependencies via `rm -rf node_modules && npm install`.

## Deployment to Cloudflare Workers

The site uses the official Cloudflare adapter for Astro to produce a Worker-compatible server build.

`wrangler.toml` captures the Worker name, compatibility date, and entrypoint (`dist/_worker.js`). Session storage is not enabled by default; if you add it later, define the KV binding in `wrangler.toml` before deploying.

1. Ensure the adapter is installed (`@astrojs/cloudflare`) and configured in `astro.config.mjs` with `output: "server"`.
2. The Cloudflare adapter is configured to use Cloudflare's image service and to exclude static assets (`/_astro/*`, `/assets/*`) from the server function so they can be served directly via the assets binding.
3. Build the Worker bundle: `npm run build`. The generated Worker entry is emitted to `dist/_worker.js`.
4. Deploy with Wrangler using the repo defaults: `npm run deploy`.
   - The build copies `.assetsignore` from `public/` to `dist/` so Wrangler skips `_worker.js` and
     `_routes.json` when uploading static assets.
5. Configure DNS for `ethotechnics.org` to point to the Cloudflare Worker route you set in Wrangler.

## Tech stack

- [Astro 5](https://astro.build) with strict TypeScript defaults
- Astro-powered navigation with a lightweight inline script
- Cloudflare Worker adapter for server output
- Modern, responsive styling with a focus on accessibility and contrast

## Architecture overview

- Read [`docs/architecture.md`](docs/architecture.md) for the layout shell, routing approach, and
  deployment flow.

## Documentation map

- Start with [`docs/README.md`](docs/README.md) for how the docs folder is organized, when to add a
  new guide, and formatting expectations.
- [`docs/architecture.md`](docs/architecture.md) covers the rendering model, middleware, and
  Cloudflare Worker deployment. Update it when routing, layouts, or adapters change.
- [`docs/adding-pages.md`](docs/adding-pages.md) walks through creating new Astro routes without
  breaking shared navigation and metadata. Use it as the checklist for new content.
- [`docs/content-components.md`](docs/content-components.md) catalogs the page intro, section
  blocks, cards, and other building blocks reused across routes. Extend it when adding shared UI.
- [`docs/cloudflare-playwright.md`](docs/cloudflare-playwright.md) captures how to run the
  Playwright suite on Cloudflare Pages after the Worker build completes and how to surface test
  results in that environment.

## Staying updated

- Subscribe to the RSS feed at [`/rss.xml`](https://ethotechnics.org/rss.xml) to catch new pages and updates as they ship.

## Where things live

- `src/pages`: Astro routes, starting with [`src/pages/index.astro`](src/pages/index.astro) for the homepage content.
- `src/layouts`: Shared layouts such as [`src/layouts/BaseLayout.astro`](src/layouts/BaseLayout.astro), which wires global SEO, fonts, and the navigation shell.
- `src/components`: Interactive islands and shared UI components such as the navigation in [`src/components/Navigation.astro`](src/components/Navigation.astro).
- `src/styles`: Global styles and theme tokens defined in [`src/styles/global.css`](src/styles/global.css).

### Adding new pages

- Follow the checklist in [`docs/adding-pages.md`](docs/adding-pages.md) for layout imports, shared components, navigation updates, and the `npm run check` command to run before sending a PR.
