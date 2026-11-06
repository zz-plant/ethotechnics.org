# Agent review checklist

Use this before final handoff.

## Scope and intent

- Change matches the requested task.
- No unrelated refactors slipped into the diff.
- New or moved docs are reflected in docs indices.

## Correctness and quality

- Commands in docs match `package.json` scripts.
- Technical claims are consistent with current project behavior.
- Contributor and agent guidance do not conflict.
- External links with `target="_blank"` include `rel="noopener noreferrer"`.
- New headings keep a logical hierarchy with no skipped levels.
- TypeScript changes avoid unneeded assertions and dead fallback branches.
- New or renamed files follow repository naming conventions.

## Validation

- Required checks were run for code or mixed changes (`bun run check`).
- Docs-only changes include formatting verification.
- Skipped checks are explicitly called out with reason.

## Delivery quality

- PR title passes `bun run check:commit-message --message "<title>"`; it becomes the subject on
  `main`.
- PR description fills the template's sections and reads as a commit body
  ([`version-control.md`](version-control.md)).
