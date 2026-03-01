---
name: seo-maintainer
description: Ship repeatable SEO and discoverability improvements for metadata, structured data, and crawl surfaces.
required_tools:
  - run_command
version: 1.0.0
---

# SEO Maintainer Skill

Use when requests involve SEO audits, search visibility, metadata quality, sitemap integrity, or Open Graph coverage.

## Workflow

1. **Baseline checks**
   - Run `bun run check`.
   - Inspect route metadata patterns and canonical URL behavior.

2. **Metadata and social cards**
   - Ensure each changed route has a unique title and description.
   - Validate Open Graph/Twitter card fields and image fallbacks.

3. **Indexing and crawlability**
   - Review `robots.txt` and sitemap generation logic.
   - Confirm internal links exist for net-new pages.

4. **Structured context**
   - Add or update schema.org JSON-LD when page intent is explicit (article, glossary term, organization, FAQ).

5. **Validation**
   - Re-run `bun run check`.
   - Smoke-test changed routes locally.

## Done criteria

- No duplicate/conflicting metadata on changed routes.
- Social preview data is present and route-appropriate.
- Crawl/index surfaces remain valid after the change.
