# Roadmap and specs hub

This doc centralizes the lightweight roadmap, spec template, and pickup guidance so agents can
align quickly. Treat it as the in-repo tracker, and mirror key items to GitHub Issues when you
need assignment, notifications, or automation.

## Active roadmap

Use this table to keep focus visible without heavy process. Keep each item short (verb +
outcome) and link to a spec section below once scoped. Priority order is top to bottom within
each column.

**Status tags:** `[Spec ready]` means the section below is ready for pickup. `[Needs alignment]`
flags work that depends on cross-team decisions or external input.

| Now                                                                                                 | Next                                                                   | Later                                                                                              |
| --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Highest-priority work in progress.                                                                  | Ready-to-start items with scoped specs.                                | Ideas to revisit when capacity frees up.                                                           |
| Keep entries small and actionable.                                                                  | Add owners or dates only when needed.                                  | Capture rough ideas, not full specs.                                                               |
| [Reconstruction plan: justified delegation](reconstruction-plan-2026-09.md) `[Spec ready]`          | [Python evaluation toolkit](#python-evaluation-toolkit) `[Spec ready]` | [Contestability pattern library](#contestability-pattern-library) `[Needs alignment]`              |
| [Enforceable governance reference implementation](#enforceable-governance-reference-implementation) |                                                                        |                                                                                                    |
|                                                                                                     | [TypeScript SDK](#typescript-sdk) `[Spec ready]`                       | [Governance lessons from incidents](#governance-lessons-from-incidents) `[Needs alignment]`        |
|                                                                                                     |                                                                        | [Democratic vs. coercive governability](#democratic-vs-coercive-governability) `[Needs alignment]` |
|                                                                                                     |                                                                        | [FHIR profile set and W3C VC schemas](#fhir-profile-set-and-w3c-vc-schemas) `[Needs alignment]`    |

## Recently completed (checked off)

- [x] Capacity forecaster v2 (scenario compare).
- [x] Maintenance simulator v2 (risk thresholds).
- [x] Burden modeler v2 (equity snapshots).

**Priority snapshot**

- **Definition and object model first:** the reconstruction plan reframes the site around the
  consequential decision and adds authority, policy, and intervention objects; the enforceable
  governance work below is absorbed into its WS2 and WS3.
- **Governance implementation first:** ship enforceable governance crosswalks, evidence-pack
  discipline, and post-market accountability surfaces as the primary product story.
- **Foundation specs:** Python evaluation toolkit unblocks SDKs and evaluation workflows.
- **Publishing + standards:** content and standards work stays queued until alignment work is
  complete.

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

## Enforceable governance reference implementation

- **Problem:** The site describes governance concepts but does not yet behave like a reference
  implementation of enforceable governance tied to statutory and standards obligations.
- **Scope:**
  - Publish canonical control crosswalks from Ethotechnics mechanisms to EU AI Act duties,
    NIST AI RMF functions, and ISO/IEC 42001 clauses.
  - Promote evidence-pack discipline from supporting guidance to a first-class operating model,
    with required artifacts, ownership, and freshness rules.
  - Elevate post-market monitoring and incident reporting to top-level, task-oriented user flows
    with explicit intake, triage, remediation, and regulator-ready export paths.
- **UX/Tech notes:**
  - Add stable control IDs and machine-readable mapping objects so crosswalks can power APIs,
    exports, and page-level references.
  - Define an evidence-pack minimum viable set (policy record, risk register slice, test results,
    human-oversight logs, incident ledger) and expose readiness scorecards.
  - Build role-specific entry points (operator, auditor, procurement, regulator) that prioritize
    monitoring and incident workflows ahead of explanatory content.
- **Acceptance criteria:**
  - Crosswalk pages and exports cover high-risk lifecycle obligations with bidirectional links
    between controls, mechanisms, and evidence artifacts.
  - Every high-stakes mechanism references a concrete evidence bundle and freshness cadence.
  - Monitoring and incident pages support end-to-end reporting states, deadlines, and evidence
    attachments, with no dead-end informational paths.
- **Dependencies/risks:** Requires legal and standards review cadence, schema updates, and clear
  ownership for ongoing mapping maintenance.
- **Issue link:** Issue: TBD / Spec: #enforceable-governance-reference-implementation

## Python evaluation toolkit

- **Problem:** Evaluators lack a shared toolkit to validate payloads and run basic checks.
- **Scope:** Build a Python package of reference implementations and evaluators for researchers,
  auditors, risk teams, and internal tools.
- **UX/Tech notes:** Target Python 3.11+, keep dependencies minimal, and ship typed APIs with
  notebook-friendly examples.
- **Acceptance criteria:** `pip install` works, CLI validates sample payloads, and docs show a
  minimal end-to-end evaluation run.
- **What to ship:** Reference validators for schemas, time-in-harm calculators, burden-hour
  scoring functions, and RMF / ISO clause-mapping evaluators.
- **Dependencies/risks:** Depends on JSON schema set; risk of duplicated logic with SDKs.
- **Issue link:** Issue: TBD / Spec: python-evaluation-toolkit.md

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

## Democratic vs. coercive governability

- **Problem:** “Governability” can drift into compliance engineering without explicit contrast.
- **Scope:** Publish a short page explaining how contestability, proportionality, and independent
  oversight distinguish democratic from coercive governability.
- **UX/Tech notes:** Keep the page simple, with a visual compare table and minimal footnotes.
- **Acceptance criteria:** Readers can describe the difference in one paragraph and recognize
  governance tools deployed without democratic safeguards.
- **Dependencies/risks:** Needs careful political framing without partisan cues.
- **Issue link:** Issue: TBD / Spec: #democratic-vs-coercive-governability

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

## Completed work (archive)

Keep completed specs here for quick reference. Trim to the essentials and capture outcomes so
future updates can build on what already shipped.

### Capacity forecaster v2 (scenario compare)

- **Outcome:** Shipped compare mode with paired scenario controls, delta highlights, side-by-side
  table output, reset-to-single flow, and JSON exports for both single and compare views.
- **Notes:** Delivered via `src/features/capacity-forecaster/*` with compare view state,
  delta summaries, and export actions.

### Maintenance simulator v2 (risk thresholds)

- **Outcome:** Added threshold presets with labeled score bands, current tier indicators,
  recommendation messaging, and explicit watch/act-now guidance.
- **Notes:** Delivered via `src/features/maintenance-simulator/*` with preset selection,
  threshold status logic, and threshold explainer tooltip.

### Burden modeler v2 (equity snapshots)

- **Outcome:** Added a top-segment equity snapshot with delta flags, imbalance threshold marker,
  and one-click JSON export for snapshot data.
- **Notes:** Delivered via `src/features/burden-modeler/*` with segment comparison table and
  exportable snapshot payload.

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

### OpenAPI control-plane spec

- **Problem:** Control-plane endpoints were described informally, leading to inconsistent
  implementations across tools and SDKs.
- **Outcome:** Published a validated OpenAPI spec covering decision records, appeals, pause or
  reversal updates, repair SLA tracking, and burden-hours telemetry with shared error responses
  and concrete examples for common workflows.
- **Notes:** The draft OpenAPI specification lives at
  [ethotechnics-control-plane.openapi.yaml](/standards/ethotechnics-control-plane.openapi.yaml).
- **Issue link:** Issue: TBD / Spec: #openapi-control-plane-spec

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

### Self-defense diagnostic tools

- **Problem:** People need fast, concrete diagnostics to move from frustration to structured
  critique.
- **Outcome:** Published three short tools that cover governability checks, appeal legitimacy, and
  power mapping, each with a printable sheet and next-step links.
- **Notes:** The tools live under the diagnostics menu and include print-ready question blocks.
- **Issue link:** Issue: TBD / Spec: #self-defense-diagnostic-tools

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
