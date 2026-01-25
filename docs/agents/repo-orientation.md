# Repository orientation

## What to read first

- Start with `README.md` for project context and update it if you change the top-level purpose.
- Check `docs/README.md` when adding or moving documentation so guidance lands in the right place.
- If your work is confined to a subfolder, check for a scoped `AGENTS.md` for local conventions.
- When changing docs, follow the tone and formatting notes in `docs/AGENTS.md`.

## Quick reference

- Find scoped agent guidance with `rg --files -g 'AGENTS.md'`.
- Package scripts live in `package.json`; use it to discover available checks or tasks.
- Deployment and runtime configuration lives in `astro.config.mjs` and `wrangler.toml`.
- Look for content and marketing copy in `src/content` and follow the guidance in
  `docs/adding-pages.md` and `docs/content-data.md` before editing page components.

## Structure highlights

- Route entry points live in `src/pages`.
- Content collections and authored copy live in `src/content`.
- Shared layouts and components live in `src/layouts` and `src/components`.
- Feature-specific modules live in `src/features`.
- Global styling and tokens live in `src/styles`; update theme-wide changes there instead of
  per-page overrides.
- Look for scoped `AGENTS.md` files under `src/` before changing UI components or routes.
