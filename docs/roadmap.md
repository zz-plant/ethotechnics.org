# Roadmap and specs hub

This doc centralizes the lightweight roadmap, spec template, and pickup guidance so agents can
align quickly. Treat it as the in-repo tracker, and mirror key items to GitHub Issues when you
need assignment, notifications, or automation.

## Related plans

- [`interop-release-plan.md`](interop-release-plan.md) covers planned Python, TypeScript, FHIR, and
  W3C VC deliverables.

## Active roadmap

Use this table to keep focus visible without heavy process. Keep each item short (verb +
outcome) and link to a spec section below once scoped.

| Now                                                                                                                                                                                 | Next                                                                                      | Later                                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Highest-priority work in progress.                                                                                                                                                  | Ready-to-start items with scoped specs.                                                   | Ideas to revisit when capacity frees up.                                         |
| Keep entries small and actionable.                                                                                                                                                  | Add owners or dates only when needed.                                                     | Capture rough ideas, not full specs.                                             |
|                                                                                                                                                                                     |                                                                                           | - [Contestability pattern library](#contestability-pattern-library)              |
| - [JSON schema set (decision-record, appeal-event, pause-reversal, burden-hours, repair-sla)](#json-schema-set-decision-record-appeal-event-pause-reversal-burden-hours-repair-sla) | - [Self-defense diagnostic tools](#self-defense-diagnostic-tools)                         | - [Governance lessons from incidents](#governance-lessons-from-incidents)        |
|                                                                                                                                                                                     | - [Capacity forecaster v2 (scenario compare)](#capacity-forecaster-v2-scenario-compare)   |                                                                                  |
|                                                                                                                                                                                     | - [OpenAPI control-plane spec](#openapi-control-plane-spec)                               | - [Democratic vs. coercive governability](#democratic-vs-coercive-governability) |
|                                                                                                                                                                                     | - [Python evaluation toolkit](#python-evaluation-toolkit)                                 | - [TypeScript SDK](#typescript-sdk)                                              |
|                                                                                                                                                                                     | - [Maintenance simulator v2 (risk thresholds)](#maintenance-simulator-v2-risk-thresholds) | - [FHIR profile set and W3C VC schemas](#fhir-profile-set-and-w3c-vc-schemas)    |
|                                                                                                                                                                                     | - [Burden modeler v2 (equity snapshots)](#burden-modeler-v2-equity-snapshots)             |                                                                                  |

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

## AsyncAPI events spec

- **Problem:** Event payloads and channel names vary, making integrations brittle.
- **Scope:** Define an AsyncAPI spec for key events (decision issued, appeal opened,
  pause reversal, repair completed, burden hours updated) with schema references.
- **UX/Tech notes:** Reuse JSON schemas as message payloads; document channel naming and
  correlation fields.
- **Acceptance criteria:** Spec validates, includes example events, and maps events to
  schema references.
- **Dependencies/risks:** Depends on JSON schema set and control-plane decisions; risk of
  event taxonomy churn.
- **Issue link:** Issue: TBD / Spec: #asyncapi-events-spec

## Python evaluation toolkit

- **Problem:** Evaluators lack a shared toolkit to validate payloads and run basic checks.
- **Scope:** Build a Python package with schema validation, CLI helpers, and starter datasets
  for evaluation workflows.
- **UX/Tech notes:** Target Python 3.11+, keep dependencies minimal, and ship typed APIs and
  clear CLI help output.
- **Acceptance criteria:** `pip install` works, CLI validates sample payloads, and docs show
  a minimal end-to-end evaluation run.
- **Dependencies/risks:** Depends on JSON schema set; risk of duplicated logic with SDKs.
- **Issue link:** Issue: TBD / Spec: #python-evaluation-toolkit

## TypeScript SDK

- **Problem:** Product teams need TypeScript-native governance tooling or integration stalls.
- **Scope:** Implement TypeScript deliverables that are product-facing and infra-adjacent.
- **Target:** Real product teams shipping web apps, admin consoles, and decision dashboards.
- **Why:** Cloud infrastructure tooling is increasingly TypeScript-native, so governance
  must live in the same stack to avoid being sidelined.
- **What to ship:**
  - SDK for emitting Ethotechnics events.
  - Decision-log middleware for Node and edge runtimes.
  - Frontend-safe types for appeals and status.
- **UX/Tech notes:** Prefer ESM, tree-shakeable exports, and generated types from schemas
  and OpenAPI definitions.
- **Acceptance criteria:** Package installs cleanly, exposes typed clients and models, and
  includes a short usage example.
- **Dependencies/risks:** Depends on JSON schema set and OpenAPI spec; risk of API drift.
- **Issue link:** Issue: TBD / Spec: #typescript-sdk

## FHIR profile set and W3C VC schemas

- **Problem:** Healthcare and credential workflows need standards-aligned representations of
  contestability artifacts.
- **Scope:** Define FHIR profiles and W3C Verifiable Credential schemas for decision records,
  appeal events, and repair outcomes, with mapping guidance.
- **UX/Tech notes:** Use canonical URLs, provide JSON-LD contexts for VC schemas, and cite
  base resources for each profile.
- **Acceptance criteria:** Profiles and VC schemas are published, mapping notes are included,
  and examples validate against the new definitions.
- **Dependencies/risks:** Depends on JSON schema set and domain review; risk of standards
  misalignment without partner input.
- **Issue link:** Issue: TBD / Spec: #fhir-profile-set-and-w3c-vc-schemas

## Capacity forecaster v2 (scenario compare)

- **Problem:** The capacity forecaster only supports one scenario at a time, slowing comparative
  planning.
- **Scope:** Add a two-scenario compare mode with mirrored sliders, delta summaries, a
  side-by-side delta table, and a clear reset path to return to single-scenario mode.
- **UX/Tech notes:** Reuse the existing chart styles; keep keyboard access for all controls; add
  an export option for each scenario and the comparison snapshot.
- **Acceptance criteria:** Users can create two scenarios, see delta readouts at a glance, and
  export each scenario or a combined comparison snapshot.
- **Dependencies/risks:** Needs chart updates and content copy for comparison framing.
- **Issue link:** Issue: TBD / Spec: #capacity-forecaster-v2-scenario-compare

## Maintenance simulator v2 (risk thresholds)

- **Problem:** The simulator results lack clear guardrails for when mitigation steps become
  mandatory.
- **Scope:** Introduce configurable risk thresholds with labeled bands and explicit guidance on
  when to act for each tier.
- **UX/Tech notes:** Keep calculations server-side only; expose thresholds as labeled presets with
  a short explainer tooltip describing what each tier means.
- **Acceptance criteria:** Results display threshold bands, highlight the current risk tier, and
  surface recommended interventions plus an “act now” signal when thresholds are crossed.
- **Dependencies/risks:** Requires content alignment on threshold definitions and recommendation
  copy.
- **Issue link:** Issue: TBD / Spec: #maintenance-simulator-v2-risk-thresholds

## Burden modeler v2 (equity snapshots)

- **Problem:** The burden modeler reports totals but does not highlight equity deltas across
  segments.
- **Scope:** Add an equity snapshot panel that compares the top three impacted segments, shows
  deltas between them, and flags any imbalance beyond a configurable threshold.
- **UX/Tech notes:** Use existing data structures; present snapshots as a compact comparison table
  with plain-language labels and an exportable summary.
- **Acceptance criteria:** Users see a clear equity snapshot, flagged deltas, and a single-click
  export of the snapshot comparison data.
- **Dependencies/risks:** Needs clarity on segment definitions and acceptable delta thresholds.
- **Issue link:** Issue: TBD / Spec: #burden-modeler-v2-equity-snapshots

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

## Completed work (archive)

Keep completed specs here for quick reference. Trim to the essentials and capture outcomes so
future updates can build on what already shipped.

### JSON schema set (decision-record, appeal-event, pause-reversal, burden-hours, repair-sla)

- **Problem:** Contestability artifacts lacked shared schema definitions, making validation and
  interoperability inconsistent.
- **Outcome:** Published JSON Schema (2020-12) definitions for decision records, appeal events,
  pause reversals, burden hours, and repair SLAs with versioned examples and stable references.
- **Notes:** The published JSON schemas are available as public artifacts:
  - [decision-record.schema.json](/standards/decision-record.schema.json)
  - [appeal-event.schema.json](/standards/appeal-event.schema.json)
  - [pause-reversal.schema.json](/standards/pause-reversal.schema.json)
  - [burden-hours.schema.json](/standards/burden-hours.schema.json)
  - [repair-sla.schema.json](/standards/repair-sla.schema.json)
- **Issue link:** Issue: TBD / Spec:
  #json-schema-set-decision-record-appeal-event-pause-reversal-burden-hours-repair-sla

### AsyncAPI events spec

- **Problem:** Event payloads and channel names varied, making integrations brittle.
- **Outcome:** Published a versioned AsyncAPI contract covering decision issuance, appeal
  openings, pause or reversal updates, repair completion updates, burden hours telemetry, and
  deadline reminders.
- **Notes:** Event payloads reference the JSON schema set and include example messages for each
  channel, with legacy repair log updates retained for continuity.
- **Issue link:** Issue: TBD / Spec: #asyncapi-events-spec

### Language people can use

- **Problem:** People need exact phrases for demanding contestability and accountability.
- **Outcome:** Published a “Language people can use” explainer with copy-ready phrases, context
  blocks for workplaces, public services, and platforms, plus a printable sheet.
- **Notes:** Includes a print view with grouped phrases to share in audits or appeals.
- **Issue link:** Issue: TBD / Spec: #language-people-can-use

### Minimum viable contestability standard

- **Problem:** Advocates and journalists lacked a concrete, shareable yardstick for accountability.
- **Outcome:** Published a minimum viable contestability standard with a one-screen summary, text-
  only version, and requirement-by-requirement evidence checklists.
- **Notes:** The standard ships as a printable page focused on standing, reasons, records,
  timelines, remedies, and non-retaliation.
- **Issue link:** Issue: TBD / Spec: #minimum-viable-contestability-standard

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

### Rights → validators → mechanisms matrix

- **Problem:** Practitioners need faster lookups across rights, validators, and mechanisms.
- **Outcome:** Published the STD-01 rights matrix mapping rights to validators and mechanisms with
  a dedicated permalink.
- **Notes:** Linked from standards and validator/mechanism hubs to keep navigation fast.
- **Issue link:** Issue: TBD / Spec: #rights-to-validators-to-mechanisms-matrix

### Contestability checklist + plain-language explainers

- **Problem:** Visitors lack shared vocabulary for recognizing uncontestable systems.
- **Outcome:** Published a printable contestability checklist with expandable explainers and
  cross-links to STD-02 and the glossary.
- **Notes:** Checklist includes a print layout and a short summary panel for fast scanning.
- **Issue link:** Issue: TBD / Spec: #contestability-checklist--plain-language-explainers

### Where this binds (surface)

- **Problem:** Policy and procurement teams need a non-legal translation surface.
- **Outcome:** Published a non-authoritative guide to citing standards in procurement language and
  audits, including sample clauses.
- **Notes:** Framing stays explicitly non-legal and points to standards for context.
- **Issue link:** Issue: TBD / Spec: #where-this-binds-surface

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

### Public memory for contestability terms

- **Problem:** Governance language drifts and institutional memory fades, causing repeated harm.
- **Outcome:** Published a public memory explainer with a timeline of language drift, stable
  glossary anchors to cite, and source links for every entry.
- **Notes:** Includes usage guidance for audits and briefs plus links to STD-02 and evidence packs.
- **Issue link:** Issue: TBD / Spec: #public-memory-for-contestability-terms

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

### Site framing sentence for public role

- **Problem:** The site needed a concise public-facing framing line to anchor its role.
- **Outcome:** Added a single-sentence framing line to the homepage hero copy that explains where
  power lives in systems and whether it can be challenged.
- **Notes:** Kept the sentence short and aligned with existing mission language.
- **Issue link:** Issue: TBD / Spec: #site-framing-sentence-for-public-role

### Redundancy compression pass

- **Problem:** Repeated language increases maintenance cost and reading fatigue.
- **Outcome:** Centralized Institute vs. Studio callout copy so shared guidance stays consistent
  without duplicating sentences across content sources.
- **Notes:** Shared phrasing now lives in one content module for reuse.
- **Issue link:** Issue: TBD / Spec: #redundancy-compression-pass

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
