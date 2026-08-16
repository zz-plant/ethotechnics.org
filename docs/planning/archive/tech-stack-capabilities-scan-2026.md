# Tech stack capability scan (2026)

Snapshot of newer capabilities worth evaluating for the current stack.

Use this as a planning input, not a migration mandate.

Action tracking: see [`tech-stack-upgrade-actions-2026.md`](tech-stack-upgrade-actions-2026.md).

## Baseline in this repository

- Runtime and package manager: Bun 1.3.x
- Framework: Astro 5.x with Cloudflare adapter
- UI islands: React 19.x
- Language and tooling: TypeScript 5.9, ESLint 9, Playwright 1.58
- Deployment target: Cloudflare Workers via Wrangler 4.x

Version source: `package.json` at the repository root.

## Capability opportunities by stack element

### Bun (1.3.x)

- **Mature test and coverage workflow**: Bun test coverage options now support CI-friendly outputs.
  This project already uses lcov reporting in `test:unit:ci`.
- **Node API compatibility improvements**: Newer Bun releases continue reducing edge-case differences
  with Node APIs, which helps mixed toolchains (Astro, ESLint, Playwright).
- **MCP-friendly scripting**: Running local MCP servers through Bun scripts is now straightforward,
  aligning with the existing `bun run mcp` command.

Suggested follow-up:

- Keep Bun pinned to a known-good minor and refresh quarterly with `bun update --latest` in a
  branch, then run full checks.

### Astro (5.x)

- **Content and routing ergonomics**: Astro 5 adds stronger defaults around content collections,
  route typing, and static-first workflows that reduce runtime uncertainty.
- **Islands performance controls**: Client directives and partial hydration controls are improved,
  enabling tighter JavaScript budgets on interactive pages.
- **Build/runtime alignment for edge targets**: Better integration paths for edge adapters,
  including Cloudflare-oriented output and deployment flows.

Suggested follow-up:

- Audit components with `client:*` directives to confirm each island still needs hydration.
- Track Astro release notes for asset pipeline and image optimization improvements that may reduce
  custom handling.

### Cloudflare Workers + Wrangler (4.x)

- **Improved local parity**: Wrangler local development continues to reduce drift between local
  preview and deployed Worker behavior.
- **Observability and diagnostics improvements**: Logs, traces, and debugging ergonomics have
  improved across recent Wrangler/Workers releases.
- **Platform services expansion**: Workers ecosystem capabilities (KV, R2, D1, Queues, AI)
  continue expanding and can support future interactive features without changing hosting.

Suggested follow-up:

- Document which Worker platform bindings are intentionally unused today to keep future adoption
  explicit.
- Add a periodic deploy verification checklist item for Worker runtime flags and compatibility dates.

### React (19.x in Astro islands)

- **Modern concurrent rendering primitives**: React 19 APIs are mature and well supported for
  interactive islands where responsiveness matters.
- **Streaming and selective hydration patterns**: Compatible Astro integration patterns continue to
  improve for progressive rendering.

Suggested follow-up:

- Keep React islands small and bounded; prefer Astro server-rendered markup for static sections.
- Re-check whether any React islands can be replaced with framework-free Astro components.

### TypeScript (5.9)

- **Faster editor and build ergonomics**: TypeScript 5.x line continues improving project service
  performance and type checking speed.
- **Stronger inference and narrowing**: Newer narrowing/inference behavior can reduce manual type
  annotations and improve maintainability.

Suggested follow-up:

- Tighten compiler flags only where they remove real defects, not just stylistic differences.
- Keep shared schema validation (for JSON content) aligned with TypeScript domain types.

### Playwright (1.58)

- **Stronger cross-browser consistency tools**: Recent releases improve diagnostics and failure
  traces for CI.
- **Accessibility and visual testing alignment**: Better compatibility with a11y checks and visual
  regression workflows supports UI quality gates.

Suggested follow-up:

- Expand targeted visual baselines for pages with frequent design iteration.
- Preserve fast feedback by keeping smoke tests minimal and high-signal.

## Recommended quarterly review checklist

- Confirm current versions and latest stable releases for Bun, Astro, Wrangler, React,
  TypeScript, and Playwright.
- Read upstream changelogs for breaking changes and new defaults before upgrading.
- Run `bun run check` and `bun run test:e2e:ci` in an upgrade branch.
- Record upgrade outcomes in a short note under `docs/` so future work has a clear baseline.
