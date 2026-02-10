# Usability audit

Snapshot of non-accessibility usability issues across ethotechnics.org, based on a quick content and
interaction review of navigation, Library, and Diagnostics pages.

## Typical user journeys reviewed

### Journey 1: First-time operator tries to start from the homepage

**Path traversed:** `/` → “Start with a failure” (`/#failure-intake`) → failure-specific route.

**What works**

- The H1 and subhead are action-oriented (“Find the right governance action fast” + “start in under a
  minute”), which sets a clear expectation for speed.
- The top CTA (“Start with a failure”) aligns with the same-page routing block, reducing context
  switching.
- The “What do you need right now?” shortcut set supports quick intent matching on mobile.

**Friction observed**

- There are several parallel entry points above the fold (“Start with a failure,” “Quick start,” “How
  it works”), then additional path selectors immediately below. For a first-time user, this can create
  choice overload before they understand how paths differ.
- Some labels are pathway-oriented (“failure,” “team lane”), while others are artifact-oriented
  (“standards,” “glossary”). The mixed mental model can slow confidence in choosing the right next step.

**Constructive recommendations**

- Add a one-line decision helper under the hero CTAs (e.g., “Use _failure_ if something broke now; use
  _quick start_ if you are planning ahead”).
- Consider progressive disclosure: keep one primary CTA and collapse secondary options behind a short
  “Other ways to start” toggle on small screens.

### Journey 2: Team lead evaluates diagnostics and wants to take action

**Path traversed:** `/diagnostics` → “Quick triage” → tool card CTA.

**What works**

- The page introduces a practical flow (“quick triage” before the full menu), which helps users avoid
  scanning everything.
- Tool cards include useful operational metadata (delivery type, estimated time, prep checklist,
  outputs), which supports informed selection.
- Primary and secondary CTAs are explicit (“Run…”, “Method details”, “Example outputs”).

**Friction observed**

- The page is information-dense before the tool list. A visitor with high urgency may need to scroll
  through multiple sections before seeing the complete menu.
- “Compare tools,” “Quick triage,” and “Diagnostics menu” are all strong wayfinding anchors, but they are
  stacked in quick succession and can feel repetitive when skimmed quickly.

**Constructive recommendations**

- Add a persistent “Jump to tools” action in the intro/actions area that anchors directly to
  `#diagnostic-tools`.
- Collapse explanatory sections (e.g., output baseline / anti-weaponization details) into expandable
  panels by default, while preserving deep-link anchors for expert users.

### Journey 3: Reader explores Field Notes and looks for deeper linked resources

**Path traversed:** `/field-notes` → latest highlight CTA and tabbed entries → linked resource pages.

**What works**

- The “Latest highlight” callout provides a concrete starting point and a single focused CTA.
- RSS subscription is easy to find for returning readers.
- The page signals cross-link intent (“Every note links back to Library terms”), reinforcing ecosystem
  navigation.

**Friction observed**

- The strongest “next action” pattern appears in the highlight block, but equivalent guidance is less
  explicit once users move into tabbed entries.
- Readers seeking systematic follow-up (e.g., “what should I read next?”) may not get a consistent
  progression cue after opening a note.

**Constructive recommendations**

- Add a standardized “Continue with” footer pattern to each Field Notes entry card (for example:
  Glossary term, Mechanism section, and Diagnostic tool).
- Introduce a lightweight “reading paths” strip near the tabs (e.g., “Incident response path,”
  “Policy drafting path”) to convert browsing into guided progression.

## Cross-journey themes

- **Strong:** action language, rich internal linking, and clearly mission-aligned terminology.
- **Opportunity:** reduce initial choice complexity and strengthen “what next” continuity between sections.
- **Priority order:** (1) improve first-step clarity on homepage, (2) shorten path to diagnostic menu,
  (3) standardize post-read next-step prompts in Field Notes.

## Mobile journey pass (iPhone 13 viewport)

Snapshot of three common journeys run on a mobile viewport (`390x844`) in local dev.

### Journey 1: First-time visitor tries to start quickly from homepage

**Path traversed:** `/` → hero CTAs → “What do you need right now?” → team lane cards.

**What works**

- Hero copy sets urgency and intent quickly.
- The “Start with a failure” CTA is visible without scrolling.
- Card clusters create clear thematic groupings once users start scrolling.

**Mobile friction observed**

- The first screen stacks multiple competing CTAs before users understand the difference.
- Several link labels are terse or abstract in isolation, which increases decision time on a narrow screen.
- CTA density is high early in the page, so users may skim past context needed to choose confidently.

**Constructive recommendations**

- Keep one dominant primary CTA in the hero and visually demote secondary actions on mobile.
- Add one sentence under hero CTAs that explains when to pick each route.
- Delay lower-priority pathways until after a short orientation block (or collapse them behind “More ways to start”).

### Journey 2: Practitioner goes to Diagnostics to run a tool quickly

**Path traversed:** `/diagnostics` → intro / wayfinding links → first “Run …” tool CTA.

**What works**

- The page appears to include repeated jump links to the tools section, which supports fast navigation.
- Tool CTAs are action-oriented and easy to identify while scrolling.

**Mobile friction observed**

- Intro and orientation content can feel long before users reach the full tool grid.
- Multiple wayfinding links in close proximity can read as repetitive rather than progressive.
- The user needs sustained scrolling before seeing enough tool options to compare.

**Constructive recommendations**

- Add a sticky “Jump to diagnostic tools” control after the first scroll.
- Collapse supporting methodology detail by default on mobile, with expandable sections for depth.
- Add a compact comparison row (time, effort, artifact output) immediately above the tool list.

### Journey 3: Reader browses Field Notes and wants a clear next step

**Path traversed:** `/field-notes` → browse entries → first note link.

**What works**

- Field Notes remains content-first, matching reader expectations for editorial browsing.
- Link-rich note cards support exploration once users begin opening entries.

**Mobile friction observed**

- The page can feel visually dense on mobile, with weak progression cues between "read" and "do next".
- “Next step” affordances are less explicit than on task-oriented pages (for example, diagnostics).

**Constructive recommendations**

- Add a repeatable “After this note, continue with …” block on each entry card.
- Offer 2–3 mobile-first reading paths (for example, incident response, policy design, facilitation).
- Keep RSS and archive actions visible, but visually separate them from action pathways.

### Cross-journey mobile themes

- **Strong:** clear mission-aligned language and action labels across core sections.
- **Opportunity:** reduce top-of-page choice overload and make next-step guidance more explicit.
- **Priority order:**
  1. Simplify homepage CTA hierarchy.
  2. Shorten the path from diagnostics intro to tool comparison.
  3. Add consistent follow-on guidance in Field Notes.
