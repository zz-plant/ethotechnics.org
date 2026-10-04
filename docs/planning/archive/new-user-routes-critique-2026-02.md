# New user routes critique (2026-02)

This pass covers two typical first-session routes traversed in a local browser run.

## Method

- Run `bun run dev --host 0.0.0.0 --port 4321`.
- Traverse Route A and Route B as a first-time visitor.
- Evaluate only three action types: remove, rebuild, modify.
- Prioritize fixes by impact on first-session clarity and decision speed.
- Do not recommend net-new features.

## Route A: Orientation to policy usage

Path: `/` -> `/start-here` -> `/standards`.

### Prioritized fixes

1. Rebuild the `Start here` above-the-fold hierarchy so one dominant sequence appears first
   (highest impact).
2. Remove duplicated in-page wayfinding links in `Start here` where numbered anchors repeat in
   close proximity.
3. Modify CTA wording across `/`, `/start-here`, and `/standards` to keep one verb pattern and
   avoid route-level context switching.
4. Remove breadcrumb-like raw path labels (for example `/start-here`) where title context already
   exists.
5. Modify heading density in `Start here` by collapsing adjacent headings that restate the same
   instruction.

### What can be removed

- Duplicate anchor menus and repeated numbered wayfinding links in the `Start here` top viewport.
- Raw path-string breadcrumb labels that add noise without helping orientation.

### What needs to be rebuilt

- The `Start here` first-screen information stack so users see one obvious order of operations
  instead of parallel paths.
- The handoff logic from `Start here` to `Standards` so user intent is preserved rather than reset.

### What needs modification

- CTA labels and verb consistency along this route.
- Heading cadence and section labeling so each heading introduces new information.

## Route B: Incident intake to operational response

Path: `/` -> `/#failure-intake` -> `/failure/model-wrong` -> `/participate#feedback`.

### Prioritized fixes

1. Rebuild failure detail action ordering into a strict incident sequence (triage -> stabilize ->
   evidence) so urgent response is deterministic (highest impact).
2. Remove repeated primary artifact CTAs on failure detail pages where identical links appear
   multiple times.
3. Modify severity language and visual urgency cues to one convention from intake cards through
   failure detail.
4. Rebuild the transition from incident handling pages to `participate` messaging to prevent active
   response context from blending with contribution context.
5. Modify cross-page terminology (`incident`, `failure`, `response`, `feedback`) for role
   consistency.

### What can be removed

- Duplicate primary action links on failure detail pages.
- Low-signal helper/link text pairs that repeat the same destination meaning.

### What needs to be rebuilt

- Failure page action stack into a response-order structure rather than a flat action field.
- The route boundary between operational response and community participation contexts.

### What needs modification

- Urgency labels and severity vocabulary for consistency across cards and detail pages.
- Terminology alignment across intake, response, and feedback surfaces.

## Cross-route priority order

1. **Rebuild first-screen route hierarchy** on `Start here` and failure detail pages.
2. **Remove duplicate navigation/actions** that create scanning noise.
3. **Modify labels/headings/urgency terms** to enforce predictable interpretation for new users.
