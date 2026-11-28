# Homepage Revamp Implementation Plan

> **For agentic workers:** Use executing-plans to implement these tasks in this session.

**Goal:** Make the homepage explain the distinctive argument and guide readers to its evidence.

**Architecture:** Keep BaseLayout and the existing self-test and casebook. Replace homepage
composition with an editorial front page and route-local CSS, reusing canonical case data.

**Tech Stack:** Astro, CSS, TypeScript, Bun, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-21-home-revamp-design.md`

## Global Constraints

- Owner overrides maintenance for this homepage revamp.
- No new dependencies, schema changes, service commitments, or claims of empirical validation.
- Use shared spacing/type tokens and retain existing anchor destinations.

## Review Focus

- Long headings and links must wrap at 320px.
- Dark theme needs readable inverse surfaces and interactive controls.
- Self-test state must continue to restore from shared hashes.
- No-JS and reduced-motion readers must receive all substantive content.
- Draft requirements and self-reports must remain distinguishable from measured outcomes.

### Task 1: Recompose the homepage

- [x] Replace `src/pages/index.astro` with the thesis, contribution, evidence, reading routes,
      existing self-test, reader routes, and correction colophon.
- [x] Add `src/styles/components/home-revamp.css`, imported only on this route; add display type
      tokens in `src/styles/theme.css`.
- [x] Keep canonical data in `src/content/casebook.ts` and self-test logic unchanged.
- [x] Verify desktop/mobile, light/dark, anchors, no-JS, and self-test restoration in the browser.

### Task 2: Verify and review

- [x] Run file formatting, `bun run check`, and `bun run build`.
- [x] Inspect the production preview and run accessibility and internal-link checks.
- [x] Run the Impeccable detector once over changed UI files.
- [x] Obtain the Impeccable finish review; resolve material findings and confirm captures.
- [x] Record the design system and report the exact delivery and validation status.

## Verification record

Rebased onto main at `6059f938` on 2026-11-27, preserving the unified navigation and project name.
`bun run check` passed all 13 checks. `bun run build` passed. Five Chromium homepage, WCAG, and
navigation checks passed against the production Worker preview. Browser inspection covered 1440,
390, and 320 CSS pixels in light and dark themes. All 27 main-content links and fragments resolved.
Self-test completion, clipboard sharing, reload restoration, reduced motion, keyboard focus, and
no-JavaScript content/fallback were verified with no browser errors.

The detector ran once and reported only two font-choice warnings for the self-hosted Instrument
Serif faces. The display choice is intentional; review it in the context of the composed page.
Screenshots and behavioral records are local, ignored artifacts under `.impeccable/review/` and
`output/playwright/`.

The finish reviewer confirmed that the selected controls remain visible after restoring a shared
result. The final review cleared the remaining documentation finding about the design seed.
