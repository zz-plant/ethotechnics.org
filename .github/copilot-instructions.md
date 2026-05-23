# ethotechnics.org — Copilot Instructions

Ethotechnics Studio — ethical technology and human-centered design. [ethotechnics.org](https://ethotechnics.org). Astro + Cloudflare Workers. Bun.

## Quick Commands

```bash
bun run dev       # Astro dev server
bun run build     # Production build
bun run lint      # ESLint
bun run check     # Default PR checks
bun run test      # Unit tests
bun run deploy    # Deploy to Cloudflare Workers
```

## Key Paths

- `src/pages/` — Astro routes
- `src/layouts/` — Shared layouts
- `src/components/` — UI components
- `src/styles/` — Global styles and tokens
- `docs/` — Contributor + architecture docs

## Conventions

- **Package manager:** Bun
- **Framework:** Astro 5
- **Linter:** ESLint (flat config)
- **Tests:** Bun test
- **Pre-commit:** Husky runs ESLint on staged files
- **Deploy:** Cloudflare Workers via wrangler
- **Commit style:** Conventional Commits

## Pre-Commit Rule

```bash
bun run check   # Run before pushing.
```
