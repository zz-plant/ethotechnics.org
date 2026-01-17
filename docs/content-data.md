# Content data and validation

Guidance for updating structured content that lives in `src/content` and the validation checks that
keep it consistent.

## Content sources

- `src/content/*.json` holds page copy, listings, and structured data used by Astro content
  collections.
- `src/content.config.ts` defines the schema for each JSON collection and validates required fields
  at build time.
- `src/content/*.ts` exports shared TypeScript types and helper shapes that pages import when they
  need consistent typing.

## Common content files

- `src/content/home.json` contains the homepage hero, feature cards, and CTA copy.
- `src/content/start-here.json` captures the onboarding flow content for the start-here route.
- `src/content/glossary.json` and `src/content/library.json` contain the glossary terms and library
  patterns used across the site.
- `src/content/taxonomy.json` defines taxonomy entries and metadata for the `/taxonomy/*` routes.
- `src/content/field-notes.json` and `src/content/participation.json` store long-form page copy for
  those routes.

## Updating content safely

- Edit the relevant JSON file in `src/content` and keep field names aligned with
  `src/content.config.ts`.
- If you add a new field, update both the content schema and the related TypeScript type before
  wiring it into a page or component.
- For taxonomy entries, keep `slug` values nested (for example `governance/oversight`) so the page
  template can derive parent, sibling, and child navigation. Keep `owner`, `scope`, and `readiness`
  populated to avoid thin metadata.
- Fields ending in `Html` (for example `bodyHtml` or `descriptionHtml`) expect HTML strings; keep
  tags minimal and rely on existing typography styles.
- When you add or rename glossary term IDs or library pattern slugs, confirm that cross-links are
  updated everywhere they are referenced.

## Validation and checks

- `bun run validate:json` verifies every `src/content/*.json` file is valid JSON.
- `bun run validate:glossary` enforces glossary uniqueness, validates glossary-to-library links, and
  checks that glossary resource URLs are valid.
- `astro check` validates the taxonomy schema in `src/content.config.ts`, including required
  metadata fields and related artifacts.
- `bun test` exercises `tests/content-collections.test.ts` to confirm every JSON file under
  `src/content` is wired into `src/content.config.ts`.
- `bun run build` and `bun run check` both include the JSON and glossary validation steps, so they
  are good smoke tests after editing content data.

## Troubleshooting tips

- Schema errors from `astro build` point back to `src/content.config.ts` when required fields are
  missing or the shape changes.
- Validation failures often show the exact glossary term ID or pattern slug that is missing so you
  can update references quickly.
