# User journey critique (2026)

Consolidated UX journey review for representative contributor and practitioner flows.

## Method

- Run the site locally with `bun run dev --host 0.0.0.0 --port 4321`.
- Traverse three representative journeys in a browser session:
  - new visitor orientation,
  - practitioner control selection,
  - returning user search.
- Capture constructive critique focused on clarity, wayfinding, and actionability.

## Journey 1: New visitor orientation

Path: `/` → `/#failure-intake` → `/failure/decision-appealed`.

### What works

- The homepage value proposition is clear and specific for high-stakes systems.
- Failure-state cards make the first decision concrete and scannable.
- Failure detail pages map directly to usable artifacts with clear CTAs.

### Friction points

- The top nav label "Start with failure" appears to route to an in-page anchor on home.
  Users may expect a dedicated hub page.
- The homepage surface area is dense. First-time users can miss the intended sequence
  (choose failure state → pick standard/mechanism → download artifact).

### Constructive improvements

- Rename the nav item to "Failure pathways" (or similar) and make destination behavior explicit
  (anchor vs page).
- Add a short three-step "How to use this site" rail near the top fold.
- Consider progressive disclosure around specialist terms in the hero so non-experts are not
  blocked early.

## Journey 2: Practitioner finding implementable controls

Path: `/mechanisms` → `/mechanisms/patterns/kill-switch`.

### What works

- Mechanisms index provides multiple pathways (filters, navigator, themes, roles).
- Pattern pages are rich and operational, with section anchors and implementation structure.

### Friction points

- Some breadcrumb or utility links render as absolute production URLs (for example,
  `https://ethotechnics.org/`) during local traversal, which can unexpectedly pull users out of
  context in non-production environments.
- At least one breadcrumb-style item is rendered as a raw path string (for example,
  `/mechanisms/patterns/kill-switch`) instead of a human-readable label.

### Constructive improvements

- Keep internal navigation environment-relative where possible to preserve continuity in preview
  and local QA.
- Replace path-like breadcrumb text with readable labels (for example, "Kill switch pattern").
- Elevate one "recommended first action" on the mechanisms page for users who do not know where
  to begin.

## Journey 3: Returning user search

Path: `/search` → `/search?q=consent`.

### What works

- Search entry is easy to find and supports query URL parameters.
- Suggested quick links provide useful query starters.

### Friction points

- Result density appears very high, which risks cognitive overload without strong grouping.
- Initial visible links prioritize navigation and shortcuts, so relevance cues for top results can
  be easy to miss at first glance.

### Constructive improvements

- Add lightweight faceting (content type, topic, tool vs reference) above results.
- Improve result snippet hierarchy: title, one-line context, then metadata chips.
- Add "best match" or "top 3" treatment for common governance terms.

## Prioritized next steps

1. Clarify navigation semantics (anchor vs page, readable breadcrumbs).
2. Reduce first-session ambiguity with a short guided sequence.
3. Improve search triage through grouping and stronger relevance signaling.
