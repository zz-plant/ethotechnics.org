# Tech debt inventory — 2026-02-18

This inventory captures current technical debt observed during repository checks and targeted codebase scans.

## How this inventory was produced

- Run `bun run check` to capture current lint, type, Astro, validation, and unit-test health.
- Scan for large files and probable maintenance hotspots under `src/`.
- Scan for content-source overlap between `src/content/*.json` and `src/content/*.ts`.
- Scan for unreferenced content modules that may no longer be in active use.

## Priority debt register

## 1) Deprecated MCP SDK signatures in `scripts/mcp-server.ts` (high)

- `astro check` reports repeated deprecation hints (`ts(6387)`) for `server.tool`,
  `server.resource`, and `server.prompt` registrations.
- This does not fail checks today, but it increases break risk on future MCP SDK upgrades.

Suggested next step:

- Migrate tool/resource/prompt registration calls to the current `@modelcontextprotocol/sdk`
  API signatures in a focused refactor PR.

## 2) Duplicate content sources across JSON and TypeScript (high)

- `src/content` contains same-topic JSON + TypeScript pairs for `glossary`, `home`,
  `library`, `participation`, and `taxonomy`.
- The docs define JSON as the canonical content source and TS as typing/helpers; keeping
  full content in both formats creates drift risk and duplicate editing overhead.

Suggested next step:

- Define one canonical source per collection (prefer JSON), then generate or derive typed
  runtime helpers from that source to remove manual duplication.

## 3) Unreferenced content module: `src/content/participation.ts` (medium)

- Repository import scan shows no consumers of `src/content/participation.ts`.
- The file appears to duplicate page content that also exists in `src/content/participation.json`.

Suggested next step:

- Confirm whether this module is intentionally staged or obsolete.
- If obsolete, remove it and keep `participation.json` as canonical content.

## 4) Astro inline-script hints on route metrics script tags (medium)

- `astro check` reports hints that script tags with `type` and `src` attributes are treated as
  `is:inline`, and asks to mark `is:inline` explicitly.
- Affected pages include diagnostics index, failure detail, and quick-start.

Suggested next step:

- Add explicit `is:inline` where intended, or migrate to processed script patterns if future
  TypeScript/module processing is needed.

## 5) Large monolithic files that slow review and increase change risk (medium)

- Several files are unusually large (`src/content/glossary.json`, `src/styles/components.css`,
  `src/pages/tools/burden-budget-worksheet.astro`, `src/pages/standards/index.astro`,
  `src/pages/glossary/index.astro`).
- Large single files raise merge conflict frequency and make targeted QA harder.

Suggested next step:

- Split by domain/section (for example: CSS partials by component family, page sections into
  partial Astro components, large data into paged bundles).

## 6) Deprecated DOM APIs in interactive features (low)

- `astro check` reports deprecated browser APIs still in use:
  - `document.execCommand("copy")` in maintenance simulator.
  - `printWindow.document.write(...)` in burden-budget worksheet print flow.
- These continue to work today but represent forward-compatibility debt.

Suggested next step:

- Replace with modern Clipboard API (`navigator.clipboard.writeText`) and safer print rendering
  patterns where browser support allows.

## Debt follow-up plan

- Track each item as a dedicated issue with owner, target milestone, and rollback notes.
- Address high-priority debt first in small, reviewable PRs.
- Re-run this inventory monthly or after major framework and SDK upgrades.
