# ethotechnics.org

This repository powers [ethotechnics.org](https://ethotechnics.org), a content-driven site exploring ethical technology, human-centered design, and the sociotechnical systems that shape them. The project favors lean, fast-loading pages and clear storytelling.

## Getting started
1. Install dependencies: `npm install`
2. Run the dev server: `npm run dev`
3. Build the Worker bundle: `npm run build` (optionally preview with `npm run preview`).

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
