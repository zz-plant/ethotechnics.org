# Testing TODOs from the Astro guide

- **Wire up Vitest with Astro config.** Add a `vitest.config.ts` that uses `getViteConfig()` from
  `astro/config` so the test runner respects the project's Vite and Astro settings (site, trailing
  slash behavior, aliases). Create an `npm test` script that runs `vitest` in watch and CI modes.
- **Cover Astro components with the container API.** Add component specs using
  `experimental_AstroContainer` to render and assert against key UI pieces (navigation island,
  layouts, RSS feed metadata) without starting a server. Include slot and prop coverage to prevent
  regressions in rendered HTML.
- **Add end-to-end coverage with Playwright.** Scaffold Playwright via its CLI (TypeScript target,
  `tests/e2e` folder) and point it at `npm run preview` so tests run against the built worker output.
  Capture smoke flows for the homepage, RSS endpoint, and navigation links, and keep the generated
  GitHub Actions workflow to run in CI.
- **Document test expectations.** Update `README.md` once the suites exist with how to run unit,
  component, and e2e tests locally (including any required browsers) so contributors can reproduce
  CI behavior.
