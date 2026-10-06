# Recent page design review

Reviewed the recent navigator, start, standards, diagnostics, use-case, triage, and Robodebt page designs. The PR branch was subsequently rebased onto `c0d368e` and revalidated.

## Improvements

- Safeguard matrix: increased filters from 24 to at least 44 pixels; added explicit focus styling, pressed states, and announced result counts. Replaced incomplete tab semantics with a labeled group of filter buttons. Hidden results leave the accessibility tree.
- Matrix reading: increased reference text, simplified question labels, used shared surface and button colors, and kept all five reference columns together on wide screens while stacking them on phones.
- References: fixed five nonexistent standard destinations. Law statements, standard titles, and routes now resolve from their canonical catalogs. Corrected descriptions that overstated what diagnostics and remedy templates do.
- Binding stack: verified the safeguard and lens links; their correction was already present on the latest main and is not duplicated by this PR.
- Homepage: underlined the Studio link in the colophon after the updated main exposed a link-in-text accessibility failure.
- Start page: removed fixed minimum widths from symptom and vocabulary cards; enlarged their reference text. Constrained the adoption grid so the receipt sample cannot push headings and cards offscreen. The labeled code region supports keyboard scrolling and a visible focus outline.

## Validation

- `bun run check`: passed, including lint, TypeScript, Astro checks, content and asset checks, and 660 passing unit tests (2 skipped).
- `bun run build`: passed, including generated-output integrity checks.
- Prettier checks and `git diff --check`: passed.
- Chromium: 24 existing navigation, role, and accessibility tests passed against the final build.
- Responsive browser sweep: 56 views across seven routes, widths 320/375/768/1440, and both themes. No document overflow or clipped reviewed cards and headings.
- Axe: eight WCAG A/AA scans of navigator and start at phone and desktop widths in both themes; no violations.
- Browser interaction checks: Space selects Standing, shows one card, and announces the result; All safeguards restores the six cards. The receipt receives focus and scrolls horizontally with ArrowRight.

The original review used fresh local previews at ports 4346 and 4345. The rebased branch was revalidated against a fresh Cloudflare preview. This review covers local source and rendered behavior; no deployment was performed. Browser emulation does not establish physical-device behavior.

## Link reachability

The site-wide crawl passes on the rebased branch: all 86 linkable static routes are reachable, and all 685 internal links and 23,892 section references resolve. Main also resolved the three glossary destinations that failed in the original review. The five matrix destinations are fixed by this PR.

## Visual evidence

- [Desktop matrix](matrix-desktop-after.png) and [dark theme](matrix-desktop-dark-after.png)
- [Phone matrix](matrix-mobile-after.png)
- [Phone adoption plan](start-adoption-mobile-after.png), compared with [before](start-adoption-mobile-before.png)
- [Phone symptom cards](start-mobile-after.png) and [desktop symptom cards](start-desktop-after.png)
