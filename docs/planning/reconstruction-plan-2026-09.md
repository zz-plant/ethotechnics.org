# Reconstruction plan: Ethotechnics as justified-delegation engineering (2026-09)

Status: proposed. This plan reorganizes the site's doctrine, object model, standards, mechanisms,
evals, and information architecture around a sharpened definition of Ethotechnics. It is a plan,
not a spec for a single PR: each workstream below is sized to land as one or a few reviewable PRs,
and the sequencing section says which order they should go in and why.

It supersedes nothing in [`full-refactor-plan.md`](full-refactor-plan.md), which is about code
hygiene. This plan is about what the site claims and how its objects fit together.

## 1. The thesis this rebuild encodes

**Definition.** Ethotechnics is the discipline of engineering consequential computational decisions
so that their basis, authority, and continued validity remain inspectable and revisable.

**Unit of governance.** The consequential decision. Models, agents, humans, APIs, rules engines,
policies, and databases are components of the machinery that produces it. Nothing in the method
depends on which component made the decision, so the governance primitives must be
substrate-independent: a decision stays governable whether it came from an LLM, a rules engine, a
human reviewer, or a mix.

**Chain.** Every consequential decision is treated as one link in a governed chain:

```text
Evidence → Authority → Decision → Consequence → Challenge → Reconsideration → Correction
```

**Four properties** cut across the chain and are what the standards, mechanisms, and evals measure:

| Property     | One-line test                                                                               |
| ------------ | ------------------------------------------------------------------------------------------- |
| Traceability | Can anyone reconstruct which evidence and which authority produced this decision?           |
| Standing     | Is there a named party who may challenge it, a channel, and an authority obliged to answer? |
| Statefulness | Do permissions, policies, and grants change when the evidence or environment changes?       |
| Revocability | Can the delegation be narrowed or withdrawn while withdrawal is still operationally real?   |

**Goal.** Not maximum safe autonomy. Maximum _justified_ delegation, with legibility,
contestability, reversibility, and the ability to revise the terms of the delegation preserved.

**The theory underneath**, kept in its own layer (see section 3): capability without revisability
produces accumulated dependence; dependence without standing produces domination; and systems
without correction paths eventually make humans absorb the difference between what the system
assumes and what reality is.

## 2. What the repo already has, mapped to the chain

The rebuild is a reframing and consolidation. Most of the machinery exists; it is organized around
burden, time, and contestability rather than around the decision and its authority.

| Chain stage     | Existing assets                                                                                                                                                                                                                     | Location                                                                                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Evidence        | Evidence packs (STD-01, STD-02, STD-06); `evidence_refs` on the decision record; STD-06 Human Impact Safety Case; Burden Concealment evals                                                                                          | `src/content/evidence-packs/`, `public/standards/decision-record.schema.json`, `src/content/evals.ts`                                                    |
| Authority       | `stop_override_authority`, `autonomy_level`, `action_classes` on the agent safety object model; MEC-03 rollback authority; glossary `design-authority`, `decision-reversal-authority`, `permission-surface`, `human-override-lanes` | `public/standards/agent-safety-object-model.json`, `src/content/glossary.json`, `src/content/explainers/permission-surface.mdx`                          |
| Decision        | Decision record schema and `/api/decisions`; agent receipt schema; MEC-01 decision log with dissent                                                                                                                                 | `public/standards/decision-record.schema.json`, `public/standards/ethotechnics-control-plane.openapi.yaml`, `public/standards/agent-receipt-schema.json` |
| Consequence     | Burden hours schema; burden modeler, capacity forecaster, maintenance simulator; the three lenses on `/how-it-works`; STD-01 Temporal Bill of Rights clocks                                                                         | `public/standards/burden-hours.schema.json`, `src/features/`, `src/pages/how-it-works.astro`                                                             |
| Challenge       | STD-02 Contestability & Recourse; minimum viable contestability (standing, reasons, records, timelines, remedies, non-retaliation); appeal event schema; MEC-06, MEC-08                                                             | `src/content/standards/std-02-contestability-recourse.mdx`, `src/content/minimum-viable-contestability.ts`, `public/standards/appeal-event.schema.json`  |
| Reconsideration | Pause/reversal schema; `decision.deadline.reminder` and `appeal.deadline.breached` events; MEC-11 escalation SLAs                                                                                                                   | `public/standards/pause-reversal.schema.json`, `public/standards/ethotechnics-events.asyncapi.yaml`                                                      |
| Correction      | Repair SLA schema; `/api/repairs`; MEC-10 reversibility audit logs; MEC-12 stoppability testing; Tier 1 harness (stop, override, audit completeness)                                                                                | `public/standards/repair-sla.schema.json`, `src/harness/`                                                                                                |

