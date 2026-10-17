# Versioning and Citations Guide

This guide defines the distinct version domains used across Ethotechnics and clarifies how to cite standards, retrieve historical revisions, and handle releases.

## 1. The Three Version Domains

Ethotechnics deliberately maintains independent versioning across three distinct layers. They do not and should not share a single synchronized version number:

| Domain                          | What it Identifies                                                                        | Format & Source                                                      | What Belongs in a Citation?                                        |
| :------------------------------ | :---------------------------------------------------------------------------------------- | :------------------------------------------------------------------- | :----------------------------------------------------------------- |
| **Standard Document Version**   | A specific normative specification (e.g., STD-06, STD-08, Laws).                          | Semantic version in standard frontmatter (e.g., `version: "0.3.2"`). | **YES.** Formal citations must cite the standard document version. |
| **Site / Software Release**     | The deployed Astro web application, search indices, diagrams, and Cloudflare Worker code. | Tagged GitHub releases (`v1.11.0`, etc.) and `CHANGELOG.md`.         | NO (unless referencing a web platform implementation detail).      |
| **Conformance Package Version** | Standalone tooling published to npm (e.g., `@ethotechnics/conformance`).                  | `package.json` in `packages/conformance` (`0.1.0`).                  | NO (only cite if documenting CI harness tools).                    |

### Which Version Belongs in a Citation?

When citing an Ethotechnics standard or clause, cite the **standard document version** from the document header, never the site release version.

**Standard Citation Pattern:**

> _Ethotechnics Institute, STD-08 (Delegation) v0.3.2, §2.6 (2026). https://ethotechnics.org/standards/std-08-delegation_

**Specific Historical Revision Citation:**

> _Ethotechnics Institute, STD-08 (Delegation) v0.3.2 (commit `15d04ab`), §2.6 (2026). https://github.com/zz-plant/ethotechnics.org/blob/v1.11.0/src/content/standards/std-08-delegation.mdx_

---

## 2. Retrieving Cited Historical Standards

If an audit or legal review cites an earlier standard revision:

1. **By Release Tag:** Browse the repository tree at the cited Git tag:
   `https://github.com/zz-plant/ethotechnics.org/tree/v<version>/src/content/standards/`
2. **By Git Revision (SHA):**
   `https://github.com/zz-plant/ethotechnics.org/blob/<commit-sha>/src/content/standards/<standard>.mdx`
3. **Local Checkout:**
   ```bash
   git checkout tags/v1.11.0 -- src/content/standards/
   ```

---

## 3. Reconciling Site Releases and Changelog Records

The repository `CHANGELOG.md` records notable changes across the platform adhering to Keep a Changelog:

- **Tagged Releases (`v1.0.0` – `v1.11.0`):** Represent official GitHub release milestones published at https://github.com/zz-plant/ethotechnics.org/releases.
- **Editorial / Continuous Records (`1.12.0` – `1.22.0`):** Represent chronological editorial milestones documented in repository history.
- **Unreleased Changes:** All new work is documented under `## [Unreleased]` until an explicit maintainer release step tags a release commit.

---

## 4. Release Procedure

Creating new Git tags, GitHub releases, or publishing packages to npm is an explicit maintainer release action, not an automatic consequence of merging a PR.

A proposed release PR must:

1. Identify the exact source commit SHA and proposed tag (`vX.Y.Z`).
2. Move items from `[Unreleased]` into the new dated version header in `CHANGELOG.md`.
3. Provide link definitions at the bottom of `CHANGELOG.md` resolving to the release tag comparison.
4. Verify all build, lint, and test suites pass (`bun run check:full`).
