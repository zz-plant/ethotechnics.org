# Page specifications

Detailed, testable expectations for each route. Use these specs when adding content, refactoring layouts, or writing automated checks so every section renders the right data with consistent accessibility behaviors.

## Home (`/`)

- **Data sources:** Pull the `home` entry via `getEntry("home", "home")` from the content
  collection (`src/content/home.json`); do not inline copy.
- **Layout:**
  - Hero uses the two-column layout with the beam canvas, headline stack, action buttons, and a figure with AVIF image defaults and figcaption when provided.
  - Retain the "How this works" info strip with two badges (Institute charter, CC BY 4.0 license) and maintain `aria-label` values on the badge list.
  - `about` renders as a `section` with a three-card bento grid; `features` uses a `grid--two` layout with the illustration in the first column and a nested two-column card grid in the second.
  - `highlight` includes the callout block with a list of three actions and a pill rail; `cta` ends the page with two actions rendered as `<a class="button">` links.
- **Accessibility:**
  - Single `<h1>` in the hero; subsequent sections use `<h2>` and cards use `<h3>` to preserve hierarchy.
  - Hero metrics list exposes `aria-label` text on the sparkline SVGs; pill lists remain unordered lists to keep screen-reader grouping.
  - External links include `rel="noreferrer"`; maintain visible focus states on buttons and pills.

## Start here (`/start-here`)

- **Data sources:** Pull all copy, anchor links, buttons, and CTAs from `startHereContent` in
  `src/content/start-here.ts`; the artifact previews also feed the syllabus page.
- **Layout:**
  - Hero uses `PageIntro` with anchor links and a panel description; keep the hero actions row in the
    routes section so buttons map to diagnostics and PDF samples.
  - Routes section shows the action buttons from the hero above a two-column card grid for navigation.
  - Artifacts section renders preview cards with notes and primary buttons linking to the sample PDFs.
  - Framing section uses two lists (This page is / is not) in a `grid--two` layout.
  - Studio section keeps the bullet list and ghost CTA inside a banded `SectionBlock`.
  - Footer CTA ends the page with primary and ghost links pulled from `footerCta`.
- **Accessibility:**
  - Intro anchors match section IDs for keyboard-friendly jumps.
  - All CTA buttons supply `aria-label` fallbacks from `startHereContent` (including hero and card
    actions).
  - List content for routes, framing, and bullets stays as semantic `<ul>` groups.

## Research (`/research`)

- **Data sources:** Use `researchContent` from `src/content/research.ts`; glossary cross-links derive labels via `getGlossaryLabel` and `glossaryContent.permalink`.
- **Layout:**
  - `PageIntro` must include four anchor links (Orientation, Agenda, Focus areas, Publications) and panel copy describing glossary cross-linking.
  - Each SectionBlock renders a `CardGrid`; Agenda and Focus Areas cards show tags and glossary links per entry, Publications cards include `meta` for type.
  - Keep the `grid--two` modifier on the Orientation section to retain the two-column card layout.
- **Accessibility:**
  - Anchor links in the intro map to matching section IDs; glossary links expose readable labels (no raw slugs).
  - Card tags render as unordered lists; glossary links sit in the `footer` slot for consistent keyboard traversal.

## Diagnostics (`/diagnostics` landing)

- **Data sources:** Read from `diagnosticsContent` in `src/content/diagnostics.ts` and `libraryContent.permalink` for pattern language anchors.
- **Layout:**
  - `PageIntro` anchors mirror every tool slug and the panel copy lists the results off-ramp and pattern linkage.
  - Each tool section alternates background with `section--alt` on even indexes, contains a header (eyebrow, `<h2>`, muted description), action buttons (primary to CTA, ghost to examples), two cards for readiness and outputs, and a callout referencing pattern language and `offRampNote`.
- **Accessibility:**
  - CTA buttons include `aria-label` fallbacks (`ctaAriaLabel` or default to text) and example links announce the tool title.
  - Lists of readiness and outputs remain semantic `<ul>` groups.
  - Off-ramp copy includes an inline link to the pattern language with descriptive text.

