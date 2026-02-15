# UX audit: Kondo pass v2 (remove, move, modify)

This follow-up audit focuses on clarity, momentum, and confidence across the same high-traffic
journeys. Lens: keep what helps users decide quickly; simplify anything that adds cognitive load.

## Journeys reviewed

- Homepage (`/`): first-click routing and pathway commitment
- Diagnostics (`/diagnostics`): choose-and-launch flow for tools
- Field Notes (`/field-notes`): read-to-action continuity
- Primary navigation: first-time label comprehension

## Keep (what is working)

- Homepage now has stronger route prioritization with lane selection earlier in the flow.
- Diagnostics provides multiple clear jump patterns for urgent users.
- Field Notes has clear editorial framing and useful guided path cards.
- Navigation labels are increasingly task-oriented and actionable.

## Remove (or reduce)

1. **Reduce repeated “jump” affordances on Diagnostics once users scroll.**
   - Keep one sticky control set and one intro-level action group; remove visual duplication below the
     fold.
   - Why: repeat controls can feel noisy when users are already oriented.

2. **Reduce mixed abstraction in homepage “What do you need right now?” labels.**
   - Avoid pairing intent labels (“Need evidence”) with uneven action strings that vary in specificity.
   - Why: users parse faster when each card follows the same sentence structure.

3. **Reduce raw URL-style related links in Field Notes entries.**
   - Replace bare URL text with concise descriptive link labels.
   - Why: improves scan quality and trust.

## Move

1. **Move one “Start here” diagnostic card above compare content.**
   - Promote the highest-frequency triage path to a persistent top position.
   - Why: shortens time-to-first meaningful click.

2. **Move “Top resources” on homepage into contextual lane modules.**
   - Instead of one generic list, attach 1–2 resource links under each lane card.
   - Why: preserves relevance and avoids generic catch-all lists.

3. **Move Field Notes metadata into a compact header row.**
   - Group cadence + date + subscription status into a single utility row.
   - Why: keeps attention on highlight content while preserving publication context.

## Modify

1. **Modify diagnostics anchor labels to be outcome-first.**
   - Example: “Quick triage” → “Choose a tool in 30 seconds”.
   - Why: outcome phrasing clarifies payoff before click.

2. **Modify homepage lane CTAs to reflect deliverables.**
   - Example: “Policy lane” → “Generate policy draft”; “Ops lane” → “Run incident readiness”.
   - Why: deliverable-oriented copy increases confidence in what happens next.

3. **Modify Field Notes “After this note” block into fixed 3-part template.**
   - Keep exactly: term, mechanism, diagnostic (one each) with consistent labels.
   - Why: predictable progression lowers decision fatigue.

4. **Modify nav IA signal with short helper text in mobile menu.**
   - Add a brief sublabel under top nav links (for example, “Templates: reusable artifacts”).
   - Why: first-time visitors decode site structure faster.

## Priority plan (next sprint)

### P1 (high impact, low effort)

- Standardize homepage shortcut card grammar.
- Rename diagnostics anchor labels to outcome-first phrasing.
- Replace bare related URLs in Field Notes with descriptive labels.

### P2 (high impact, medium effort)

- Add a persistent “Start here” card for Diagnostics.
- Convert homepage “Top resources” into lane-specific resource snippets.
- Introduce compact Field Notes metadata utility row.

### P3 (validation + polish)

- A/B test deliverable-oriented lane CTA copy.
- Validate reduced diagnostics navigation density for faster first action.
- Evaluate mobile menu helper text comprehension via quick moderated tests.

## Suggested success metrics

- Homepage: increase click-through to lane CTAs by 10–15%.
- Diagnostics: reduce median time-to-tool-launch by 15%.
- Field Notes: increase note-to-diagnostic/mechanism follow-on clicks by 12%.
- Navigation: improve first-session progression from nav click to second pageview.

## Lightweight validation checklist

- Run 5-task hallway test (new users): “Find a starting point”, “launch a diagnostic”,
  “continue from a note to an action page”.
- Review mobile recordings for hesitation at first decision points.
- Re-check link labels for specificity, not internal jargon.
