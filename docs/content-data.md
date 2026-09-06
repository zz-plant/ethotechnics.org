# Content data and validation

Guidance for updating structured content that lives in `src/content` and the validation checks that
keep it consistent.

## Canonical and derived content rule

Use **one canonical source per content domain**:

- Canonical files live in `src/content/*.json`.
- Derived TypeScript wrappers live in `src/content/generated/*.generated.ts`.
- Do not hand-edit generated files; regenerate them from JSON.

This keeps Astro collections, runtime imports, and typed wrappers aligned.

## Dual-source inventory and canonical owner

| Domain      | Canonical source               | Derived artifact                                 | Notes                                                                                              |
| ----------- | ------------------------------ | ------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| Home        | `src/content/home.json`        | `src/content/generated/home.generated.ts`        | `src/content/home.ts` consumes generated data.                                                     |
| Glossary    | `src/content/glossary.json`    | `src/content/generated/glossary.generated.ts`    | `src/content/glossary.ts` consumes generated data and keeps supplementary `glossaryTerms` helpers. |
| Library     | `src/content/library.json`     | `src/content/generated/library.generated.ts`     | `src/content/library.ts` consumes generated data and adds runtime glossary linkage.                |
| Taxonomy    | `src/content/taxonomy.json`    | `src/content/generated/taxonomy.generated.ts`    | `src/content/taxonomy.ts` builds lookup maps from generated data.                                  |
| Field notes | `src/content/field-notes.json` | `src/content/generated/field-notes.generated.ts` | `src/content/fieldNotes.ts` consumes generated data.                                               |

## MDX collections

Long-form pages live in MDX collections rather than JSON, with no generated wrapper. Each entry
declares its own `permalink` in frontmatter.

| Collection      | Directory                     | Route                     |
| --------------- | ----------------------------- | ------------------------- |
| `standards`     | `src/content/standards/`      | `/standards/[...slug]`    |
| `theory`        | `src/content/theory/`         | `/research/theory/[slug]` |
| `evidencePacks` | `src/content/evidence-packs/` | `/evidence-packs/[slug]`  |
| `explainers`    | `src/content/explainers/`     | `/explainers/[slug]`      |
| `incidents`     | `src/content/incidents/`      | `/incidents/[slug]`       |

The `theory` collection holds the Theory layer: the essays that explain why the laws hold. Method
pages may cite them as motivation, never as a requirement. Adding an essay is one MDX file with
`title`, `description`, `permalink`, `published`, and optional `lawRefs`; the route and the sitemap
pick it up from the `permalink`.

## Content sources

- `src/content/*.json` holds page copy, listings, and structured data used by Astro content
  collections.
- `src/content.config.ts` defines the schema for each JSON collection and validates required fields
  at build time.
- `src/content/*.ts` exports shared TypeScript types and helper shapes that pages import when they
  need consistent typing.

## Updating content safely

1. Edit the canonical JSON file in `src/content`.
2. Regenerate derived wrappers: `bun run content:generate`.
3. Validate drift and content checks:
   - `bun run content:check`
   - `bun run validate:json`
   - `bun run validate:glossary` (when glossary or mechanisms data changes)
4. Commit both canonical JSON changes and generated wrapper updates.

Additional guidance:

- If you add a new field, update both the content schema and the related TypeScript type before
  wiring it into a page or component.
- For taxonomy entries, keep `slug` values nested (for example `governance/oversight`) so the page
  template can derive parent, sibling, and child navigation.
- Fields ending in `Html` (for example `bodyHtml` or `descriptionHtml`) expect HTML strings; keep
  tags minimal and rely on existing typography styles.
- When you add or rename glossary term IDs or library pattern slugs, confirm cross-links are
  updated everywhere they are referenced.

## Validation and checks

- `bun run content:generate` refreshes derived `src/content/generated/*.generated.ts` files.
- `bun run content:check` fails if generated wrappers are stale or edited manually.
- `bun run validate:json` verifies every `src/content/*.json` file is valid JSON.
- `bun run validate:glossary` enforces glossary uniqueness, validates glossary-to-library links, and
  checks that glossary resource URLs are valid.
- `astro check` validates collection schemas in `src/content.config.ts`.
- `bun test src/utils/schema-examples.test.ts` validates the schema examples: every
  `public/standards/examples/*.example.json` must have a schema of the same name, every schema must
  declare draft 2020-12 with an `$id`, a title, and a description, and every example must validate
  against its schema. Add the example alongside any new schema, or this step fails.
- `bun run test:unit` exercises content collection coverage tests.
- `bun run build` runs generation first; `bun run check` enforces drift validation before type and
  lint checks.

## Troubleshooting tips

- Schema errors from `astro build` point back to `src/content.config.ts` when required fields are
  missing or the shape changes.
- If `content:check` fails, run `bun run content:generate` and commit regenerated files.
- Validation failures usually report the exact glossary term ID or pattern slug that is missing so
  you can update references quickly.
