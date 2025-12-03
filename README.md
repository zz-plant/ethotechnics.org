# ethotechnics.org

This repository powers [ethotechnics.org](https://ethotechnics.org), a content-driven site exploring ethical technology, human-centered design, and the sociotechnical systems that shape them. The project favors lean, fast-loading pages and clear storytelling.

## Getting started
1. Install dependencies: `npm install`
2. Run the dev server: `npm run dev`
3. Build the Worker bundle: `npm run build` (optionally preview with `npm run preview`).

## Checks before committing
Use `npm run check` for a full pre-commit sweep. It will run linting, tests, TypeScript checks, and Astro's checker (skipping any step that is not configured).
### Environment configuration
- Copy `.env.example` to `.env.local` for local development. Astro automatically loads `.env`, `.env.local`, and environment-specific files (such as `.env.development`).
- No environment variables are required today, but add new entries to `.env.example` if the project adopts external services.
## Quickstart for agents
- **Prerequisites:** Node.js 20+ with npm (project uses `package-lock.json`), Git, and a shell with `npm` on PATH.
- **Dev server:** `npm run dev`
  - Expected log snippet: `[@astrojs/compiler] ready` followed by `Local  http://localhost:4321/`.
- **Production check:** `npm run build && npm run preview`
  - Build output should include `Built in` timing lines and emit `dist/_worker.js`; preview logs start with `[@astrojs/preview] Server running` and the same localhost URL.
- If commands are slow or fail, confirm Node version with `node -v` and reinstall dependencies via `rm -rf node_modules && npm install`.

## Deployment to Cloudflare Workers
The site uses the official Cloudflare adapter for Astro to produce a Worker-compatible server build.

1. Ensure the adapter is installed (`@astrojs/cloudflare`) and configured in `astro.config.mjs` with `output: "server"`.
2. Build the Worker bundle: `npm run build`. The generated Worker entry is emitted to `dist/_worker.js`.
3. Deploy with Wrangler: `npx wrangler deploy ./dist/_worker.js --name ethotechnics --compatibility-date=$(date +%Y-%m-%d)`.
4. Configure DNS for `ethotechnics.org` to point to the Cloudflare Worker route you set in Wrangler.

## Tech stack
- [Astro 5](https://astro.build) with strict TypeScript defaults
- React island for the navigation, hydrated on load
- Cloudflare Worker adapter for server output
- Modern, responsive styling with a focus on accessibility and contrast

## Where things live
- `src/pages`: Astro routes, starting with [`src/pages/index.mdx`](src/pages/index.mdx) for the homepage content.
- `src/layouts`: Shared layouts such as [`src/layouts/BaseLayout.astro`](src/layouts/BaseLayout.astro), which wires global SEO, fonts, and the navigation shell.
- `src/components`: Interactive islands like the navigation React component in [`src/components/Navigation.tsx`](src/components/Navigation.tsx).
- `src/styles`: Global styles and theme tokens defined in [`src/styles/global.css`](src/styles/global.css).