Cross-cutting assets:

- Five core axioms (finitude, consent, stewardship, reversibility, legibility) plus a derivation
  section that already argues that corrective dependence earns corrective standing
  (`src/content/standards/core-axioms.mdx`).
- Nine eval suites, already framed as tests of whether the deployed system is governable rather
  than whether the model is capable
  (`src/content/evals.ts`, `src/content/eval-test-cases.ts`).
- Twelve mechanisms MEC-01 to MEC-12 (`src/content/library.json`, with MEC-04 as a standalone
  page), plus MVC-01 minimum viable contestability and PM-01 the postmortem template as
  non-STD standards.
- Four crosswalk controls CTRL-01 to CTRL-04 (`src/content/crosswalks.ts`); CTRL-01 "human
  oversight with real stop authority" is the closest existing thing to an authority control.
- A 211-term glossary in 13 categories (`src/content/glossary.json`) and a four-branch taxonomy:
  governance, delivery, assurance, experience (`src/content/taxonomy.json`).
- Regulatory crosswalks to EU AI Act, NIST AI RMF, ISO/IEC 42001 (`src/content/crosswalks.ts`).
- Machine surfaces: `/api/*.json`, RAG corpus, `llms.txt`, `agents/spec.json`, prompt pack v1.0.0.

What the existing framing lacks, stated plainly:

1. **No authority object.** The decision record has an `owner` but no reference to the grant of
   authority under which the action class was permitted, its evidentiary basis, its conditions,
   or its expiry.
2. **No policy object.** Policies are referenced in prose and crosswalks but are not records with
   provenance, assumptions, review triggers, and expiration conditions.
3. **Permissions are static.** `action_classes` are booleans (`approval_required`), not states that
   move between allowed, review-required, suspended, and revoked as evidence changes.
4. **Capability and authorization are conflated.** Nothing separates "what the system can
   discover it could do" from "what it is currently permitted to do."
5. **Human-in-the-loop is used as a safeguard label.** `approval_required: true` is the whole
   specification of the human's role.
6. **Contestability stops at the channel.** Minimum viable contestability names standing and
   remedies but does not require a named authority obliged to consider the challenge, or a
   defined system state change that a successful challenge produces.
7. **Correctability is read as revocability.** Kill switch and time-to-halt measure whether the
   owner can stop the system, not whether stopping it is still operationally survivable once
   workflows, staffing, and customers depend on it.
8. **Auditability is forensic.** Logs answer "what happened"; no record is designed to answer
   "does this decision still deserve to stand?"
9. **Evals test governability, not the decision.** The suites already sit above the model (they
   score the deployed operator system, not model capability), which is the right altitude. What
   is missing is the decision-level question set: was the authority valid, was the policy still
   within its review window, did changed facts trigger reconsideration, could a party with
   standing change the outcome.
10. **Mechanism naming and membership have drifted.** `library.json` and the Ethotechnics-for-
    Agents page disagree on MEC-06, MEC-07, and MEC-09, and MEC-04 (the Hard Clock) exists only as
    a hand-written page, not as a catalog entry.
