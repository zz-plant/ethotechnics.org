# Tech stack near-term upgrade actions (2026 Q1)

Status log for the near-term actions proposed in
[`tech-stack-capabilities-scan-2026.md`](tech-stack-capabilities-scan-2026.md).

## Completed actions

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
- Documented that the project currently relies on the static asset binding only (`ASSETS`) and does
  not use KV, D1, R2, Queues, Durable Objects, or AI bindings.

### 3) Add deploy verification checks for runtime compatibility settings

**Status:** Completed

- Expanded deployment verification guidance to include checks for:
  - `compatibility_date` drift versus current recommended Worker runtime date.
  - `compatibility_flags` changes, especially `nodejs_compat` behavior.

## Next phase

- Mid-term dependency refresh work is tracked in
  [`tech-stack-upgrade-actions-2026-q2.md`](tech-stack-upgrade-actions-2026-q2.md).
