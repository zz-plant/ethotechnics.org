# UX audit: Kondo pass (remove, move, modify)

This audit uses a Kondo-style lens: keep what creates clarity and momentum, and simplify what creates
friction. Recommendations focus on three high-traffic journeys: homepage routing, diagnostics tool
selection, and Field Notes exploration.

## Scope reviewed

- Homepage routing (`/`)
- Diagnostics index (`/diagnostics`)
- Field Notes index (`/field-notes`)
- Primary navigation labels

## What sparks clarity (keep)

- **Fast-start framing on homepage.** The page leads with a single primary action and a decision helper,
  which lowers first-click hesitation.
- **Diagnostics wayfinding density.** The page includes explicit quick actions and sticky jump controls,
  which support both urgent and exploratory users.
- **Field Notes guided paths.** Reading paths establish intent before tab exploration.
- **Action-oriented nav labels.** Core labels are task-forward and generally understandable.

## Kondo recommendations

### Remove (or demote)

1. **Remove duplicate wayfinding labels where possible on Diagnostics.**
   - The page currently offers anchor links, intro action buttons, summary jump links, and sticky jump
     links. Keep two layers (intro + sticky) and demote extras into a single expandable “More anchors”.
   - Benefit: less visual repetition and faster scanning.

2. **Demote low-priority homepage sections below lane selection.**
   - Move “Top resources” below “Choose your team lane” so users commit to a path before browsing
     references.
   - Benefit: stronger momentum toward action.

### Move

1. **Move “Choose your team lane” directly under mobile shortcuts on homepage.**
   - Keep “3 steps” and “Top resources” after lane choice.
   - Benefit: converts intent into role-specific action earlier.

2. **Move RSS subscribe action into the Field Notes highlight callout.**
   - Keep the subscription visible, but anchor it near the highest-intent card to reduce line-by-line
     metadata at the top.
   - Benefit: cleaner opening block and better action grouping.

3. **Move the most-used diagnostic triage prompt into a persistent first-card slot.**
   - Keep the full triage section, but reserve one “Start here” card that remains first regardless of
     sort/filter state.
   - Benefit: faster path for repeat visitors.

### Modify

1. **Modify top-level nav terminology for first-time clarity.**
   - Consider renaming “Artifacts” to “Templates” (or “Artifacts & templates”) to reduce jargon risk.
   - Benefit: lower cognitive load for new users.

2. **Modify homepage CTA hierarchy with stronger progressive disclosure.**
   - Keep one primary CTA above the fold, and make “Other ways to start” collapsed by default on all
     breakpoints.
   - Benefit: clearer first decision on both desktop and mobile.

3. **Modify Diagnostics section ordering for urgency.**
   - Keep quick triage near the top, but shorten above-the-fold explanatory text and defer method detail
     to collapsed sections.
   - Benefit: faster time-to-tool.

4. **Modify Field Notes card footers to standardize “continue with” actions.**
   - Add a repeatable footer pattern: “Continue with glossary term / mechanism / diagnostic.”
   - Benefit: stronger journey continuity from reading to action.

## Prioritized implementation plan

1. **High impact / low effort**
   - Move homepage “team lane” section above “3 steps” and “Top resources”.
   - Consolidate duplicate Diagnostics jump links.
   - Rename “Artifacts” in top nav to a clearer phrase.

2. **High impact / medium effort**
   - Standardize Field Notes “continue with” footer pattern in tabbed cards.
   - Collapse secondary Diagnostics explanatory blocks by default.

3. **Medium impact / low effort**
   - Relocate RSS action into the Field Notes highlight block.
   - Refine CTA microcopy for consistency (“Start”, “Compare”, “Browse”, “Run”).

## Success metrics to validate changes

- **Homepage**
  - +15% increase in click-through to lane or failure-routing actions.
  - -10% decrease in hero bounce on mobile.
- **Diagnostics**
  - -20% time-to-first “Run/Open” tool click.
  - +10% completion rate from quick triage to tool launch.
- **Field Notes**
  - +15% click-through from notes to diagnostic/mechanism/glossary routes.
  - +10% return sessions via RSS or recurring path usage.

## Review cadence

- Run a lightweight UX check monthly after publishing batches.
- Re-audit after major information architecture or navigation updates.