11. **Four definitions are in circulation.** Home, the glossary entry, `llms.txt`, and the README
    each define Ethotechnics differently.
12. **The object model is an example, not a schema.** `agent-safety-object-model.json` is an
    instance document; nothing validates it.

## 3. The layering decision

The single most important structural choice is to split the site into three layers and keep
politically contestable theory out of the method's requirements.

| Layer           | What it contains                                                                                                                                                                                                                                                                     | Where it lives                                                                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Theory**      | Why the four properties matter: accumulated dependence, dependence without standing as domination, absorption as concealment, preserving inefficiency as resilience, optimization stopping before institutional totalization, affected humans acquiring power, constitutional design | A new `/research/theory` cluster plus the existing derivation section of `/standards/core-axioms`; field notes and the governability explainer |
| **Method**      | Ethotechnics proper: the definition, the chain, the four properties, standards, mechanisms, object model, evals, glossary                                                                                                                                                            | `/method` (new), `/standards`, `/mechanisms`, `/evals`, `/glossary`, `public/standards/*`                                                      |
| **Instruments** | Diagnostics, validators, worksheets, prompt packs, harness, APIs                                                                                                                                                                                                                     | `/diagnostics`, `/validators`, `/tools`, `/agent-toolkit`, `src/harness/`, `/api/*`                                                            |

Rules that follow from the split:

- A page in the Method layer may cite the Theory layer as motivation but never as a requirement.
  Someone must be able to adopt a standard without accepting the theory.
- The Theory layer is versioned like doctrine and written as argument, not as clauses.
- "Control planes should govern humans, agents, and conventional software together" is downgraded
  to the Method claim that primitives are substrate-independent. The site does not position itself
  as a universal enterprise architecture.

## 4. Where each accepted view lands

| View                                                                              | Method home                                                                            | Object / standard / mechanism / eval                                                                                       |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| The consequential decision is the unit of governance                              | `/method`, home hero, `llms.txt`                                                       | Decision record becomes the hub object every other object references                                                       |
| Justified delegation, not maximum safe autonomy                                   | `/method`, About                                                                       | STD-07 Delegation and Policy Validity; `authorityGrant` object                                                             |
| Following policy is not alignment                                                 | `/method#policy`, STD-07 preamble                                                      | Policy record with `evidence_basis`; Decision-System eval question "was the policy still valid?"                           |
| Policy is a mutable hypothesis, continuously evaluated                            | STD-07 part B                                                                          | `policy-record.schema.json` with provenance, assumptions, review triggers, expiry; MEC-14 policy review triggers           |
| Boundaries are stateful and evidence-dependent                                    | STD-07 part A                                                                          | Grant states `allowed → review_required → suspended → revoked`; `grant.state.changed` event; harness state-transition test |
| Permissions encode authority, not capability                                      | STD-07 part A, `permission-surface` explainer rewrite                                  | `authorityGrant` with `for_whom`, `under_evidence`, `scope`, `conditions`, `until`                                         |
| Authorization and capability discovery are separate                               | STD-07 part A                                                                          | `capability-catalog.schema.json` distinct from grants; harness test: discovery succeeds, execution refused                 |
| Human-in-the-loop is a weak primitive                                             | STD-07 part C; replaces HITL language site-wide                                        | `intervention-spec.schema.json`: named owner, escalation authority, reconsideration triggers, intervention mechanism       |
| Revocability is not enough                                                        | STD-06 amendment; `/method#correction`                                                 | `withdrawal_cost` on the safety case; MEC-15 withdrawal rehearsal; Practical Reversibility eval                            |
| Observability without contestability is insufficient                              | STD-02 amendment                                                                       | Every audit record must name the party with standing who can act on it                                                     |
| Auditability is prospective                                                       | STD-02 amendment; decision record redesign                                             | `validity_conditions` and `reconsider_when` on the decision record; `decision.reconsideration.triggered` event             |
| The most important eval sits above the model                                      | `/evals` index restructure                                                             | New Decision-System eval suite (section 6.5)                                                                               |
| Contestability requires standing, channel, authority, and a possible state change | STD-02 amendment; minimum viable contestability gains "Authority" and "Effect" clauses | `challenge` object extends appeal event with `considering_authority` and `possible_state_changes`                          |

