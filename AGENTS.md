# AGENTS

Scope: applies to the entire repository unless a more specific `AGENTS.md` overrides it.

## Maintenance mode (since 2026-11-10)

Ethotechnics is in maintenance: the owner decided on 2026-11-10 to keep it working and stop developing it. Until this section is removed, it overrides the roadmap and any other document that names work to do next.

Take:

- a fix for something broken: a failing build or check, a page error, a dead link or source, a deploy that stopped;
- security updates and the monthly dependency pull request;
- an objection: the site promises an answer within 30 days, and that promise stands. Draft the answer for the owner to post;
- the presence-data pull request that rebuilds the objections record.

No new concept, glossary entry, standard or clause unless the owner names a problem the existing framework fails to express.

One exception, added on 2026-11-10: evaluation work on three requirements is in scope.

1. A person with standing can cause a consequential decision to be reconsidered.
2. An institution detects and repairs a failure without making the affected person investigate it.
3. A system can be interrupted, reversed or withdrawn when its authorization or the evidence for it becomes invalid.

Testing one of these against a real workflow, and publishing the method and the result, is in scope, including a result where the requirement fails. Tests that concern healthcare AI run in zz-plant/fast-harm-slow-repair; this site publishes their results. Title these pull requests `eval: <what was tested>`.

Decline the rest, and say in your reply that the repository is in maintenance:

- new features, pages, tools, datasets or integrations;
- redesigns, copy passes, and refactors that fix nothing broken;
- new automation, services, secrets, paid APIs or scheduled jobs.

The owner can still ask for any of these. Do one only when the request says it overrides this section.

## Purpose

This repo powers ethotechnics.org: open standards, scored public failures, and diagnostics for
keeping automated decision systems answerable: when one is wrong, evidence of the harm reaches
someone who has to change it. Follow these instructions to keep changes consistent and reviewable.

## Public copy voice

The reference voice is `src/content/casebook.ts` and `src/content/method.ts`. Match it.

- Short declarative sentences, one idea each. Name the institution, the date, the number.
- Claim only what a page, tool, or inbox actually does. No schedules, response times, or
  services that are not staffed; no "received" for a message nobody stores.
- No selling: avoid "actionable", "stakeholder-ready", "unlock", "empower", "powerful",
  "seamless", "comprehensive", "quick", "simply", "just", "easily".
- Name who a thing is for (the risk owner, a regulator, the person the system decided about),
  not "stakeholders".
- Sentence case for labels. American spelling.
- The theory essays reject "empowerment" and "human-centered design" as framings; don't
  reintroduce them in page copy.
- Write for a smart reader who has not read the rest of the site. A coined term ("authority
  lease", "standing"), clause number, mechanism ID, or law number appears only after the page
  says what it means or links it at first use. Cards, eyebrows, tooltips, frontmatter
  summaries, and pages for the person a system decided about use none.
- Don't explain what the named reader already uses: the EU AI Act to a compliance lead, a
  rollback to an engineer. Say a thing once; no restatement, no navigation reassurance.
- In MDX prose, write emphasis and links as markdown (`**`, `_`, `[text](url)`). A wrapped
  line that starts with inline HTML gets a blank line from Prettier, and MDX splits the
  sentence into two paragraphs.

## Essentials

- Package manager and script runner: **Bun**.
- Runtime baseline: **Node.js 22.x** (`nvm use`).
- In a new worktree, run `bun install --frozen-lockfile` before anything else.
- Run `bun run check` before committing code or mixed changes. A passing step prints one line;
  a failing step prints its output.
- Find where a change goes in `docs/agents/repo-orientation.md` before searching.
- When a check, the dev server, or an e2e test fails for no clear reason, read
  `docs/agents/local-quirks.md` before debugging.
- Discover scoped overrides before editing: `rg --files -g 'AGENTS.md'`.

## Working agreement

- Follow scope precedence (nearest `AGENTS.md` wins).
- Keep instructions short, actionable, and linked to canonical docs.
- Record exactly which checks you ran and their outcomes.
- Keep changes focused; avoid unrelated cleanup in task branches.

## Canonical references

- Where a change goes: `docs/agents/repo-orientation.md`
- Local quirks: `docs/agents/local-quirks.md`
- Workflow and required checks: `docs/agents/workflow-and-checks.md`
- Formatting and tooling: `docs/agents/formatting-and-tooling.md`
- Coding practices: `docs/agents/coding-practices.md`
- Version control: `docs/agents/version-control.md`
- Review checklist: `docs/agents/review-checklist.md`
- Docs structure: `docs/agents/docs-structure.md`
