# IA refactor proposal (2026-09)

Status: **largely executed**. It began as a proposal that named four decisions as the site
owner's. Those were delegated back, so §8 records what was decided and what was built, including
one finding that did not survive contact with the pages it described. Sections 1 through 7 are
left as originally written, so the reasoning that led to the decisions is still legible next to
the decisions.

The site grew from 60-odd routes to 91 static routes in a few days, across two parallel
workstreams. Nothing is broken. The problem is that the shape no longer teaches anyone anything.

## 1. What is actually true today

Measured, not estimated.

| Measure                                           | Count |
| ------------------------------------------------- | ----- |
| Static routes (excluding dynamic `[slug]` routes) | 91    |
| Reachable from the primary nav or the footer      | 23    |
| Linked from anywhere in the repo                  | 84    |
| Linked from nowhere at all                        | 7     |

The 7 that nothing links to: `/audit`, `/contact`, `/incompatible`, `/intake`, `/library/cite`,
`/library/mechanisms-by-domain`, `/library/validators-by-standard`. The three `/library/*` entries
are 301 redirects, so they are fine as files and invisible as pages. The other four are real
pages that no path reaches.

So the honest diagnosis is **not** that the site is full of orphans. Most pages are reachable by
clicking through. The diagnosis is that **the top two levels carry 23 of 91 routes**, and the
remaining 68 are reachable only by knowing where to look.

## 2. The finding that matters: seven front doors

Seven pages currently compete to be where a new reader begins.

| Route           | Its own heading                                                 |
| --------------- | --------------------------------------------------------------- |
| `/`             | Make high-stakes AI easier to stop, explain, appeal, and repair |
| `/start`        | Find your path through Ethotechnics                             |
| `/how-it-works` | How Ethotechnics works                                          |
| `/method`       | The Ethotechnics method                                         |
| `/quick-start`  | Choose your role, then take one clear first action.             |
| `/fast-path`    | Implementing Ethotechnics in one sprint                         |
| `/finite`       | Start with these steps                                          |

Each is defensible alone. Together they are a maze: a reader who lands on any one of them has no
way to know whether the other six are prerequisites, alternatives, or the same thing rephrased.
`/start-here` already 301s to `/start`, which shows this was noticed once and solved for one pair.

This is the single largest IA problem on the site, and it is worse than the navigation ceiling
that prompted this proposal.

## 3. Secondary findings

**A name collision across two altitudes.** `/validators/burden-modeler` is a 277-line
specification of VAL-01. `/diagnostics/burden-modeler` is the 45-line page that mounts the
interactive tool. Same name, different things, no cross-link. A reader arriving from search
cannot tell which one they wanted. The same split does not collide for the other validators,
which is why it has gone unnoticed.

**Three case-study families.** `/examples/*` (5 pages), `/incidents/*` (dynamic), and
`/applications/*` (2 pages) are all "here is a situation and what the framework says about it,"
under three different nouns.

**Seven singletons with no family.** `/artifacts`, `/audit`, `/exceptions`, `/measurement-tiers`,
`/governance`, `/syllabus`, `/experience`. Each is a top-level route with one page under it.

**The nav ceiling is a symptom.** Fitting the record conformance checker into the Diagnostics
section required dropping Capacity Forecaster, because a five-link ceiling on four sections gives
20 slots for 91 routes. Raising the ceiling would not fix this; it would postpone it.

## 4. The proposal

### 4.1 Collapse the front doors from seven to two

Keep exactly two orientation pages, with a stated division:

- **`/start`** answers "what should I do today?" It routes by situation: a live decision, an
  incident, a policy gap, an adoption question. It is the only page that asks the reader about
  themselves.
- **`/method`** answers "what is this?" It is the canonical statement: the chain, the state
  variables, the laws. It never asks the reader anything.

Then:

| Page            | Disposition                                                                                                |
| --------------- | ---------------------------------------------------------------------------------------------------------- |
| `/how-it-works` | Merge into `/method`. The three lenses become a section there; the chain is already duplicated.            |
| `/quick-start`  | Merge into `/start` as its role-selection step. It is `/start` with a different question shape.            |
| `/fast-path`    | Keep as a route, reframe as an adoption _plan_ rather than an entry point, and link it from `/start` only. |
| `/finite`       | Keep. It is a training loop, not an entry point; its heading is the problem, not the page.                 |

Every removed route gets a 301, as `/start-here` already does.

### 4.2 Name the layers in the navigation

The site already has a three-layer content model (theory, method, instruments) that the
navigation does not express. Reorganize the four mega-menu sections to match what the layers
actually are, which also relieves the ceiling because the sections stop competing:

- **Method** — Method, Laws, Standards, Crosswalks, Evidence packs
- **Mechanisms and evals** — Catalog, Evals, Validators, Harness
- **Instruments** — the diagnostics, by what they take as input rather than by tool name
- **Knowledge** — Glossary, Taxonomy, Incidents, Field notes, Theory

The instruments section is where the ceiling bites, so order it by input, not by name: tools that
take a workflow description (delegation audit, system auditor, burden modeler), tools that take
records (record conformance), tools that take numbers (capacity forecaster, maintenance
simulator, debt calculator). That grouping makes "which one do I want" answerable without opening
each.

### 4.3 Resolve the burden-modeler collision

Rename `/validators/burden-modeler` to reflect that it is a specification, not the tool, and
cross-link the pair explicitly in both directions. The tool keeps its URL, since it is the one
people are sent to.

### 4.4 Consolidate the case-study families