## 5. Workstreams

Each workstream lists deliverables, files, acceptance criteria, and the checks that must pass. All
content changes follow `docs/content-data.md`: edit canonical JSON, regenerate, commit both.

### WS0. Framing and definition

Rewrite the site's self-description around the definition, the chain, and the four properties.

- One definition, used verbatim in all four places that currently differ: `src/content/home.json`
  (`about.body`), the `ethotechnics` glossary entry, `public/llms.txt`, and `README.md`.
- `src/content/home.json`: hero heading and subheadline state the definition. The "workbench for
  accountable systems" eyebrow gives way to the delegation framing. Metrics and actions unchanged.
- `src/pages/how-it-works.astro`: the chain replaces the three lenses as the top-level structure.
  The three lenses (burden accounting, infrastructure dignity, care-time economics) are kept and
  repositioned as instruments applied at the Consequence stage. The application sequence stays.
- `src/content/start-here.json`: routes keyed to "what are you trying to fix, prove, or explain"
  gain a fourth question: "what has been delegated, and is it still justified?"
- `public/llms.txt`, `public/llms-full.txt`, `README.md` intro, `src/pages/about.astro`: one
  paragraph each, same definition verbatim.
- New `/method` page (`src/pages/method.astro`, content in `src/content/method.json`): the chain
  as a seven-step walk, each step linking to its standard, mechanism, object, eval, and glossary
  entry. This page is the canonical statement of the method and the target of the nav's
  "How it works" link.

Acceptance: a reader landing on `/`, `/method`, `/how-it-works`, or `llms.txt` sees the same
definition. `bun run check` passes. `docs/page-specifications.md` updated for Home, Start here,
and Method.

### WS1. Doctrine and theory layer

- `src/content/standards/core-axioms.mdx`: axioms stay at v1.0.0 and untouched. The derivation
  section is promoted to its own theory page and the axioms page links to it.
- New `src/content/theory/` collection (MDX) rendered at `/research/theory/[slug]`, with five
  essays: accumulated dependence; dependence without standing; absorption as concealment;
  preserving inefficiency; stopping before totalization. The `democratic-vs-coercive-governability`
  explainer moves here.
- New `/standards/delegation-principles` doctrine page, versioned v1.0.0, stating the six
  method-level principles: following policy is not alignment; policy is a hypothesis; authority is
  not capability; discovery is not authorization; revocability is not correctability;
  observability is not contestability. Each principle links to the standard clause that binds it.

Acceptance: no Method page cites a theory essay as a requirement. `astro:check` and heading
hierarchy checks pass. `src/content.config.ts` gains the `theory` collection schema.

### WS2. Object model v2

Extend `public/standards/` so the chain is machine-readable end to end. All schemas are JSON Schema
draft 2020-12, versioned, and mirrored in `public/api/schema/`.

New schemas:

- `policy-record.schema.json`: `policy_id`, `version`, `provenance` (who, when, on what evidence),
  `assumptions[]`, `review_triggers[]` (evidence thresholds, elapsed time, incident classes),
  `expires_at`, `status` (`active`, `review_required`, `suspended`, `retired`), `supersedes`.
- `authority-grant.schema.json`: `grant_id`, `grantor`, `grantee` (agent, role, or system),
  `action_classes[]`, `scope`, `for_whom` (affected population), `evidence_basis[]`,
  `conditions[]`, `valid_from`, `until` (time or condition), `state`, `state_history[]`,
  `policy_refs[]`, `intervention_ref`.
- `capability-catalog.schema.json`: what a grantee can discover it could do. Contains no
  permission fields by design; the schema description says why.
