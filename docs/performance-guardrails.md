# Performance guardrails

Keep the site fast and stable with explicit budgets enforced in automation.

## Budgets and checks

- CLS must remain 0 for primary page loads.
- LCP must stay under 2.5 seconds on the homepage.
- Console output must remain clean (no warnings or errors) on core routes.

## Where the checks live

- Playwright validates budgets and console output in `tests/e2e/quality.spec.ts`.
- Run the checks with `bun run test:e2e` after updating layouts, styles, or content that could
  affect rendering performance.

## When to review manually

- Record manual timing notes in the PR summary if you change hero imagery, typography, or global
  layout.
- If performance budgets fail locally, reduce LCP contributors before merging (optimize imagery,
  defer non-critical scripts, and avoid layout shifts).
