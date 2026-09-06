# Glossary content

Stable glossary data and helpers live in `src/content/glossary.ts` so new terms land in one place.

- Add or edit terms in `glossaryContent`; it stores the full territory map and categorized entries
  used by the `/glossary` route.
- `glossaryTerms` is derived from the full content and powers lightweight link lists in the Library
  and Research pages. Use `getGlossaryLabel` when rendering links so labels follow the canonical
  term instead of slug casing.
- Update `glossaryContent.permalink` if the glossary route moves so cross-links from Research and
  Field Notes stay accurate.

## Cross-linking rule

- Every glossary term added from the 2026-09 delegation reconstruction onward must have at least
  two inbound `<a href="#term-id">` links from other entries' `bodyHtml`. New terms are added together with the cross-links that reach them, so the semantic
  graph stays connected. `src/utils/semantic-graph.test.ts` enforces the rule.

## Taxonomy branches

- `src/content/taxonomy.json` carries the domain branches. Alongside `governance`, `delivery`,
  `assurance`, and `experience` it now holds `authority` (delegation, policy-validity, expansion)
  and `dependence` (reversibility, standing, preserved-capacity). Branch pages derive parents,
  siblings, and children from the nested `slug`, so adding a branch needs no route changes.
