# Developer experience checklist for agents

This file summarizes agent-facing references so onboarding stays short and consistent.

## Current agent references

- Project context, commands, and contributor expectations live in
  [README.md](../README.md), especially [Quick start](../README.md#quick-start),
  [Common scripts](../README.md#common-scripts), [Testing](../README.md#testing), and
  [Contributing](../README.md#contributing).
- Docs-specific expectations live in [`docs/AGENTS.md`](./AGENTS.md).
- The docs map and when to add guidance live in [`docs/README.md`](./README.md).
- The roadmap, spec template, and pickup guidance live in [`docs/roadmap.md`](./roadmap.md).
- Repository-wide expectations live in [`AGENTS.md`](../AGENTS.md).
- File-level conventions live with the code in
  [`src/AGENTS.md`](../src/AGENTS.md),
  [`src/pages/AGENTS.md`](../src/pages/AGENTS.md), and
  [`src/components/AGENTS.md`](../src/components/AGENTS.md).
- Environment configuration, including `.env` loading, is covered in
  [README.md#environment-configuration](../README.md#environment-configuration).
- Playwright browser download troubleshooting sits near the
  [README.md#testing](../README.md#testing) e2e instructions.

## Agent workflow reminders

- Use the pinned toolchain: `nvm use` for Node 20 and Bun for all scripts.
- Run `bun run check` for code or mixed changes. Docs-only updates can skip it but note the skip
  in the PR body.
- Format docs with `bunx prettier --write docs/*.md` before committing.
- Keep changes small, readable, and scoped to the task.

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

## Picking work

- Start with the roadmap/specs hub in
  [`docs/page-specifications.md`](./page-specifications.md) for the current priority list.
- Prefer items marked “Now” or labeled “good first issue” when you want a bounded, high-confidence
  starting point.
- If multiple items are viable, pick the one with the clearest acceptance notes and required files.

## Editor and IDE helpers

- Workspace recommendations for VS Code live in `.vscode/extensions.json`; install them to pick up
  Astro IntelliSense, ESLint, and Prettier support.
- `.vscode/settings.json` pins format-on-save behavior and uses the workspace TypeScript version so
  diagnostics match the scripts in `package.json`.

## MCP integration

If your environment supports [Model Context Protocol](https://modelcontextprotocol.io), enable the
project MCP server for structured access to project context:

```bash
bun run mcp
```

### Available resources

| URI                         | Description                  |
| --------------------------- | ---------------------------- |
| `project://structure`       | Project layout and key paths |
| `project://scripts`         | Package.json scripts         |
| `project://agents-guidance` | Aggregated AGENTS.md content |
| `agent://onboarding`       | Agent Quick Start & Mission  |
| `docs://index`              | Documentation listing        |

### Available prompts

| Name              | Purpose                     |
| ----------------- | --------------------------- |
| `design-engineer` | Design-engineer mode prompt |
| `code-review`     | Code review template        |
| `new-component`   | Astro component scaffolding |

### Key tools

| Tool                     | Description                |
| ------------------------ | -------------------------- |
| `list_available_scripts` | Package.json scripts       |
| `get_component_list`     | Astro components in src/   |
| `read_docs`              | Read documentation files   |
| `run_check\`              | Execute full project check |
| \`get_repo_map\`           | Birds-eye view of folders    |
| `list_workflows`         | Agent skill definitions     |

## Agent skills

Modular capabilities live in `.agent/skills/`:

- **fix-types** — resolve TypeScript errors
- **qa** — run full QA suite
- **ui-verify** — browser-based verification
- **design-engineer** — maintain premium design standards

## Improvements still needed

- None noted.
