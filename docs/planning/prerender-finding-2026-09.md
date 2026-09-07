# Prerendered dynamic routes build to a placeholder (2026-09)

Status: **found, not fixed.** Recorded here because it was discovered while doing
something else, it is larger than that task, and it should not be lost.

## What was observed

Every prerendered page this repo builds is 15 bytes containing the literal string
`[object Object]`.

```
$ find dist/client -name index.html | wc -l
877
$ find dist/client -name index.html -size -100c | wc -l
877
```

All 877. Not a subset. `dist/client/glossary/stoppability/index.html`,
`dist/client/research/theory/absorption-as-concealment/index.html`, and every
other prerendered page are identical 15-byte files.

Thirteen route files opt into prerendering and produce those 877 pages:

```
src/pages/api/validators.json.ts        src/pages/glossary/entries/[slug]/tests/[test].astro
src/pages/audit.astro                   src/pages/incidents/[slug].astro
src/pages/evals/[slug].astro            src/pages/research/theory/[slug].astro
src/pages/evidence-packs/[slug].astro   src/pages/sitemaps/[section].xml.ts
src/pages/experience/[...slug].astro    src/pages/taxonomy/[...slug].astro
src/pages/explainers/[slug].astro
src/pages/glossary/[slug].astro
```

Server-rendered routes are unaffected: `/examples/automated-account-lock` returns
58 KB of real HTML, `/mechanisms/patterns/kill-switch` returns 200 with content.
The split is exactly `prerender = true` versus not.

## Why nobody noticed

Two reasons, and the second is the one worth fixing regardless of the first.

1. `bun run preview:cf` serves `dist/client` in front of the worker, so the
   placeholder is what a local request gets — but only if you read the body. The
   status code is 200. Earlier work in this area checked status codes, which is
   how the routes were declared fixed when `prerender = true` was added to stop
   them 500ing.
2. **The e2e suite visits no prerendered page at all.** Its routes are `/`,
   `/404`, `/components-preview`, `/diagnostics`, `/field-notes`, `/glossary`,
   `/library`, `/mechanisms`, `/syllabus` — every one of them server-rendered.
   877 pages have no coverage, so nothing contradicted the status codes.

## What is not known

Whether production is affected. The `deploy` script passes `--no-assets`, which
would mean the worker serves every request and the placeholders never ship. But
`wrangler.toml` declares `[assets] directory = "./dist/client"`, and the
Cloudflare Git integration that posts the "Workers Builds: et3" check runs its
own build and deploy rather than that npm script. Which of the two describes the
live deployment could not be determined from inside this environment — the
network policy blocks requests to ethotechnics.org and to the workers.dev preview
URLs, so the live pages could not be fetched.

That is the first thing to check, and it decides the severity:

- If assets ship, 877 pages — the entire glossary, all theory essays, every
  incident and evidence pack — serve `[object Object]` to readers and crawlers.
- If they do not, this is a build-hygiene problem and a preview-fidelity problem,
  and nothing more.

## What was done about it here

Nothing, beyond not adding to it. The `/roles/[role]` route added alongside this
finding resolves its role from `Astro.params` at request time rather than
prerendering, matching `/mechanisms/patterns/[slug]`, which is the shape known to
serve correctly. It renders in the worker: seven pages, 48–53 KB each, 404 on an
unknown role.

## Suggested order of work

1. Fetch a prerendered page from the live site. That single request decides
   whether this is an outage or a cleanup.
2. Add one e2e case that asserts a prerendered detail page contains its own
   heading, not merely that it returns 200. Whatever the answer to (1), the
   suite should be able to tell the difference.
3. Then find the root cause. Suspects, in order: the `security.csp` block
   interacting with static generation under `output: "server"`, the Cloudflare
   adapter's static file emitter, and the middleware, which wraps every response
   including those produced during the build.
