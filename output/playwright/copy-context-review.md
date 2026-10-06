# Site copy follow-up — October 5, 2026

This review follows the navigation, start-page, and American-spelling edits already present on `main`. The remaining edits replace vague labels, inflated diagnostic descriptions, and an unsupported promise in the validator introduction.

## Copy changes

| Location                          | Before                                                         | After                                                            | Reason                                                                                                     |
| --------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Validator introduction            | A mechanism “that would fix the problem”                       | “A related mechanism to review”                                  | A suggested mechanism does not establish that a workflow will be repaired.                                 |
| Failure-point diagram             | “Actionable challenge path?”                                   | “Can a person challenge it?”                                     | Name the person and the question.                                                                          |
| Outcomes diagram                  | “Robust systems”                                               | “Low repair burden”                                              | Describe the plotted property; the bars are qualitative. The accessible description uses the same wording. |
| Diagnostic changelog              | “Codified compensatory labor and shadow subsidy audit checks…” | “Added checks for unrecorded repair work and staff workarounds…” | State what changed in terms a tool reader can recognize.                                                   |
| Glossary entry template           | “Quick takeaways”                                              | “Definition summary”                                             | Describe the content without a speed claim.                                                                |
| Search suggestions                | “Quick search”                                                 | “Frequent topics”                                                | Name what the links offer.                                                                                 |
| Standards comparison              | “The landscape”                                                | “Frameworks and law”                                             | Identify what the comparison covers.                                                                       |
| Authored evaluation/archive prose | “cancelled”, “catalogue”                                       | “canceled”, “catalog”                                            | Use American spelling.                                                                                     |

Defined theory terms, quotations, official names, and the qualitative scope of the figures remain intact.

## Browser finding

At 375 pixels, the Failure Point, Outcomes Hide, and Ratchet diagrams overflow their containers but could not receive keyboard focus. The containers now have names and receive focus. Two added browser tests check accessibility and actual ArrowRight scrolling on the laws and outcomes essay pages. The existing ESLint exception for named scroll regions now includes these three components.

## Validation

- `bun run check`: passed; 660 tests passed, 2 skipped, 0 failed. Includes lint, TypeScript, Astro, generated-content, and schema checks.
- `bun run build`: passed; Cloudflare worker and generated-output checks passed.
- `CF_PAGES_URL=http://127.0.0.1:4353 bunx playwright test tests/e2e/roles.e2e.ts tests/e2e/nav-browse.e2e.ts tests/e2e/a11y.e2e.ts tests/e2e/rendered-detail-pages.e2e.ts --project=chromium --reporter=line`: 37 passed.
- 40 axe scans: 10 routes × 375/1440 pixels × light/dark; no WCAG 2 A/AA or 2.1 A/AA violations.
- 100 layout views: the same routes × 320/375/768/1280/1440 pixels × light/dark; all returned 200, no document overflow or clipped visible headings.
- `bun run check:reachability http://127.0.0.1:4353`: passed; 86 static routes reachable, 685 internal paths valid, 23,885 fragment links valid. Two working redirects remain.
- `git diff --check`: passed.

Routes sampled: validators, an authority-drift glossary entry, search, standards, laws, the outcomes essay, retired-tool archive, diagnostics, governance capability, and evaluations.

These are local Cloudflare-preview and Chromium checks. Physical-device checks, Firefox/WebKit, and production deployment were not performed.

## Rendered examples

[Validators at 375px](copy-validators-375.png) · [Validators at 1440px](copy-validators-1440.png)

[Outcomes diagram at 375px](copy-outcomes-375.png) · [Outcomes diagram at 1440px](copy-outcomes-1440.png)