Fold `/examples/*` and `/applications/*` into one family under a single noun, keeping `/incidents`
distinct because an incident is a real event and the others are constructed situations. That
distinction is worth preserving; three nouns for two ideas is not.

### 4.5 Rehome the singletons

`/measurement-tiers` belongs under evals. `/artifacts` and `/exceptions` belong under mechanisms.
`/governance` and `/audit` belong under the institute. `/syllabus` and `/experience` belong under
knowledge. None of these need new pages, only a parent and a breadcrumb.

## 5. What this costs

- Roughly 8 to 12 route moves, each needing a 301, a sitemap entry, and a breadcrumb update.
- The e2e suite asserts nav labels and destinations; those tests move with the nav.
- `llms.txt`, `llms-full.txt`, `site-index.json` and the RAG corpus all enumerate routes.
- Two merges of page content (`/how-it-works` into `/method`, `/quick-start` into `/start`), which
  is editorial work, not mechanical.

Sequenced as: front doors first (highest reader value, most editorial judgement), then nav
sections, then the singletons and the collision, then the machine surfaces last so they are
regenerated once against a settled shape.

## 6. Decisions that are not mine

1. **Whether `/fast-path` and `/finite` survive at all.** Both have a real audience; both are also
   entry points that compete with `/start`. I propose keeping them and reframing their headings,
   but retiring them is defensible and I would not do it without you saying so.
2. **The noun for the merged case-study family.** "Examples" is plain and slightly weak;
   "applications" is more precise and less inviting. This is a voice decision.
3. **Whether the institute pages belong in the primary nav at all.** They are currently footer-only.
   That is arguably correct for a standards body and arguably a mistake for one asking to be
   adopted.
4. **How much to spend here.** The site works. This proposal buys legibility, not function, and
   the honest comparison is against spending the same effort on the check-catalogue combination,
   which buys a capability the site does not have.

## 7. What I would not do

- **Raise the five-link nav ceiling.** It is a symptom. Twenty slots for 91 routes is the wrong
  ratio whatever the ceiling is; the fix is fewer competing top-level ideas.
- **Delete the four unlinked pages** (`/audit`, `/contact`, `/incompatible`, `/intake`) without
  checking analytics. Unlinked is not unvisited: they may carry inbound links from outside.
- **Flatten the URL structure.** Nesting is not the problem. Seven pages saying "begin here" is.

## 8. What was decided and what was built

The four decisions in §6 were delegated back to me. Recorded here rather than in a commit
message, because the next person to touch the IA needs the reasoning more than the diff.

### 8.1 The decisions

1. **`/fast-path` and `/finite` survive.** Both have a real audience and neither is really an
   entry point — one is an adoption plan for a team that has already decided, the other is a
   training environment. Retiring them would have destroyed working content to fix a heading.
   Both were reframed instead: `/fast-path` now announces itself as an adoption plan and says
   where to go if you are still orienting, and `/finite`'s "Start with these steps" card is now
   "Preparing a drill".
2. **There is no merged case-study family.** The proposal was wrong about this and §8.2 records
   why.
3. **Institute pages stay out of the primary nav.** The nav has four sections and a hard
   five-link ceiling, which is twenty slots. Spending any of them on institutional pages costs
   an instrument or a standard, and a reader who wants to know who publishes this will look in
   the footer, which is where it is. A standards body asking to be adopted is judged on the
   standards.
4. **Spend: front doors, nav, and the collision. Not the singletons.** §4.1 through §4.4 are
   done. §4.5 — rehoming the seven singletons under parents — is not, and is deferred
   deliberately: it is the most route moves for the least reader value, since each buys a
   breadcrumb and costs a redirect plus a regeneration of every machine surface that enumerates
   routes. It should happen when something else already requires regenerating those surfaces.

### 8.2 Where the proposal was wrong

§4.4 claimed `/examples`, `/incidents` and `/applications` were three nouns for two ideas.
Reading the pages rather than their names: `/examples` holds constructed end-to-end scenarios,
`/incidents` holds real events, and `/applications` was not a case-study family at all. It was a
catalogue of operating patterns whose index mostly linked out to explainers — which makes it a
thin duplicate of `/mechanisms/patterns`, not a sibling of `/examples`.

So the merge went the other way. `/applications` 301s to `/mechanisms`; its one page of its own
moved to `/mechanisms/moral-circuit-breakers`. `/examples` and `/incidents` keep their nouns,
because two nouns for two ideas is correct.

This is worth recording as a method note: the inventory in §1 counted routes and links, which is
what made §2 and §3 trustworthy. §4.4 grouped by page title, which is what made it wrong.

### 8.3 What shipped

- Seven front doors are two. `/how-it-works` merged into `/method` (its lenses and four-step
  sequence are sections there; its chain section was a duplicate). `/quick-start`'s index merged
  into `/start`, with the role guides keeping their URLs. Both 301.
- The mega menu is named for the content layers — Method, Mechanisms and evals, Instruments,
  Knowledge — and the instruments are ordered by what the reader has to bring rather than by
  tool name. Tests assert both.
- The two pages called Burden Modeler say which is which and link to each other. VAL-01 is the
  specification; the diagnostic keeps the URL people are sent to.
- `/evals/coverage` is new and unrelated to this proposal, but it is the page the "Mechanisms and
  evals" section needed to justify its fifth slot.

### 8.4 Still open

- §4.5, the seven singletons, per 8.1(4).
- The four unlinked pages (`/audit`, `/contact`, `/incompatible`, `/intake`). Still unlinked,
  still not deleted, still waiting on analytics rather than on a decision.
