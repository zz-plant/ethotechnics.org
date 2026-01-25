# AGENTS

Scope: applies to the entire repository unless a more specific `AGENTS.md` overrides it.

## Purpose

This repo powers ethotechnics.org, a content-driven site about ethical technology and
human-centered design. These instructions exist to keep contributions consistent, reliable,
and easy to review.

## Working agreement (best practices)

- **Follow scope and precedence:** obey the closest `AGENTS.md` to the files you touch, with
  deeper scopes taking priority.
- **Keep instructions actionable:** prefer short, imperative bullets over long paragraphs.
- **Avoid duplication:** link to deeper docs instead of restating them.
- **Record what you ran:** mention tests/checks (or why they were skipped) in your summary.

## Essentials

- Package manager: **Bun** (do not use npm or yarn).
- Use Node.js 20.x via `nvm use` before installing dependencies or running scripts.
- Run `bun run check` before committing for code or mixed changes.
- Check for scoped `AGENTS.md` files in subfolders before editing.

## Where to look next

- Repository orientation: `docs/agents/repo-orientation.md`
- Workflow and required checks: `docs/agents/workflow-and-checks.md`
- Formatting and tooling: `docs/agents/formatting-and-tooling.md`
- Coding practices: `docs/agents/coding-practices.md`
- Version control: `docs/agents/version-control.md`
- Review checklist: `docs/agents/review-checklist.md`
- Suggested docs structure: `docs/agents/docs-structure.md`