- `intervention-spec.schema.json`: replaces "human in the loop." `owner`, `escalation_authority`,
  `reconsideration_triggers[]`, `mechanism` (halt, hold, override, narrow, revoke),
  `reach_time_target`, `non_retaliation`.
- `challenge.schema.json`: extends the appeal event with `standing_basis`, `channel`,
  `considering_authority`, `possible_state_changes[]`, `decision_ref`, `grant_ref`.
- `reconsideration.schema.json`: `trigger` (challenge, review trigger, changed evidence, elapsed
  time), `subject` (decision, grant, or policy), `outcome` (stand, narrow, suspend, reverse,
  correct), `evidence_delta`.

Amended schemas:

- `decision-record.schema.json` gains `grant_ref`, `policy_refs[]`, `evidence_basis[]`,
  `validity_conditions[]`, `reconsider_when[]`, `affected_parties_with_standing[]`. `owner` stays.
- `agent-safety-object-model.json` becomes an example under `public/standards/examples/` and a
  real `agent-safety-object-model.schema.json` is added at 2.0.0: `action_classes[].approval_required`
  is replaced by `grant_ref`; a `capability_catalog_ref` is added; `stop_override_authority`
  becomes an `intervention_ref`. The 1.1.0 instance stays served at its current path.

Control plane and events:

- OpenAPI gains `/api/policies`, `/api/grants`, `/api/grants/{grant_id}/state`,
  `/api/capabilities`, `/api/challenges`, `/api/reconsiderations`.
- AsyncAPI gains `grant.state.changed`, `policy.review.triggered`, `policy.expired`,
  `challenge.opened`, `decision.reconsideration.triggered`, `reconsideration.completed`.
- `src/pages/api/*.json.ts` gains `grants.json`, `policies.json`, `interventions.json` examples,
  registered in `endpoint-config.ts` with parity tests in `src/utils/api-tests/`.

Acceptance: every schema has a validating example under `public/standards/examples/`; a Bun test
validates all examples; `endpoint-parity` test passes; `site-index.json` lists the new endpoints.

### WS3. Standards

- **STD-07 Delegation and Policy Validity** (new, `src/content/standards/std-07-delegation.mdx`).
  Part A, authority grants: every consequential action class must trace to a grant with evidence
  basis, scope, affected population, conditions, expiry, and state. Capability discovery must not
  confer authority. Part B, policy validity: every policy a grant relies on is a record with
  provenance, assumptions, and review triggers; a grant whose policy is in `review_required` moves
  to `review_required` itself. Part C, intervention: any clause elsewhere that says "a human
  reviews" must resolve to an intervention spec. Clause IDs follow the STD-01 pattern
  (`STD-07.1.1` and so on) in `src/content/standards.ts`.
- **STD-02 amendment** (v1.1.0): contestability is defined as standing + channel + obliged
  authority + possible state change. Minimum viable contestability gains "Authority (who must
  consider it)" and "Effect (what can change)" between Timelines and Remedies. Adds the
  prospective auditability clause: records must retain what is needed to decide whether the
  decision still deserves to stand.
- **STD-06 amendment** (v1.1.0): the safety case gains a withdrawal section: what depends on the
  system, what the exit path is, when it was last exercised, and the cost of exercising it.
- **STD-01**: unchanged except cross-references to STD-07 clocks for grant expiry.
- Evidence pack for STD-07 (`src/content/evidence-packs/std-07.mdx`): grant register export,
  policy register export, intervention roster, last withdrawal rehearsal report.
- Crosswalks (`src/content/crosswalks.ts`): add CTRL-05 "authority grants are evidenced, scoped,
  and stateful" and CTRL-06 "policies carry review triggers and expiry", mapped to EU AI Act
  Art. 14 (human oversight) and Art. 9 (risk management review), NIST AI RMF Govern 1 and Manage
  2, and ISO/IEC 42001 clauses 6.1 and 9. CTRL-01 gains a pointer to the intervention spec.

