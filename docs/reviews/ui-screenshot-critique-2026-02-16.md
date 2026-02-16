# UI screenshot critique — 2026-02-16

## Scope and method

Captured key pages and sections from a local Astro dev server to evaluate:

- Information hierarchy
- Scannability
- Navigation clarity
- CTA prioritization

Pages reviewed:

- Home (`/`)
- Standards (`/standards/`)
- Diagnostics (`/diagnostics/`)
- Library (`/library/`)

Screenshot artifacts:

- `home-full.png`
- `home-hero-section.png`
- `standards-top.png`
- `diagnostics-top.png`
- `diagnostics-main.png`
- `library-top.png`

## Page-by-page critique

### 1) Home (`/`)

**What works**

- Strong voice and mission framing above the fold.
- Editorial tone matches the site’s governance and ethics focus.

**Observed friction**

- The first viewport carries multiple competing ideas before a clear primary action.
- Secondary exploration options appear early and can dilute the main conversion path.

**Suggested change**

- Reduce hero to one core claim and one primary CTA.
- Move secondary pathways into a compact “Explore by intent” row directly below the hero.

**Acceptance signal**

- New visitors can identify the primary next step in under 5 seconds during quick usability checks.

### 2) Standards (`/standards/`)

**What works**

- High content depth communicates authority and practical coverage.

**Observed friction**

- Initial scan cost is high because entries have similar visual weight.
- It is not obvious which standards are foundational versus advanced references.

**Suggested change**

- Group items into explicit tiers (e.g., “Core,” “Implementation,” “Reference”).
- Add compact metadata chips (domain, status, complexity) to support rapid triage.

**Acceptance signal**

- Users can correctly identify a recommended “starting standard” without scrolling deep.

### 3) Diagnostics (`/diagnostics/`)

**What works**

- Tooling orientation is clear and outcome-focused.
- Layout implies practical workflows rather than abstract reading.

**Observed friction**

- Equal card emphasis makes first-step selection ambiguous for first-time users.

**Suggested change**

- Label one path as “Start here” and present a simple recommended sequence.
- Introduce optional filters such as “planning,” “audit,” “incident response.”

**Acceptance signal**

- First-time users select an appropriate tool path with fewer backtracks.

### 4) Library (`/library/`)

**What works**

- Clean index structure with low decorative noise.

**Observed friction**

- Link blocks can feel utilitarian, with limited preview context before click-through.

**Suggested change**

- Add one-line summaries under top-level entries to describe audience and use case.
- Surface “most used” or “recommended first” for faster orientation.

**Acceptance signal**

- Increased depth of navigation from `/library/` to second-level pages.

## Priority recommendations

1. **Clarify primary CTA on Home** (high impact, low-medium effort).
2. **Add tiering + metadata on Standards** (high impact, medium effort).
3. **Create guided entry path on Diagnostics** (high impact, medium effort).
4. **Add contextual summaries on Library** (medium impact, low effort).

## Suggested implementation sequence

### Sprint 1 (quick wins)

- Home hero simplification and single primary CTA.
- Library one-line descriptions for top links.

### Sprint 2 (structural clarity)

- Standards grouping and metadata chips.
- Diagnostics “Start here” and basic filter taxonomy.

## Lightweight measurement plan

Track before/after for 2 weeks after each release:

- Click-through rate on primary CTA from Home.
- First-click accuracy on Standards and Diagnostics landing pages.
- Time-to-first-meaningful-click on each reviewed page.
- Navigation depth from Library to second-level content.
