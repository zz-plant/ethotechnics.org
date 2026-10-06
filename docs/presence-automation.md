# Presence automation

The site runs on its own standards. An objection to a clause gets a public answer within 30 days,
and an upheld objection ends in a revised clause or a recorded reason for keeping it. The site is
measured by outside uptake, not page views. Four workflows do the bookkeeping. None of them commits
to the default branch: a workflow that changes a file the site displays opens a pull request, and a
workflow that only notifies opens or updates an issue.

## Workflows

| Workflow                               | Runs                                          | Permissions                                               | Writes                                    |
| -------------------------------------- | --------------------------------------------- | --------------------------------------------------------- | ----------------------------------------- |
| `.github/workflows/objections.yml`     | Issue opened or labeled; daily 07:23; by hand | `contents: read`, `issues: write`                         | Labels and comments on `objection` issues |
| `.github/workflows/presence-data.yml`  | Mondays 06:41; by hand                        | `contents: write`, `pull-requests: write`, `issues: read` | A pull request from `bot/presence-data`   |
| `.github/workflows/presence-watch.yml` | Mondays 07:17; by hand                        | `contents: read`, `issues: write`                         | One `Presence watch: <ISO week>` issue    |
| `.github/workflows/release.yml`        | By hand, with a `version` input               | `contents: write`                                         | A tag `v<version>` and a GitHub release   |

Times are UTC. "By hand" means Actions > the workflow > Run workflow.

### Objections

- An issue filed from `.github/ISSUE_TEMPLATE/objection.yml` carries the `objection` label. When it
  is opened, or the label is added later, the bot adds the standard's label (`std-02` and so on)
  and posts one comment with the date the answer is due: the day it was opened plus 30 days.
- Each day, every open objection without an answer gets `due-soon` from day 21 and `overdue` after
  day 30, which replaces `due-soon`. Each label comes with one comment.
- Days are whole UTC calendar days. Every bot comment carries a hidden marker, so a re-run never
  posts the same comment twice.
- Each clause in a standard's clause register links to the form with the standard, clause, and
  title filled in (`src/utils/objection-link.ts`).

### Presence data

Rebuilds `src/content/generated/objections.json` from every issue labeled `objection`. The `/record`
page and the clause registers read it. When the record changed, the workflow opens a pull request
from `bot/presence-data`, or updates the open one. A week with nothing new changes nothing, because
the file keeps its generation time unless the data changed.

A pull request opened with `GITHUB_TOKEN` does not trigger other workflows, so Site checks does not
run on it by itself. Close and reopen the pull request, push a commit to the branch, or set
`PRESENCE_BOT_TOKEN`.

### Presence watch

Notify only. Each Monday it looks for:

- US Federal Register proposed rules and notices with an open comment period whose text matches
  "artificial intelligence" or "automated decision".
- GOV.UK open consultations matching the same terms.
- Outside mentions: GitHub code search for `ethotechnics.org` outside the owner's account, and
  Federal Register full text for "ethotechnics".

It lists only what no earlier run reported. Each consultation shows the clauses whose text shares
the most distinctive words with it. That is keyword matching, and the issue says so. Consultations
whose title or summary names the topic come first; matches found only in the full text sit in a
folded list, because most of them are about something else. A source that fails is noted in the
issue and does not fail the run.

### Release

Creates the tag and a release whose notes are the dated changes since the previous release, from
the same list `/changes.xml` serves. Zenodo, once connected, archives each published release and
mints a DOI with the metadata in `.zenodo.json`.

## Labels

| Label            | Set by   | Meaning                                                               |
| ---------------- | -------- | --------------------------------------------------------------------- |
| `objection`      | The form | An objection to one clause                                            |
| `std-01` …       | Bot      | The standard the clause belongs to                                    |
| `due-soon`       | Bot      | Open 21 days or more without an answer                                |
| `overdue`        | Bot      | Past the 30-day answer date without an answer                         |
| `answered`       | Owner    | The objection has a public answer; the clock stops                    |
| `upheld`         | Owner    | Upheld: the clause is revised, or a reason for keeping it is recorded |
| `not-upheld`     | Owner    | Not upheld; the answer gives the reason                               |
| `presence-watch` | Watch    | A weekly watch issue                                                  |

