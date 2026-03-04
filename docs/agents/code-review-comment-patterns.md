# Code review comment patterns (GitHub scan)

Snapshot date: 2026-03-04.

Data source: GitHub PR review comments from `zz-plant/ethotechnics.org` via the REST API.

## What comes up most often

From the latest 100 PR review comments, recurring themes were:

1. **TypeScript typing quality (38 comments)**
   - Unnecessary type assertions.
   - Dead fallback branches after default values.
   - Suggestions to simplify inferred types.
2. **Naming and structure consistency (36 comments)**
   - Placeholder names.
   - File/component naming and organization suggestions.
3. **Accessibility and semantics (31 comments)**
   - ARIA placement and semantic structure feedback.
   - Heading and metadata clarity concerns.
4. **Link and URL hygiene (27 comments)**
   - External link safety and canonical URL concerns.
5. **Cleanup and redundancy (26 comments)**
   - Remove duplicate variables and dead code.
6. **Testing expectations (23 comments)**
   - Add tests to cover changed behavior.

## Observations about reviewer mix

- Most comments came from automated reviewers (`gemini-code-assist[bot]`,
  `chatgpt-codex-connector[bot]`).
- Many comments are preventive quality suggestions that can be caught earlier
  with static checks and PR checklists.

## Guardrails now in place

- `bun run check` includes `bun run check:external-links`, which fails if
  `target="_blank"` links omit `rel="noopener noreferrer"`.
- `bun run check` includes `bun run check:heading-hierarchy`, which fails when
  files skip heading levels (for example `h2` to `h4`).
- The pull request template includes a pre-review guardrail checklist for:
  - external link safety,
  - heading hierarchy,
  - TypeScript assertion/dead-branch hygiene,
  - naming convention checks.

## Recommended next guardrails

- Add lint rules for redundant nullish coalescing and unnecessary assertions
  where not already covered.
- Add a lightweight naming convention check for new files in key directories.
- Keep the PR checklist concise and adjust quarterly based on new comment trends.
