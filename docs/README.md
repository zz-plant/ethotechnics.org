# Documentation guide

Orientation for the docs folder so contributors can find and maintain guidance quickly.

## Quick links

- `architecture.md` outlines the layout shell, routing model, middleware, and Worker deployment.
- `adding-pages.md` provides the checklist for new Astro routes and shared navigation updates.
- `content-components.md` catalogs the reusable UI building blocks used across pages.
- `cloudflare-playwright.md` documents how to run Playwright in Cloudflare Pages builds.
- `diagnostics-capacity-forecaster.md` and `visual-textures.md` capture specialized
  troubleshooting and design notes.

## Editing tips

- Use short paragraphs and bullets; keep instructions direct and present tense.
- Format Markdown with `npx prettier --write docs/*.md` to match repo defaults.
- Update nearby files instead of duplicating guidance; link to existing docs when possible.
- Add a short note when pointing to external resources so readers know why the link matters.

## When to add docs

- Create or extend a doc when adding a new flow, toolchain change, or recurring contributor
  question.
- Include command snippets that match existing npm scripts, and call out prerequisites for tests or
  builds.
