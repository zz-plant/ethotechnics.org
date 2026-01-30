# SEO audit (2025-02-14)

## Scope

- Reviewed global metadata in `src/layouts/BaseLayout.astro` and the `/api/og.svg` endpoint.
- Confirmed sitemap and robots integrations in `astro.config.mjs`.

## Strengths

- Canonical URLs, Open Graph, Twitter card tags, and JSON-LD are defined in the base layout.
- Organization, website, and webpage structured data are present and connected with stable IDs.
- Sitemap and robots.txt are generated via Astro integrations.

## Gaps and risks

- Open Graph images are SVG-only. Some social crawlers prefer PNG/JPEG and may ignore SVG.
- Pages that omit custom title/description fall back to global defaults, which can repeat snippets.
- Breadcrumb structured data is only emitted when pages pass `breadcrumbItems`.

## Recommendations

- Add a PNG Open Graph endpoint or a content-negotiated fallback for broader platform support.
- Audit pages for missing titles/descriptions and add unique copy where needed.
- Ensure key landing pages pass `breadcrumbItems` so search engines get hierarchy context.
- Add Twitter handle metadata if the Institute has an official account.

## Next-step checklist

- [x] Export a list of pages missing title/description values in
      [`docs/seo-metadata-report.md`](seo-metadata-report.md).
- [x] Ship a PNG Open Graph endpoint and point metadata to it for broader support.
- [ ] Update priority routes with breadcrumb data.