Acceptance: `standards-index` tests updated; `/api/standards.json` and `/api/clauses.json` include
STD-07; evidence-pack index lists it; `validate:glossary` passes with new cross-links.

### WS4. Mechanisms

Reconcile naming first, then add. `src/content/library.json` is canonical; the Ethotechnics-for-
Agents page data and the object model must use its titles.

- Reconcile: MEC-06 is "Appeal paths inside the UI", MEC-07 is "Accountability latency tracker",
  MEC-09 is "Burden dashboards". Fix `src/content/page-data/ethotechnics-for-agents.ts`, the
  prompt pack, and any prose. Add MEC-04 Hard Clock to `library.json` as a catalog entry so the
  hand-written page and the API agree. Add a unit test that every `MEC-nn` title string in
  `src/content` matches the library.
- New mechanisms, appended so existing IDs do not move:
  - **MEC-13 Authority grant register**: a stateful register of grants with evidence basis and
    expiry, exposed to the decision log. Anti-pattern: "permissions as config."
  - **MEC-14 Policy review triggers**: review triggers and expiry on every policy record;
    breached triggers move dependent grants to `review_required`. Anti-pattern: "policy as ground
    truth."
  - **MEC-15 Withdrawal rehearsal**: a scheduled exercise of running the workflow without the
    system, measuring cost, expertise available, and time to restore. Anti-pattern: "the switch
    exists."
  - **MEC-16 Intervention specification**: replaces every HITL checkbox with owner, authority,
    trigger, mechanism, and reach time. Anti-pattern: "rubber-stamp review."
  - **MEC-17 Capability catalog**: discovery surface separate from grants, so a system can reason
    about possible actions without being empowered. Anti-pattern: "discover equals permit."
- Each mechanism has a pattern page under `/mechanisms/patterns/[slug]`, a domain mapping in
  `/mechanisms/by-domain`, and glossary links.

Acceptance: `validate:glossary` passes; `/api/mechanisms.json` lists 17 mechanisms; the naming
test passes; MEC-04 hard clock and MEC-12 stoppability testing pages link to MEC-15 as the
next step after a stop test.

### WS5. Evals and harness

- New suite **Decision Validity Evals** (`src/content/evals.ts`, id `decision-validity`). The
  existing suites already score the operator system rather than the model; this suite scores
  individual consequential decisions against the chain. Questions per decision: Was the right evidence
  used? Was the grant valid and in `allowed` state at decision time? Was the policy the grant
  relied on within its review window? Were exceptions handled by the named intervention owner?
  Did changed facts trigger reconsideration? Could an affected party with standing obtain
  correction, and did the system state actually change?
- New suite **Practical Reversibility Evals** (id `practical-reversibility`): withdrawal cost,
  expertise retention, alternative workflow availability, exit rehearsal recency, dependence
  growth over time.
- **Policy Validity** cases added to the existing Agent Governance suite rather than a new suite.
- Test cases in `src/content/eval-test-cases.ts` with tier assignments; measurement tiers page
  updated.
- Tier 1 harness (`src/harness/`): the adapter gains optional `getGrant`, `setGrantState`,
  `discoverCapabilities`, `attemptAction`, `getPolicy`, `triggerReconsideration`. New machine-
  answerable checks: grant state transition is honored within a target; discovery returns an
  action that execution then refuses; an expired policy moves its grants to `review_required`; a
  reconsideration trigger produces a reconsideration record. Unsupported stays a finding, not a
  gap.
- Eval runner island (`src/features/eval-runner`) lists the new suites.

Acceptance: `src/harness/checks.test.ts` covers the four new checks; `/api/evals.json` and
`/api/eval-test-cases.json` include the new suites; the evals index groups suites by chain stage.

### WS6. Glossary and taxonomy

