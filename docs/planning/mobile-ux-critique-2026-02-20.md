# Mobile UX critique (2026-02-20)

## Scope and method

- Audited the current homepage experience at a 390×844 viewport.
- Reviewed first-screen orientation, tap priority, navigation discoverability, and scan speed.
- Cross-checked implementation details in homepage and mobile navigation source.

## Executive summary

The mobile IA is strong, but the first screen still asks users to parse too much before they can act.
The page would feel faster and clearer if the header consumed less vertical space and if primary intent
controls were tightened around one immediate action.

## Key findings

### 1) Header stack is visually heavy on small screens

**Observation**

- Mobile navigation currently surfaces search, utility links, and route links in one persistent stack.
- The combined header occupies a large portion of the initial viewport before core content begins.

**UX impact**

- Users must parse multiple navigation systems before seeing the primary page promise.
- Time-to-first-understanding increases for new or stressed visitors.

**Recommendation**

- Collapse utility links behind a progressive disclosure on narrow widths.
- Keep one-row top nav with search + menu trigger as the default entry state.

### 2) Hero starter is clear, but still competes with nearby navigation density

**Observation**

- The hero CTA model is improved (single primary action plus secondary disclosure).
- However, that clarity arrives only after users scroll through dense nav controls.

**UX impact**

- The strongest conversion control (incident intake) is delayed by non-task-first content.

**Recommendation**

- Reduce header height so the main hero heading and starter panel appear earlier on first render.
- Preserve the current one-primary-CTA pattern.

### 3) Quick actions are useful but can read as another menu layer

**Observation**

- The quick-action cards are good shortcuts, but follow immediately after dense top-level nav.
- On mobile, this can feel like repeated wayfinding rather than progression.

**UX impact**

- Extra choice sets can increase hesitation when users are urgency-driven.

**Recommendation**

- Keep three quick actions, but add short intent framing above them (for example: "If not urgent").
- Consider reducing icon stroke complexity for faster visual parsing.

### 4) Failure-intake list remains highly scannable and task-aligned

**Observation**

- Failure options use consistent, compact severity/action patterns.
- Interaction targets appear clear and actionable.

**UX impact**

- This section supports rapid triage and lowers decision ambiguity.

**Recommendation**

- Preserve this pattern and use it as the copy/structure baseline for other option sets.

## Priority actions

### P0 (highest leverage)

1. Compress mobile header by default (show less until user asks for more).
2. Ensure hero heading + primary CTA are visible within the first viewport on common phone sizes.

### P1

1. Add short intent framing above quick actions to distinguish triage vs non-urgent paths.
2. Trim decorative complexity in quick-action iconography.

### P2

1. Validate with a lightweight mobile usability pass (5 users, first-action timing and mis-tap rate).

## Suggested metrics

- **First meaningful action time (mobile):** median under 6 seconds.
- **First-screen mis-tap rate:** under 10%.
- **Primary CTA discovery rate:** above 90% in first session.
