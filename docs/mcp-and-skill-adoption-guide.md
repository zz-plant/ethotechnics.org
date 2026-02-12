# MCP and skill adoption guide

This guide now documents implemented MCP and skill upgrades for contributors and agent clients.

## Implemented in this repository

### New MCP tool: `validate_changed_files`

Purpose: classify changed files and return required/optional checks.

Behavior:

- Input: `files` array of paths relative to project root.
- Output: markdown check plan with:
  - file list,
  - required commands,
  - optional commands,
  - reasons for each recommendation.
- Safety: rejects path traversal attempts and keeps resolution project-root scoped.

Current check mapping:

- Docs-only changes (`docs/**`, `*.md`) → require `bun run format:check` and suggest
  `bun run check` as optional.
- Content JSON changes (`src/content/**/*.json`) → include `bun run validate:json`.
- Glossary-related changes (`*glossary*.json|.ts`) → include `bun run validate:glossary`.
- Code/script changes (`*.ts|tsx|astro|js|mjs|cjs`, `scripts/**`) → include `bun run check`.

### New MCP tool: `summarize_checks`

Purpose: convert raw command outcomes into PR-ready check bullets.

Behavior:

- Input: `checks` list of `{ command, exitCode, note? }`.
- Output: standardized summary lines using emoji status markers:
  - `✅` for success (`exitCode = 0`),
  - `⚠️` for warning (`exitCode = 2`),
  - `❌` for failure (all other non-zero codes).

### New MCP planning tools: `suggest_priority_features`, `audit_priority_sources`, `suggest_route_next_actions`

Purpose: expose roadmap and journey planning data as actionable guidance.

Behavior:

- `suggest_priority_features`
  - returns P0/P1 candidates from planning docs,
  - includes rationale and Issue/Spec metadata when available.
- `audit_priority_sources`
  - reports parser coverage for roadmap/journey sources,
  - lists sections missing required fields (for example `Problem` or `Issue link`).
- `suggest_route_next_actions`
  - accepts a route and maps it to a journey playbook,
  - returns next-step recommendations and route sequence guidance.

### New MCP discovery tool: `list_mcp_capabilities`

Purpose: list MCP tools and resources available in the repository server.

Behavior:

- Extracts registered `server.tool(...)` and `server.resource(...)` definitions.
- Returns a consolidated markdown inventory for onboarding and diagnostics.

### New skill: `docs-maintainer`

Path: `.agent/skills/docs-maintainer/SKILL.md`.

Purpose: enforce a consistent docs-only update workflow for agents.

Workflow includes:

1. route docs updates to the right section in `docs/README.md`,
2. apply scoped AGENTS instructions (`AGENTS.md` + `docs/AGENTS.md`),
3. run docs checks,
4. report exact command outcomes and skip reasons in PR notes.

## How to use these additions

## 1) Contributor/agent flow for docs-only changes

1. Run `validate_changed_files` with changed docs paths.
2. Execute required commands from the tool output.
3. Run `summarize_checks` on command outcomes.
4. Copy the generated summary into PR notes.

## 2) Contributor/agent flow for mixed changes

1. Run `validate_changed_files` for all changed files.
2. Execute the required full-check path (`bun run check`) when code/script changes are present.
3. Use `summarize_checks` for final reporting.
4. Use `list_mcp_capabilities` when planning work that depends on MCP capability availability.

## 3) Contributor/agent flow for planning tasks

1. Run `suggest_priority_features` to collect P0/P1 candidates from roadmap and journey docs.
2. Run `audit_priority_sources` to confirm parser coverage and identify doc drift.
3. For route-level UX planning, run `suggest_route_next_actions` with representative routes.

## 4) Skill routing

- Use `docs-maintainer` whenever the task is docs-only or docs-heavy.
- Chain with `qa` if documentation also changes implementation behavior.

## Why this matters for web-browsing agents

- Machine-readable API and metadata endpoints remain the discovery layer for external agents.
- MCP tools now improve internal contributor reliability by standardizing check decisions and
  reporting output.
- The docs-maintainer skill reduces workflow drift for repetitive documentation updates.
