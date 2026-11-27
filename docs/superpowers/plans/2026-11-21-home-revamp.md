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

- [ ] Replace `src/pages/index.astro` with the thesis, contribution, evidence, reading routes,
      existing self-test, reader routes, and correction colophon.
- [ ] Add `src/styles/components/home-revamp.css`, imported only on this route; add display type
      tokens in `src/styles/theme.css`.
- [ ] Keep canonical data in `src/content/casebook.ts` and self-test logic unchanged.
- [ ] Verify desktop/mobile, light/dark, anchors, no-JS, and self-test restoration in the browser.

### Task 2: Verify and review

- [ ] Run file formatting, `bun run check`, and `bun run build`.
- [ ] Inspect the production preview and run accessibility and internal-link checks.
- [ ] Run the Impeccable detector once over changed UI files.
- [ ] Obtain the Impeccable finish review; resolve material findings and confirm captures.
- [ ] Record the design system and report the exact delivery and validation status.
