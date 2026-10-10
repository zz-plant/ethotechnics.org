# Content-layer architecture rationale (2026-10)

Why the current content structure is wrong, and what replaces it. Covers the eval-test-case
conversion, the content-module splits, and the schema convention those two establish.

## What is wrong with the current structure

**Data-as-TypeScript.** Thirty-plus content domains live as hand-written TS object literals in
`src/content/*.ts`. The four largest — `eval-test-cases.ts` (6,225 lines), `standards.ts` (3,011),
`glossary.ts` (2,069), `casebook.ts` (1,262) — are data in the shape of code. Consequences:

- Reviewing a two-line data change means diffing one of these monoliths.
- Every data edit pays a typecheck, and every consumer must import the whole module.
- There is no boundary between "this file exists to hold facts" and "this file computes things."

**Three validation mechanisms, none complete.**

1. `tsc` typechecks the TS modules, but only when someone runs it; the data ships whatever shape
   the literal satisfies structurally, with no required-field discipline beyond what the type
   happens to say.
2. `scripts/validate-json.ts` checks five `src/content/*.json` files — but only that they parse as
   JSON. It validates no schema.
3. `scripts/validate-glossary.ts` is the only zod validation in the repo, and it covers one file.

A new content domain has three possible answers to "how is this validated," and two of them are
wrong.

**Drift between the mechanisms.** The generated wrappers (`src/content/generated/*.ts`, refreshed
by `scripts/generate-content-derived.ts`) prove the repo already needs data files that TS can
import. The convention is implicit and per-domain instead of shared.

## What replaces it

1. **Data belongs in JSON.** One JSON file per domain (or per split of a large domain, e.g. one
   file per standard). JSON is diffable per entry, reviewable, and already the format of the five
   domains that migrated first (`glossary.json`, `taxonomy.json`, `library.json`,
   `field-notes.json`, `participation.json`) and of `src/data/green-dashboard-benchmark.json`.
2. **zod schema is the source of truth for shape.** Each domain gets a zod schema; TS types are
   derived with `z.infer`, so a type and its validator cannot drift. `validate:json` gains schema
   checking instead of parse-only checking, one mechanism instead of three.
3. **TS modules stay as the import surface.** Where pages and utils import content, a thin TS
   wrapper re-exports the parsed data (the existing `generate-content-derived.ts` pattern), so
   consumers do not change and dead-simple static analysis still works.
4. **Scales that repeat are named, not duplicated.** The eval test cases share scoring-scale
   definitions across entries; in JSON they become named references the loader resolves, not
   copies inlined 176 times.

## Sequencing

1. Pilot on `eval-test-cases.ts` (biggest file, purest data) with a round-trip check proving the
   loaded data is deep-equal to the old exports. The canary GUID comment moves with the wrapper
   and is recorded in the JSON as a non-data field.
2. Split `standards.ts`, `glossary.ts`, and `casebook.ts` the same way, using barrel exports so
   consumer imports do not change.
3. Roll the zod convention across the remaining TS-content domains opportunistically — when a
   domain is next edited, not in a sweep.

## What this is not

This is not a move to Astro content collections with frontmatter: the content here is structured
cross-referenced data (clause IDs, glossary refs, mechanism refs validated against each other),
not documents. Documents already live where they should — MDX under `src/content/theory/`.
