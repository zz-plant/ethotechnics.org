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
- Look for content and marketing copy in `src/pages` before adding new directories.

## Structure highlights

- Site content lives in `src/pages`.
- Shared layouts and components live in `src/layouts` and `src/components`.
- Global styling and tokens live in `src/styles`; update theme-wide changes there instead of
  per-page overrides.
- Look for scoped `AGENTS.md` files under `src/` before changing UI components or routes.
