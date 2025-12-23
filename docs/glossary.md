# Glossary content

Stable glossary data and helpers live in `src/content/glossary.ts` so new terms land in one place.

- Add or edit terms in `glossaryContent`; it stores the full territory map and categorized entries
  used by the `/glossary` route.
- `glossaryTerms` and the lookup index are generated from `glossaryContent.categories` so slugs,
  titles, and definitions stay synced with the canonical entries. Definitions pull from the first
  paragraph of `bodyHtml`; tags populate the Library “Useful in” list and fall back to the category
  heading when absent.
- The Library page surfaces the first 12 derived terms for quick anchors, and the Research page uses
  `getGlossaryLabel` so its cards stay aligned with glossary titles.
- Update `glossaryContent.permalink` if the glossary route moves so cross-links from Research and
  Field Notes stay accurate.
