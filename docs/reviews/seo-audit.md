# SEO audit (2026-09-22)

This audit replaces the 2026-02-21 audit. Its section on progress since then records what happened to
the earlier findings.

## Status

The high- and medium-priority findings are fixed in code, except the `www` DNS record, which has to
be added in Cloudflare. The low-priority findings are open.

| Finding                         | Status                                                                           |
| ------------------------------- | -------------------------------------------------------------------------------- |
| 1. `robots.txt` sitemap pointer | Fixed. The integration is removed and the route serves the file.                 |
| 2. Pages missing from sitemap   | Fixed. 609 URLs are listed, all answer 200, and none is listed twice.            |
| 3. Conflicting JSON-LD graphs   | Fixed. No page emits one `@id` with two types, two breadcrumbs, or two articles. |
| 4. Conflicting dates            | Fixed. Glossary pages publish their real publication and modified dates.         |
| 5. `www` host                   | Redirect is in the middleware. The DNS record still needs adding.                |
| 6. Sitemap hygiene              | Fixed alongside finding 2.                                                       |
| 7 to 9                          | Open.                                                                            |

Fixing finding 2 brought the explainers into the rendered audit for the first time. Their FAQ node
reused the page URL as its `@id`, the same conflict as finding 3, and the glossary index had a
second breadcrumb list. Both are fixed. Across all 607 pages the link crawl reaches, no JSON-LD
conflict remains.

## Scope and method

- Ran the source-level audit with `bun run seo:audit`.
- Built the site and fetched every URL in the four child sitemaps from a local preview. That was 557
  unique pages. For each page the audit read the head title, meta description, robots tags,
  canonical, Open Graph and Twitter fields, `h1` count, JSON-LD, image `alt` attributes, and page
  size.
- Crawled internal links from `/` and compared the pages reached with the sitemap.
- Checked `robots.txt`, the sitemap files, and host and path redirects on the live site.

## Summary

The page-level basics are in good shape. Every page returned 200. Each has a unique title, one
meta description, one canonical pointing at itself, Open Graph and Twitter cards, exactly one `h1`,
valid JSON-LD, and alt text on every image.

The problems are in the crawl surfaces and the structured data, and the first two are serious.

| Priority | Finding                                                              | Pages affected |
| -------- | -------------------------------------------------------------------- | -------------- |
| High     | `robots.txt` points crawlers at a sitemap URL that returns 404       | Whole site     |
| High     | Linked, indexable pages missing from the sitemap                     | 49             |
| Medium   | Conflicting JSON-LD: one `@id` with two types, duplicate breadcrumbs | 371            |
| Medium   | Conflicting publication dates in JSON-LD                             | 366            |
| Medium   | `www.ethotechnics.org` does not resolve                              | Host           |
| Low      | Sitemap lists a noindex page and three URLs twice                    | 4              |
| Low      | Two robots meta tags on every page                                   | All            |
| Low      | Meta descriptions over 160 characters                                | 40             |
| Low      | Titles under 30 characters, several with no site name                | 21             |

## Findings

### 1. `robots.txt` advertises a sitemap that does not exist (high)

The live `robots.txt` reads:

```
User-agent: *
Allow: /
Sitemap: https://ethotechnics.org/sitemap-index.xml
```

`/sitemap-index.xml` returns 404 in production. The sitemap index is at `/sitemap.xml`.

The file comes from the `astro-robots-txt` integration in `astro.config.mjs`, which writes a static
`robots.txt` into the build output. That static file is served ahead of the site's own route in
`src/pages/robots.txt.ts`, so the route never runs. The route already does the right things:

- It points at `/sitemap.xml`.
- It disallows `/readouts/`, the private-by-link diagnostic permalinks.
- It serves `Disallow: /` with `X-Robots-Tag: noindex` on any host that is not production, which
  covers Workers preview URLs.

None of that ships. Search engines are told about a sitemap that is missing, and preview hosts are
open to crawling. Canonical tags limit the duplicate-content risk from preview hosts, and readout
pages carry their own noindex tag.

**Fix:** remove `robotsTxt()` from the integrations list so the existing route serves `robots.txt`.
Confirm afterwards that `dist/client/robots.txt` is gone and the live file names `/sitemap.xml`.

### 2. 49 indexable pages are missing from the sitemap (high)

The core sitemap is built from `src/pages/**/*.astro` in `src/utils/sitemaps.ts`, and it drops every
dynamic route. Sections that list their own dynamic pages are covered: glossary, standards,
taxonomy, theory, evidence packs, incidents, casebook, and mechanism patterns. These dynamic
routes are not covered:

| Route                              | Pages | Examples                              |
| ---------------------------------- | ----- | ------------------------------------- |
| `/explainers/[slug]`               | 18    | `/explainers/typed-decision-models`   |
| `/evals/[slug]`                    | 15    | `/evals/delegation-validity`          |
| `/failure/[slug]`                  | 7     | `/failure/cant-stop`                  |
| `/artifacts/[slug]`                | 5     | `/artifacts/decision-record-template` |
| `/standards/crosswalk/[controlId]` | 4     | `/standards/crosswalk/ctrl-01`        |

The explainers are the pages most likely to answer a search query, and none of them is in the
sitemap. They are still reachable through internal links, so they can be discovered, but more slowly
and with no `lastmod` signal.

