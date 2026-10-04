# Prerendered pages built to a placeholder (2026-09)

Status: **fixed**, with a guard. The root cause sits upstream and is not fixed
here; the site no longer takes the broken path, and the build now fails rather
than shipping this class of output again.

## What was wrong

Every prerendered page this repo built was a 15-byte file containing the string
`[object Object]`.

```
$ find dist/client -name index.html | wc -l
877
$ find dist/client -name index.html -size -100c | wc -l
877
```

All 877 — the entire glossary, every theory essay, every incident dossier and
evidence pack. Not a subset.

## Why nobody noticed

1. The routes returned HTTP 200. Earlier work in this area added
   `prerender = true` to stop these routes from 500ing under `output: "server"`,
   checked the status codes, and declared them fixed. A 200 cannot distinguish a
   rendered page from an empty one.
2. **The e2e suite visited no prerendered page.** Its routes were `/`, `/404`,
   `/components-preview`, `/diagnostics`, `/field-notes`, `/glossary`,
   `/library`, `/mechanisms`, `/syllabus` — all server-rendered. 877 pages had
   no coverage, so nothing contradicted the status codes.

## What was ruled out

Each of these was tested by rebuilding from a clean `dist` and counting the
undersized files. None changed the result:

| Suspect                                                                                                 | Result                     |
| ------------------------------------------------------------------------------------------------------- | -------------------------- |
| `security.csp` in `astro.config.mjs`                                                                    | still broken               |
| `src/middleware.ts` (wraps every response)                                                              | still broken               |
| The project's `vite.optimizeDeps` / `vite.ssr` / `vite.oxc` overrides                                   | still broken               |
| Vite's `optimizeDeps` cache (`node_modules/.vite`)                                                      | still broken               |
| The adapter's `rolldownAstroFrontmatterScanPlugin`, which stubs `.astro` modules to `export default {}` | still broken when neutered |
| Building with `node` rather than `bun`                                                                  | still broken               |
| `astro@7.2.10` + `@astrojs/cloudflare@14.2.6`                                                           | still broken               |

It also reproduced on a page with no imports, no layout and no frontmatter
beyond the flag:

```astro
---
export const prerender = true;
---

<html><body><h1>PROBE-PLAIN</h1></body></html>
```

So it was not project content.

## Where it actually breaks

Instrumenting the adapter's in-worker prerender handler showed the render itself
returning the placeholder, before anything wrote a file:

```
INWORKER url: https://ethotechnics.org/probe-test/plain/ status: 200 len: 15 text: "[object Object]"
INWORKER routeData.component: src/pages/probe-test/plain.astro type: page
```

`app.render()` inside the prerender worker returns a 200 whose body is
`[object Object]`. Astro's own write path is fine: instrumenting
`generate.js` showed it receiving a correct `Buffer` for endpoints and the
placeholder for pages.

The split is exact and is the most useful fact here:

- **Prerendered endpoints** (`.ts` routes — `api/validators.json`,
  `sitemaps/[section].xml`) render correctly.
- **Prerendered pages** (`.astro` routes) render as `[object Object]`.
- The **same pages render correctly through the SSR worker** — `/glossary/stoppability`
  returns 48 KB of real HTML when served by the worker rather than as an asset.

That is an upstream defect in the prerender path for `.astro` pages, not
something this repo can fix from the outside.

## The fix applied here

Prerendering is an optimisation on a site whose output is `server` and whose
every route already renders correctly at request time. So the ten `.astro`
routes that opted into it no longer do; each resolves its entry from
`Astro.params` and returns a 404 when the slug is unknown, which is the shape
`/mechanisms/patterns/[slug]` and `/roles/[role]` already used.

The two prerendered **endpoints** keep `prerender = true`. They were never
affected, and their output is genuinely static.

Verified against the built worker: all nine route families return real content
(50–102 KB), and unknown slugs 404 rather than rendering an empty page.

## What stops it recurring

- **`scripts/check-build-output.ts`**, wired into `bun run build`. It fails the
  build on any generated HTML or XML that is below a size floor, is entirely a
  stringified sentinel, or lacks the markup its type requires. Cheap enough to
  run every time, which matters more than being clever: this defect was
  detectable by `wc -c` for months.
- **`tests/e2e/rendered-detail-pages.e2e.ts`**, one page from each family that
  used to be prerendered, asserting page _content_ — a single `<h1>` with real
  text, a body over 500 characters, no `[object Object]` anywhere — rather than
  a status code, plus that unknown slugs 404.

## Left open

- **The upstream bug is unreported.** It reproduces on a trivial page with
  `astro@7.3.1` + `@astrojs/cloudflare@14.3.0` and on `7.2.10` + `14.2.6`, and
  the repro above is small enough to file as-is.
- **Per-request rendering cost.** Roughly 870 pages that were meant to be static
  now render on each request. On Workers this is cheap, and it is what was
  effectively happening already whenever the worker served these routes — but
  if these pages are ever hot, caching them at the edge is the mitigation, and
  nothing in this repo currently sets `Cache-Control` on HTML responses.
- **Whether the placeholders ever reached production.** Still unknown, and now
  moot: the `deploy` script passes `--no-assets` (in which case they never
  shipped and the worker served every request), while `wrangler.toml` declares
  the assets directory and the Cloudflare Git integration runs its own build.
  Either way the site now serves real HTML on both paths.
