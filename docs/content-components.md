# Content components

Reusable building blocks used across pages and shared layouts. Each entry calls out what the
component is for and where it appears.

## BaseLayout.astro

- Usage: Wraps page content with the global shell, head metadata, navigation, and footer.
- Reference: `src/pages/index.astro`.

## PageIntro.astro

- Usage: Renders the page eyebrow, heading, summary, permalink, and optional breadcrumb JSON-LD.
- Reference: `src/pages/library/index.astro`.

## SectionBlock.astro

- Usage: Wraps section markup with a consistent header layout and optional alternating background.
- Reference: `src/pages/diagnostics/index.astro`.
- Props:
  - `id`: Optional anchor target.
  - `eyebrow`: Small uppercase label above the heading.
  - `title`: Required heading text (`<h2>`).
  - `description`: Optional muted paragraph under the heading.
  - `variant`: Use `"alt"` to append `section--alt` for alternating backgrounds.
  - `className`: Additional classes for custom layout tweaks.

## CardGrid.astro

- Usage: Grid wrapper for collections of cards or similar items.
- Reference: `src/pages/index.astro`.
- Props:
  - `as`: Optional tag name (`div` default).
  - `className`: Extra classes when the grid needs local overrides.

## CardItem.astro

- Usage: Standard card shell with glow, headings, tags, and optional glossary links.
- Reference: `src/pages/index.astro`.
- Props:
  - `id`: Optional anchor for direct links.
  - `eyebrow`: Uppercase label above the body.
  - `meta`: Muted line above the title (e.g., timeframe or type).
  - `title`: Heading text (omit when the slot supplies custom content).
  - `headingLevel`: Heading tag for the title (`h3` default).
  - `description`: Supporting copy under the title.
  - `descriptionTone`: Set to `"default"` to render the description without `muted` styling.
  - `tags`: Renders a `.pill-list` of strings.
  - `glossaryLinks`: `{ href, label }[]` rendered as a comma-separated glossary line.
  - `glossaryLabel`: Override the glossary line label (defaults to "Glossary").
- Slots:
  - Default slot appears after the description (useful for extra paragraphs or metadata).
  - `footer` slot renders after tags and glossary links for permalinks or calls to action.

## Illustration.astro

- Usage: Figure wrapper with a framed image, halo treatment, and optional caption.
- Reference: `src/pages/index.astro`.

## InstituteStudioComparison.astro

- Usage: Glass panel comparison grid between the Institute and Studio offerings.
- Reference: `src/pages/institute/index.astro`.

## CitationBlock.astro

- Usage: Expandable citation formats with copy buttons for APA/MLA/Chicago/BibTeX/RIS.
- Reference: `src/pages/library/cite.astro`.

## ScholarlyMeta.astro

- Usage: Authorship, publication details, license, and changelog callout for published content.
- Reference: `src/pages/diagnostics/llm-capacity-benchmark.astro`.

## DiagnosticMethodology.astro

- Usage: Structured diagnostic methodology section for inputs, procedure, outputs, and validation.
- Reference: `src/pages/diagnostics/llm-capacity-benchmark.astro`.

## FieldNotesTabs.astro

- Usage: Tabbed interface that groups field notes by format and renders cards with glossary links.
- Reference: `src/pages/field-notes/index.astro`.

## PatternFilter.astro

- Usage: Filter, search, and bundle controls for library pattern listings.
- Reference: `src/pages/library/index.astro`.

## Navigation.astro

- Usage: Primary site navigation shell with search, utility links, and the expandable menu.
- Reference: `src/pages/index.astro` (via `BaseLayout.astro`).

## NavSectionList.astro

- Usage: Grouped navigation sections inside the navigation panel.
- Reference: `src/pages/index.astro` (via `Navigation.astro`).

## NavQuickLinks.astro

- Usage: Compact quick links list for the library theme shortcuts in the navigation panel.
- Reference: `src/pages/index.astro` (via `Navigation.astro`).

## NavActions.astro

- Usage: Call-to-action button group inside the navigation panel.
- Reference: `src/pages/index.astro` (via `Navigation.astro`).

## NavUtilityLinks.astro

- Usage: Utility links (GitHub, Studio) used in the navigation bar and panel.
- Reference: `src/pages/index.astro` (via `Navigation.astro`).

## Search.astro

- Usage: Search dialog trigger and Pagefind-powered results UI inside the navigation bar.
- Reference: `src/pages/index.astro` (via `Navigation.astro`).

## Logo.astro

- Usage: Inline SVG wordmark used for the navigation brand mark.
- Reference: `src/pages/index.astro` (via `Navigation.astro`).
