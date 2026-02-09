# Agent guidance

This folder is the implementation detail for agent-facing workflows. Treat
`docs/agent-developer-experience.md` as the onboarding index, then use this folder for
step-by-step execution details.

## Information architecture

- **Entry point:** `../agent-developer-experience.md` (what to read, in what order).
- **Execution playbooks:** files in this folder (how to perform work).
- **Global constraints:** root `AGENTS.md` and scoped `AGENTS.md` files.
- **Docs conventions:** `../AGENTS.md` and `../README.md`.

## Quick start

1. Run `rg --files -g 'AGENTS.md'` to locate scoped instructions.
2. Read `repo-orientation.md` to map the affected directories.
3. Follow `workflow-and-checks.md` for required validation and commit flow.
4. Use `formatting-and-tooling.md` and `coding-practices.md` while editing.
5. Finish with `review-checklist.md` before opening a PR.

## Contents

- `repo-orientation.md`: where to look first and which folders matter.
- `workflow-and-checks.md`: contribution flow and required checks.
- `formatting-and-tooling.md`: formatting conventions and tooling notes.
- `coding-practices.md`: expectations for code changes.
- `version-control.md`: commit and status hygiene.
- `review-checklist.md`: final verification before handoff.
- `docs-structure.md`: target docs information architecture and ownership boundaries.
