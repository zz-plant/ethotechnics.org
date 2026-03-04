# Agent workflow and checks

Required execution flow for agent-authored changes.

## 1) Start of task

- Read repository and scoped `AGENTS.md` files.
- Confirm the relevant docs for the area you are editing.
- Keep scope narrow; avoid unrelated refactors.

## 2) During implementation

Run focused checks as you iterate:

- `bun run lint`.
- `bun run typecheck`.
- `bun run test:unit`.
- `bun run validate:json` when JSON/content schemas change.
- `bun run validate:glossary` for glossary updates.

## 3) Before commit

For code or mixed changes, run:

- `bun run check`.
- `bun run check:full` for release prep or periodic deep validation.

`bun run check` includes linting, type checks, Astro checks, JSON/glossary validation,
unit tests, external-link safety checks, heading-hierarchy checks, and `agent:doctor` preflight checks.
`agent:doctor` now also enforces research freshness for watchlisted standards pages
via `scripts/research-watchlist.json`.

When updating a watchlisted resource, always update `const lastUpdated = "YYYY-MM-DD"`
in the page frontmatter area so the automation can track staleness in agentic flows.

`bun run check:full` adds the SEO audit and coverage unit test run.

For docs-only changes:

- Run at least formatting checks (`bun run format:check` or equivalent file-scoped Prettier).
- `bun run check` may be skipped if no code behavior changed.
- Record the skip in commit/PR notes.

## 4) Finalization

- Ensure docs match current scripts and workflows.
- Summarize commands run and outcomes.
- Keep PR scope aligned to the request.
