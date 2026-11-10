# Repository orientation

Find the row for your change, edit the file it names, and run the command beside it. Read the
linked guide only when the row is not enough.

## Where a change goes

| To change                                    | Edit                                                                            | Then run                                                |
| -------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------- |
| A glossary entry                             | `src/content/glossary.json`                                                     | `bun run content:generate && bun run validate:glossary` |
| A library pattern, taxonomy node, field note | `src/content/library.json`, `taxonomy.json`, `field-notes.json`                 | `bun run content:generate`                              |
| A standard, the laws, the axioms             | `src/content/standards/*.mdx`                                                   | `bun run astro:check`                                   |
| A theory essay                               | `src/content/theory/*.mdx`                                                      | `bun run astro:check`                                   |
| A research essay                             | `src/content/research-essays/*.mdx`                                             | `bun run astro:check`                                   |
| A casebook case or score                     | `src/data/casebook.json` (shape and copy helpers in `src/content/casebook.ts`)  | `bun test src/content/casebook.test.ts`                 |
| Standards listing data                       | `src/data/standards.json` (read through `src/content/standards.ts`)             | `bun run test:unit`                                     |
| Copy on a page                               | the page's object in `src/content/*.ts`, then `src/pages/<route>`               | `bun run astro:check`                                   |
| Primary navigation or footer                 | `src/content/navigation.ts`, `src/content/site-footer.ts`                       | `bun test src/content/navigation.test.ts`               |
| A new page                                   | `src/pages/<route>/index.astro`; see [`../adding-pages.md`](../adding-pages.md) | `bun run check`                                         |
| A JSON API endpoint                          | `src/utils/api/api-endpoints.ts` and `src/pages/api/manifest.ts`                | `bun test src/utils/api/tests/api-manifest.test.ts`     |
| A JSON schema or its example                 | `public/standards/` (each schema needs an example of the same name)             | `bun test src/utils/schema-examples.test.ts`            |
| The conformance checker                      | `packages/conformance/src/`                                                     | `bun run conformance:action`, then commit the bundle    |
| An interactive tool                          | `src/features/<tool>/`                                                          | `bun test src/features/<tool>`                          |
| Shared styles and tokens                     | `src/styles/` (`components/research.css` is imported per page, not globally)    | check the page in a browser                             |
| A check or build script                      | `scripts/`, wired in `package.json`                                             | `bun run check`                                         |
| Contributor docs                             | `docs/`; update [`../README.md`](../README.md) when a file moves                | `bun run format:check`                                  |

## Generated files

Do not edit these by hand; the command regenerates them and `bun run check` fails on drift.

- `src/content/generated/*.generated.ts`: `bun run content:generate`
- `packages/conformance/action/cli.mjs`: `bun run conformance:action`
- The favicon and app icon set: `bun run icons:generate`

## Searching

- `.ignore` hides the minified conformance bundle, `bun.lock`, and `public/archive/` from
  ripgrep. Use `rg --no-ignore` to search them on purpose.
- `src/content/glossary.json` (750 KB), `src/data/eval-test-cases.json`, and
  `src/content/library.json` match most domain terms. When you want code or page copy and not
  data, add `-g '!*.json'`.
- Scoped rules: `rg --files -g 'AGENTS.md'`.

## Further reading, by task

- Content data, dates, versions, and the house vocabulary: [`../content-data.md`](../content-data.md)
- Routing and content layers: [`../architecture.md`](../architecture.md)
- Checks and when they may be skipped: [`workflow-and-checks.md`](workflow-and-checks.md)
- Machine-specific failures that look like regressions: [`local-quirks.md`](local-quirks.md)
- Deploying: [`../deployment.md`](../deployment.md)
