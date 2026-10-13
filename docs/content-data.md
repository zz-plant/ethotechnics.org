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

## Dates shown to readers

- Store a date as ISO (`2026-10-06`) and render it with `formatDate` or `formatMonth` from
  `src/utils/dates.ts`.
- Metadata, tables, lists, changelog lines, and badges use the compact form: "Oct 6, 2026", or
  "Oct 2026" for a month.
- Running prose uses the full month in American order: "October 6, 2026", or "October 2026"
  (`formatDate(value, "prose")`). Write hand-typed prose dates the same way, never "6 October 2026".
- ISO stays where it is data: code samples, JSON, schema examples, URLs, `datetime` attributes,
  exports, and filenames.

## Versions shown to readers

- Render a version number with `formatVersion` from `src/utils/versions.ts`: "v1.0.2", with no
  "Version" in front of it. A "Version" column or label keeps its label, and its value reads
  "v1.0.2".
- Version strings in data, schemas, and JSON keep their stored form.

## House vocabulary

Each word below names one thing. Pick the word for the thing you mean; do not swap a word for
another because it reads better. Quotations, case names, statute and report titles, and other
fields' terms of art keep their own wording; when citing a field, use its word and, if it differs,
say once which house word it corresponds to.

**Challenging a decision**

- _Challenge_: the act of disputing a decision. "Upheld challenges" is the measure.
- _Standing_: the right to have a challenge received, answered by a date, and able to change the
  decision. It is the safeguard; a challenge is what standing lets someone make.
- _Appeal_: a formal route to a tribunal, court, or ombudsman, or the operator's own named appeal
  procedure. Not a synonym for challenge.
- _Contestability_: the property as the design and law literature names it. Use it when engaging
  that literature or naming STD-02; otherwise say what can be challenged and how.
- _Complaint_: what an institution can file and close as an anecdote. Use it for that contrast.
- _Remedy_: what the person receives when a challenge is upheld or harm is found. Use _redress_
  only in legal or quoted contexts, and _recourse_ only for the existence of any route at all.

**Stopping**

- _Halt_: stopping a system, or one of its decision paths, for everyone. "Time to halt" is the
  measure.
- _Pause_: holding one case or one flow while a person looks, without stopping the system.
- _Stoppability_: the property of being haltable by a named role without permission from above.
- _Freeze_: holding one account or asset in place (a fraud freeze). Not a synonym for halt.
- _Kill switch_ and _circuit breaker_ are engineering mechanisms that implement a halt; name them
  only when describing the mechanism itself, and say what they halt.

**Time**

- _Deadline_: a date promised to a person ("answered by"). Breaching it is a breach.
- _Clock_: the running measure against a deadline, started by an event.
- _Time to halt_, _time to reverse_, _time to restore_, _time in harm_: the four measured intervals.
- _SLO_ is STD-03's term for an internal target with an error budget; keep it there and in
  engineering-facing material. Do not call a promise to a person an SLA.

**Fixing what went wrong** (one verb per object)

- _Reverse_ a decision. _Restore_ a person to where they would have been. _Repair_ the harm that
  cannot be undone. _Correct_ the rule that produced it. A sentence that needs more than one says
  each.
- _Roll back_ a software change or an agent's action. _Recover_ a system after an incident.
- _Remedy_ is what the person is owed (see above), and can include reversal, restoration, and
  repair.

**Records**

- _Decision record_: one decision, with its inputs, rule, owner, and reasons (STD-07).
- _Decision log_: where decision records are kept; MEC-01 adds dissent to it.
- _Receipt_: what the person is handed, such as a harm receipt. A receipt cites the decision record.
- _Evidence pack_: what an auditor is handed for a standard.
- _Repair log_: the record of repairs and their cost to the people repaired.

**Unseen work**

- _Human subsidy_: the unpaid, unlogged work people do to keep a system's numbers looking right.
  _Moral overhead_ is the ethical share of it; _absorption_ is the process by which it hides
  failure. _Unlogged_ is an adjective, not a separate concept.

**People**

- Name the role when it is known: claimant, patient, applicant, tenant, worker, customer, student.
- _The people it decides about_: the general term. _People affected_ is wider and includes those
  who are not decided about (family, staff, a neighbourhood); use it when that is meant.

**Safeguards**

- The six _safeguards_ are capability, authority, evidence, dependency, standing, and correction.
  The laws treat them as _state variables_: quantities that move over time and can be measured. Use
  "safeguard" in interface and prose for readers, and "state variable" where the argument is
  about how they move.

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
