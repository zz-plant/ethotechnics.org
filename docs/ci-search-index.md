# Search Index Generation

The site uses [Pagefind](https://pagefind.app/) for full-text search. Due to Astro 6's SSR output format with the Cloudflare adapter, prerendered HTML files don't include body content, which Pagefind requires for indexing.

## Build-time Index

The `build:search` script attempts to generate an index from the prerendered HTML. This produces a limited index that covers page titles and metadata only.

## Full Index (Post-Deploy)

For a complete index with full body content, run Pagefind against the deployed site:

```bash
# Install Playwright browsers first
bunx playwright install chromium

# Run the crawling script
bun run scripts/build-search-crawl.ts
```

This script starts a headless browser, crawls every page on the deployed site, saves the full HTML, and runs Pagefind on the result. The generated index is then ready for upload alongside the static assets.

## CI Integration

The deploy workflow in `.github/workflows/deploy.yml` runs `build:search` before deploying. To enable full index generation in CI, set up:

1. A nightly workflow that runs the crawl script against the production URL
2. Uploads the generated index as a build artifact
3. The next deploy includes it via the cached `dist/client/pagefind/` directory
