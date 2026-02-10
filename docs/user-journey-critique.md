# User journey critique (three representative flows)

This review traverses three common journeys on the local site build and focuses on practical UX
improvements that preserve the current information architecture.

## Journey 1: New visitor orientation

### Typical path

- Home (`/`)
- Start Here (`/start-here/`)
- How it works (`/how-it-works`)

### What works well

- The home headline is specific and action-oriented, with clear first-step options.
- Home and Start Here both present multiple path choices, which supports users arriving with
  different levels of urgency.
- “How it works” provides clear institutional framing for users who need to understand scope
  before acting.

### Friction observed

- The global navigation plus dense in-page links can feel crowded for first-time visitors.
- On Start Here, anchor labels like “1 What this is” and “2 Choose your path” compete with
  action CTAs and may create decision fatigue.
- Repeated top-level language (“Open standards & artifacts…”) across pages can reduce signal for
  users scanning for what changes from page to page.

### Constructive recommendations

- Add a single persistent “recommended next action” card near the top of each orientation page.
- Demote lower-priority anchor links behind a “Show full outline” disclosure for first-time use.
- Add one-line “You are here” context under each H1 to distinguish orientation, doctrine, and
  execution pages.

## Journey 2: Practitioner trying a diagnostic + artifact

### Typical path

- Validators index (`/validators/`)
- Risk Radar validator (`/validators/risk-radar/`)
- Burden budget worksheet (`/tools/burden-budget-worksheet/`)

### What works well

- The Validators index makes “run” actions easy to identify.
- Risk Radar describes purpose in plain language and links to related standard/mechanism context.
- The Burden budget worksheet offers multiple download formats (PDF/Markdown/CSV/JSON), which
  supports adoption in varied team workflows.

### Friction observed

- Moving from validator insight to implementation artifact is conceptually possible but not always
  obvious as a guided sequence.
- Validator pages share structural sections that can dilute page-specific “do this next” clarity.
- The amount of surrounding navigation can obscure task completion steps for time-constrained
  operators.

### Constructive recommendations

- Add a compact “After this validator” section with direct links to the top 2–3 implement-now
  artifacts.
- Introduce a standard status checklist pattern (e.g., “Assess → Select mechanism → Export
  artifact”) on validator detail pages.
- Add estimated completion time and required inputs near the top of each validator/tool page.

## Journey 3: Researcher validating standards evidence

### Typical path

- Standards index (`/standards/`)
- STD-01 minimum binding set (`/standards/std-01-minimum-binding-set/`)
- Evidence packs (`/evidence-packs/`)

### What works well

- The standards index is rich and citation-friendly, with direct access to core doctrine.
- The minimum binding set page gives concrete requirement structure and avoids vague policy prose.
- Evidence packs make audit-readiness explicit and provide standard-specific proof pathways.

### Friction observed

- The Standards index is link-dense, which may slow “which document should I read first?”
  decisions for newcomers.
- The transition from standard interpretation to evidence assembly is present but not always
  framed as a single workflow.
- Users may need an explicit confidence cue that they selected the correct evidence tier.

### Constructive recommendations

- Add a short “If your goal is…” chooser at the top of Standards (policy drafting, audit prep,
  implementation oversight).
- Add cross-page workflow chips that persist from standards pages into evidence packs.
- Include “minimum acceptable evidence” examples per standard tier to reduce ambiguity during
  assurance reviews.

## Priority improvements (near-term)

1. Add page-top next-action modules on key orientation and validator pages.
2. Reduce initial cognitive load by collapsing secondary in-page outlines.
3. Strengthen standards→evidence continuity with persistent workflow signposts.

## How this critique was executed

- Traversed the three journeys on a local dev server (`bun run dev --host 0.0.0.0 --port 4321`).
- Validated headings, link density, and CTA visibility across each step using scripted HTML
  inspection.
