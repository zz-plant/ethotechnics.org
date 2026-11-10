# Agent playbooks

Detailed execution guides for AI contributors.

## Read what the task needs

Start with [`repo-orientation.md`](repo-orientation.md): it maps a change to the file to edit and
the command to run. Open another guide only when you reach its subject.

- [`workflow-and-checks.md`](workflow-and-checks.md): which checks are required and when they may
  be skipped. Read before committing.
- [`local-quirks.md`](local-quirks.md): failures that look like regressions and are not. Read when
  a check, the dev server, or an end-to-end test fails for no clear reason.
- [`version-control.md`](version-control.md): branch, commit subject, and pull request rules.
  Read before opening a pull request.
- [`coding-practices.md`](coding-practices.md): implementation expectations.
- [`formatting-and-tooling.md`](formatting-and-tooling.md): formatter and linter commands.
- [`review-checklist.md`](review-checklist.md): the pass before handoff.
- [`code-review-comment-patterns.md`](code-review-comment-patterns.md): recurring review themes.
- [`micro-diagram-language.md`](micro-diagram-language.md): what each shape and line means in a
  diagram.

## Ground rules

- Follow the closest `AGENTS.md` for any file you edit.
- Use Node.js 22 and Bun commands.
- Prefer links to canonical docs over restating long instructions.
