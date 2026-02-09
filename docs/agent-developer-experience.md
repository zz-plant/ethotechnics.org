# Agent developer experience

Primary onboarding document for AI contributors.

## Canonical startup sequence

1. Read repository-wide instructions in [`../AGENTS.md`](../AGENTS.md).
2. Discover scoped overrides with `rg --files -g 'AGENTS.md'`.
3. Use [`README.md`](README.md) to route to the right docs area.
4. Follow [`agents/README.md`](agents/README.md) for execution playbooks.
5. Use [`contributor-workflow.md`](contributor-workflow.md) for the shared delivery loop.

## Operational defaults

- Runtime: Node.js 20 via `nvm use`.
- Package manager and scripts: Bun only.
- Required validation for code or mixed changes: `bun run check`.
- Docs-only changes may skip `bun run check`, but must include that skip in PR notes.

## Source-of-truth map

### Workflow and checks

- [`contributor-workflow.md`](contributor-workflow.md)
- [`agents/workflow-and-checks.md`](agents/workflow-and-checks.md)
- [`agents/review-checklist.md`](agents/review-checklist.md)

### Code and repository conventions

- [`agents/repo-orientation.md`](agents/repo-orientation.md)
- [`agents/coding-practices.md`](agents/coding-practices.md)
- [`agents/version-control.md`](agents/version-control.md)
- [`agents/formatting-and-tooling.md`](agents/formatting-and-tooling.md)

### Environment and tooling references

- [`local-development.md`](local-development.md)
- [`../README.md`](../README.md)
- MCP server command: `bun run mcp`

## Handoff expectations

- Keep diffs focused and scoped to one intent when practical.
- Record exactly which checks were run.
- Call out skipped checks with reason.
- Update docs indices when contributor-facing docs move.
