# Tech stack upgrade actions (2026)

Consolidated execution log for dependency and platform maintenance work in 2026.

Related planning input: [`tech-stack-capabilities-scan-2026.md`](tech-stack-capabilities-scan-2026.md).

## Q1 (near-term actions)

### 1) Audit Astro hydration usage (`client:*` directives)

**Status:** Completed

- Audited all hydration directives with:
  - `rg "client:(load|idle|visible|media|only)" -n src`
- Current usage is limited to three diagnostics widgets, all mounted with `client:only="react"`:
  - `src/pages/diagnostics/capacity-forecaster.astro`
  - `src/pages/diagnostics/burden-modeler.astro`
  - `src/pages/diagnostics/maintenance-simulator.astro`
- Decision: keep as-is for now because each page is primarily interactive and requires client-side
  state.

### 2) Document current Cloudflare Worker binding posture

**Status:** Completed

- Verified `wrangler.toml` bindings and runtime settings.
- Documented that the project currently relies on the static asset binding only (`ASSETS`) and
  does not use KV, D1, R2, Queues, Durable Objects, or AI bindings.

### 3) Add deploy verification checks for runtime compatibility settings

**Status:** Completed

- Expanded deployment verification guidance to include checks for:
  - `compatibility_date` drift versus current recommended Worker runtime date.
  - `compatibility_flags` changes, especially `nodejs_compat` behavior.

## Q2 (mid-term actions)

### 1) Refresh core stack package versions

**Status:** Completed

Updated `package.json` with focused upgrades:

- `astro`: `^5.16.3` → `^5.17.1`
- `wrangler`: `4.50.0` → `4.63.0`
- `@playwright/test`: `^1.57.0` → `^1.58.2`

No changes were needed for:

- `typescript` (already at `5.9.3`)
- `@astrojs/cloudflare` (already at latest `12.6.12`)

### 2) Validate the refresh with full repository checks

**Status:** Completed

Validation command:

- `bun run check`

Outcome:

- Lint, typecheck, Astro diagnostics, JSON/glossary validators, and unit tests completed with zero
  errors.

### 3) Record remaining medium-horizon work

**Status:** Completed

Recommended follow-on items after this refresh:

- React and React DOM were upgraded to 19.2.x in this cycle; keep Astro island coverage under
  observation in the next release.
- Re-run visual and end-to-end suites in CI after any future framework major-version changes.