## Diagnostics — Technical Capacity Forecaster (`/diagnostics/capacity-forecaster`)

- **Data sources:** Uses the React widget at `src/features/capacity-forecaster/CapacityForecaster` with static header copy in the page frontmatter.
- **Layout:** Single `section` with `section__header` for eyebrow, `<h1>`, two muted paragraphs (tool purpose and modeling assumptions link), and a permanent-link paragraph followed by the widget.
- **Accessibility:**
  - Ensure the external modeling guide link stays descriptive and opens in the same tab (no `target` override).
  - The widget must retain keyboard support for sliders and export actions per the feature tests; keep it wrapped in the section for landmark navigation.

## Library (`/library`)

- **Data sources:** Pull `libraryContent` from `src/content/library.ts` and `diagnosticsContent.tools` for diagnostic title mapping in PatternFilter.
- **Layout:**
  - `PageIntro` anchor links cover Themes, Primer, Glossary, Pattern language, and Syllabus with panel copy explaining filters.
  - Themes render as a pill rail with descriptions and hint text; Primer, Glossary, Patterns, and Syllabus each use `SectionBlock` with `CardGrid` children.
  - Patterns section renders hidden anchor spans matching filter slugs and the interactive `PatternFilter` component.
- **Accessibility:**
  - Theme pills are `<a>` elements with `aria-label` describing the jump target; glossary cards include permalinks in the footer slot.
  - PatternFilter must preserve keyboard navigation and announce applied filters; ensure diagnostic links expose the mapped tool title.

## Syllabus (`/syllabus`)

- **Data sources:**
  - Modules pull from `libraryContent.syllabus.modules` with IDs generated from titles and linked
    diagnostics pulled from `diagnosticsContent.tools`.
  - Required artifacts and preview links reuse `startHereContent.artifacts.previews` for reading links
    and PDF CTAs.
  - Knowledge checks, module resources, and certificate strings live in `src/pages/syllabus/index.astro`
    and hydrate client-side.
- **Layout:**
  - Intro anchors cover required artifacts, modules, and certificate sections with a panel explaining
    the syllabus flow.
  - Required artifacts section shows the two preview cards with notes and compact primary buttons.
  - Module grid renders `panel` cards with module number/duration, topics list, required readings list
    plus checkbox acknowledgment, knowledge check radio group, and linked references to library and
    diagnostic pages.
  - Module footers keep primary completion and ghost reset buttons with status copy underneath.
  - Certificate block contains PDF download and share buttons, a list of completed modules with linked
    references, and a shareable link input with status text.
- **Accessibility:**
  - Knowledge check options render as grouped radio inputs with `aria-label` on the wrapper for screen
    readers.
  - Completion buttons toggle `aria-pressed` and stay disabled until readings and quizzes are satisfied;
    reset keeps modules keyboard accessible.
  - Shareable link input remains read-only with polite live region updates; the `completed` query param
    preselects finished modules and updates state without user interaction.

## Glossary (`/glossary`)

- **Data sources:** `glossaryContent` provides index, territory map data, and category entries; filter script sourced via `glossary-filter.ts`.
- **Layout:**
  - `PageIntro` anchors include A–Z index, territory map, and each category heading; panel copy covers permalink usage.
  - Index section contains a search input with visible label, counts in the description, and a UL of results grouped by letter.
  - Territory map lists categories with entry counts; category sections render `SectionBlock` with entry cards that include HTML descriptions.
- **Accessibility:**
  - Search input uses `type="search"` and a visually hidden label; maintain `aria-live` region for result counts from the filter script.
  - Each entry exposes an `id` for permalink targets; ensure headings remain `<h3>` within cards to keep the hierarchy intact.

## Field Notes (`/field-notes`)

- **Data sources:** Driven by `fieldNotesContent` with `sections` and `entries`; glossary links use `glossaryContent.permalink`.
- **Layout:**
  - `PageIntro` anchors match each section `format` slug and panel copy explains glossary linkage.
  - `FieldNotesTabs` renders tabs for each section with tablist/tabpanel semantics and per-entry cards showing metadata, summary, and glossary links.
