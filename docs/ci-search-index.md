# Search Index Generation

The site uses [Pagefind](https://pagefind.app/) for full-text search. Due to Astro 6's SSR output format with the Cloudflare adapter, prerendered HTML files don't include body content, which Pagefind requires for indexing.

## Build-time Index

The `build:search` script (runs automatically as part of `build`) generates the
search index by crawling the build output with Playwright:

1. Starts the wrangler dev server against the built output
2. Discovers all URLs from sitemaps (`core`, `glossary`, `standards`, `taxonomy`)
3. Crawls every page with a headless browser, capturing full HTML
4. Runs Pagefind on the crawled HTML
5. Outputs the index to `dist/client/pagefind/`

If a cached index already exists at `dist/client/pagefind/pagefind.js`, it is
reused and crawling is skipped.

First-time setup:

```bash
bun run build:search:setup   # Install Chromium for Playwright
```

## Manual Crawl

To regenerate the index independently of the build:

```bash
bun run build:search:crawl
```

## Post-Deploy Crawl

For a production-only index (crawling the deployed site instead of a local
preview), point the crawl script at the live URL:

```bash
BASE_URL=https://ethotechnics.org bun run scripts/build-search-crawl.ts
```

## CI Integration

The deploy workflow in `.github/workflows/deploy.yml` runs `build:search` as
part of `build`. The crawl runs automatically if `dist/client/pagefind/` is
missing or stale.

For CI without a display server, install Playwright system dependencies:

```bash
bunx playwright install --with-deps chromium
```