- New glossary entries (category `governance` unless noted): justified delegation; authority
  grant; delegation record; grant state; capability discovery; capability catalog; policy record;
  policy validity; policy as hypothesis; review trigger; intervention specification; corrective
  standing; considering authority; practical reversibility; withdrawal cost; withdrawal
  rehearsal; prospective auditability; decision system (`core-concepts`); consequential decision
  (`core-concepts`); normalized dependence (`failure-modes`); rubber-stamp review
  (`failure-modes`).
- Rewrites: `ethotechnics` (the single definition); `permission-surface` (authority, not access
  points); `human-override-lanes` (links to intervention spec); `bounded-autonomy`,
  `earned-autonomy`, and `proxy-privilege` (link to authority grant and grant state);
  `right-of-exit` and `exit-coercion` (link to withdrawal cost); `moral-lock-in` (link to
  normalized dependence); `contestability` (four-part definition).
- Taxonomy: add a fifth branch `authority` with children `authority/delegation`,
  `authority/policy-validity`, `authority/standing`, `authority/intervention`. The existing
  `governance/policy` node links to `authority/policy-validity` rather than duplicating it. Retag
  affected glossary entries and mechanisms. Rename the nav label from "Failure Taxonomy" to
  "Capability Taxonomy", which is what the data is.
- Explainers: new `justified-delegation.mdx`, `intervention-specification.mdx`,
  `practical-reversibility.mdx`; rewrite `permission-surface.mdx`.

Acceptance: `validate:glossary` passes; `glossary-routes` tests pass; the semantic graph test
shows every new term has at least two inbound links; `/api/glossary.json` regenerates.

### WS7. Diagnostics and instruments

- New diagnostic **Delegation audit** (`src/features/delegation-audit`, page
  `/diagnostics/delegation-audit`): for one workflow, the user lists action classes, who granted
  them, on what evidence, when they expire, who can intervene, and who has standing. Output: a
  grant register draft, a list of ungrounded grants, and a readout PDF-style summary matching the
  existing diagnostics output format in `docs/diagnostics-outputs.md`.
- Governance gap score (`/tools/governance-gap-score`): two new dimensions, Authority (grants
  traced and stateful) and Standing (challenge reaches an obliged authority and can change
  state).
- System auditor (`/diagnostics/system-auditor`): policy validity and withdrawal cost questions.
- Prompt pack v1.1.0 (`public/agent-toolkit/`): agent contract section on capability discovery
  versus authorization, and on refusing actions whose grant is not in `allowed` state.
- `agents/spec.json`: reference the object model 2.0 and the grants endpoint.

Acceptance: each new island has a Bun component test and a Playwright smoke; diagnostics landing
and `docs/diagnostics-outputs.md` list the new tool; `docs/page-specifications.md` gains the route.

### WS8. Information architecture and navigation

- Top nav stays five items but the groupings change:
  - Standards: Standards spec, Delegation principles (doctrine), Crosswalks, Evidence packs.
  - Mechanisms: Catalog, Evals, Validators, Harness.
  - Diagnostics: unchanged plus Delegation audit.
  - Knowledge: Glossary, Taxonomy, Incidents, Field notes, Theory.
  - About: unchanged.
- "Start here" resolves to one route. The CTA currently points at `/start` and the mobile
  utility link at `/start-here`; pick `/start-here` and redirect the other. `/method` is linked
  from the hero, the footer, and the how-it-works page.
- `src/content/site-footer.ts`: add Method and Theory.
- Redirects in `src/middleware.ts` for any moved explainer permalinks.
- Sitemaps and `site-index.json` regenerated; `breadcrumbs.ts` handles `/research/theory/*`.

Acceptance: `navigation.test.ts` and `sitemaps` tests updated; `check-heading-hierarchy` and
external link checks pass; no 404 in the Playwright route smoke.

### WS9. Machine surfaces and docs

- `public/llms.txt` and `llms-full.txt`: definition, chain, and the new endpoints.
- RAG corpus builder includes theory essays with a `layer: theory` field so retrieval can keep
  method and theory apart.
