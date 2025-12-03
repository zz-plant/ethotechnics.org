# Testing to-dos inspired by Astro's guide

- Add a `vitest.config.ts` that uses `defineConfig` from `vitest/config` with the `astro()` plugin,
  aligns test `root`/`alias` settings with `astro.config.mjs`, and enables `environment: 'jsdom'` for
  any component tests.
- Create a minimal component test suite (e.g., for `src/components/Navigation.tsx`) using Vitest's
  Container API to render Astro or React islands and assert meta tags or link rendering.
- Wire an npm script (e.g., `npm run test`) to run the Vitest suite and ensure it is included in the
  existing `npm run check` chain.
- Scaffold Playwright for end-to-end coverage with a `playwright.config.ts` that either reuses an
  existing dev server or starts one via the `webServer` option. Add `npm run test:e2e` and document
  how to run the HTML reporter (`npx playwright show-report`).
- Add an example Playwright spec under `src/test/` that hits the home page, verifies the `<title>`
  and primary navigation links, and is safe to run against both the dev server and a production
  preview build.
- Record in `README.md` how to run the Vitest and Playwright suites so future contributors can run
  them locally and in CI.
