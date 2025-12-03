# Content components

Reusable wrappers for sections and cards to keep markup consistent across pages.

## SectionBlock.astro

- Wraps `<section>` markup with the shared header layout.
- Props:
  - `id`: Optional anchor target.
  - `eyebrow`: Small uppercase label above the heading.
  - `title`: Required heading text (`<h2>`).
  - `description`: Optional muted paragraph under the heading.
  - `variant`: Use `"alt"` to append `section--alt` for alternating backgrounds.
  - `className`: Additional classes for custom layout tweaks.

## CardGrid.astro

- Simple `.grid` wrapper for card collections.
- Props:
  - `as`: Optional tag name (`div` default).
  - `className`: Extra classes when the grid needs local overrides.

## CardItem.astro

- Standard card shell with glow, headings, tags, and optional glossary links.
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