- **Accessibility:**
  - Tabs must remain keyboard-navigable (arrow keys cycling, Enter/Space activating) and expose `role="tablist"`/`role="tab"`/`role="tabpanel"`.
  - Entries include semantic lists for tags; glossary links use readable labels instead of slugs.

## Participate (`/participate`)

- **Data sources:** Source hero, pathway cards, tags, and actions from `participationContent` in
  `src/content/participation.ts`.
- **Layout:**
  - Hero uses `PageIntro` anchors to jump to each participation pathway and panel copy explaining
    evidence collection.
  - Field-report, peer-review, and clinic cards keep their `id` values for anchors, display tags, and
    nest action buttons as ordered in the content.
  - Feedback strip uses the eyebrow/title/description plus two action buttons from `feedback.actions`.
- **Accessibility:**
  - Anchor links in the intro map to each pathway `id` and the feedback section.
  - Badge and tag lists render as semantic lists; action buttons include `aria-label` text when
    provided in `participationContent`.
  - Feedback actions remain real `<a>` elements for predictable focus and activation behavior.

## Institute (`/institute`)

- **Data sources:** Use `instituteContent` for sections and `instituteStudioComparisonContent` for the comparison component.
- **Layout:**
  - `PageIntro` anchors cover the overview, programs, Studio partnership, governance, stewards, and contact.
    Panel copy explains how to escalate to the Studio.
  - Overview uses a banded `SectionBlock` with a two-column `CardGrid` of highlights. Programs uses the
    alt section variant with descriptive cards and muted outcomes. Studio partnership wraps
    `InstituteStudioComparison` inside a standard section. Governance returns to the banded style; stewards
    stay alt with meta lines; contact retains descriptive links in a standard section.
- **Accessibility:**
  - Anchor IDs match intro links; steward cards keep names as headings with roles in `meta`.
  - Contact links are descriptive (no bare URLs); list items remain `<li>` elements for screen-reader grouping.

## Finite (`/finite`)

- **Data sources:** Renders static legal and policy copy from `src/content/finite.ts`.
- **Layout:** Single-page content structured with `PageIntro` and subsequent sections for service scope, SLAs, and data handling; keep ordered/unordered lists as authored.
- **Accessibility:** Preserve heading levels as written (`<h1>` in intro, `<h2>` per section); ensure any email or link text is descriptive.

## Donate (`/donate`)

- **Data sources:** Uses `src/content/donate.ts` for hero and contribution options.
- **Layout:**
  - Landing hero includes eyebrow, `<h1>`, muted description, and a two-action row (primary donation link, ghost transparency/reporting link).
  - Subsequent sections outline contribution methods and stewardship notes using `SectionBlock` and `CardGrid`.
- **Accessibility:**
  - External donation links carry `rel="noreferrer"` and explicit `aria-label` text describing the destination.
  - Lists of contribution options use bullets; ensure the primary CTA remains a true link (<a>) to support right-click/save target behaviors.

## RSS feed (`/rss.xml`)

- **Data sources:** Combines the site title and description from the home content collection via
  `getEntry("home", "home")` with recent entries returned by `loadRecentContent()` (async); items
  missing required fields or invalid dates are skipped.
- **Layout:**
  - Emits standard RSS 2.0 XML with channel metadata (`<title>`, `<link>`, `<description>`, `<language>`).
  - Each `<item>` includes a title, link/guid pair pointing to the content path, a CDATA-wrapped description, and a UTC pubDate.
  - Falls back to `https://ethotechnics.org` when the runtime `site` origin is absent.
- **Accessibility:**
  - Escapes XML-reserved characters in titles and descriptions to avoid malformed feeds.
  - Sets `Cache-Control: public, max-age=3600` and `Content-Type: application/rss+xml; charset=utf-8` headers so readers and aggregators receive a correctly typed, cacheable feed.
