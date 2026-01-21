# Roadmap and specs hub

This doc centralizes the lightweight roadmap, spec template, and pickup guidance so agents can
align quickly. Treat it as the in-repo tracker, and mirror key items to GitHub Issues when you
need assignment, notifications, or automation.

## Active roadmap

Use this table to keep focus visible without heavy process. Keep each item short (verb +
outcome) and link to a spec section below once scoped.

| Now                                                           | Next                                                                                              | Later                                                                               |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Highest-priority work in progress.                            | Ready-to-start items with scoped specs.                                                           | Ideas to revisit when capacity frees up.                                            |
| Keep entries small and actionable.                            | Add owners or dates only when needed.                                                             | Capture rough ideas, not full specs.                                                |
| - [Redundancy compression pass](#redundancy-compression-pass) | - [Rights → validators → mechanisms reference matrix](#rights-to-validators-to-mechanisms-matrix) | - [Where this binds (non-legal translation surface)](#where-this-binds-surface)     |
|                                                               | - [Contestability checklist + explainers](#contestability-checklist--plain-language-explainers)   | - [Contestability pattern library](#contestability-pattern-library)                 |
|                                                               | - [Minimum viable contestability standard](#minimum-viable-contestability-standard)               | - [Governance lessons from incidents](#governance-lessons-from-incidents)           |
|                                                               | - [Self-defense diagnostic tools](#self-defense-diagnostic-tools)                                 | - [Language people can use](#language-people-can-use)                               |
|                                                               |                                                                                                   | - [Democratic vs. coercive governability](#democratic-vs-coercive-governability)    |
|                                                               |                                                                                                   | - [Public memory for contestability terms](#public-memory-for-contestability-terms) |
|                                                               |                                                                                                   | - [Site framing sentence for public role](#site-framing-sentence-for-public-role)   |
|                                                               | - [Capacity forecaster v2 (scenario compare)](#capacity-forecaster-v2-scenario-compare)           |                                                                                     |
|                                                               | - [Maintenance simulator v2 (risk thresholds)](#maintenance-simulator-v2-risk-thresholds)         |                                                                                     |
|                                                               | - [Burden modeler v2 (equity snapshots)](#burden-modeler-v2-equity-snapshots)                     |                                                                                     |

## Spec template

Use this template when starting new work or clarifying requirements. Create a dedicated section
under this heading and link to it from the roadmap table.

### Spec section format

**Anchor format:** `## <Feature name>`

- **Problem:**
- **Scope:**
- **UX/Tech notes:**
- **Acceptance criteria:**
- **Dependencies/risks:**
- **Issue link:** `Issue: <GitHub link> / Spec: <section anchor>`

### Ready-for-pickup checklist

- Scope is bounded (small enough for a single PR).
- Acceptance criteria are testable.
- Dependencies and blockers are listed.
- If needed, a GitHub Issue exists and links back here.

## Redundancy compression pass

- **Problem:** Repeated language increases maintenance cost and reading fatigue.
- **Scope:** Audit repetition (Institute vs. Studio explanations, diagnostic off-ramp language) and
  replace repeats with canonical callouts or references.
- **UX/Tech notes:** Keep copy tone unchanged; create a single authoritative explanation per concept.
- **Acceptance criteria:** Fewer repeated paragraphs with no loss of clarity for first-time readers.
- **Dependencies/risks:** Requires coordination across Diagnostics and Start Here pages.
- **Issue link:** Issue: TBD / Spec: #redundancy-compression-pass

## Rights → validators → mechanisms matrix

- **Problem:** Practitioners need faster lookups across rights, validators, and mechanisms.
- **Scope:** Create a static, printable matrix mapping STD-01 rights to validators and mechanisms.
  Link from STD-01 and Diagnostics.
- **UX/Tech notes:** Deliver as one table or SVG. Avoid introducing new concepts.
- **Acceptance criteria:** Enables fast navigation without explanation. No prioritization or
  rankings.
- **Dependencies/risks:** Needs stable identifiers for rights, validators, and mechanisms.
- **Issue link:** Issue: TBD / Spec: #rights-to-validators-to-mechanisms-matrix

## Desktop navigation visibility

- **Problem:** Core destinations remain hidden behind the navigation overlay on desktop.
- **Scope:** Expose top-level links (Library, Institute, Diagnostics) in the desktop header while
  keeping the overlay for deeper navigation.
- **UX/Tech notes:** Keep SSR navigation and skip-link behavior; avoid layout shifts and preserve
  current structure in `Navigation.astro`.
- **Acceptance criteria:** Desktop nav surfaces the primary destinations without opening the panel;
  keyboard focus order remains predictable.
- **Dependencies/risks:** Requires coordinated styling updates in global navigation styles.
- **Issue link:** Issue: TBD / Spec: #desktop-navigation-visibility

## Capacity forecaster v2 (scenario compare)

- **Problem:** The capacity forecaster only supports one scenario at a time, slowing comparative
  planning.
- **Scope:** Add a two-scenario compare mode with mirrored sliders, delta summaries, and a clear
  reset path to return to single-scenario mode.
- **UX/Tech notes:** Reuse the existing chart styles and export flow; keep keyboard access for all
  controls.
- **Acceptance criteria:** Users can create two scenarios, see a delta summary, and export each
  scenario or the comparison snapshot.
- **Dependencies/risks:** Needs chart updates and content copy for comparison framing.
- **Issue link:** Issue: TBD / Spec: #capacity-forecaster-v2-scenario-compare

## Maintenance simulator v2 (risk thresholds)

- **Problem:** The simulator results lack clear guardrails for when mitigation steps become
  mandatory.
- **Scope:** Introduce configurable risk thresholds with labeled bands and auto-suggested
  interventions when results cross a threshold.
- **UX/Tech notes:** Keep calculations server-side only; expose thresholds as labeled presets with
  a short explainer tooltip.
- **Acceptance criteria:** Results display threshold bands, highlight the current risk tier, and
  surface a recommended intervention list per tier.
- **Dependencies/risks:** Requires content alignment on threshold definitions and recommendation
  copy.
- **Issue link:** Issue: TBD / Spec: #maintenance-simulator-v2-risk-thresholds

## Burden modeler v2 (equity snapshots)

- **Problem:** The burden modeler reports totals but does not highlight equity deltas across
  segments.
- **Scope:** Add an equity snapshot panel that compares the top three impacted segments and flags
  any imbalance beyond a configurable delta.
- **UX/Tech notes:** Use existing data structures; present snapshots as a compact table with
  plain-language labels and an exportable summary.
- **Acceptance criteria:** Users see a clear equity snapshot, flagged deltas, and a single-click
  export of the snapshot data.
- **Dependencies/risks:** Needs clarity on segment definitions and acceptable delta thresholds.
- **Issue link:** Issue: TBD / Spec: #burden-modeler-v2-equity-snapshots

## Where this binds (surface)

- **Problem:** Policy and procurement teams need a non-legal translation surface.
- **Scope:** Explain how standards can be cited in internal policy, procurement requirements, and
  audit frameworks using abstract examples only.
- **UX/Tech notes:** Publish as a clearly labeled “non-legal guidance” page.
- **Acceptance criteria:** Useful to policy teams without reading as regulatory authority. No legal
  advice or jurisdictional claims.
- **Dependencies/risks:** Needs careful review to avoid legal framing.
- **Issue link:** Issue: TBD / Spec: #where-this-binds-surface

## Contestability checklist + plain-language explainers

- **Problem:** Visitors lack shared vocabulary for recognizing uncontestable systems.
- **Scope:** Publish a plain-language “Can I contest this?” checklist plus three short explainers:
  “What contestability actually means,” “Why ‘contact support’ is not due process,” and “What
  makes an appeal real vs performative.”
- **UX/Tech notes:** One landing page with a printable checklist block and three expandable
  explainers; cross-link from Diagnostics and Start Here.
- **Acceptance criteria:** A non-expert can answer the checklist in under two minutes and leave
  with a clear definition of contestability vs. support-only processes.
- **Dependencies/risks:** Needs alignment with existing glossary terms for contestability and
  due process language.
- **Issue link:** Issue: TBD / Spec: #contestability-checklist--plain-language-explainers

## Minimum viable contestability standard

- **Problem:** Advocates and journalists lack a concrete, shareable yardstick for accountability.
- **Scope:** Publish a short, non-jargony “Minimum Viable Contestability” standard covering
  standing, reasons, records, timelines, remedies, and non-retaliation.
- **UX/Tech notes:** Deliver as a printable page with a one-screen summary and a text-only
  version for linking or quoting.
- **Acceptance criteria:** Readers can point to the standard to assess whether a system meets a
  baseline contestability threshold.
- **Dependencies/risks:** Must align with STD-01 framing without re-litigating standards language.
- **Issue link:** Issue: TBD / Spec: #minimum-viable-contestability-standard

## Self-defense diagnostic tools

- **Problem:** People need fast, concrete diagnostics to move from frustration to structured
  critique.
- **Scope:** Create three short tools: “Is this system governable?” (5–10 yes/no questions), “Is
  this appeal real or fake?”, and “Who actually holds power here?”
- **UX/Tech notes:** Use consistent question blocks that work for benefits portals, workplace
  tools, platform bans, and AI agent interactions; include a print/export option.
- **Acceptance criteria:** Each tool yields a clear result (governable vs. not, appeal real vs.
  performative, power map) with next-step links.
- **Dependencies/risks:** Needs careful wording to avoid implying legal advice.
- **Issue link:** Issue: TBD / Spec: #self-defense-diagnostic-tools

## Contestability pattern library

- **Problem:** Teams lack concrete examples of contestability patterns (good and bad).
- **Scope:** Publish a pattern library with anti-patterns (“trust us governance,” “black-box
  denial,” “appeal without remedy,” “AI says no”) and positive patterns (reversible decisions,
  human escalation, logged reasons, compensation after error).
- **UX/Tech notes:** Structure as a library with short pattern cards; avoid naming specific
  organizations and focus on design patterns.
- **Acceptance criteria:** Readers can identify a pattern and map it to their own system without
  needing vendor-specific knowledge.
- **Dependencies/risks:** Requires consistent terminology with glossary and diagnostics.
- **Issue link:** Issue: TBD / Spec: #contestability-pattern-library

## Governance lessons from incidents

- **Problem:** Public incidents are framed as “bad tech” rather than governance failures.
- **Scope:** Create a recurring “governance lessons” format that analyzes incidents for missing
  contestability, failed oversight, and what would have caught or repaired harm earlier.
- **UX/Tech notes:** Keep tone non-polemical; use a repeatable template with structural questions
  and links to relevant standards.
- **Acceptance criteria:** Each incident entry yields a short list of structural failures and a
  concrete remediation checklist.
- **Dependencies/risks:** Requires careful sourcing and avoids naming-and-shaming.
- **Issue link:** Issue: TBD / Spec: #governance-lessons-from-incidents

## Language people can use

- **Problem:** People need exact phrases for demanding contestability and accountability.
- **Scope:** Publish a “language people can use” page with succinct statements such as “This
  decision lacks contestability,” “What is the escalation path and remedy?” and “Who is the
  accountable steward?”
- **UX/Tech notes:** Provide copy blocks with short context notes for workplaces, public services,
  and platforms; include a printable version.
- **Acceptance criteria:** Readers can copy/paste a phrase and understand when to deploy it.
- **Dependencies/risks:** Align with any existing glossary or FAQ language.
- **Issue link:** Issue: TBD / Spec: #language-people-can-use

## Democratic vs. coercive governability

- **Problem:** “Governability” can drift into compliance engineering without explicit contrast.
- **Scope:** Publish a short page explaining how contestability, proportionality, and independent
  oversight distinguish democratic from coercive governability.
- **UX/Tech notes:** Keep the page simple, with a visual compare table and minimal footnotes.
- **Acceptance criteria:** Readers can describe the difference in one paragraph and recognize
  governance tools deployed without democratic safeguards.
- **Dependencies/risks:** Needs careful political framing without partisan cues.
- **Issue link:** Issue: TBD / Spec: #democratic-vs-coercive-governability

## Public memory for contestability terms

- **Problem:** Governance language drifts and institutional memory fades, causing repeated harm.
- **Scope:** Maintain a public memory page tracking stable definitions and language drift (e.g.,
  “responsible AI,” “trustworthy AI”) with short historical notes.
- **UX/Tech notes:** Use a timeline or changelog format with short entries and clear sources.
- **Acceptance criteria:** Visitors can see how terms shifted and locate prior meanings easily.
- **Dependencies/risks:** Requires periodic updates and sourcing discipline.
- **Issue link:** Issue: TBD / Spec: #public-memory-for-contestability-terms

## Site framing sentence for public role

- **Problem:** The site needs a concise public-facing framing line to anchor its role.
- **Scope:** Introduce a tight framing sentence for the site (e.g., “Ethotechnics helps people see
  where power lives in systems—and whether they can challenge it.”) and identify the placement
  location(s).
- **UX/Tech notes:** Coordinate with homepage and About/Institute page tone; keep the line short,
  single sentence.
- **Acceptance criteria:** The sentence appears in agreed locations and is reused consistently in
  summaries or metadata.
- **Dependencies/risks:** Must align with existing mission statements and avoid duplication.
- **Issue link:** Issue: TBD / Spec: #site-framing-sentence-for-public-role

## Completed work (archive)

Keep completed specs here for quick reference. Trim to the essentials and capture outcomes so
future updates can build on what already shipped.

### End-to-end mapping artifact (brandless)

- **Problem:** The composability chain (harm → right → validator → mechanism → binding change) was
  hard to parse in one view.
- **Outcome:** Published a brandless mapping artifact with a synthetic scenario, table-based
  chain, and cross-links to STD-01, validators, and mechanisms.
- **Notes:** Includes citation blocks and a stable permalink for reuse in briefs and audits.
- **Issue link:** Issue: TBD / Spec: #end-to-end-mapping-artifact-brandless

### Micro-diagram language specification

- **Problem:** Diagram semantics could drift as more visuals were added.
- **Outcome:** Published a canonical micro-diagram language with shapes, line styles, axes, and
  example SVG snippets.
- **Notes:** Examples cover execution vs. redress clocks and stoppability vs. reversibility.
- **Issue link:** Issue: TBD / Spec: #micro-diagram-language-specification

### Minimum binding set specification

- **Problem:** Standards could be adopted in partial or symbolic ways without enforcement.
- **Outcome:** Published STD-01 minimum binding sets per right with clause references and explicit
  insufficient implementations.
- **Notes:** Intended for auditors and policy teams to prevent checkbox compliance.
- **Issue link:** Issue: TBD / Spec: #minimum-binding-set-specification

### Navigation clarity refresh

- **Problem:** The primary navigation is comprehensive but can feel dense for new visitors.
- **Outcome:** Simplified nav labels and hierarchy with clearer descriptions and consistent labels
  across desktop and mobile.
- **Notes:** Decision logged on whether to introduce a “Start here” entry; updates reflected in
  navigation components.
- **Issue link:** Issue: TBD / Spec: #navigation-clarity-refresh

### Homepage narrative clarity

- **Problem:** The homepage narrative can undersell the mission and focus areas early.
- **Outcome:** Updated the hero and “How it works” copy to highlight delivery, research, and
  governance with clearer action framing.
- **Notes:** Kept layout and structure intact while refining mission-focused language.
- **Issue link:** Issue: TBD / Spec: #homepage-narrative-clarity

### Desktop navigation visibility

- **Problem:** Core destinations remained hidden behind the navigation overlay on desktop.
- **Outcome:** Exposed Library, Diagnostics, and Institute links directly in the desktop header
  while keeping the full overlay navigation for deeper destinations.
- **Notes:** Kept SSR navigation structure intact and preserved predictable focus order.
- **Issue link:** Issue: TBD / Spec: #desktop-navigation-visibility

### Diagnostics CTA clarity

- **Problem:** Diagnostics cards lacked clear “start” actions and consistent examples.
- **Outcome:** Updated diagnostics CTAs and aria labels to use clear action language that calls out
  each tool by name.
- **Notes:** Kept the primary/ghost action structure while standardizing labels for consistency.
- **Issue link:** Issue: TBD / Spec: #diagnostics-cta-clarity

### Pattern detail actions

- **Problem:** Pattern cards stopped at summaries without a path to deeper usage guidance.
- **Outcome:** Added a consistent “Details” action to pattern cards that routes to the
  server-rendered mechanism pages.
- **Notes:** Reused existing SSR detail routes without introducing new client-side behavior.
- **Issue link:** Issue: TBD / Spec: #pattern-detail-actions

### Hero hierarchy performance audit

- **Problem:** Typography or hero imagery changes could risk CLS/LCP regressions.
- **Outcome:** Reviewed hero layout and animation choices against CLS/LCP guardrails and confirmed
  no code changes were needed.
- **Notes:** Documented the audit outcome in the roadmap for future updates.
- **Issue link:** Issue: TBD / Spec: #hero-hierarchy-performance-audit

### Long-page summaries + wayfinding

- **Problem:** Long pages (glossary, research) lacked at-a-glance summaries and orientation.
- **Outcome:** Added summary blocks, key takeaways, and related-section quick links on glossary and
  research landing pages.
- **Notes:** Summary blocks include anchor links to major sections with concise copy.
- **Issue link:** Issue: TBD / Spec: #long-page-summaries--wayfinding

### Institute vs. Studio clarity

- **Problem:** Visitors may confuse the Institute (ethotechnics.org) with the Studio (.com).
- **Outcome:** Added a consistent clarification statement on the home page and Institute page, with
  a navigation or FAQ note distinguishing the two.
- **Notes:** Copy kept short and links to Studio were added without overshadowing the Institute’s
  mission.
- **Issue link:** Issue: TBD / Spec: #institute-vs-studio-clarity

### Feedback channel

- **Problem:** There was no clear pathway for visitors to submit feedback or accessibility issues.
- **Outcome:** Added a “Send feedback” entry in the global UI that routes to a form or mailto.
- **Notes:** Destination includes accessibility feedback instructions and routing/tracking notes.
- **Issue link:** Issue: TBD / Spec: #feedback-channel

### Glossary + research search filters

- **Problem:** Filtering existed but lacked quick search and combined filters for speed.
- **Outcome:** Added live search inputs with auto-complete on glossary and research lists, plus
  support for combined filters.
- **Notes:** Search results update without page reload and include clear empty-state messaging.
- **Issue link:** Issue: TBD / Spec: #glossary--research-search-filters

### Accessibility + semantic audit

- **Problem:** Accessibility improvements were needed for headings, link text, and semantic
  structure.
- **Outcome:** Completed an audit, applied high-priority fixes, and added breadcrumb navigation in
  page intros to reinforce semantic structure.
- **Notes:** Prioritized semantic HTML, descriptive links, and consistent heading hierarchy.
- **Issue link:** Issue: TBD / Spec: #accessibility--semantic-audit

### Role-specific quick-start guides

- **Problem:** Different audiences needed tailored entry points to standards and mechanisms.
- **Outcome:** Added four persona guides (policy makers, designers, engineers, researchers) with
  tailored resource links and navigation placement.
- **Notes:** Guides use consistent layouts and cross-link to core resources.
- **Issue link:** Issue: TBD / Spec: #role-specific-quick-start-guides

### Interactive diagrams + timelines

- **Problem:** Key concepts (Temporal Bill of Rights) were text-heavy and hard to scan.
- **Outcome:** Added an expandable rights diagram in STD-01 plus a research timeline linking
  milestones to related standards.
- **Notes:** Accessible fallback text included for interactive elements.
- **Issue link:** Issue: TBD / Spec: #interactive-diagrams--timelines

### Performance chunking for long lists

- **Problem:** Long lists (glossary, research) were slow to load and scroll.
- **Outcome:** Implemented collapsible list sections, default-open behavior, and manual
  expand/collapse controls; expanded all sections when filters are active.
- **Notes:** Changes balance performance with discoverability.
- **Issue link:** Issue: TBD / Spec: #performance-chunking-for-long-lists

### Agent-ready metadata + API

- **Problem:** Agents needed machine-readable metadata and structured access to content.
- **Outcome:** Implemented JSON-LD for standards, mechanisms, validators, and research; added API
  endpoints plus documentation with example payloads and agent discovery notes.
- **Notes:** Defined Schema.org types, canonical URLs, and versioning guidance.
- **Issue link:** Issue: TBD / Spec: #agent-ready-metadata--api

## GitHub Issues integration

Treat this in-repo doc as the canonical source of roadmap and spec truth. When creating a GitHub
Issue, point it back to the relevant section here for full context.

**Template line:** `Issue: <GitHub link> / Spec: <section anchor>`

### Roadmap-to-issue checklist

- **Title format:** `Roadmap: <Feature>`
- **Required labels:** `roadmap`, `spec`, `good first issue`
- **Spec link:** include the anchor to the spec section in this doc.
- **Sync rule:** update the roadmap entry and spec section when the issue status changes.

## How to pick up work

- Start with the roadmap table and pull from **Now**, then **Next** if no **Now** items exist.
- Draft or update the spec using the template above before changing code.
- Confirm dependencies or blockers in the spec so follow-on work stays clear.
- Keep updates lightweight and scoped to the smallest useful change.
