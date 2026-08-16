# Refactor trawl — 2026-03-01

## Scope and method

- Reviewed repository structure and hotspot file sizes.
- Sampled large files in layout, page, API, and styling layers.
- Checked for explicit debt markers (`TODO`, `FIXME`, `HACK`) and consistency gaps.

## Priority 1 — split monolithic page implementation

**Target:** `src/pages/tools/burden-budget-worksheet.astro`

- The route is very large and currently combines frontmatter data, full page markup,
  and a large inline script in one file.
- The inline script includes many workflow responsibilities (form repeater setup,
  worksheet assembly, markdown/csv/pdf export, status updates, and comparison logic).

**Refactor direction:**

1. Extract form/export logic into `src/features/burden-budget-worksheet/` with typed modules.
2. Keep the route file as composition only (page sections + island mounting).
3. Add unit tests for serialization (`toMarkdown`, `toCsv`) and worksheet validation.

## Priority 2 — decompose `BaseLayout` into focused concerns

**Target:** `src/layouts/BaseLayout.astro`

- Layout frontmatter currently handles metadata defaults, Open Graph image template
  resolution, JSON-LD construction, breadcrumb inference, and route-type heuristics.
- The same file also contains a large inline SVG symbol/filter block in the HTML body.

**Refactor direction:**

1. Move SEO and schema graph builders into `src/utils/seo/`.
2. Move reusable SVG defs to a dedicated component (`src/components/SvgDefs.astro`).
3. Leave `BaseLayout` as orchestrator + slots + top-level shell structure.

## Priority 3 — reduce duplicated versioned API route files

**Target:** `src/pages/api/*.ts` and `src/pages/api/v/2026.01/*.ts`

- Most files in `/api/v/2026.01` are near-identical wrappers to `/api` counterparts,
  with only import depth and small option differences.
- This adds drift risk and makes adding new endpoints a two-directory edit.

**Refactor direction:**

1. Introduce a shared route factory (or generated wrappers) for versioned endpoints.
2. Keep per-route differences declarative (basePath, includeSnapshots, etc.).
3. Enforce parity with a small test that checks base/versioned endpoint manifest sync.

## Priority 4 — modularize the global component stylesheet

**Target:** `src/styles/components.css`

- `components.css` is currently a very large, central stylesheet.
- The file is likely carrying unrelated component concerns that are harder to reason
  about and review as one unit.

**Refactor direction:**

1. Split by UI domain (navigation, cards, forms, diagrams, marketing sections).
2. Keep existing `@layer components` ordering with explicit import order.
3. Add a style inventory doc noting source-of-truth file per class namespace.

## Priority 5 — formalize refactor guardrails with measurable gates

**Target:** existing planning docs and checks

- The repository already has a strong staged plan in `docs/planning/full-refactor-plan.md`.
- Immediate improvement is operationalizing that plan into explicit per-PR checks and
  acceptance gates for hotspot files.

**Refactor direction:**

1. Attach complexity budgets (max LOC or max responsibilities) to hotspot modules.
2. Require tests when extracting behavior from layout/page files.
3. Add a lightweight architecture decision record when cross-layer boundaries change.

## What does _not_ currently require urgent refactor

- No widespread ad-hoc debt markers were found in `src`, `docs`, `scripts`, or `tests`
  (`TODO`, `FIXME`, `HACK`, `XXX`).
- Existing API response composition in `src/utils/api-responses.ts` is already centralized
  and can remain the data-shaping seam while route wrappers are reduced.

## Proposed delivery order (fewest practical PRs)

To keep risk controlled while minimizing review overhead, sequence the work in **3 PRs**.

### PR 1 — safety rails + API wrapper consolidation (low UI risk)

**Includes:**

- Priority 3 (versioned API route deduplication).
- Priority 5 (guardrails): add parity checks and explicit acceptance criteria for hotspot files.

**Why first:**

- API wrappers are mostly structural duplication and can be validated heavily with tests.
- Guardrails should land before larger layout/page splits.

**Exit criteria:**

- `/api` and `/api/v/*` endpoint parity check passes.
- `bun run check` passes.
- No response payload regressions in existing API tests.

### PR 2 — worksheet page extraction + stylesheet modularization (feature-adjacent)

**Includes:**

- Priority 1 (`burden-budget-worksheet` extraction into typed feature modules + unit tests).
- Priority 4 (split `components.css` into domain files with preserved layer order).

**Why second:**

- Both changes touch UI composition and benefit from being reviewed together with visual QA.
- Isolates front-end behavior changes into one bounded review cycle.

**Exit criteria:**

- Serialization/export tests added and passing.
- No visual or interaction regressions for the worksheet route.
- CSS split produces no class-loss/regression in existing pages.

### PR 3 — `BaseLayout` decomposition (cross-cutting but now safer)

**Includes:**

- Priority 2 (extract SEO/schema utilities and SVG defs component).

**Why third:**

- `BaseLayout` is cross-cutting and affects most pages.
- Landing after guardrails and earlier extractions reduces blast radius and debugging ambiguity.

**Exit criteria:**

- Existing SEO regression tests pass.
- Structured data and OG tags remain equivalent for representative route types.
- No layout-shell regressions on key pages.

## If the team insists on only 2 PRs

Use this fallback split:

1. **PR A:** Priority 3 + Priority 5 + Priority 2 (infrastructure + layout internals).
2. **PR B:** Priority 1 + Priority 4 (worksheet behavior + CSS decomposition).

This is still workable, but 3 PRs is the better tradeoff between speed and reviewability.
