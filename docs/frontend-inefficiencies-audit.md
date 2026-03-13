# Front-end inefficiencies and antipatterns audit

## Scope

This audit identifies ten front-end inefficiencies/antipatterns currently present in the codebase,
with concrete evidence and suggested remediations.

## Findings

1. **Desktop and mobile nav trees are rendered together on every page.**
   - Evidence: `Navigation.astro` renders both `<NavigationDesktop />` and `<NavigationMobile />` in the same response.
   - Why it matters: duplicates nav markup and link nodes in the DOM, increasing HTML transfer and parse cost.
   - Recommendation: server-render a single nav variant per breakpoint strategy (or progressively enhance one tree).

2. **Homepage-only hash tracking logic ships in the global navigation script.**
   - Evidence: global `<script>` in `Navigation.astro` is included with nav, then gated at runtime by `if (window.location.pathname === "/")`.
   - Why it matters: non-home pages still download/parse code they never execute.
   - Recommendation: move this logic into a home-page-only script/module.

3. **Search UI is duplicated across desktop and mobile nav.**
   - Evidence: both nav variants include `<Search />` (`NavigationDesktop.astro` and `NavigationMobile.astro`).
   - Why it matters: repeated dialog/controls markup and IDs add DOM weight and initialization overhead.
   - Recommendation: mount one shared dialog and expose multiple triggers instead of multiple full instances.

4. **Search bootstrap module is attached per `<Search />` instance.**
   - Evidence: `Search.astro` emits `<script type="module" src={searchModalScript} is:inline></script>` inside each component instance.
   - Why it matters: repeated module tags add orchestration overhead and can cause repeated bootstrap work.
   - Recommendation: include search bootstrap once at layout level and register instances declaratively.

5. **Three diagnostics pages force full React client rendering (`client:only`).**
   - Evidence: `capacity-forecaster`, `burden-modeler`, and `maintenance-simulator` each mount widgets with `client:only="react"`.
   - Why it matters: zero SSR for these views and larger JS hydration/download burden before interaction.
   - Recommendation: prefer SSR + selective islands (`client:idle`/`client:visible`) where possible.

6. **Large near-duplicate inline diagnostic scripts exist across pages.**
   - Evidence: `evidence-pack-readiness.astro` and `escalation-coverage-planner.astro` both embed long, similar form/state/URL logic blocks.
   - Why it matters: duplicated logic increases bundle weight, drift risk, and long-term maintenance cost.
   - Recommendation: extract shared scoring/form persistence utilities to reusable modules.

7. **Pattern cards embed full JSON payloads inline per card.**
   - Evidence: each card outputs a `type="application/json"` script with full pattern data in `PatternFilter.astro`.
   - Why it matters: inflates HTML payload and duplicates data already represented in rendered DOM.
   - Recommendation: emit a compact index once per page (or fetch lazily) instead of per-card payload blobs.

8. **Pattern payloads are synchronously parsed card-by-card at startup.**
   - Evidence: `pattern-filter.ts` loops through cards and `JSON.parse`s each payload on initialization.
   - Why it matters: front-loads CPU work on page load, especially as card count grows.
   - Recommendation: precompile one structured payload, and defer heavy parsing until first interaction.

9. **Filtering recomputes per-card filter arrays on every apply cycle.**
   - Evidence: `applyFilters()` repeatedly splits/trims `data-filters` attributes for every card.
   - Why it matters: unnecessary repeated allocations and string processing during search/filter interactions.
   - Recommendation: precompute normalized filter tokens once during initialization.

10. **`PageIntro` repeats anchor-list markup across three branches.**
    - Evidence: `anchorLinks.map(...)` rendering is duplicated in collapsed, mobile-collapsed, and default branches.
    - Why it matters: larger templates and HTML output paths, plus higher risk of inconsistent behavior/styling.
    - Recommendation: extract a shared anchor list partial/component and vary only wrapper behavior.
