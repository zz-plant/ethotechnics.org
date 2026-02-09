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

## Validation

- Required checks were run for code or mixed changes (`bun run check`).
- Docs-only changes include formatting verification.
- Skipped checks are explicitly called out with reason.

## Delivery quality

- Commit message is clear and scoped.
- PR summary explains what changed, why, and how it was validated.
- Follow-up work or known limitations are noted when applicable.
