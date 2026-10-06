UI improvements for mobile and desktop

The homepage now has a stronger mobile headline, a more compact lead paragraph, and three resource cards spanning the desktop hero. Shared page headers use less empty space. Mobile navigation controls and self-test choices have 44px touch targets. The Browse drawer follows the page gutter, scrolls within short viewports, respects reduced motion, closes on Escape, and includes its trigger in the keyboard focus cycle.

Interactive method diagrams expose their controls to assistive technology. The casebook chart can receive keyboard focus for horizontal scrolling. The homepage's explanatory link is underlined.

Validation:

- Production build passed.
- Full repository check: 658 tests passed, 2 skipped; lint, TypeScript, Astro checks, content drift, and asset checks passed.
- Layout sweep: 48 views across the homepage, standards, method, mechanisms, diagnostics, and casebook; widths 320, 375, 768, and 1440px; light and dark themes. No page overflow, header spill, or clipped headings.
- Phone accessibility scan: all six pages passed WCAG A/AA checks in light and dark themes, 12 scans total.
- Open mobile drawer: both themes passed accessibility checks, reduced-motion animation is disabled, and arrow-key scrolling moves the focused casebook chart.
- Browse drawer checked at 320, 375, and 768px in a 568px-tall viewport; it stays within the screen and scrolls internally. Escape releases the page and restores focus to Browse.
- Browser suite: 65 passed, 4 failed. The failures are unrelated to the changed UI: an obsolete Burden Modeler title expectation, an All themes expectation where the UI now says All safeguards, an older syllabus structure expectation, and 8 broken destination links. Five broken links come from the existing navigator work; three involve glossary destinations.

Existing navigator edits and SafeguardMatrix.astro were preserved. Changes remain local and uncommitted; nothing was deployed.

Screenshots:

- [Desktop homepage](home-desktop-after.png)
- [Mobile homepage](home-mobile-after.png)
- [Phone touch layout](home-mobile-touch-after.png)
- [Mobile Browse drawer](browse-mobile-after.png)
- [Mobile standards](standards-mobile-after.png)
- [Dark desktop homepage](home-desktop-dark-after.png)
