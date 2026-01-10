# Roadmap and specs hub

This doc centralizes the lightweight roadmap, spec template, and pickup guidance so agents can
align quickly. Treat it as the in-repo tracker, and mirror key items to GitHub Issues when you
need assignment, notifications, or automation.

## Active roadmap

Use this table to keep focus visible without heavy process. Keep each item short (verb +
outcome) and link to a spec section below once scoped.

| Now                                                        | Next                                                    | Later                                                  |
| ---------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------ |
| Highest-priority work in progress.                         | Ready-to-start items with scoped specs.                 | Ideas to revisit when capacity frees up.               |
| Keep entries small and actionable.                         | Add owners or dates only when needed.                   | Capture rough ideas, not full specs.                   |
| _No active items yet — add new priorities as they emerge._ | _No queued items yet — draft specs before moving work._ | _Backlog ideas go here once they are worth capturing._ |

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
