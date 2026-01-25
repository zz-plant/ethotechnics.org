# Workflow and checks

## Contribution workflow

- Work in small, reviewable changes; keep diffs focused on the stated task.
- Capture any new workflows, scripts, or conventions in the closest relevant README or AGENTS file.
- Keep `git status` clean before finishing; use it to confirm only intended files changed.

## Required checks

- Run `bun run check` before committing for code or mixed changes.
- Docs-only changes can skip `bun run check` per `docs/AGENTS.md`.
- If `bun run check` is intentionally skipped, call it out in the PR body.

## Validation tips

- Prefer `bun run lint` or targeted tests when a change only affects a narrow area, but still run
  `bun run check` before commit for non-docs work.
- Capture manual UI checks in the PR summary when visual changes are involved.
- Confirm Node and Bun versions are aligned before running scripts; see the root AGENTS guidance.
