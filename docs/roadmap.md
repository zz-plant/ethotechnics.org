# Roadmap and specs hub

This doc centralizes the lightweight roadmap, spec template, and pickup guidance so agents can
align quickly. Treat it as the in-repo tracker, and mirror key items to GitHub Issues when you
need assignment, notifications, or automation.

## Now/Next/Later roadmap

Use this table to keep focus visible without heavy process. Update entries as priorities change.
Keep each item short (verb + outcome) and link to a spec section below once scoped.

| Now                                                                  | Next                                                                     | Later                                                                       |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Highest-priority work in progress.                                   | Ready-to-start items with scoped specs.                                  | Ideas to revisit when capacity frees up.                                    |
| Keep entries small and actionable.                                   | Add owners or dates only when needed.                                    | Capture rough ideas, not full specs.                                        |
| [Navigation clarity refresh](#navigation-clarity-refresh)            | [Glossary + research search filters](#glossary--research-search-filters) | [Interactive diagrams + timelines](#interactive-diagrams--timelines)        |
| [Long-page summaries + wayfinding](#long-page-summaries--wayfinding) | [Accessibility + semantic audit](#accessibility--semantic-audit)         | [Performance chunking for long lists](#performance-chunking-for-long-lists) |
| [Institute vs. Studio clarity](#institute-vs-studio-clarity)         | [Role-specific quick-start guides](#role-specific-quick-start-guides)    | [Agent-ready metadata + API](#agent-ready-metadata--api)                    |
| [Feedback channel](#feedback-channel)                                |                                                                          |                                                                             |

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

## Navigation clarity refresh

- **Problem:** The primary navigation is comprehensive but can feel dense for new visitors.
- **Scope:** Audit top-level nav labels and hierarchy; propose a simplified structure with clear
  descriptions for Standards, Mechanisms, Validators, Research, and Institute.
- **UX/Tech notes:** Consider a fixed nav, optional “Start here” entry, and concise descriptions.
  Keep labels consistent across desktop and mobile.
- **Acceptance criteria:**
  - Proposed nav structure documented with label updates and rationale.
  - Decision recorded on whether to introduce a “Start here” entry.
  - Updated nav labels reflected in site navigation components.
- **Dependencies/risks:** Requires UX review for clarity and alignment with existing IA.
- **Issue link:** Issue: TBD / Spec: #navigation-clarity-refresh

## Long-page summaries + wayfinding

- **Problem:** Long pages (glossary, research) lack an at-a-glance summary and orientation.
- **Scope:** Add an intro paragraph and a concise “Key takeaways” list to the glossary and research
  landing pages; add visual wayfinding cues for related sections.
- **UX/Tech notes:** Use existing layout patterns; keep summaries short, with anchor links to major
  sections.
- **Acceptance criteria:**
  - Glossary and research pages open with a summary block and takeaways list.
  - Summary block includes anchor links to key sections.
  - Content is concise and matches existing tone.
- **Dependencies/risks:** Requires content review to avoid duplication across pages.
- **Issue link:** Issue: TBD / Spec: #long-page-summaries--wayfinding

## Institute vs. Studio clarity

- **Problem:** Visitors may confuse the Institute (ethotechnics.org) with the Studio (.com).
- **Scope:** Add a brief, consistent clarification on the home page and Institute page, plus a
  navigation note or FAQ entry.
- **UX/Tech notes:** Keep copy short; link to Studio where appropriate without overshadowing the
  Institute’s mission.
- **Acceptance criteria:**
  - Home and Institute pages include a consistent clarification statement.
  - Navigation or FAQ includes a brief distinction note.
  - Copy reviewed for clarity and tone.
- **Dependencies/risks:** Requires sign-off on messaging.
- **Issue link:** Issue: TBD / Spec: #institute-vs-studio-clarity

## Feedback channel

- **Problem:** There is no clear pathway for visitors to submit feedback or accessibility issues.
- **Scope:** Add a “Send feedback” entry in the global UI that links to a form or mailto.
- **UX/Tech notes:** Keep the UI lightweight and accessible; ensure spam mitigation if a form is
  used.
- **Acceptance criteria:**
  - Feedback entry appears in a consistent global location (nav or footer).
  - Destination includes instructions for accessibility feedback.
  - Tracking or routing for submissions is documented.
- **Dependencies/risks:** Requires decision on form handling and data privacy.
- **Issue link:** Issue: TBD / Spec: #feedback-channel

## Glossary + research search filters

- **Problem:** Filtering exists but lacks quick search and combined filters for speed.
- **Scope:** Add a live search input with auto-complete to glossary and research lists; allow
  users to combine filters.
- **UX/Tech notes:** Favor client-side search with clear empty-state messaging.
- **Acceptance criteria:**
  - Live search input appears above glossary and research lists.
  - Multiple filters can be active simultaneously.
  - Search results update without page reload.
- **Dependencies/risks:** Requires performance checks on large datasets.
- **Issue link:** Issue: TBD / Spec: #glossary--research-search-filters

## Accessibility + semantic audit

- **Problem:** Accessibility improvements are needed for headings, link text, and semantic structure.
- **Scope:** Audit headings, link text, image alt text, contrast, and breadcrumbs across core pages.
- **UX/Tech notes:** Prioritize semantic HTML (`header`, `nav`, `main`, `section`) and descriptive
  link labels; ensure consistent heading hierarchy.
- **Acceptance criteria:**
  - Audit checklist completed with issues logged.
  - High-priority fixes applied to navigation, headings, and link text.
  - Breadcrumb approach decided and documented.
- **Dependencies/risks:** Requires cross-page review; may touch multiple templates.
- **Issue link:** Issue: TBD / Spec: #accessibility--semantic-audit

## Role-specific quick-start guides

- **Problem:** Different audiences need tailored entry points to standards and mechanisms.
- **Scope:** Create quick-start guide pages for policy makers, designers, engineers, and
  researchers, each with key links.
- **UX/Tech notes:** Use consistent layout and keep guides short; cross-link to core resources.
- **Acceptance criteria:**
  - Four persona guides added with tailored resource links.
  - Guides appear in navigation or a “Start here” hub.
  - Content reviewed for clarity and duplication.
- **Dependencies/risks:** Requires alignment on personas and copy tone.
- **Issue link:** Issue: TBD / Spec: #role-specific-quick-start-guides

## Interactive diagrams + timelines

- **Problem:** Key concepts (Temporal Bill of Rights) are text-heavy and hard to scan.
- **Scope:** Design an interactive diagram for the seven rights and a timeline showing research
  contributions to standards.
- **UX/Tech notes:** Ensure fallback text for accessibility; keep interactions lightweight.
- **Acceptance criteria:**
  - Diagram spec and timeline outline completed.
  - Interactive elements have accessible text alternatives.
  - Prototype approved for implementation.
- **Dependencies/risks:** Requires design and front-end capacity.
- **Issue link:** Issue: TBD / Spec: #interactive-diagrams--timelines

## Performance chunking for long lists

- **Problem:** Long lists (glossary, research) can be slow to load and scroll.
- **Scope:** Investigate chunking via tabs/accordions or lazy loading for large lists.
- **UX/Tech notes:** Balance performance with discoverability; avoid hiding critical content.
- **Acceptance criteria:**
  - Performance approach chosen and documented.
  - Long list pages updated with chunking or lazy loading.
  - Load time improvements measured or noted.
- **Dependencies/risks:** Requires performance measurement and UX validation.
- **Issue link:** Issue: TBD / Spec: #performance-chunking-for-long-lists

## Agent-ready metadata + API

- **Problem:** Agents need machine-readable metadata and structured access to content.
- **Scope:** Add JSON-LD for standards, mechanisms, validators, glossary entries, and research
  artifacts; outline API endpoints and plugin manifest requirements.
- **UX/Tech notes:** Use Schema.org types (`Article`, `CreativeWorkSeries`, `Dataset`) and
  document canonical URLs and versioning.
- **Acceptance criteria:**
  - JSON-LD schema strategy documented with sample payloads.
  - API surface defined for `/api/standards`, `/api/mechanisms`, `/api/glossary`, `/api/research`.
  - Sitemap and robots guidance documented for agent access.
- **Dependencies/risks:** Requires backend/API decisions and content modeling.
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
