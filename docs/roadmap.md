# Roadmap and specs hub

This doc centralizes the lightweight roadmap, spec template, and pickup guidance so agents can
align quickly.

## Now/Next/Later roadmap

Use this table to keep focus visible without heavy process. Update entries as priorities change.

| Now                                | Next                                    | Later                                    |
| ---------------------------------- | --------------------------------------- | ---------------------------------------- |
| Highest-priority work in progress. | Ready-to-start items with scoped specs. | Ideas to revisit when capacity frees up. |
| Keep entries small and actionable. | Add owners or dates only when needed.   | Capture rough ideas, not full specs.     |

## Spec template

Use this template when starting new work or clarifying requirements.

- **Problem:**
- **Scope:**
- **UX/Tech notes:**
- **Acceptance criteria:**

## GitHub Issues integration

Treat this in-repo doc as the canonical source of roadmap and spec truth. When creating a GitHub
Issue, point it back to the relevant section here for full context.

**Template line:** `Issue: <GitHub link> / Spec: <section anchor>`

### Roadmap-to-issue checklist

- **Title format:** `Roadmap: <Feature>`
- **Required labels:** `roadmap`, `spec`, `good first issue`

## How to pick up work

- Start with the roadmap table and pull from **Now**, then **Next** if no **Now** items exist.
- Draft or update the spec using the template above before changing code.
- Confirm dependencies or blockers in the spec so follow-on work stays clear.
- Keep updates lightweight and scoped to the smallest useful change.
