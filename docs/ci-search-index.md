# Search index generation

The header search dialog runs [Pagefind](https://pagefind.app/) in the browser against an index
served from `/pagefind/`. `bun run build` builds that index, so every build that deploys carries
one.

## Why the build requests pages from the Worker

Pagefind indexes HTML, and `astro build` writes none. Every page is rendered by the Worker on
request, because prerendered `.astro` pages come out as the string `[object Object]` under the
Cloudflare adapter ([`planning/prerender-finding-2026-09.md`](planning/prerender-finding-2026-09.md)).
`dist/client/` holds assets and the four sitemap files, so running Pagefind over it finds nothing
to index.

## What the build does

`bun run build` runs `build:search` after `astro build` and `patch:cf-worker`.
`scripts/build-search.ts` then:

1. Starts the built Worker with `wrangler dev` on an unused local port.
2. Reads `/sitemap.xml` and each sitemap it lists.
3. Requests every address and passes the returned HTML to Pagefind. No browser runs: the Worker
   returns the whole page, and Pagefind does not execute scripts.
4. Writes the index to `dist/client/pagefind/`, which deploys with the other static assets, and
   stops the Worker.

On 2026-11-09 this indexed 615 pages in about 6 seconds on a laptop and wrote 667 files
(4.3 MB).

The script exits non-zero, and the build fails, when the Worker does not start, when a sitemap
address answers anything but 200, when a page has no `data-pagefind-body` element, or when
Pagefind reports an error. Without that, a missing index is silent: the dialog shows a link to
`/search` and no check reports it. No deployed build had an index until this step joined the
build.

A page is searchable only if a sitemap lists it.

`bun run build:search` rebuilds the index on its own from an existing `dist/`.

## What Pagefind reads from a page

`src/layouts/BaseLayout.astro` sets all of it:

- `data-pagefind-body` on `<main>`. Pagefind indexes the text inside it and skips the header and
  footer.
- `<meta data-pagefind-meta="type[content]">`, holding the first segment of the address
  (`glossary`, `standards`). The dialog groups results under a heading by this value, through
  `CONTENT_TYPE_MAP` in `src/client/search-modal/types.ts`. The `[content]` suffix tells Pagefind
  to read the attribute. Without it Pagefind reads the element's text, and a `<meta>` has none.
- The `title` and `description` tags beside it have no suffix, so Pagefind ignores them. A
  result's title is the page's first `h1`.

`src/components/SearchIds.astro` adds clause and mechanism IDs to a page's indexed text without
showing them.

## Checking search locally

The dev server has no index, so the dialog shows its fallback there. Run `bun run build`, then
`bun run preview:cf`, and search from the header. The browser console shows any request the
Content-Security-Policy blocked; Pagefind needs `'wasm-unsafe-eval'` in `script-src`, which
`astro.config.mjs` sets.

## Content layers and the search index

The RAG corpus at `/api/rag-corpus.jsonl` tags every document with a `layer`
field so retrieval can keep the doctrine apart from the requirements:

- `theory` for `/research/theory/*`.
- `instrument` for `/diagnostics/*`, `/validators/*`, and `/tools/*`.
- `method` for everything else.

The layer is derived in `resolveCorpusLayer` in `src/utils/api/api-responses.ts`.

The Pagefind index does not carry the layer. Pagefind reads rendered HTML, so
tagging it would mean emitting `data-pagefind-meta` attributes from the page
layouts rather than changing `scripts/build-search.ts`, which only passes each
page to Pagefind. Use the RAG corpus when a consumer needs the layer.
