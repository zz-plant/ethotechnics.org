# Mobile UX critique (2026-02, refreshed)

## Scope and method

- Reviewed the current homepage and mobile navigation implementation in `src/pages/index.astro` and
  shared navigation styles.
- Verified behavior in a mobile viewport (390×844) and focused on orientation speed, tap friction,
  and content prioritization.
- Evaluated whether previous mobile recommendations are now resolved or still in progress.

## What improved since the prior pass

1. **Above-the-fold choices are clearer**
   - The hero now emphasizes one primary pathway and moves secondary paths into a disclosure.
2. **Horizontal utility-link scrolling pressure is reduced**
   - Mobile utility links no longer rely on side-scrolling affordances in the header zone.
3. **Failure priorities are more compact overall**
   - Most triage priorities now read as short chips, improving scan speed.

## Current mobile UX issues (remaining)

### 1) Duplicate primary action causes decision friction

**Current behavior**

- The hero shows both `Something failed now` and `Start incident intake`, and both route into the
  same incident-first flow.

**Impact on mobile**

- Two near-identical primary CTAs consume above-the-fold space without adding decision value.
- New visitors still have to parse unnecessary choice duplication before acting.

**Suggested change**

- Keep only one primary incident CTA above the fold.
- Convert the secondary duplicate action into supportive text (not another button).

### 2) Quick-action labels add noise rather than clarity

**Current behavior**

- Quick-action cards include a repeated micro-label (`Direct link`) above each action title.

**Impact on mobile**

- Repeated, low-information labels increase visual noise.
- The card title already communicates intent; extra labels dilute hierarchy.

**Suggested change**

- Remove the repeated `Direct link` labels.
- Keep title + optional one-line description (e.g., "Open the standards index").

### 3) Priority-chip language is inconsistent

**Current behavior**

- Most failure priorities use the compact pattern (`High · Owner in 24h`), but one still includes
  `Priority: Critical · ...`.

**Impact on mobile**

- Inconsistent phrasing weakens pattern recognition during rapid triage.
- Users need to re-parse language instead of scanning a stable token structure.

**Suggested change**

- Normalize all priority strings to one compact grammar:
  - `{Severity} · {Immediate action}`
  - Example: `Critical · Activate hard halt`

### 4) Scroll depth is still high before confidence-building context

**Current behavior**

- Even with improvements, mobile users encounter a long sequence of blocks before reaching deeper
  evidence and regulatory content.

**Impact on mobile**

- Task-focused users can still feel the page is text-heavy and "document-like" before confidence
  cues and completion paths are fully clear.

**Suggested change**

- Add a compact progress anchor near the top for jump navigation:
  - `Incident triage`
  - `Diagnostics`
  - `Standards`
  - `Evidence`
- Keep anchors sticky or near-sticky on mobile to reduce long-scroll backtracking.

### 5) “Other ways to start” disclosure needs stronger affordance

**Current behavior**

- Secondary start paths are hidden behind a disclosure, but the control relies heavily on the user
  noticing and understanding the summary affordance.

**Impact on mobile**

- Some users may not discover alternatives, especially when rushing or scanning quickly.

**Suggested change**

- Add a concise summary hint such as "2 more pathways" in the disclosure label.
- Consider default-open behavior for larger mobile widths (e.g., 680–899px), while keeping compact
  phones collapsed.

## Prioritized recommendations

### Phase 1 (fast, high impact)

1. Remove duplicate incident CTA in hero.
2. Remove repeated `Direct link` labels from quick-action cards.
3. Normalize all failure-priority copy to one compact pattern.

### Phase 2 (medium effort)

1. Add mobile jump anchors for the four core destinations.
2. Improve disclosure discoverability with explicit count/hint text.

### Phase 3 (validation)

1. Measure time-to-first-action on mobile (goal: ≤5 seconds for first-time users).
2. Measure first-screen tap success (goal: primary action chosen without backtracking).
3. Track scroll depth before first outbound navigation to a task page.

## Suggested acceptance criteria

- Hero presents one unambiguous primary action on 390px mobile.
- Quick-action cards contain no redundant micro-labels.
- All failure-priority chips follow one grammar and visual style.
- Users can jump to key sections without full linear scroll.
