# AGENTS

Scope: applies to the entire repository unless a more specific `AGENTS.md` overrides it.

## Purpose

This repo powers ethotechnics.org, a content-driven site about ethical technology and
human-centered design. Follow these instructions to keep changes consistent and reviewable.

## Essentials

- Package manager and script runner: **Bun**.
- Runtime baseline: **Node.js 22.x** (`nvm use`).
- Run `bun run check` before committing code or mixed changes.
- Discover scoped overrides before editing: `rg --files -g 'AGENTS.md'`.

## Working agreement

- Follow scope precedence (nearest `AGENTS.md` wins).
- Keep instructions short, actionable, and linked to canonical docs.
- Record exactly which checks you ran and their outcomes.
- Keep changes focused; avoid unrelated cleanup in task branches.

## Tool-supported agents (MCP)

Start MCP support with `bun run mcp` when your client supports Model Context Protocol.

Available capabilities:

- **Resources:** project structure, docs index, AGENTS guidance.
- **Prompts:** design-engineer mode and review templates.
- **Tools:** script discovery, docs access, build analysis, checks.

## Agent skills

Skill modules are in `.agent/skills/`:

- `fix-types` — resolve TypeScript issues.
- `qa` — run full quality validation workflows.
- `ui-verify` — browser-based UI verification.
- `design-engineer` — visual system and taste alignment.
- `docs-maintainer` — docs placement, checks, and PR-ready reporting.
- `seo-maintainer` — metadata, indexing, and discoverability improvements.
- `glossary-curator` — glossary quality, taxonomy, and cross-linking.
- `refactor-hygiene` — safe cleanup and maintainability-oriented refactors.

## Canonical references

- Repository orientation: `docs/agents/repo-orientation.md`
- Workflow and required checks: `docs/agents/workflow-and-checks.md`
- Formatting and tooling: `docs/agents/formatting-and-tooling.md`
- Coding practices: `docs/agents/coding-practices.md`
- Version control: `docs/agents/version-control.md`
- Review checklist: `docs/agents/review-checklist.md`
- Docs structure: `docs/agents/docs-structure.md`