Missing labels are created on each run of the objection bot and the watch.

## Secrets

- `GITHUB_TOKEN`: provided by Actions. Enough for everything except the cases below.
- `PRESENCE_BOT_TOKEN` (optional): a fine-grained token with access to this repository only, with
  Contents and Pull requests set to read and write. Presence data pushes and opens its pull request
  with it, so Site checks runs on that pull request. Presence watch uses it for GitHub code search,
  in case code search refuses `GITHUB_TOKEN`.

No workflow prints a token.

## One-time setup for the owner

1. Merge this work to the default branch. Scheduled and issue-triggered workflows run only from
   there.
2. Settings > Actions > General > Workflow permissions: tick "Allow GitHub Actions to create and
   approve pull requests". Presence data needs it to open its pull request with `GITHUB_TOKEN`.
3. Labels need no setup: the first objection or the first daily sweep creates them. To create them
   now, run the Objections workflow by hand.
4. Zenodo: sign in at <https://zenodo.org> with GitHub, open Settings > GitHub, and switch on
   `zz-plant/ethotechnics.org`. Then run the Release workflow. After Zenodo mints the DOI:
   - Replace the `"Pending Zenodo deposit"` placeholders in the `doi` fields with the concept DOI
     (the one that always resolves to the latest version). The default is in
     `src/utils/publication.ts`; the others are in `src/content/`. Until then the site prints no
     DOI line, because `src/utils/doi.ts` prints only a value that is a DOI.
   - Add `doi`, `version`, and `date-released` to `CITATION.cff`, as its comment says.
5. Optional: add the `PRESENCE_BOT_TOKEN` secret (Settings > Secrets and variables > Actions).

## How to answer an objection

1. Read the objection and the evidence. Write the answer as a comment on the issue: upheld or not,
   and why.
2. Add `answered` and one of `upheld` or `not-upheld`. The record dates the answer by the first time
   one of these labels was added, and compares that date with the due date.
3. If upheld, either revise the clause or record a reason for keeping it, and link that from the
   issue:
   - A revision is a commit or pull request that changes the clause in the standard's MDX, its
     registry row in `src/content/standards.ts`, and a `changelogEntries` line. Link the commit.
   - A reason for keeping it is a comment on the issue that says what the clause keeps and why.
4. Close the issue.
5. The next Presence data run proposes the updated record. Merge its pull request to publish it.

To keep spam or a duplicate out of the record, remove its `objection` label. The record reads only
issues that carry it. Do not remove the label from a real objection, answered or not.

## Local commands

```sh
# A Markdown brief of the clauses matching a topic, for a consultation response.
bun run presence:brief -- appeal deadline

# The watch issue body, printed and not posted. Reads the live APIs.
bun run scripts/presence/watch.ts --dry-run

# Rebuild the objection record locally.
GITHUB_TOKEN="$(gh auth token)" bun run scripts/presence/objections-snapshot.ts

# Release notes for changes on or after a date.
bun run scripts/presence/release-notes.ts --since 2026-10-01
```

The scripts import only repository files, so the workflows run them without `bun install`.

## Code map

- Rules and pure logic, with unit tests beside each:
  - `src/utils/objections.ts`: form parsing, the 30-day clock, the sweep, the record snapshot.
  - `src/utils/objection-link.ts`: the prefilled objection link.
  - `src/utils/changes-feed.ts`: the merged change list, its RSS, and release notes.
  - `src/utils/clause-match.ts`: keyword matching against the clause register, and the brief.
  - `src/utils/presence-watch.ts`: watch queries, response parsing, dedupe state, and the issue.
  - `src/utils/doi.ts`: which `doi` values are DOIs.
- Network calls: `scripts/presence/github.ts` and the scripts beside it.
- Pages: `src/pages/record.astro`, `src/pages/changes.xml.ts`, and
  `src/components/ClauseRegister.astro`.