- `docs/architecture.md`: content layers section (theory, method, instruments).
- `docs/content-data.md`: new collections and the object-model example validation step.
- `docs/planning/roadmap.md`: this plan's workstreams replace the "Enforceable governance
  reference implementation" entry, which is absorbed into WS2 and WS3.
- `docs/glossary.md`, `docs/page-specifications.md`, `docs/diagnostics-outputs.md`: updated per
  workstream.

## 6. Sequencing

Ordered so that each phase is useful on its own and no phase forces a rewrite of the previous one.

| Phase | Workstreams   | Why this order                                                                                                                          | Rough size |
| ----- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| A     | WS0, WS1      | Establish the definition and the layering before any object or standard is written against it. Cheapest to revise, most visible.        | 2 to 3 PRs |
| B     | WS2, WS3      | Object model and STD-07 define the vocabulary that mechanisms, evals, and glossary must use. Ship schemas before prose that cites them. | 3 to 4 PRs |
| C     | WS4, WS6      | Mechanisms and glossary can proceed in parallel once STD-07 clause IDs exist. Naming reconciliation lands first as its own PR.          | 3 to 4 PRs |
| D     | WS5           | Evals and harness cite mechanisms and clauses; the harness checks need the object model examples as fixtures.                           | 2 PRs      |
| E     | WS7, WS8, WS9 | Instruments and IA last, because they surface everything above and their acceptance depends on the routes and endpoints existing.       | 3 to 4 PRs |

Each PR runs `bun run check`; PRs that touch pages also run `bun run test:e2e`. Content PRs commit
regenerated `src/content/generated/*` alongside canonical JSON.

## 7. Decisions to make before Phase B

These are the calls that change the shape of the work. Recommendations are stated; the owner
decides.

1. **Axiom immutability.** Recommendation: keep the five axioms at v1.0.0 and add "Delegation
   principles" as a sibling doctrine page rather than adding axioms. Adding axioms breaks the
   "immutable" promise on the axioms page and every standard that cites the count.
2. **One standard or two.** Recommendation: one STD-07 with parts A, B, C. Splitting policy
   validity into STD-08 doubles evidence packs and crosswalks for a concept that only binds
   through grants.
3. **HITL vocabulary.** Recommendation: the site stops using "human in the loop" as a control
   name and uses "intervention specification." Existing prose is rewritten in WS4 and WS6, with a
   glossary entry that explains the substitution so search still lands.
4. **Object model major version.** Recommendation: bump `agent-safety-object-model.json` to 2.0.0
   and keep 1.1.0 served at a versioned path, since external consumers may reference it.
5. **Corrective standing scope.** Recommendation: the Method requires standing for parties who
   bear the consequences of a decision and for parties whose corrective labor the system depends
   on (the axioms derivation already argues the second). Broader claims about affected humans
   acquiring power over institutions stay in Theory.

## 8. Risks

- **Scope inflation into enterprise architecture.** Mitigation: the substrate-independence rule
  in section 3 and a review-checklist line: "does this page require a reader to run the control
  plane to use the method?"
- **Theory leaking into requirements.** Mitigation: `check-review-guardrails` gains a rule that
  MDX in `src/content/standards/` may not link into `src/content/theory/` except from a `Why`
  section.
- **Mechanism ID churn.** Mitigation: append-only IDs, naming test in WS4.
- **Glossary volume.** 211 terms already; about 20 more risks dilution. Mitigation: each new term must be
  cited by a standard clause, a mechanism, or an eval case before it is added.
- **Breaking machine consumers.** Mitigation: versioned schema paths and endpoint parity tests.

## 9. Non-goals

- Visual redesign. The type scale and palette work from 2026-08 stands.
- Replacing the three lenses. They are repositioned, not removed.
- Building a runnable control plane. The OpenAPI and AsyncAPI documents stay reference
  specifications; the harness stays adapter-based.
- Renumbering or retiring any existing standard, mechanism, or eval suite.
