# Testing overview

Current suites cover unit/component behavior with Vitest and smoke end-to-end flows with
Playwright.

## Vitest unit and component tests
- Vitest shares the project's Astro/Vite settings through
  [`vitest.config.ts`](../vitest.config.ts). Run `npm test` during development for watch mode and
  `npm run test:ci` for a full run with coverage.
- Component specs live in [`src/components/__tests__/`](../src/components/__tests__/), relying on
  [`src/test/astro-container.ts`](../src/test/astro-container.ts) to render Astro components without
  starting a server. Extend coverage there by adding new `*.test.ts` files or assertions alongside
  existing fixtures like `NavigationShell.astro`.

## Astro container usage
- Use `createAstroContainer` and `parseHtml` from
  [`src/test/astro-container.ts`](../src/test/astro-container.ts) to render components and query the
  resulting DOM. This keeps component tests fast while exercising slots, props, and rendered markup.

## Playwright smoke coverage
- End-to-end smoke tests live in [`tests/e2e/`](../tests/e2e/) and run against `npm run preview` via
  `playwright.config.ts`. They currently cover the homepage hero, navigation interactions, and the
  RSS feed.
- Run `npm run e2e` locally to build and execute the suite with the HTML reporter, or
  `npm run e2e:ci` to use the line reporter in CI. Respect `PLAYWRIGHT_BASE_URL` or
  `CF_PAGES_URL` if you already have a preview running.
