# AGENTS

Scope: applies to the entire repository unless a more specific `AGENTS.md` overrides it.

## Purpose

This repo powers ethotechnics.org: open standards, scored public failures, and diagnostics for
keeping automated decision systems stoppable, explainable, and appealable. Follow these
instructions to keep changes consistent and reviewable.

## Public copy voice

The reference voice is `src/content/casebook.ts` and `src/content/method.ts`. Match it.

- Short declarative sentences, one idea each. Name the institution, the date, the number.
- Claim only what a page, tool, or inbox actually does. No schedules, response times, or
  services that are not staffed; no "received" for a message nobody stores.
- No selling: avoid "actionable", "stakeholder-ready", "unlock", "empower", "powerful",
  "seamless", "comprehensive", "quick", "simply", "just", "easily".
- Name who a thing is for (the risk owner, a regulator, the person the system decided about),
  not "stakeholders".
- Sentence case for labels. American spelling.
- The theory essays reject "empowerment" and "human-centered design" as framings; don't
  reintroduce them in page copy.

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
