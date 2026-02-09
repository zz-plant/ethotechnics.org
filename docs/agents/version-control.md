# Agent version control guidance

Keep Git history readable, traceable, and easy to review.

## Branch and scope hygiene

- Keep each branch focused on one primary objective.
- Avoid mixing drive-by refactors with the requested change.
- If a rename/move is required, note it clearly in the PR summary.

## Commit quality

- Commit after checks pass (or with explicit documented skip for docs-only work).
- Use clear imperative commit messages.
- Keep commits coherent; split unrelated edits.

## Suggested commit message pattern

- `<area>: <short imperative summary>`

Examples:

- `docs: modernize contributor and agent workflow guides`
- `content: update glossary references for diagnostics page`

## Pull request quality

- Summarize what changed and why.
- Include commands run and outcomes.
- Explicitly list skipped checks and rationale.
- Link to related issues or planning docs when relevant.
