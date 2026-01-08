# AGENTS

This repository is small, so keep guidance concise and easy to follow.

## Purpose
- Capture lightweight instructions so an agent can onboard quickly.
- Keep edits focused and easy to review.

## What to read first
- Start with `README.md` for project context and update it if you change the top-level purpose.
- Check `docs/README.md` when adding or moving documentation so guidance lands in the right place.
- If your work is confined to a subfolder, check for a scoped `AGENTS.md` for local conventions.

## Contribution workflow
- Work in small, reviewable changes; keep diffs focused on the stated task.
- Prefer clear Markdown for documentation and comments; avoid unnecessary boilerplate.
- Use the pinned Node.js 20.x toolchain (`nvm use`) before installing dependencies or running scripts.

## Formatting and tooling
- Use Bun (respecting `bun.lock`); do not use npm or yarn.
- Format Markdown and code with Prettier defaults (`bunx prettier --write`), matching existing quoting/spacing.
- Lean on built-in Astro and TypeScript strictness; do not introduce new linting/formatting stacks without need.

## Required checks
- Run `bun run check` before committing for code or mixed changes; follow `docs/AGENTS.md` for
  docs-only edits.
- If `bun run check` is intentionally skipped (for example, a docs-only change that does not
  touch code), call it out in the PR body.

## Quick review checklist
- Is the change scoped to the smallest sensible set of files and updated docs where readers expect them?
- Did you run the required checks and keep the repository clean (`git status`) before finishing?
- Are new conventions captured in the relevant `AGENTS.md` (or README) to keep guidance localized?

## Coding practices
- Keep functions and files short and readable; remove dead or duplicate code.
- Maintain consistent naming and formatting; prefer standard tools over custom helpers when possible.
- Add or update tests/checks when behavior changes; document how to run them if non-obvious.

## Version control
- Write meaningful commit messages that describe the change.
- Ensure the repository is clean (`git status`) before finishing a task.
