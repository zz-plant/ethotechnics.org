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
  `glossary-index-*`, `glossary-highlight-*`).
- `standards.css`: standards and diagrams (`standard-*`, `standards-timeline-*`,
  `mapping-table-*`, `rights-matrix-*`, `diagram-spec-*`, `validator-*`, `mechanism-sheet-*`,
  `binding-*`, `temporal-diagram-*`).
- `diagnostics.css`: diagnostics workspace (`diagnostics-*`, `diagnostic-tool-*`).
- `research.css`: research index (`research-*`, `research-filter-*`).
- `shell.css`: page shell and chrome (`page-shell-*`, `scroll-progress`, `back-to-top`,
  `theme-toggle-*`, `preference-control`, `footer__preferences`).
- `button-pill.css`: pill, button, copy-button, status-pill, and `pill-list-*` clusters.
- `bespoke-pages.css`: page-specific domains such as `quick-signal-*`, `decision-split-*`,
  `feedback-ribbon-*`, `institute-*`, `failure-grid-*`, and `lane-card-*`.

Keep new selectors in the matching domain file and avoid cross-domain namespace reuse.

Shared tokens (colors, radii, spacing, motion, shadows) live in `src/styles/theme.css`. Add new
values there before hardcoding; dark-mode variants are declared in both dark blocks
(`prefers-color-scheme: dark` and `:root.dark`).
