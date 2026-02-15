# UX audit: route critique v4 (remove, rebuild, modify)

This pass traverses three common first-session routes from the homepage and critiques each route using
three action lenses: what to remove, what to rebuild, and what to modify.

## Routes traversed in browser

1. Home (`/`) → Quick start (`/quick-start`)
2. Home (`/`) → Diagnostics (`/diagnostics`)
3. Home (`/`) → Failure pathway: Model wrong (`/failure/model-wrong`)

## Route 1: Home → Quick start

### Remove

- Remove repeated low-context action labels like "Open guide" when multiple cards share the same text.
  Keep one clear destination verb per card.
- Remove glossary term links from parity with role-guide CTAs in the first viewport.
  These links are useful, but they compete with the primary route-completion action.

### Rebuild

- Rebuild each role card around one explicit outcome promise plus one "start" action.
  Example card structure: who it is for, what problem it solves in 10 minutes, one primary CTA.
- Rebuild progression cues so users know whether to choose by role, by urgency, or by artifact type.
  The current mix increases interpretation cost for first-time visitors.

### Modify

- Modify CTA labels from generic verbs ("Open guide") to role-specific verbs
  ("Start policy guide", "Start design guide").
- Modify section copy so the top heading and subheading explain expected completion time and result.

## Route 2: Home → Diagnostics

### Remove

- Remove duplicate jump links that repeat the same destination in the same page region
  (for example, repeated entries that point to quick triage and tools menu).
- Remove trailing marker glyphs (e.g., headings that visually end with "#") from linked teaser copy.
  They read like formatting artifacts, not intentional UI language.

### Rebuild

- Rebuild the above-the-fold hierarchy into one primary "start now" action,
  one secondary "compare" action, and one tertiary "full menu" action.
- Rebuild diagnostics orientation into a linear "Step 1 / Step 2 / Step 3" scaffold
  for urgent users who need immediate tool selection.

### Modify

- Modify link labels for consistency: keep one verb pattern throughout
  (Choose, Compare, Open) instead of switching phrasing across nearby controls.
- Modify anchor navigation density by collapsing long in-page menus behind a "jump to" control
  on smaller screens.

## Route 3: Home → Failure pathway (Model wrong)

### Remove

- Remove duplicated "Use this artifact" links when each card already includes a named artifact link.
  Keep one high-signal action per artifact card.
- Remove path-like label fragments inside visible link text ("→ /artifact/...") from card headings.
  URL-shaped copy creates noise and lowers trust.

### Rebuild

- Rebuild the page into a clear response workflow: triage, contain, document, escalate.
  Artifacts should map to explicit stages rather than appearing as a flat list.
- Rebuild contextual guidance above artifacts so users understand when to pick each asset,
  expected effort, and required role ownership.

### Modify

- Modify artifact cards with metadata chips (time to complete, owner role, evidence produced).
- Modify CTA text from generic "Use this artifact" to intent-driven language
  ("Start reversal SLA", "Open escalation ladder").

## Prioritized implementation

### P0 (do now: immediate clarity fixes)

- Replace repeated generic CTAs with intent-specific labels across quick-start and failure pages.
- Remove duplicate diagnostics jump links in top regions.
- Clean linked heading text that currently exposes formatting artifacts or raw URL fragments.

### P1 (next: structural UX improvements)

- Redesign diagnostics action hierarchy and mobile jump navigation.
- Redesign failure pathway pages into stage-based workflows with artifact mapping.
- Reframe quick-start role cards to lead with one explicit outcome and one primary action.

### P2 (validate and tune)

- Track first-click success and time-to-first-action for the three routes.
- Run a lightweight moderated test with 5 participants from policy, design, and operations roles.
- Tune copy and CTA hierarchy based on route-level completion and drop-off data.

## P2 execution guide (consolidated)

### Metric definitions

- **First-click success rate**
  - Definition: share of sessions where first click is one of the intended route actions.
  - Formula: `successful_first_click_sessions / total_route_sessions`.
- **Time-to-first-action (TTFA)**
  - Definition: milliseconds from page render start to first click on an instrumented route action.
  - Reporting: median TTFA, p75 TTFA, and delta vs baseline window per route.

### Intended action sets

- Quick start: `quick-start-*`
- Diagnostics: `diagnostics-choose`, `diagnostics-open-menu`, `diagnostics-compare`
- Failure pathway: `failure-triage-*`, `failure-contain-*`, `failure-document-*`, `failure-escalate-*`

### Moderated validation protocol (5 participants)

- 2 policy/compliance practitioners
- 2 operators or engineers
- 1 designer or researcher

Session tasks:

1. Find the fastest role-specific starting point on quick-start.
2. Choose a diagnostic path in under 30 seconds.
3. Begin the first artifact in the model-wrong failure pathway.

Record for each task:

- first click target
- completion status (yes/no)
- completion time
- confusion notes (verbatim)
- confidence rating (1-5)

### Data extraction snippet

```js
const rows = JSON.parse(
  localStorage.getItem("ethotechnics.routeMetrics") ?? "[]",
);
console.table(rows);
```

```js
const rows = JSON.parse(
  localStorage.getItem("ethotechnics.routeMetrics") ?? "[]",
);
const byRoute = rows.reduce((acc, row) => {
  acc[row.route] ??= [];
  acc[row.route].push(row.elapsedMs);
  return acc;
}, {});

Object.entries(byRoute).forEach(([route, values]) => {
  const sorted = values.slice().sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)] ?? null;
  console.log(route, { count: values.length, medianMs: median });
});
```

### Tuning loop

1. Keep the highest first-click-success actions as primary.
2. Demote low-conversion or low-confidence actions to secondary placement.
3. Rewrite labels associated with repeated hesitation in session notes.
4. Re-run the same moderated script and compare TTFA/first-click deltas.
