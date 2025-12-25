# AGENTS — docs/

Scope: applies to documentation under `docs/`.

## Formatting and tone
- Keep Markdown instructional and concise; prefer short sentences and bullet lists.
- Use ATX headings (`#` style) and wrap lines near 100 characters for readability.
- Favor present tense and direct guidance aimed at contributors.

## Organization
- Skim `docs/README.md` before adding or moving guides so new content lands in the right section.
- Keep links relative when possible; add a brief note when pointing to external references.

## Tooling
- Format Markdown with Prettier defaults (`npx prettier --write docs/*.md`).

## Checks
- Docs-only changes can skip `npm run check`, but run it when documentation covers code behaviors
  or commands that might have drifted.
- If you skip `npm run check` for a docs-only change, mention the skip in the PR body.

## Review checklist
- Are examples and command snippets up to date with current scripts?
- Did you avoid duplicating guidance that already lives in README or scoped AGENTS files?
- Are new instructions positioned near the files they affect?
