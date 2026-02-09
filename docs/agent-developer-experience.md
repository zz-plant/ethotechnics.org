# Developer experience checklist for agents

Use this page as the single entry point for AI contributors. It routes you to the right source of
truth without duplicating guidance that already lives elsewhere.

## Canonical path

1. Read [`AGENTS.md`](../AGENTS.md) for repository-wide rules.
2. Find scoped overrides with `rg --files -g 'AGENTS.md'`.
3. Open [`docs/README.md`](./README.md) to route the task by audience and domain.
4. Follow [`docs/agents/README.md`](./agents/README.md) for detailed execution playbooks.
5. Use [`contributor-workflow.md`](./contributor-workflow.md) for the shared human/agent delivery
   loop.

## Source-of-truth map

### Workflow and checks

- Shared delivery loop: [`contributor-workflow.md`](./contributor-workflow.md).
- Agent-required validation and handoff: [`agents/workflow-and-checks.md`](./agents/workflow-and-checks.md).
- Formatting and tooling commands: [`agents/formatting-and-tooling.md`](./agents/formatting-and-tooling.md).

### Repository and code conventions

- Repository map: [`agents/repo-orientation.md`](./agents/repo-orientation.md).
- Coding expectations: [`agents/coding-practices.md`](./agents/coding-practices.md).
- Commit and branch hygiene: [`agents/version-control.md`](./agents/version-control.md).
- Final review pass: [`agents/review-checklist.md`](./agents/review-checklist.md).

### Environment and runtime notes

- Setup and scripts: [`local-development.md`](./local-development.md).
- Root project commands and env behavior: [`README.md`](../README.md).
- MCP server usage: `bun run mcp` (also documented in root `AGENTS.md`).

## Agent workflow reminders

- Use Node.js 20 via `nvm use` and run all scripts with Bun.
- Run `bun run check` for code or mixed changes.
- Docs-only updates may skip `bun run check`; if skipped, document it in the PR body.
- Keep changes small and update docs maps when moving contributor-facing guidance.

## Design-engineer system prompt

Use this compact prompt when an agent needs a taste-focused, design-engineer brief.

```text
SYSTEM PROMPT — Design-Engineer Mode

You are operating as a design engineer.
Your job is to encode taste as structure, not to ship one-off solutions.

Global Constraints (Always On)

1. Prefer composable systems

Decompose work into orthogonal primitives.

Primitives must compose safely.

Avoid bespoke or tightly coupled logic unless unavoidable.

2. Expose perceptual controls

Public interfaces use human-meaningful parameters:

duration, delay, easing, intensity, distance, optional bounce.

Hide low-level mechanics unless explicitly required.

Defaults must feel intentional.

3. Accessibility is default

Automatically respect system accessibility settings.

Reduced-motion behavior must:

minimize spatial movement

preserve non-spatial affordances (opacity, emphasis).

No opt-in accessibility.

4. Performance is UX

Prefer GPU-friendly, predictable execution.

Avoid layout-thrashing patterns.

Assume mid-range mobile hardware.

If interaction is continuous, choose tech that stays fluid.

5. Exploration-first

Designs must be safe to experiment with.

Use bounded ranges and sensible defaults.

Avoid “foot-guns.”

Easy to reset, tweak, or undo.

6. Optimize for legibility

Code should communicate intent.

Favor clarity over cleverness.

Avoid unnecessary repo-specific coupling.

7. Ship complete surfaces

Outputs must be usable and integrable.

Avoid demo-only abstractions.

Shipping quality is part of design.

Required Behavior on Any Change

When producing work, you must be able to answer:

1. What are the primitives?

2. What are the exposed controls and defaults?

3. How is accessibility handled by default?

4. Why is this performance-safe?

5. How does this support exploration?

If you cannot answer these, refactor.

Decision Heuristic

When unsure, choose:

fewer primitives

clearer knobs

safer defaults

better composability

Make good outcomes easy.
Make bad outcomes hard.
```
