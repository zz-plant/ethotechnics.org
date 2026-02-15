# UX audit kondo — round 5

This pass revisits two first-session routes from direct browser traversal and translates
findings into implementation-ready actions.

## Traversed routes

1. Home (`/`) → Start here (`/start-here`) → Diagnostics (`/diagnostics`)
2. Home (`/`) → Failure pathways (`/#failure-intake`) → Model wrong
   (`/failure/model-wrong`)

## Route 1: Home → Start here → Diagnostics

### Evidence snapshot

- Start here repeats route navigation links and utility links before presenting a
  single recommended next action.
- Diagnostics repeats nearby links to the same in-page destinations
  (compare/choose/menu), increasing scan time.
- First-action verbs vary between "Start", "Visit", "Open", and "Choose" for similar
  tasks.

### Remove

- Remove duplicate top-of-page jump-link clusters on Start here and Diagnostics when
  they target the same in-page destinations.
- Remove secondary micro-copy variants for the same first action in the first
  viewport.
- Remove non-critical conceptual intro text from first view when it delays tool
  selection.

### Rebuild

- Rebuild Start here above the fold as one decision module:
  - one question,
  - one recommendation,
  - one primary CTA.
- Rebuild Diagnostics entry into outcome-first cards:
  - estimate workload risk,
  - test escalation ownership,
  - forecast capacity.
- Rebuild route progression as a visible 3-step scaffold: choose → run → share.

### Modify

- Modify CTA vocabulary to one first-action verb pattern
  (for example, "Open diagnostic").
- Modify heading hierarchy so each section adds new decision context.
- Modify first-screen copy to show payoff and time-to-value
  (for example, "pick a diagnostic in under 30 seconds").

### Build targets (where to change)

- `/start-here` page shell and above-the-fold modules.
- `/diagnostics` top navigation cluster and quick-triage region.
- Shared CTA label conventions used across route entry pages.

### Acceptance checks

- A new user identifies one primary action within 5 seconds on each page.
- No duplicate top-of-page links point to the same anchor destination.
- Equivalent first actions use one verb pattern across both pages.

## Route 2: Home → Failure pathways → Model wrong

### Evidence snapshot

- Model wrong shows duplicate links to identical artifacts, reducing signal density.
- Workflow order is implied rather than explicit for stress-mode usage.
- Artifact titles are concrete, but "when to use" guidance is inconsistent.

### Remove

- Remove repeated links to the same artifact within one page state.
- Remove section labels that restate intent without adding a decision.
- Remove any link copy that reads like internal structure instead of user action.

### Rebuild

- Rebuild the page as a staged incident flow:
  1. triage,
  2. stabilize,
  3. communicate,
  4. prevent recurrence.
- Rebuild artifact cards with a one-line "use this when" statement and expected
  completion time.
- Rebuild cross-route links so each stage points to a relevant diagnostic and
  standard.

### Modify

- Modify header region to pin one "Do this first" action.
- Modify artifact labels to lead with plain language and move formal template names
  to secondary metadata.
- Modify card metadata to show role owner and output produced.

### Build targets (where to change)

- `/failure/model-wrong` page structure and artifact list rendering.
- Shared artifact card copy pattern used by failure pages.
- Cross-link mapping from failure stages to diagnostics and standards.

### Acceptance checks

- Users complete the first recovery action without encountering duplicate artifact
  links.
- Every artifact card answers "when to use" in one line.
- Each stage includes at least one direct path to a related diagnostic or standard.

## Prioritized implementation tickets

### P0 — immediate clarity fixes (1 sprint)

- R5-01: deduplicate repeated CTA and artifact links.
- R5-02: enforce one primary CTA in each first viewport.
- R5-03: normalize first-action verb language across both routes.

### P1 — structural route upgrades (next sprint)

- R5-04: convert Start here to a single recommendation module.
- R5-05: convert Model wrong to explicit stage-based workflow sections.
- R5-06: add plain-language "when to use" guidance to all artifact cards.

### P2 — validation and tuning (ongoing)

- R5-07: measure first-click success on the two audited routes.
- R5-08: track time-to-first-action (median and p75).
- R5-09: iterate copy/placement from route completion and drop-off data.

## Delivery notes

- Keep each ticket scoped to one route surface to simplify review and rollback.
- Use route-level feature flags for staged rollout if copy or IA changes are large.
- Validate first on mobile viewport because dense jump-link clusters create higher
  friction on small screens.
