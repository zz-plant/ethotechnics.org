# Documentation guide

Orientation for the docs folder so contributors can find and maintain guidance quickly.

Use this map before adding new guidance so information stays discoverable and current.

## Quick links

- [`roadmap.md`](roadmap.md) tracks the now/next/later roadmap, spec template, and pickup guidance.
- [`issue-templates.md`](issue-templates.md) defines the consistent fields for roadmap-related GitHub
  Issues.
- [`architecture.md`](architecture.md) outlines the layout shell, routing model, middleware, and Worker deployment.
- [`adding-pages.md`](adding-pages.md) provides the checklist for new Astro routes and shared navigation updates.
- [`content-components.md`](content-components.md) catalogs the reusable UI building blocks used across pages.
- [`cloudflare-playwright.md`](cloudflare-playwright.md) documents how to run Playwright in Cloudflare Pages builds and where
  test results show up.
- [`local-development.md`](local-development.md) captures setup, dev server tips, and how to preview builds locally.
- [`agent-developer-experience.md`](agent-developer-experience.md) aggregates agent-specific references and to-do items.
- [`diagnostics-capacity-forecaster.md`](diagnostics-capacity-forecaster.md) and [`visual-textures.md`](visual-textures.md) capture specialized troubleshooting
  and design notes.
- [`page-specifications.md`](page-specifications.md) lists route-by-route expectations for data, layout, and accessibility.

## How to add or update docs

- Check whether related guidance already exists before creating a new file.
- Mirror existing naming and structure; prefer short, topic-focused files.
- Include the command or script name when describing required checks.
- Link out to relevant guides instead of repeating long explanations.
- Add a brief note about context or prerequisites when linking external resources.
- Refresh the Quick links list and related maps when docs move or retire so navigation stays
  accurate.

## Editing tips

- Use short paragraphs and bullets; keep instructions direct and present tense.
- Format Markdown with `bunx prettier --write docs/*.md` to match repo defaults.
- Update nearby files instead of duplicating guidance; link to existing docs when possible.
- Add a short note when pointing to external resources so readers know why the link matters.
- Keep line wraps near 100 characters to stay readable in diffs.

## When to add docs

- Create or extend a doc when adding a new flow, toolchain change, or recurring contributor
  question.
- Include command snippets that match existing Bun scripts, and call out prerequisites for tests or
  builds.
- Add a short changelog-style note in PR descriptions when significant docs shift where people look
  for information.
