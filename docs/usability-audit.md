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

- Add a one-line decision helper under the hero CTAs (e.g., “Use *failure* if something broke now; use
  *quick start* if you are planning ahead”).
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
