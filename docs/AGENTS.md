# AGENTS — docs/

Scope: applies to documentation under `docs/`.

## Formatting and tone
- Keep Markdown instructional and concise; prefer short sentences and bullet lists.
- Use ATX headings (`#` style) and wrap lines near 100 characters for readability.
- Favor present tense and direct guidance aimed at contributors.

## Tooling
- Format Markdown with Prettier defaults (`npx prettier --write docs/*.md`).
- Keep links relative when possible; add a brief note when pointing to external references.

## Checks
- Docs-only changes normally do not require a full site build, but run `npm run check` if docs describe code behavior or commands.

## Review checklist
- Are examples and command snippets up to date with current scripts?
- Did you avoid duplicating guidance that already lives in README or scoped AGENTS files?
- Are new instructions positioned near the files they affect?
