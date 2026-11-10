# Glossary content

The glossary has two datasets with one file layout:

- Entry pages: data in `src/content/glossary.json`, imported through the generated wrapper
  (`src/content/generated/glossary.generated.ts`) and re-exported as `glossaryContent` from
  `src/content/glossary.ts`. Edit terms in the JSON; run `bun run content:generate` after.
- Tooltip terms: `glossaryTermSeeds` in `src/content/glossary.ts` (short definitions powering the
  hover tooltips, site search, and lightweight link lists). A seed with no entry page defines
  itself, so anything that turns one of its slugs into a link must check
  `hasGlossaryEntryPage` first; the sitemap and the entry route both read `glossaryContent` only.
  Use `getGlossaryLabel` when rendering links so labels follow the canonical term instead of slug
  casing.
- Update `glossaryContent.permalink` if the glossary route moves so cross-links from Research and
  Field Notes stay accurate.

## Retiring an entry

- Remove the entry and its tooltip seed, and add `"slug": "target"` to
  `src/data/glossary-retired.json`. The middleware sends `/glossary/<slug>` and the legacy
  `/glossary/entries/<slug>` to the target in one hop.
- The target is a live entry or a page that covers the term: an explainer, a mechanism pattern, or
  a theory essay. `src/content/glossary.test.ts` fails on a target that is retired or missing.
- Rewrite internal links, mechanism `glossaryRefs`, and explainer `glossaryRef` fields to the
  target instead of leaving them to the redirect.

## Cross-linking rule

- Every glossary term added from the 2026-09 delegation reconstruction onward must have at least
  two inbound `<a href="#term-id">` links from other entries' `bodyHtml`. New terms are added together with the cross-links that reach them, so the semantic
  graph stays connected. `src/utils/semantic-graph.test.ts` enforces the rule.

## Taxonomy branches

- `src/content/taxonomy.json` carries the domain branches. Alongside `governance`, `delivery`,
  `assurance`, and `experience` it now holds `authority` (delegation, policy-validity, expansion)
  and `dependence` (reversibility, standing, preserved-capacity). Branch pages derive parents,
  siblings, and children from the nested `slug`, so adding a branch needs no route changes.
