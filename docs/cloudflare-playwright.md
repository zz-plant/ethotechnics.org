# Cloudflare Playwright testing

- Cloudflare Pages can run the existing Playwright suite directly using the
  `CF_PAGES_URL` provided for each preview or production deployment.
- The shared `playwright.config.ts` now prefers `CF_PAGES_URL` and skips starting
  the local preview server when that variable is present.
- Enable testing in the Cloudflare dashboard for the project and point it at the
  repo so Pages runs the suite after building the Worker bundle.
- Local runs continue to work with `npm run e2e` and `PLAYWRIGHT_BASE_URL` when
  targeting a custom preview host.