`/api` is also indexable and absent. It is excluded on purpose by `isPublicPath`, so it should either
carry noindex or be listed.

`/syllabus` is the reverse case. It is in the sitemap, but no page links to it.

**Fix:** add these collections to the section builders the same way theory and casebook are added.
Then add a test that every page the link crawl reaches is either in the sitemap or marked noindex.

### 3. Conflicting JSON-LD on glossary and standards pages (medium)

Every page gets a JSON-LD graph from `BaseLayout`. The glossary term route and six standards pages
add a second graph of their own, and the two disagree.

On each of the 364 glossary pages:

- The page URL is used as the `@id` of a `DefinedTerm` in the layout's graph and of a `WebPage` in
  the route's graph. Parsers merge nodes by `@id`, so one entity ends up with two types.
- There are two `DefinedTerm` nodes, one at the page URL and one at `#defined-term`. The layout's
  node is named with the page title, including the "— Ethotechnics glossary" suffix.
- There are two `BreadcrumbList` nodes, one with an `@id` and one without.

On `/standards/std-01`, `-02`, `-03`, `-06`, `-08`, and `-09`, the layout's `Article` and the
document's own `TechArticle` both describe the page. One mechanisms page has the same `@id`
conflict.

**Fix:** have routes that emit their own graph turn off the layout's page-level nodes. The layout
should keep only `Organization` and `WebSite`. Alternatively, pass the route's nodes into the
layout so it emits one graph.

### 4. Conflicting publication dates (medium)

`src/pages/glossary/[slug].astro` passes the term's last-updated date to the layout as
`publishedTime`. The layout's `Article` node and the `article:published_time` Open Graph tag
therefore give the modified date as the publication date. The route's own `WebPage` and
`DefinedTerm` nodes use the glossary's real publication date. 363 glossary pages and three
standards pages carry two different `datePublished` values.

**Fix:** pass the glossary's publication date as `publishedTime` and `termUpdated` as `modifiedTime`.

### 5. `www.ethotechnics.org` does not resolve (medium)

The `www` host has no DNS record, so a visitor or a link using it gets a connection error. The
robots route already treats `www` as a production host. This is a DNS and Cloudflare setting, not
a code change: add the record and a permanent redirect to the apex domain.

`ethotechnics.com` is a separate site, "Ethotechnics Studio", with its own canonical tags, so it
does not duplicate this one. The `.com`-to-`.org` redirect in `src/middleware.ts` never fires for it.
A maintainer should decide whether that redirect is still wanted.

### 6. Sitemap hygiene (low)

- **Noindex page listed.** `/search` is in the core sitemap but is marked noindex, which sends
  crawlers a mixed signal. Exclude it in `isPublicPath`.
- **Three URLs listed twice.** `/evidence-packs/std-01`, `std-02`, and `std-06` exist both as static
  pages and as content-collection entries, so they are listed twice. Keep one source.

### 7. Two robots meta tags on every page (low)

Every page emits `index, follow` from the `SEO` component and a second robots tag from the layout.
On indexable pages both allow indexing. On `/search`, `/404`, and the readout pages, one allows and
one forbids. Search engines apply the stricter one, so noindex still works, but the page should
say one thing. Emit a single tag.

### 8. Snippet copy (low)

- **Long descriptions.** 40 descriptions run past 160 characters, and the longest is 313. They are
  mostly on research pages (16), casebook cases (6), and standards (6). Search engines will cut them
  off, usually mid-sentence.
- **Short descriptions.** Eight descriptions are under 70 characters. Most are on `/incompatible`,
  `/explainers`, `/artifacts`, and taxonomy branch pages.
- **Short titles.** 21 titles are under 30 characters. Several have no site name at all, including
  "Agent FAQ", "Explainers", "Evidence Packs", "STD-08 — Delegation", and "STD-09 — Agent Chains".
  The standards titles matter most, because people search for them by name.

### 9. Page weight (information only)

The heaviest HTML documents are `/glossary` at 925 KB, `/search` at 528 KB, and `/mechanisms` at
304 KB. The glossary index renders every term inline. It is indexable and a primary entry point, so
its size is worth watching, but it is not blocking anything.

## Progress since the 2026-02-21 audit

These counts come from `bun run seo:audit`. The script counts links written in page source, so it
misses links that components render, and some of its internal-link warnings are not real.

| Warning                                 | 2026-02-21 | 2026-09-22 |
| --------------------------------------- | ---------- | ---------- |
| Missing `publishedTime` on article-like | 83         | 4          |
| Few internal links on long pages        | 45         | 38         |
| Inferred `structuredDataType` on hubs   | 27         | 13         |
| Title length out of range               | 7          | 2          |
| Description length out of range         | 9          | 4          |

## Recommended order of work

1. Remove the `astro-robots-txt` integration so `src/pages/robots.txt.ts` serves the file
   (finding 1).
2. Add the missing dynamic routes to the sitemap, drop `/search`, and dedupe the evidence packs.
   Add a test that compares the link crawl with the sitemap (findings 2 and 6).
3. Emit one JSON-LD graph per page, and fix the glossary publication date (findings 3 and 4).
4. Add a DNS record and redirect for `www.ethotechnics.org` (finding 5).
5. Emit one robots tag per page, then tighten the long descriptions and short titles
   (findings 7 and 8).
6. Re-run `bun run seo:audit` and the rendered crawl after each batch.
