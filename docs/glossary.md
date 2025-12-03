# Glossary content

Stable glossary data and helpers live in `src/content/glossary.ts` so new terms land in one place.

- Add or edit terms in `glossaryTerms`; each entry includes `slug`, `term`, `definition`, and
  `appliesTo`.
- Use `getGlossaryLabel` when rendering links so labels follow the canonical term instead of slug
  casing.
- `libraryContent` consumes `glossaryTerms` directly, which keeps the Library page and linked
  sections in sync when terms change.
