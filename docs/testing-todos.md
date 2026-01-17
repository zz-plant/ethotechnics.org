# Testing overview

Current suites cover unit/component behavior with Bun test and smoke end-to-end flows with
Playwright.

## Bun unit and component tests

- Bun test configuration lives in [`bunfig.toml`](../bunfig.toml), which preloads
  [`src/test/preload.ts`](../src/test/preload.ts) to register happy-dom and mock Astro virtual
  modules. Run `bun test` for local coverage and `bun run test:unit:ci` for a full run with the lcov
  reporter.
- Component specs live in [`src/components/__tests__/`](../src/components/__tests__/), relying on
  [`src/test/astro-container.ts`](../src/test/astro-container.ts) to render Astro components without
  starting a server. Extend coverage there by adding new `*.test.ts` files or assertions alongside
  existing fixtures like `NavigationShell.astro`.

## Astro container usage

- Use `createAstroContainer` and `parseHtml` from
  [`src/test/astro-container.ts`](../src/test/astro-container.ts) to render components and query the
  resulting DOM. This keeps component tests fast while exercising slots, props, and rendered markup.

## Playwright smoke coverage

- End-to-end smoke tests live in [`tests/e2e/`](../tests/e2e/) and run against `bun run preview`
  via `playwright.config.ts`. They cover navigation flows, syllabus rendering, diagnostics scripts,
  accessibility checks, console-clean guardrails, and Core Web Vitals budgets for the homepage.
- Run `bun run test:e2e` locally to build and execute the suite with the HTML reporter, or
  `bun run test:e2e:ci` to use the line reporter in CI. Respect `PLAYWRIGHT_BASE_URL` or
  `CF_PAGES_URL` if you already have a preview running.
- If Playwright installation fails due to missing system packages, rerun
  `bunx playwright install --with-deps` to pull the required dependencies before retrying the
  suite.
