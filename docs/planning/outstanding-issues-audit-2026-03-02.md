# Outstanding issues audit (2026-03-02)

## Scope

- Ran quality and SEO checks to identify current unresolved issues.
- Focused on repository-level blockers and high-impact content/metadata gaps.

## Checks run

1. `bun run lint` ✅
2. `bun run typecheck` ✅
3. `bun run astro:check` ✅
4. `bun run check` ✅
5. `bun test` ⚠️ (fails in this environment because it executes Playwright-style `tests/e2e/*.spec.ts` under Bun test)
6. `bun run seo:audit` ✅ (reports warnings, exits successfully)

## Outstanding issues

### 1) Test runner mismatch in `bun test` path

`bun test` currently discovers `tests/e2e/*.spec.ts` files that use Playwright's test API.
Those specs are not meant to run under Bun's unit-test runner, which causes repeated
`Playwright Test did not expect test.describe() to be called here` failures.

Additionally, `tests/sitemap-and-robots.spec.ts` fails when run this way because Bun test cannot
resolve `astro:content` from `src/utils/sitemaps.ts`.

**Impact**

- Local confidence checks can appear red even when `bun run check` is green.
- Contributor confusion around which command is canonical for CI-like validation.

**Suggested follow-up**

- Keep `bun run check` as the canonical gate.
- Either scope `bun test` to unit-test files only or split scripts so e2e runs exclusively via
  Playwright (`bun run e2e` / `bunx playwright test`).

### 2) SEO warning backlog from automated audit

`bun run seo:audit` reports **164 warnings** across **146 Astro pages**.

Breakdown:

- `missing publishedTime`: **80** warnings
- `low internal links on long pages`: **48** warnings
- `automatic structuredDataType on landing pages`: **29** warnings
- `description length out of target range`: **5** warnings
- `title length out of target range`: **2** warnings

**Impact**

- Lower quality Article JSON-LD coverage.
- Weaker crawl-path reinforcement and topic clustering on long-form pages.
- Reduced control over schema typing for landing pages.

**Suggested follow-up order**

1. Add `publishedTime` (and `modifiedTime` when available) on high-intent article routes.
2. Add contextual internal links on long diagnostics/explainers/agent-toolkit pages.
3. Set explicit `structuredDataType` for landing hubs.
4. Resolve remaining title/description length outliers.

## Immediate status

- Code-quality gate (`bun run check`) is passing.
- Main outstanding work is SEO content-metadata hygiene and test-script ergonomics.
