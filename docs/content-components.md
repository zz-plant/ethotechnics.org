# Content components

Reusable building blocks used across pages and shared layouts. Each entry calls out what the
component is for and where it appears.

## BaseLayout.astro

- Usage: Wraps page content with the global shell, head metadata, navigation, and footer.
- Reference: `src/pages/index.astro`.

## PageIntro.astro

- Usage: Renders the page eyebrow, heading, lede, optional actions and aside panel, and the on-page anchor list (with the sticky section bar when there are four or more anchors).
- Reference: `src/pages/mechanisms/index.astro`.

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

## PromptPackInstallCard.astro

- Usage: Reusable install card for the agent prompt pack download, path, and invocation steps.
- Reference: `src/pages/agent-toolkit/prompt-packs.astro`.
- Props:
  - `title`: Card heading text.
  - `version`: Display version for the prompt pack.
  - `downloadUrl`: Public asset URL for the downloadable file.
  - `pathSnippet`: Repository path snippet where the pack should live.
  - `invokeExample`: Single-line invocation example that matches the pack name.

## Illustration.astro

- Usage: Figure wrapper with a framed image, halo treatment, and optional caption.
- Reference: `src/pages/index.astro`.

## InstituteStudioComparison.astro

- Usage: Glass panel comparison grid between the Institute and Studio offerings.
- Reference: `src/pages/institute/index.astro`.

## CitationBlock.astro

- Usage: Expandable citation formats with copy buttons for APA/MLA/Chicago/BibTeX/RIS.
- Reference: `src/pages/mechanisms/cite.astro`.

## ScholarlyMeta.astro

- Usage: Authorship, publication details, license, and changelog callout for published content. End-matter: place it (with `CitationBlock`) after the page's last content section, not under the intro.
- Reference: `src/pages/diagnostics/llm-capacity-benchmark.astro`.

## DemoFigure.astro

- Usage: The frame every demonstration figure sits in: eyebrow, a title at the heading level of
  wherever the figure is placed, a lede that says what to do, and a slot for the figure itself. A
  demonstration is neither a static diagram nor a diagnostic: it makes one claim felt by letting
  the reader move a control, and it is embedded next to the paragraph that makes the claim.
- Reference: `src/content/standards/std-08-delegation.mdx` (Part C), `src/content/standards/laws.mdx`
  (Laws VIII and XI), `src/content/theory/friction-as-accidental-governance.mdx`.
- Props: `id`, `title`, `lede`, `level` (`"h3"` by default, `"h4"` under a law heading), `eyebrow`,
  `class`.
- Rules the demonstrations follow:
  - Every control is a field on a published object, and a co-located test holds the figure to the
    schema (`src/utils/theater-test.test.ts`, `src/features/beside-the-loop/loopLogic.test.ts`,
    `src/features/withdrawal-figure/withdrawalLogic.test.ts`, `src/utils/ratchet.test.ts`).
    Prose the figure needs is declared next to the essay as an `export const` and checked at build
    (`src/features/friction-figure/frictionLogic.ts`, `src/components/ChainPauseFigure.astro`).
  - Toggle-only figures are `.astro` components with a plain bundled `<script>`
    (`src/components/TheaterTestFigure.astro`); stateful ones follow the diagnostics layout under
    `src/features/<name>/` with pure logic in a tested module and a thin React island hydrated with
    `client:visible`. Nothing is timed or random: runs are turn-based and seeded so they replay.
  - The frame carries `data-glossary-ignore`, because glossary highlighting rewrites text nodes
    before an island hydrates and React then finds markup the server never sent. A `<pre>` inside
    an island carries `data-copy-attached="true"` for the same reason.
  - Each figure ends with one sentence saying what it is not: a measurement of any deployment.
    It carries no method cards; those belong to diagnostics that score real systems.
  - All figure CSS, shared and per-figure, lives in `src/styles/components/figures.css`, and no
    figure ships a stylesheet of its own. The figures render through MDX content, and a stylesheet
    small enough for Astro to inline (under 4 KB) reaches those pages as a `<style>` element whose
    hash is missing from the Content-Security-Policy header, so the browser drops it in
    production; one linked stylesheet is allowed by `style-src 'self'`. `figures.test.ts` holds the
    file above the limit. A wide drawing scrolls inside the frame at every viewport
    (`contain: inline-size` on the figure keeps its min-width from widening the standards column).

## Static diagrams (`*Diagram.astro`, STD-07 and validator drawings)

- Usage: a hand-drawn SVG inside a `<figure class="state-diagram">` (explainers, theory essays,
  standards) or `<figure class="standard-diagram">` (STD-01, STD-07), with a `figcaption` or an
  SVG `<title>`/`<desc>` and `role="img"`.
- Rules:
  - Text uses the shared classes: `.state-diagram__state` (title), `.state-diagram__label`, and
    `.state-diagram__clause` (emphasized label), in `src/styles/components/reference-tables.css`.
    Record drawings use the scoped vocabulary (`.title`, `.label`, `.small`, `.ink`, `.muted`,
    `.chip`…) at the end of `figures.css`, and each one imports that stylesheet in its
    frontmatter, because the pages they sit on do not load it otherwise. Avoid `font-size`
    attributes on `<text>`; the class sizes override them. A `fill` or `stroke` attribute on a
    node or label does win: the shared defaults only apply where the drawing sets none.
  - Every label renders at 11px or larger at desktop width and on a 375px phone. Below 720px a
    diagram does not shrink: it keeps a minimum width (state 760px, chain 900px, record 800px)
    and scrolls sideways in a scroller that breaks out to the screen edges. Labels are larger
    there (14px), so leave line pitch for them.
  - No `<style>` inside an `<svg>`: it reaches the page inline with no Content-Security-Policy
    hash, and production drops it. Colors come from theme tokens (`--text`, `--muted`,
    `--accent`, `--accent-strong`, `--border`, `--panel`, `--surface`, `--status-danger`…), never
    from a custom property no stylesheet defines.
  - `src/components/__tests__/diagram-sources.test.ts` enforces the last two rules and checks
    that every class drawn with is defined somewhere.

## DiagnosticMethodology.astro

- Usage: Structured diagnostic methodology section for inputs, procedure, outputs, and validation.
- Reference: `src/pages/diagnostics/llm-capacity-benchmark.astro`.

## FieldNotesTabs.astro

- Usage: Tabbed interface that groups field notes by format and renders cards with glossary links.
- Reference: `src/pages/field-notes/index.astro`.

## PatternFilter.astro

- Usage: Filter, search, and bundle controls for library pattern listings.
- Notes: Bundle actions stay enabled; when nothing is selected, actions prompt via the bundle status
  line and focus the first mechanism checkbox.
- Reference: `src/pages/mechanisms/index.astro`.

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
