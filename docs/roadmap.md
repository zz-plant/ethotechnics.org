# Roadmap and specs hub

This doc centralizes the lightweight roadmap, spec template, and pickup guidance so agents can
align quickly. Treat it as the in-repo tracker, and mirror key items to GitHub Issues when you
need assignment, notifications, or automation.

## Active roadmap

Use this table to keep focus visible without heavy process. Keep each item short (verb +
outcome) and link to a spec section below once scoped.

| Now                                                                                            | Next                                                                                              | Later                                                                           |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Highest-priority work in progress.                                                             | Ready-to-start items with scoped specs.                                                           | Ideas to revisit when capacity frees up.                                        |
| Keep entries small and actionable.                                                             | Add owners or dates only when needed.                                                             | Capture rough ideas, not full specs.                                            |
| - [End-to-end mapping artifact (synthetic, brandless)](#end-to-end-mapping-artifact-brandless) | - [Redundancy compression pass](#redundancy-compression-pass)                                     | - [Where this binds (non-legal translation surface)](#where-this-binds-surface) |
| - [Micro-diagram language specification](#micro-diagram-language-specification)                | - [Rights → validators → mechanisms reference matrix](#rights-to-validators-to-mechanisms-matrix) |                                                                                 |
| - [Minimum binding set specification](#minimum-binding-set-specification)                      |                                                                                                   |                                                                                 |

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

## End-to-end mapping artifact (brandless)

- **Problem:** The composability chain (harm → right → validator → mechanism → binding change) is
  hard to understand in one view.
- **Scope:** Create one synthetic, brandless scenario (e.g., service eligibility denial) mapped to
  STD-01 clause IDs, validators, mechanisms, and concrete system changes. Present as a table with
  arrows, not narrative.
- **UX/Tech notes:** Publish as a standalone page with a stable permalink; include APA and BibTeX
  citation blocks; cross-link to standards, validators, and mechanisms.
- **Acceptance criteria:** A reader can explain the full chain in under three minutes. No personas,
  no storytelling, no brand references. The mapping is reusable across domains.
- **Dependencies/risks:** Needs agreement on canonical clause IDs and link targets.
- **Issue link:** Issue: TBD / Spec: #end-to-end-mapping-artifact-brandless

## Micro-diagram language specification

- **Problem:** Diagram semantics can drift as more visuals are added.
- **Scope:** Define canonical shapes (state, agent, boundary, authority), line styles (causal,
  authority, contingent), and axes (time, authority, burden). Include examples for execution vs.
  redress clocks and stoppability/reversibility.
- **UX/Tech notes:** Publish as a one-page spec with Markdown and SVG snippets. Reference it from
  future diagrams.
- **Acceptance criteria:** Every diagram can be explained using the spec alone. Shapes are
  unambiguous. Grayscale-readable and accessible.
- **Dependencies/risks:** Requires alignment with existing diagrams to avoid breaking semantics.
- **Issue link:** Issue: TBD / Spec: #micro-diagram-language-specification

## Minimum binding set specification

- **Problem:** Standards can be adopted in partial, symbolic, or checkbox ways.
- **Scope:** Define minimum binding requirements per right, starting with STD-01. Example: for
  Bounded Duration, require a hard clock, escalation path, and declared duration pre-commitment.
  Include clause-level references and an explicit list of insufficient implementations.
- **UX/Tech notes:** Publish as a STD-01 appendix or standalone spec with clear enforcement logic.
- **Acceptance criteria:** Impossible to claim compliance with a single surface change. Auditors and
  reviewers can apply the logic consistently.
- **Dependencies/risks:** Requires agreement on enforcement language and clause references.
- **Issue link:** Issue: TBD / Spec: #minimum-binding-set-specification

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

## Where this binds (surface)

- **Problem:** Policy and procurement teams need a non-legal translation surface.
- **Scope:** Explain how standards can be cited in internal policy, procurement requirements, and
  audit frameworks using abstract examples only.
- **UX/Tech notes:** Publish as a clearly labeled “non-legal guidance” page.
- **Acceptance criteria:** Useful to policy teams without reading as regulatory authority. No legal
  advice or jurisdictional claims.
- **Dependencies/risks:** Needs careful review to avoid legal framing.
- **Issue link:** Issue: TBD / Spec: #where-this-binds-surface

## Completed work (archive)

Keep completed specs here for quick reference. Trim to the essentials and capture outcomes so
future updates can build on what already shipped.

### Navigation clarity refresh

- **Problem:** The primary navigation is comprehensive but can feel dense for new visitors.
- **Outcome:** Simplified nav labels and hierarchy with clearer descriptions and consistent labels
  across desktop and mobile.
- **Notes:** Decision logged on whether to introduce a “Start here” entry; updates reflected in
  navigation components.
- **Issue link:** Issue: TBD / Spec: #navigation-clarity-refresh

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
