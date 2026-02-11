# UX audit: Kondo pass v3 (remove, move, modify)

This third-pass audit reviews current UX after recent updates and focuses on reducing residual friction
without undoing progress. The Kondo lens remains: keep what creates momentum, remove what distracts,
move what belongs closer to intent, and modify language for faster comprehension.

## Journeys reviewed

- Homepage (`/`): first decision, lane routing, and follow-through confidence
- Diagnostics (`/diagnostics`): start speed, wayfinding clarity, and launch confidence
- Field Notes (`/field-notes`): browse-to-action continuity and trust signals
- Mobile primary navigation: orientation for first-time visitors

## Keep (what now works well)

- **Homepage lane placement is stronger.** Team lane choices now appear early enough to convert intent.
- **Diagnostics starts with outcomes.** Current action labels communicate user payoff faster than before.
- **Field Notes has reliable continuity cues.** The “After this note” pattern helps readers continue.
- **Mobile nav now communicates purpose.** Helper text improves information architecture comprehension.

## Remove (or reduce)

1. **Remove duplicated directional cues within Diagnostics hero region.**
   - Keep one “primary start” action and one alternate path; demote any third competing prompt.
   - Reason: users under urgency should not parse three equal-strength choices.

2. **Reduce “Continue with” list density inside homepage lane cards.**
   - Limit each lane to one strongest next link plus one optional “More for this lane” link.
   - Reason: too many micro-links can recreate the choice overload we just reduced.

3. **Reduce overly generic generated Field Notes link labels.**
   - Replace fallback labels like “Open resource” with source-aware labels from content metadata.
   - Reason: generated labels improve formatting but can still feel vague.

## Move

1. **Move one tactical proof point directly under each lane CTA.**
   - Example: “Includes reversible decision checklist” under policy lane CTA.
   - Reason: a tiny proof statement increases confidence before click.

2. **Move Diagnostics “Compare options” lower for returning users.**
   - On narrow screens, keep “Choose in 30s” and “Open tools menu” visible first; compare can be second row
     or disclosure.
   - Reason: repeat users usually want launch, not evaluation.

3. **Move Field Notes RSS from action parity to utility style on mobile.**
   - Keep RSS visible but visually secondary to the highlight destination CTA.
   - Reason: subscription is valuable but not the dominant first-session action.

## Modify

1. **Modify homepage lane headings to outcome nouns.**
   - Example: “Legal / Compliance” → “Policy decisions”, “Appeals / Incident” → “Incident response”.
   - Reason: role labels help teams; outcome labels help cross-functional first-time visitors.

2. **Modify Diagnostics sticky labels for consistency with hero wording.**
   - Align short labels to exact verb patterns: “Choose”, “Compare”, “Open”.
   - Reason: consistent verb grammar improves quick parsing under scroll.

3. **Modify Field Notes related links to editorial titles when available.**
   - If link target is internal and known, show content title instead of path-derived text.
   - Reason: titles improve trust and reduce mechanical phrasing.

4. **Modify mobile nav helper text length budget.**
   - Cap to ~32 characters and avoid line wraps where possible.
   - Reason: wrapped helper lines increase visual noise in compact nav rows.

## Suggested implementation order

### P1 — immediate (high impact, low effort)

- Trim Diagnostics top action set from three equal actions to two prominent + one secondary.
- Simplify homepage lane follow-on links per card.
- Enforce helper-text length budget in mobile nav descriptions.

### P2 — next sprint (high impact, medium effort)

- Add lane CTA proof points.
- Upgrade Field Notes link labels to title-based rendering when resolvable.
- Adjust diagnostics mobile action hierarchy for launch-first behavior.

### P3 — validation and polish

- Run moderated first-click tests across the three core journeys.
- Measure route completion from homepage lane selection to first destination action.
- Measure Diagnostics time-to-first-tool-launch before/after action hierarchy changes.

## Success metrics

- **Homepage:** +10% lane CTA completion to second-step pages.
- **Diagnostics:** -15% median time-to-first-tool click on mobile.
- **Field Notes:** +12% click-through from notes to linked internal resources.
- **Navigation:** +8% first-session progression from nav tap to second pageview.

## Validation checklist

- Confirm action hierarchy visually at 390px, 768px, and 1280px.
- Verify no loss of accessibility labels when demoting or collapsing controls.
- Confirm all updated link labels remain specific and non-jargon.
