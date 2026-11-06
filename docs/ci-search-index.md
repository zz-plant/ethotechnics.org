# Search Index Generation

The site uses [Pagefind](https://pagefind.app/) for full-text search. Due to Astro 6's SSR output format with the Cloudflare adapter, prerendered HTML files don't include body content, which Pagefind requires for indexing.

## Build-time Index

`bun run build:search` runs Pagefind on the static HTML in `dist/client/` and
writes the index to `dist/client/pagefind/`. It reuses an existing index and
does nothing when `dist/client/` is missing. `bun run build` does not call it.

## Crawl

Where the static HTML lacks page bodies, crawl a running build with Playwright
instead. It reads the URLs from the sitemaps, captures each page, and runs
Pagefind on the result. Install Chromium once with `bun run build:search:setup`.

```bash
bun run build:search:crawl
```

## Post-Deploy Crawl

For a production-only index (crawling the deployed site instead of a local
preview), point the crawl script at the live URL:

```bash
BASE_URL=https://ethotechnics.org bun run scripts/build-search-crawl.ts
```

## Content layers and the search index

The RAG corpus at `/api/rag-corpus.jsonl` tags every document with a `layer`
field so retrieval can keep the doctrine apart from the requirements:

- `theory` for `/research/theory/*`.
- `instrument` for `/diagnostics/*`, `/validators/*`, and `/tools/*`.
- `method` for everything else.

The layer is derived in `resolveCorpusLayer` in `src/utils/api/api-responses.ts`.

The Pagefind index does not carry the layer. Pagefind reads rendered HTML, so
tagging it would mean emitting `data-pagefind-meta` attributes from the page
layouts rather than changing `scripts/build-search.ts` or
`scripts/build-search-crawl.ts`, which only run Pagefind over the crawled
output. Use the RAG corpus when a consumer needs the layer.
