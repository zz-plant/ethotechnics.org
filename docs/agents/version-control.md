# Version control

A person reading `git log --oneline` should learn what changed from the subjects alone, and why
from the bodies. They may be the maintainer next year, a researcher citing a revision, or someone
checking when a clause changed. These rules are for that reader.

## How a change reaches main

- Every change reaches `main` through a pull request, squash-merged.
- The PR title becomes the commit subject. The PR description becomes the commit body. History
  keeps those two, not the branch's own commits.
- One pull request, one change. If the title needs "and", a semicolon, or two areas, open two.
- Start each branch from the current `main`. A branch built on another PR's branch carries that
  PR's commits into its own squash: #1065 repeats all five of #1064's.
- Edit the title and description when the change moves during review. They are the record.

## Subject line

`<area>: <what changed>`

- **One area, lowercase.** The place a reader would look for the change. Common areas are below;
  a site section's URL name (`casebook`, `mechanisms`, `use-cases`) also works.
- **What changed, as the reader meets it.** `casebook: add the Dutch childcare benefits case`, not
  `content: update casebook.json`.
- **Imperative, no period, 72 characters or fewer.** GitHub's ` (#123)` suffix does not count.
- **No type prefix.** Write `seo: …`, not `fix(seo): …`. The area says where; the summary says what.

| Area          | Covers                                                        |
| ------------- | ------------------------------------------------------------- |
| `content`     | Essays, standards text, and other prose in `src/content/`     |
| `copy`        | Interface wording: labels, buttons, cards, empty states       |
| `design`      | Components, layout, styles, figures                           |
| `seo`         | Metadata, share cards, sitemaps, structured data              |
| `a11y`        | Keyboard, screen reader, and contrast fixes                   |
| `api`         | `/api` endpoints                                              |
| `conformance` | `packages/conformance`, its schemas, and the GitHub Action    |
| `presence`    | Presence watch, the objection record, and their bots          |
| `deps`        | Dependency and toolchain versions                             |
| `ci`          | `.github/workflows/`                                          |
| `tests`       | Test suites and fixtures, when nothing else changes           |
| `docs`        | Repository docs: README, `docs/`, CONTRIBUTING                |
| `agents`      | `AGENTS.md`, skills, the MCP server, and agent-facing signals |

Before and after, from this repository's history:

- `deps + method: patch 126 of 127 audited vulnerabilities; one source for the safeguard questions; green check`
  becomes two PRs: `deps: patch 126 of 127 audited vulnerabilities` and
  `method: read the safeguard questions from casebook.json`.
- `fix(seo, docs, home): resolve #1049, #1048, and #1047` becomes three PRs, one of them
  `seo: inline share-card fonts so mobile previews show text`.
- `Make the repository readable and usable by someone who has never seen the project` becomes
  `docs: rewrite the README for a first-time reader`.

## Body

- Say why. The diff already shows what.
- Name the number, the file, the issue: "Six guides said Node 20; the repository requires
  Node 22."
- Say what a reader of the site will see differently, if anything.
- Wrap at 72 characters. Leave a blank line after the subject.
- Trailers go last: `Fixes #123`, then one `Co-Authored-By:` line per person.

## Pull request description

Use the [template](../../.github/pull_request_template.md). It becomes the commit body, so write
it to be read in `git log` with no GitHub around it.

- **What changed:** the change as a reader of the site or the repository meets it.
- **Why:** the problem, with the number or the report that showed it.
- **Checks:** the commands run and what they returned. Name any check skipped and why.
- **Not done:** known gaps and follow-ups. Delete the heading if there are none.

Leave out "This PR…", checkboxes, and a list of the branch's commits.

## What checks the subject

- `bun run hooks:install` adds a `commit-msg` hook that runs `bun run check:commit-message` on
  every commit.
- `.github/workflows/pr-title.yml` runs the same script on each PR title, since the title becomes
  the subject on `main`.
- Subjects Git writes itself (merge, revert, `fixup!`) are left alone.

## Repository settings

These live in GitHub, not in the repository. An owner sets them once under **Settings → General
→ Pull Requests**:

- Allow squash merging only. Merge commits put the branch's working commits on `main`.
- Default squash message: **Pull request title and description**. The default, "Default
  message", writes the list of branch commits as the body.
