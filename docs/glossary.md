# Glossary content

Stable glossary data and helpers live in `src/content/glossary.ts` so new terms land in one place.

- Add or edit terms in `glossaryContent`; it stores the full territory map and categorized entries
  used by the `/glossary` route.
- `glossaryTerms` is derived from the full content and powers lightweight link lists in the Library
  and Research pages. Use `getGlossaryLabel` when rendering links so labels follow the canonical
  term instead of slug casing.
- Update `glossaryContent.permalink` if the glossary route moves so cross-links from Research and
  Field Notes stay accurate.
