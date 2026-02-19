# Open-source citizenship audit (2026-02)

This audit reviews whether the `ethotechnics.org` repository demonstrates good citizenship
standards in the open-source community.

> Update (post-audit remediation): `CODE_OF_CONDUCT.md` and `CONTRIBUTING.md` were added after
> this snapshot audit. Keep this document as a point-in-time assessment and use current repo files
> for latest governance posture.

## Scope and method

- Reviewed repository-facing governance and contribution files.
- Assessed baseline community health signals:
  - license clarity
  - contribution pathways
  - security disclosure workflow
  - issue and pull request triage ergonomics
  - automation and quality gate transparency
- Assigned status labels for each signal:
  - **Meets standard**
  - **Partially meets standard**
  - **Missing / should add**

## Findings

### 1) Licensing and reuse terms — **Meets standard**

- The repository includes a top-level `LICENSE` file with CC BY-SA 4.0 terms.
- The README repeats the licensing position in plain language for contributors.
- This gives downstream users clear reuse permissions and attribution expectations.

### 2) Security reporting path — **Meets standard**

- A dedicated `SECURITY.md` exists with private reporting instructions via GitHub security
  advisories.
- The policy sets an explicit response objective (acknowledgment within 3 business days), which
  improves reporter trust.

### 3) Contribution guidance — **Partially meets standard**

- The README includes a concise contribution section and links to contributor docs.
- There is no dedicated top-level `CONTRIBUTING.md` that GitHub can auto-surface in all
  contribution entry points.
- Existing guidance is practical, but discoverability would improve with a canonical
  `CONTRIBUTING.md`.

### 4) Community standards and conduct — **Missing / should add**

- No `CODE_OF_CONDUCT.md` was found.
- For public open-source collaboration, a conduct policy is a common baseline expectation.
- Absence can increase ambiguity for new contributors about expected behavior and moderation.

### 5) Intake experience (issues/PRs) — **Partially meets standard**

- Structured issue templates exist for bug reports and content requests.
- A pull request template exists and includes a testing checkbox.
- `blank_issues_enabled: true` allows unstructured submissions, which can be useful but may
  increase triage load.
- Template coverage could be expanded with categories like docs, accessibility, and governance.

### 6) CI and quality transparency — **Meets standard**

- A GitHub Actions workflow runs `bun run check` on pull requests and pushes to `main`.
- README badges expose check status and project metadata, improving external confidence.

## Overall assessment

**Current maturity: Good foundation, not yet best-in-class.**

The project demonstrates multiple strong citizenship signals: explicit license terms,
security disclosure policy, issue/PR templates, and CI enforcement. The largest gap relative to
community-health norms is the lack of a formal code of conduct, followed by the absence of a
canonical `CONTRIBUTING.md`.

## Recommended next actions (priority order)

1. Add `CODE_OF_CONDUCT.md` (adopt Contributor Covenant v2.1 or equivalent).
2. Add `CONTRIBUTING.md` that links to repo workflow docs and defines:
   - setup and checks
   - PR expectations
   - review cadence and communication channels
3. Expand issue templates to cover docs/improvement requests and accessibility issues.
4. Consider setting `blank_issues_enabled: false` after template coverage expands.
5. Add governance context (optional) if the project grows:
   - decision model
   - maintainer roles
   - response-time targets for issues/PRs

## Suggested scorecard

- License clarity: **5/5**
- Security policy: **5/5**
- Contribution discoverability: **3/5**
- Community conduct policy: **1/5**
- Issue/PR process maturity: **4/5**
- CI transparency: **5/5**

**Composite: 23/30 (77%)**

At 77%, the project already shows responsible maintenance practices.
Addressing code-of-conduct and contribution discoverability should move this into
an excellent citizenship tier.
