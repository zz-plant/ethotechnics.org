# Components style ownership map

Class namespaces and their owning files under `src/styles/components/`:

- `navigation.css` (+ `navigation-shell.css`, `navigation-links.css`): `nav__*` shell, links, and
  responsive navigation states.
- `search.css`: `search-*` dialog, trigger, and recent-search widgets.
- `site-search.css`: `.site-search-*` /search page controls and results.
- `syllabus.css`: `syllabus-*`, `certificate-*`, and `scholarly-meta__*` learning flow sections.
- `intake-form.css`: `intake-form-*` and modern intake interaction patterns.
- `field-notes.css`: `field-notes-*` layout and path browsing components.
- `field-notes-animations.css`: `[data-field-notes-*]` animation-only states.
- `home.css`: homepage sections (`audience-*`, `output-*`, `workflow-map-*`, `agents__*`).
- `pattern-browser.css`: pattern library (`pattern-*`, `mechanism-*`, `library-*`, `tracks-*`,
  `tag-rail-*`, `pattern-drawer`, `drawer-section`).
- `glossary.css`: glossary pages (`glossary-*`, `glossary-entry-*`, `glossary-filter-*`,
  `glossary-index-*`).
- `glossary-highlights.css`: the term markers and hover cards that `glossary-highlights.ts`
  puts into running prose on every page (`glossary-highlight`, `glossary-peek-card*`). Global.
- `standards.css`: standards and diagrams (`standard-*`, `standards-timeline-*`,
  `rights-matrix-*`, `diagram-spec-*`, `validator-*`, `mechanism-sheet-*`, `binding-*`,
  `temporal-diagram-*`). Imported only by the two `/standards` pages.
- `mapping-table.css`: the comparison and mapping tables (`mapping-table`,
  `mapping-table--compare`, `mapping-table__wrapper`). Global, because seven pages use the
  class; below 720px a comparison stacks each row into a card captioned from `data-label`.
- `diagnostics.css`: diagnostics workspace (`diagnostics-*`, `diagnostic-tool-*`).
- `research.css`: research index (`research-*`, `research-filter-*`).
- `shell.css`: page shell and chrome (`page-shell-*`, `scroll-progress`, `back-to-top`,
  `theme-toggle-*`, `preference-control`, `footer__preferences`).
- `button-pill.css`: pill, button, copy-button, status-pill, and `pill-list-*` clusters.
- `bespoke-pages.css`: page-specific domains such as `quick-signal-*`, `decision-split-*`,
  `feedback-ribbon-*`, `institute-*`, `failure-grid-*`, and `lane-card-*`.
- `hero.css`: the page hero (`hero-*`, `info-strip-*`, `illustration-*`).
- `sections.css`: section rhythm and page intros (`section-*`, `page-intro-*`, `breadcrumbs-*`,
  `page-breadcrumbs-*`, `step-list-*`, `features-*`, `divider-wave`).
- `cards-panels.css`: cards, tiles, panels and callouts (`card-*`, `tile-*`, `panel-*`,
  `callout-*`, `highlight-*`, `comparison-*`, `status-badge-*`).

Keep new selectors in the matching domain file and avoid cross-domain namespace reuse.

Only the sheets `src/styles/global.css` imports load on every page: `navigation.css`, `search.css`, `shell.css`, `hero.css`, `button-pill.css`, `cards-panels.css`, `sections.css`, `mapping-table.css`, `home.css`, `site-search.css`, `bespoke-pages.css`, `glossary-highlights.css`.
The rest are imported by the pages that use them. A class used on more than one page must live
in a global sheet: the mapping table lived in `standards.css` and rendered as a bare `<table>` on
six of its seven pages until #852 moved it.

Shared tokens (colors, radii, spacing, motion, shadows) live in `src/styles/theme.css`. Add new
values there before hardcoding; dark-mode variants are declared in both dark blocks
(`prefers-color-scheme: dark` and `:root.dark`).
