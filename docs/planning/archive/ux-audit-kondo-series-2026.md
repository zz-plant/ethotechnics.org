# UX audit: Kondo series (consolidated 2026)

This document consolidates findings and actions from the Kondo audit sequence that was previously
split across multiple rounds:

- `ux-audit-kondo.md`
- `ux-audit-kondo-round2.md`
- `ux-audit-kondo-round3.md`
- `ux-audit-kondo-round4.md`
- `ux-audit-kondo-round5.md`

## Why this consolidation exists

- Reduce duplicated recommendations repeated across round files.
- Keep one canonical summary of recurring friction and decisions.
- Make planning docs easier to maintain and scan.

## Durable findings across rounds

### 1) First-session routing must stay opinionated

- Homepage performs best when one dominant next action is visible in the first viewport.
- Secondary pathways should stay available but visually subordinate.
- Redundant route cards and repeated generic CTAs slow first decisions.

### 2) Navigation language should remain task-oriented

- Labels are clearer when they describe user intent (what happens next) instead of internal IA terms.
- Similar actions should use consistent verbs across pages.
- Header/utility links should avoid horizontal overflow pressure on mobile.

### 3) Diagnostics pages need a clear start path

- Adjacent links to the same destination increase scan time.
- Launch actions should prioritize immediate use over exploratory reading.
- Sticky or jump navigation helps returning users but should not displace the primary CTA.

### 4) Content pages should keep continuity cues

- Guided-path prompts and "after this" transitions improve onward navigation.
- Related links are most effective when they point to one recommended next move.
- Dense action clusters are better converted into short, prioritized stacks.

## Consolidated action backlog

### Keep

- Strong first-screen value proposition and route framing on homepage.
- Outcome-led naming in diagnostics entry points.
- Guided reading continuity patterns on Field Notes and pathway pages.

### Remove / reduce

- Duplicate links that target the same destination in one viewport.
- Repeated generic CTA text (for example, many adjacent "Open guide" labels).
- Competing low-priority links near primary conversion actions.

### Rebuild

- Above-the-fold hierarchy on orientation pages so one route is clearly dominant.
- CTA system vocabulary to a small, reusable verb set.
- Route-level card stacks so only the top one or two recommendations appear first.

### Modify

- Microcopy that adds conceptual overhead without helping decisions.
- Section order to match first-time decision flow before depth reading.
- Mobile nav spacing/priority so essential actions remain visible without overflow.

## Source and traceability

Detailed per-round observations remain available in Git history through the original files.
Future UX audits should append to this consolidated document (or create a date-based successor)
instead of opening another numbered Kondo round file.
