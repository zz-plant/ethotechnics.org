# Usability audit

Snapshot of non-accessibility usability issues across ethotechnics.org, based on a quick content and
interaction review of navigation, Library, and Diagnostics pages.

## Findings and recommendations

### Navigation keeps key destinations hidden

- The primary navigation opens into a modal-like menu even on desktop, so core sections (Library,
  Institute, Diagnostics) remain hidden until a visitor clicks the toggle. This adds friction for
  new users who expect direct links without opening an overlay.
- Recommendation: expose top-level links on desktop (e.g., a horizontal list or quick-access bar)
  and reserve the overlay for deeper exploration or mobile.

### Diagnostics lack a clear "start" action

- Diagnostics cards outline readiness and outputs but never provide an action to launch, download,
  or request a diagnostic, leaving users to guess how to begin.
- Recommendation: add a primary CTA per tool ("Run the readiness check", "Book a facilitated
  session") and a consistent follow-up link to example outputs.

### Pattern cards stop at summaries

- Pattern entries present titles, summaries, cues, and diagnostic references but do not link to a
  fuller write-up or downloadable template, limiting their usefulness when someone needs to execute
  a pattern.
- Recommendation: add per-pattern detail pages or expandable details (e.g., steps, artifacts,
  example usage) and include a quick copy/share action for diagnostic links.
