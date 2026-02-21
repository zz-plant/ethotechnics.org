# SEO audit (2026-02-21)

## Scope

- Ran the automated audit with `bun run seo:audit`.
- Reviewed metadata and structured-data defaults in `src/layouts/BaseLayout.astro`.
- Reviewed crawler configuration in `astro.config.mjs`.

## What is likely limiting search engine presence

1. **Many article-like routes lack `publishedTime` metadata**.
   - Audit count: **83 warnings**.
   - Impact: article pages can ship less complete `Article` JSON-LD, which may weaken
     eligibility for rich results and freshness signals.

2. **Long pages often have weak internal linking**.
   - Audit count: **45 warnings** for pages with fewer than three internal links.
   - Impact: lower crawl depth reinforcement and weaker topic clustering across key hubs.

3. **Landing pages depend on inferred `structuredDataType`**.
   - Audit count: **27 warnings**.
   - Impact: less explicit control over JSON-LD type selection on important entry pages.

4. **Several routes have short or out-of-range title/description copy**.
   - Audit count: **7 title** warnings and **9 description** warnings.
   - Impact: lower-quality SERP snippets and possible truncation/under-utilization of snippets.

## High-priority route clusters to fix first

- `/adopt/*` pages: very short titles/descriptions.
- `/explainers/*`, `/examples/*`, and dynamic glossary routes: missing `publishedTime` and low
  internal link density.
- Top-level hub pages (`/taxonomy`, `/glossary`, `/research`, `/bundles`, etc.): set explicit
  `structuredDataType` values instead of relying on auto resolution.

## Positive signals confirmed

- Site canonical base URL is set to `https://ethotechnics.org` in Astro config.
- Robots.txt generation is enabled through `astro-robots-txt`.
- Base layout includes canonical URLs, social metadata, and JSON-LD scaffolding.

## Recommended next actions

1. Add `publishedTime` (and where possible `modifiedTime`) to high-value article pages first.
2. Add contextual internal links to long-form pages, prioritizing standards/mechanisms/explainers
   cross-links.
3. Set explicit `structuredDataType` on landing hubs.
4. Rewrite short title/description metadata for `/adopt/*`, `/tools/governance-gap-score`,
   `/mechanisms/mec-04-hard-clock`, and `/institute/team`.
5. Re-run `bun run seo:audit` after each batch and track warning count reduction over time.
