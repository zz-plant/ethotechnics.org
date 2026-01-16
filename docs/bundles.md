# Bundles

Bundles package ready-to-export artifacts (clauses, evidence references, diagnostics summaries) for
fast adoption. Use this guide when adding or updating bundle metadata and exports.

## Bundle structure

Bundle metadata lives in `src/content/bundles/*.json`. Each file must include:

- `slug`: URL slug used under `/bundles/<slug>`.
- `title`: Human-readable bundle name.
- `summary`: Short description used in listings and SEO.
- `scope`: Primary audience and usage scope.
- `includedArtifacts`: List of `{ title, detail }` entries.
- `useCases`: Bullet list of common scenarios.
- `updateCadence`: Release cadence text.
- `exports`: Array of export options with `format`, `status`, `description`, and optional `href`.

Bundle aggregation and types live in `src/content/bundles.ts`. Keep the JSON and TypeScript
structure aligned so Astro pages can render without extra parsing.

## Export steps

1. Add or update the bundle JSON file.
2. Register the bundle in `src/content/bundles.ts`.
3. Create or update the landing page in `src/pages/bundles/<slug>.astro`.
4. Confirm export options:
   - `GitHub` exports require an `href` and should be marked `available`.
   - `Notion` and `PDF` exports can stay `coming-soon` until the flow is live.
5. Add cross-links from relevant pages (standards, bindings, diagnostics) to the bundle.

## Notes

- Keep bundle summaries skimmable and action-oriented.
- When export behavior changes, update this guide and the bundle pages together.
