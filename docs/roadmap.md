# Roadmap and specs hub

This doc centralizes the lightweight roadmap, spec template, and pickup guidance so agents can
align quickly. Treat it as the in-repo tracker, and mirror key items to GitHub Issues when you
need assignment, notifications, or automation.

## Now/Next/Later roadmap

Use this table to keep focus visible without heavy process. Update entries as priorities change.
Keep each item short (verb + outcome) and link to a spec section below once scoped.

| Now                                | Next                                    | Later                                   |
| ---------------------------------- | --------------------------------------- | --------------------------------------- |
| Refresh content component catalog. | Improve navigation skip-link behavior.  | Add post-launch performance checklist.  |
| Clarify homepage story hierarchy.  | Add contact form submission validation. | Explore sitemap coverage for new pages. |

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

## Refresh content component catalog

- **Problem:** The reusable component list can drift when new layout blocks land, leaving contributors
  unsure which patterns are officially supported.
- **Scope:** Audit `src/components` and `src/pages` to confirm the list in `docs/content-components.md`
  matches the components in use, and add missing entries with brief usage notes.
- **UX/Tech notes:** Focus on descriptive labels, props, and where the component is used so readers
  can recognize patterns quickly.
- **Acceptance criteria:**
  - `docs/content-components.md` reflects every shared component currently in use.
  - Each added component includes a short usage note and at least one reference page.
  - The docs map in `docs/README.md` remains accurate.
- **Dependencies/risks:** Requires time to inventory components before editing docs.
- **Issue link:** `Issue: <GitHub link> / Spec: #refresh-content-component-catalog`

## Clarify homepage story hierarchy

- **Problem:** The homepage narrative should clarify priority sections so readers understand the
  site focus without scanning the entire page.
- **Scope:** Review `src/pages/index.astro` and the related copy blocks to identify the primary
  message sequence, then adjust headings or supporting copy for clearer ordering.
- **UX/Tech notes:** Preserve existing layout structure; focus on copy and heading levels.
- **Acceptance criteria:**
  - The first two sections explicitly state the site's mission and focus.
  - Heading levels remain semantic and pass the existing accessibility structure.
  - Any copy changes are reflected in relevant docs if they alter page guidance.
- **Dependencies/risks:** Requires copy review by maintainers if messaging shifts materially.
- **Issue link:** `Issue: <GitHub link> / Spec: #clarify-homepage-story-hierarchy`

## Improve navigation skip-link behavior

- **Problem:** Keyboard users need a reliable skip link to jump past navigation to the main content.
- **Scope:** Confirm the skip-link exists in the shared layout, verify focus styles, and ensure the
  anchor target is present on key pages.
- **UX/Tech notes:** Keep focus rings consistent with the global styles in `src/styles`.
- **Acceptance criteria:**
  - Skip-link is visible on focus and moves focus to main content reliably.
  - Target anchors exist on key layouts and pages.
  - Visual focus treatment meets existing contrast and spacing expectations.
- **Dependencies/risks:** May require small updates to shared layout and global styles.
- **Issue link:** `Issue: <GitHub link> / Spec: #improve-navigation-skip-link-behavior`

## Add contact form submission validation

- **Problem:** If a contact form is introduced, it needs clear validation and error messaging.
- **Scope:** Define the required fields, client-side validation copy, and any server-side constraints
  expected by the endpoint.
- **UX/Tech notes:** Align error messaging tone with existing site voice and ensure accessibility.
- **Acceptance criteria:**
  - Validation rules are documented with user-facing copy.
  - Required field list and constraints are defined.
  - Accessibility guidance covers focus management and error summaries.
- **Dependencies/risks:** Depends on whether a contact form route exists or is planned.
- **Issue link:** `Issue: <GitHub link> / Spec: #add-contact-form-submission-validation`

## Add post-launch performance checklist

- **Problem:** There is no lightweight checklist to ensure performance budgets are met after changes.
- **Scope:** Define a short checklist for `bun run build`, Lighthouse scores, and asset size checks,
  plus where to record results.
- **UX/Tech notes:** Keep it to 5-7 bullet points, focusing on repeatable checks.
- **Acceptance criteria:**
  - Checklist is documented with expected targets and where to log results.
  - References existing tooling in README or docs.
  - Includes guidance for when to re-run Playwright or lint checks.
- **Dependencies/risks:** Needs alignment on target metrics and tooling.
- **Issue link:** `Issue: <GitHub link> / Spec: #add-post-launch-performance-checklist`

## Explore sitemap coverage for new pages

- **Problem:** As routes grow, sitemap coverage may not reflect all new content.
- **Scope:** Review the sitemap generation configuration and ensure new routes are captured.
- **UX/Tech notes:** Document any exclusions and how to update them.
- **Acceptance criteria:**
  - Sitemap generation path is documented.
  - Any exclusions are listed with rationale.
  - New routes are included or explicitly excluded.
- **Dependencies/risks:** Requires knowledge of the current sitemap generation approach.
- **Issue link:** `Issue: <GitHub link> / Spec: #explore-sitemap-coverage-for-new-pages`
