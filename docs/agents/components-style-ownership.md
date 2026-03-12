# Components style ownership map

Class namespaces and their owning files under `src/styles/components/`:

- `navigation.css` (+ `navigation-shell.css`, `navigation-links.css`): `nav__*` shell, links, and
  responsive navigation states.
- `search.css`: `search-*` dialog, trigger, and recent-search widgets.
- `syllabus.css`: `syllabus-*`, `certificate-*`, and `scholarly-meta__*` learning flow sections.
- `intake-form.css`: `intake-form-*` and modern intake interaction patterns.
- `field-notes.css`: `field-notes-*` layout and path browsing components.
- `field-notes-animations.css`: `[data-field-notes-*]` animation-only states.
- `bespoke-pages.css`: page-specific domains such as `quick-signal-*`, `decision-split-*`,
  `feedback-ribbon-*`, `institute-*`, `failure-grid-*`, and `lane-card-*`.

Keep new selectors in the matching domain file and avoid cross-domain namespace reuse.
