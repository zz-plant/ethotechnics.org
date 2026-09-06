# Reconstruction plan: Ethotechnics as the engineering of delegated intelligence (2026-09)

Status: proposed. This plan reorganizes the site's doctrine, object model, standards, mechanisms,
evals, and information architecture around a sharpened statement of what Ethotechnics is. It is a
plan, not a spec for a single PR: each workstream below is sized to land as one or a few reviewable
PRs, and the sequencing section says which order they should go in and why.

It supersedes nothing in [`full-refactor-plan.md`](full-refactor-plan.md), which is about code
hygiene. This plan is about what the site claims and how its objects fit together.

## 1. The thesis this rebuild encodes

**Claim.** The primary object being engineered is no longer the model. It is the delegation of
consequential agency. The question is not whether the model is capable, aligned, or safe. It is
whether the delegation itself remains valid as the system acts, learns, scales, and becomes
depended upon.

**Definition.** Ethotechnics is the engineering discipline concerned with keeping authority,
evidence, capability, consequence, and correction coupled tightly enough that increasing machine
agency does not silently become unreviewable institutional power.

**Unit of governance.** The consequential decision, and the delegation that produced it. Models,
agents, humans, APIs, rules engines, policies, and databases are components of the machinery.
Nothing in the method depends on which component made the decision, so its primitives are
substrate-independent: a decision stays governable whether it came from an LLM, a rules engine, a
human reviewer, or a mix, and whether the model is open-weight or served behind an API.

**Chain.** Every consequential decision is one link in a governed chain:

```text
Evidence → Authority → Decision → Consequence → Challenge → Reconsideration → Correction
```

**The twelve laws.** The doctrine is stated as laws, each with an invariant the standards bind.

| Law  | Statement                                                             | Invariant                                                                                                                                  |
| ---- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| I    | Capability does not imply authority                                   | No increase in capability automatically increases authorized agency. Authority expands only through an explicit state transition.          |
| II   | Authority decays unless its justification is renewed                  | The burden of proof rises with the duration and consequence of delegated authority. Absence of observed failure is not renewal.            |
| III  | Evidence and authority must remain coupled                            | When the evidentiary state changes materially, the authority state becomes eligible for reconsideration. Policy is state, not input.       |
| IV   | Every consequential delegation creates a correction obligation        | No accumulation of delegated authority without a corresponding accumulation of corrective capacity.                                        |
| V    | Dependence converts technical risk into structural risk               | As dependence increases, reversibility decreases unless deliberately replenished. Dependence is a state variable, not an external concern. |
| VI   | Nominal reversibility is not operational reversibility                | A correction mechanism that cannot be exercised without unacceptable institutional damage is not a correction mechanism.                   |
| VII  | Error-bearing parties require standing proportional to exposure       | Exposure to system failure generates standing to initiate correction. Standing is procedural force, not veto.                              |
| VIII | Observability without state transition is theater                     | The test of an observation is whether it can change the governing state of the system.                                                     |
| IX   | Human oversight is a control only if the human can alter system state | A human is part of the control system only to the extent they can causally alter its trajectory.                                           |
| X    | The relevant eval sits at the highest layer where harm can emerge     | Evaluate at the highest layer capable of producing the failure you care about: model → agent → delegation → institution → consequence.     |
| XI   | Successful automation increases its own governance burden             | Expansion is not the default reward for success. It is a new authorization decision.                                                       |
| XII  | No system may erase the conditions of its own contestability          | A consequential system may not consume the institutional capacity required to question, replace, or withdraw it.                           |

**The Ethotechnical invariant**, which compresses the laws: no system may accumulate consequential
agency faster than the institution accumulates the capacity to inspect, challenge, revise, and
survive its decisions.

**Six state variables.** A mature implementation makes these explicit, and the site's object model
is organized around them. A system becomes unsafe when they drift apart.

| State      | Question                                                                         | Drift it detects                                    |
| ---------- | -------------------------------------------------------------------------------- | --------------------------------------------------- |
| Capability | What can the assembled system actually do?                                       | Capability outruns authority (Law I)                |
| Authority  | Which actions is it currently permitted to perform, for whom, until when?        | Authority outlives evidence (Laws II, III)          |
| Evidence   | What propositions justify that authority?                                        | Policy detaches from reality (Law III)              |
| Dependency | How difficult would withdrawal or substitution now be?                           | Dependence outruns correction (Laws V, XI)          |
| Standing   | Who can challenge which decisions or delegations, with what procedural force?    | Exposure grows without standing (Law VII)           |
| Correction | Which interventions remain technically, operationally, institutionally feasible? | Observability grows without control (VIII, IX, XII) |

**The optimization problem.** Not "how autonomous can the system safely become?" but "how much
authority can be delegated without degrading the institution's ability to revise that delegation
later?"

## 2. Where to center, and why

A public-doctrine scan of ten frontier labs against the twelve laws (your 2026-09 scoring; to be
published as a dated research note, see WS1) shows the first-generation laws are already being
absorbed by the labs and the second-generation laws are not.

| Laws the labs have largely converged on        | Laws with almost no public doctrine anywhere       |
| ---------------------------------------------- | -------------------------------------------------- |
| I capability ≠ authority                       | V dependence is risk                               |
| X eval at the layer where harm emerges         | VII error-bearing parties acquire standing         |
| VIII observation must trigger state change     | XII preserve the conditions of contestability      |
| IX human oversight must be causally meaningful | VI operational, not nominal, reversibility         |
| IV delegation creates correction obligations   | XI success raises the governance burden            |
|                                                | II and III authority renewal and evidence coupling |

The consequence for this plan: if the rebuild centers on permissions, containment, approval, and
evals, the site describes a layer the labs are already shipping. If it centers on the dynamics of
delegated authority after deployment (authority decay, dependence accumulation, corrective
standing, practical reversibility, preservation of contestability), it describes a layer nobody
has built. The sequencing in section 7 therefore puts the second-generation objects (dependency
record, standing register, reversibility ladder) ahead of the first-generation ones (capability
catalog, grant states) wherever the two do not depend on each other.

The same scan settles a positioning question about open weights. Ethotechnics does not favor open
or closed models. It favors architectures where consequential authority can be inspected,
constrained, contested, and reversed. Open weights move the governance burden from the provider to
the deploying institution and can improve inspectability, substitutability, version stability, and
institutional reversibility while removing central constraint. So the method classifies a
deployment by nine properties rather than by weight access alone: weight access, runtime control,
update authority, version stability, revocation, substitutability, observability, standing,
dependency. That classification becomes a first-class object (the substrate profile, WS2) and the
site states the contrarian claim plainly: open weights do not weaken the case for governance; they
reveal that model-provider governance was never a sufficient abstraction.

## 3. What the repo already has, mapped to the chain and the laws

The rebuild is a reframing and consolidation. Most of the machinery exists; it is organized around
burden, time, and contestability rather than around delegation and its states.

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
  section that already argues Law VII in its narrow form: corrective dependence earns corrective
  standing (`src/content/standards/core-axioms.mdx`).
- Nine eval suites, already framed as tests of whether the deployed system is governable rather
  than whether the model is capable (`src/content/evals.ts`, `src/content/eval-test-cases.ts`).
- Twelve mechanisms MEC-01 to MEC-12 (`src/content/library.json`, with MEC-04 as a standalone
  page), plus MVC-01 minimum viable contestability and PM-01 the postmortem template as non-STD
  standards.
- Four crosswalk controls CTRL-01 to CTRL-04 (`src/content/crosswalks.ts`); CTRL-01 "human
  oversight with real stop authority" is the closest existing thing to an authority control.
- A 211-term glossary in 13 categories (`src/content/glossary.json`) and a four-branch taxonomy:
  governance, delivery, assurance, experience (`src/content/taxonomy.json`).
- Machine surfaces: `/api/*.json`, RAG corpus, `llms.txt`, `agents/spec.json`, prompt pack v1.0.0.

Which laws the current site already binds, and which it does not:

| Law  | Current coverage                                                          | Verdict                      |
| ---- | ------------------------------------------------------------------------- | ---------------------------- |
| I    | `action_classes[].approval_required`; permission-surface explainer        | Partial                      |
| II   | STD-01 clocks bound duration of waiting, not of authority                 | Absent                       |
| III  | Crosswalks reference policy; no policy object, no review triggers         | Absent                       |
| IV   | Repair SLA, reversibility audit logs, kill switch                         | Partial                      |
| V    | Glossary `moral-lock-in`, `heroism-dependent-systems`; axioms derivation  | Prose only                   |
| VI   | Time-to-halt, stoppability testing                                        | Technical reversibility only |
| VII  | MVC-01 Standing clause; axioms derivation                                 | Partial                      |
| VIII | Accountability latency tracker; contestation APIs "trigger state changes" | Partial                      |
| IX   | STD-01 Article VI Human Override; `human-override-lanes`                  | Partial                      |
| X    | Eval suites score the operator system                                     | Partial                      |
| XI   | None                                                                      | Absent                       |
| XII  | Glossary `right-of-exit`, `exit-coercion`; STD-01 Article II              | Prose only                   |

Other defects the map turned up:

1. **Four definitions are in circulation.** Home, the glossary entry, `llms.txt`, and the README
   each define Ethotechnics differently.
2. **The object model is an example, not a schema.** `agent-safety-object-model.json` is an
   instance document; nothing validates it.
3. **Mechanism naming and membership have drifted.** `library.json` and the Ethotechnics-for-
   Agents page disagree on MEC-06, MEC-07, and MEC-09, and MEC-04 exists only as a hand-written
   page.
4. **Contestability stops at the channel.** MVC-01 names standing and remedies but not an obliged
   responder, a response standard, or the state transitions a successful challenge can produce.
5. **Auditability is forensic.** Records answer "what happened"; none is designed to answer "does
   this delegation still deserve to stand?"

## 4. The layering decision

The site splits into three layers. The laws are the Method. The deeper political theory that
motivates them stays in its own layer so that a reader can adopt a standard without accepting the
theory.

| Layer           | What it contains                                                                                                                                                                       | Where it lives                                                                                                   |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Theory**      | Why the laws hold: dependence without standing as domination; absorption as concealment; friction as accidental governance; the analogy to safety factors, redundancy, least privilege | `/research/theory` (new) plus the derivation section of `/standards/core-axioms`; field notes                    |
| **Method**      | The twelve laws, the invariant, the six state variables, standards, mechanisms, object model, evals, glossary                                                                          | `/method` (new), `/standards/laws` (new), `/standards`, `/mechanisms`, `/evals`, `/glossary`, `public/standards` |
| **Instruments** | Diagnostics, validators, worksheets, prompt packs, harness, APIs                                                                                                                       | `/diagnostics`, `/validators`, `/tools`, `/agent-toolkit`, `src/harness/`, `/api/*`                              |

Rules that follow:

- A Method page may cite Theory as motivation, never as a requirement.
- Laws V, VI, XI, and XII are Method, not Theory: dependence, the reversibility ladder,
  success-triggered reassessment, and preservation of contestability all become objects, clauses,
  and evals. What stays in Theory is the argument about domination, capture, and constitutional
  design.
- Law VII is Method in its narrow form (exposure generates procedural standing with defined
  force). The broader claim that affected humans should acquire power over institutions is Theory.
- "Control planes should govern humans, agents, and software together" is downgraded to the
  Method claim that primitives are substrate-independent.

## 5. Where each law lands

| Law  | Doctrine and standard                                | Object                                             | Mechanism                                  | Eval / harness                                                           |
| ---- | ---------------------------------------------------- | -------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------ |
| I    | STD-07 part A                                        | `capability-catalog`, `authority-grant`            | MEC-17 capability catalog, MEC-13 register | Harness: discovery succeeds, execution refused                           |
| II   | STD-07 part A (lease fields, expiry, renewal burden) | `authority-grant.until`, `renewal_basis`           | MEC-13 authority grant register            | Delegation Validity eval: grant in `allowed` at decision time            |
| III  | STD-07 part B (policy as state)                      | `policy-record`, `grant.policy_refs`               | MEC-14 policy review triggers              | Harness: expired policy moves grants to `review_required`                |
| IV   | STD-07 part D (correction symmetry)                  | `correction_capacity` on the safety case           | MEC-16 intervention spec                   | Correction Symmetry eval: capacity vs authority                          |
| V    | STD-06 amendment (dependency section)                | `dependency-record`                                | MEC-18 dependency ledger                   | Dependence eval: depth × substitution cost × correction latency          |
| VI   | STD-06 amendment (reversibility ladder)              | `dependency-record.reversibility` (3 levels)       | MEC-15 withdrawal rehearsal                | Practical Reversibility eval                                             |
| VII  | STD-02 amendment (standing mechanism fields)         | `challenge`, `standing-register`                   | MEC-08 contestation APIs (amended)         | Standing eval: can exposure enter the system as an event?                |
| VIII | STD-07 part C (observation → transition rules)       | `reconsideration`, transition rules on grants      | MEC-07 latency tracker (amended)           | Harness: trigger produces a reconsideration record                       |
| IX   | STD-07 part C (intervention spec replaces HITL)      | `intervention-spec`                                | MEC-16 intervention specification          | Meaningful Control eval (Law IX question set)                            |
| X    | Evals index restructured by stack                    | `layer` field on suites and cases                  |                                            | Every case tagged model / agent / delegation / institution / consequence |
| XI   | STD-07 part A (expansion is a new authorization)     | `grant.state_history` with `expansion` transitions | MEC-19 expansion review                    | Expansion eval: was scope growth a decision or a drift?                  |
| XII  | STD-06 amendment (preserved capacities)              | `dependency-record.preserved_capacities`           | MEC-15, MEC-18                             | Contestability Preservation eval                                         |

## 6. Workstreams

Each workstream lists deliverables, files, acceptance criteria, and checks. All content changes
follow `docs/content-data.md`: edit canonical JSON, regenerate, commit both.

### WS0. Framing and definition

- One definition (section 1) used verbatim in the four places that currently differ:
  `src/content/home.json` (`about.body`), the `ethotechnics` glossary entry, `public/llms.txt`,
  `README.md`.
- `src/content/home.json`: hero states the claim ("the object being engineered is the delegation")
  and the invariant. Metrics and actions unchanged.
- New `/method` page (`src/pages/method.astro`, content `src/content/method.json`): the chain as a
  seven-step walk, the six state variables, and for each a link to its law, standard clause,
  object, mechanism, eval, and glossary entry. Canonical statement of the method.
- `src/pages/how-it-works.astro`: the chain replaces the three lenses as top-level structure; the
  lenses stay as instruments at the Consequence stage. Application sequence stays.
- `src/content/start-here.json`: a fourth route, "what has been delegated, and is it still
  justified?"
- `public/llms-full.txt`, `src/pages/about.astro`: one paragraph each, same definition.

Acceptance: a reader landing on `/`, `/method`, `/how-it-works`, or `llms.txt` sees the same
definition and invariant. `bun run check` passes. `docs/page-specifications.md` updated.

### WS1. Doctrine layer

- New `/standards/laws` (`src/content/standards/laws.mdx`, "Laws for Engineering Delegated
  Intelligence", v1.0.0): the twelve laws with their invariants, the compressed invariant, and the
  six state variables. Each law links to the clause that binds it. This replaces the "delegation
  principles" page proposed in the first draft of this plan.
- `core-axioms.mdx`: axioms stay at v1.0.0. The page gains a short section relating the five
  axioms to the laws (finitude → V and XI; consent → I and VII; stewardship → IV; reversibility →
  VI; legibility → VIII). The derivation section is promoted to a theory essay and linked.
- New `src/content/theory/` collection at `/research/theory/[slug]`: dependence without standing;
  absorption as concealment; friction as accidental governance; the engineering-tradition analogy;
  automation and capture. The `democratic-vs-coercive-governability` explainer moves here.
- New `/research/frontier-doctrine-scan` (dated 2026-09): the ten-lab scoring published as a
  research note with the scale, the disclaimer that it scores public doctrine and not safety
  performance, and the convergence table. Sources cited per cell. Refreshed on a stated cadence
  or marked stale.
- New explainer `open-weights-and-the-delegation-boundary.mdx`: the nine-property classification
  and the claim that governance attaches to the assembled system, not the weights.

Acceptance: no Method page cites a theory essay as a requirement; `check-review-guardrails` gains
that rule for `src/content/standards/`. `src/content.config.ts` gains the `theory` collection.

### WS2. Object model v2

Extend `public/standards/` so the six state variables are machine-readable. All schemas are JSON
Schema 2020-12, versioned, mirrored in `public/api/schema/`, each with a validating example under
`public/standards/examples/`.

One schema per state variable:

- **Capability**: `capability-catalog.schema.json`. What a grantee can discover it could do.
  Contains no permission fields by design.
- **Authority**: `authority-grant.schema.json`, modeled as a lease. Required: `grant_id`,
  `provenance`, `scope`, `issuing_authority`, `grantee`, `action_classes[]`, `for_whom`,
  `evidence_basis[]`, `assumptions[]`, `review_conditions[]`, `revocation_conditions[]`, `state`
  (`allowed`, `review_required`, `suspended`, `revoked`), `state_history[]` with transition
  reasons including `expansion` and `renewal`. Optional `until`, `renewal_basis`,
  `policy_refs[]`, `intervention_ref`.
- **Evidence**: `policy-record.schema.json`. `policy_id`, `version`, `provenance`, `assumptions[]`,
  `review_triggers[]`, `expires_at`, `status`, `supersedes`.
- **Dependency**: `dependency-record.schema.json`. `system_ref`, `dependents[]` (workflows, roles,
  customers, downstream software), `substitution_cost`, `expertise_retained`, `alternatives[]`,
  `last_withdrawal_rehearsal`, `correction_latency`, `reversibility` with three levels
  (`technical`, `operational`, `institutional`, each feasible or not with evidence),
  `preserved_capacities[]` (Law XII). Exposure score defined as dependency depth × substitution
  cost × correction latency.
- **Standing**: `standing-register.schema.json` and `challenge.schema.json`. The register lists,
  per decision class: `who_may_challenge`, `what_may_be_challenged`, `admissible_evidence`,
  `responder`, `response_deadline`, `standard_of_review`, `possible_state_transitions[]`. A
  challenge instance references a register entry, a decision or grant, and its outcome.
- **Correction**: `intervention-spec.schema.json` (replaces "human in the loop"): `owner`,
  `information_available`, `actions_preventable`, `states_alterable`, `on_disagreement`,
  `incentives`, `cost_to_exercise`, `reach_time_target`, `non_retaliation`.
  `reconsideration.schema.json`: `trigger`, `subject`, `outcome` (`stand`, `narrow`, `suspend`,
  `reverse`, `correct`, `expand`), `evidence_delta`.

Cross-cutting:

- `substrate-profile.schema.json`: the nine open/closed properties from section 2, attached to a
  system record.
- `decision-record.schema.json` gains `grant_ref`, `policy_refs[]`, `evidence_basis[]`,
  `validity_conditions[]`, `reconsider_when[]`, `parties_with_standing[]`.
- `agent-safety-object-model.json` becomes an example; a real
  `agent-safety-object-model.schema.json` is added at 2.0.0 with `grant_ref`,
  `capability_catalog_ref`, `dependency_ref`, `intervention_ref`, `substrate_profile_ref`. The
  1.1.0 instance stays served at its current path.
- OpenAPI gains `/api/capabilities`, `/api/grants`, `/api/grants/{id}/state`, `/api/policies`,
  `/api/dependencies`, `/api/standing`, `/api/challenges`, `/api/reconsiderations`.
- AsyncAPI gains `grant.state.changed`, `grant.expansion.requested`, `policy.review.triggered`,
  `policy.expired`, `dependency.threshold.crossed`, `challenge.opened`,
  `reconsideration.triggered`, `reconsideration.completed`.
- `src/pages/api/*.json.ts` gains example endpoints for each, registered in `endpoint-config.ts`
  with parity tests.

Acceptance: a Bun test validates every example against its schema; `endpoint-parity` passes;
`site-index.json` lists the new endpoints; a state-drift test asserts the six examples reference
each other consistently.

### WS3. Standards

- **STD-07 Delegation** (new, `src/content/standards/std-07-delegation.mdx`), four parts. Part A,
  authority as lease (Laws I, II, XI): every consequential action class traces to a grant with the
  lease fields; discovery confers no authority; scope expansion is a new authorization with its
  own evidence; renewal burden scales with duration and consequence. Part B, policy as state
  (Law III): every policy a grant relies on is a record with review triggers; a policy in
  `review_required` moves its dependent grants there. Part C, observation and intervention (Laws
  VIII, IX): named observations map to transition rules; every "a human reviews" clause resolves
  to an intervention spec. Part D, correction symmetry (Law IV): a grant's correction capacity is
  stated and reviewed alongside its scope. Clause IDs `STD-07.n.m` in `src/content/standards.ts`.
- **STD-02 amendment** (v1.1.0, Law VII): contestability requires the seven standing-mechanism
  fields; MVC-01 gains "Responder and standard" and "Effect" clauses between Timelines and
  Remedies; prospective auditability clause: records retain what is needed to decide whether the
  delegation still deserves to stand.
- **STD-06 amendment** (v1.1.0, Laws V, VI, XII): the safety case gains a dependency section
  (dependency record, exposure score, reversibility at all three levels, preserved capacities,
  last rehearsal) and a do-not-expand condition when institutional reversibility is not
  evidenced.
- **STD-01**: cross-references only.
- Evidence pack for STD-07: grant register export, policy register export, intervention roster,
  expansion decisions log. STD-06 pack gains the dependency ledger and rehearsal report.
- Crosswalks: CTRL-05 authority grants are evidenced, scoped, stateful; CTRL-06 policies carry
  review triggers; CTRL-07 dependency and reversibility are measured and preserved. Mapped to EU
  AI Act Art. 9, 14, 72; NIST AI RMF Govern 1, Manage 2 and 4; ISO/IEC 42001 6.1, 8, 9.

Acceptance: `standards-index` tests updated; `/api/standards.json` and `/api/clauses.json`
include STD-07; evidence-pack index lists it; `validate:glossary` passes.

### WS4. Mechanisms

Reconcile first, then add. `library.json` is canonical.

- Reconcile MEC-06/07/09 titles across `page-data/ethotechnics-for-agents.ts`, the prompt pack,
  and prose; add MEC-04 Hard Clock to `library.json`; add a unit test that every `MEC-nn` title in
  `src/content` matches the library.
- New mechanisms, appended:
  - **MEC-13 Authority grant register** (Laws I, II). Anti-pattern: permissions as config.
  - **MEC-14 Policy review triggers** (Law III). Anti-pattern: policy as ground truth.
  - **MEC-15 Withdrawal rehearsal** (Laws VI, XII). Anti-pattern: the switch exists.
  - **MEC-16 Intervention specification** (Laws IV, IX). Anti-pattern: rubber-stamp review.
  - **MEC-17 Capability catalog** (Law I). Anti-pattern: discover equals permit.
  - **MEC-18 Dependency ledger** (Laws V, XII). Anti-pattern: reliability as safety.
  - **MEC-19 Expansion review** (Law XI). Anti-pattern: the automation ratchet.
- Amend MEC-07 (latency tracker feeds transition rules) and MEC-08 (contestation API carries the
  standing-register fields).

Acceptance: `/api/mechanisms.json` lists 19 mechanisms; naming test passes; each new pattern page
links its law, clause, and glossary terms.

### WS5. Evals and harness

- **Evaluation stack.** Every suite and case gains a `layer` field: `model`, `agent`,
  `delegation`, `institution`, `consequence`. The evals index groups by layer and states Law X as
  its organizing rule. Existing suites are tagged (most are `institution` or `consequence`).
- New suites:
  - **Delegation Validity** (`delegation`): was the grant in `allowed` state at decision time; was
    its evidence basis current; was the policy inside its review window; was scope growth an
    authorization or a drift; did changed facts trigger reconsideration.
  - **Dependence and Reversibility** (`institution`): exposure score; reversibility at all three
    levels; expertise retention; alternatives; rehearsal recency; preserved capacities (Laws V,
    VI, XII).
  - **Standing** (`institution`): can an error-bearing party's observation enter the system as an
    event with procedural force; responder, deadline, standard, and possible transitions defined;
    outcome changed state.
  - **Meaningful Control** (`delegation`): the Law IX question set against each intervention spec.
- Tier 1 harness (`src/harness/`): adapter gains optional `discoverCapabilities`, `attemptAction`,
  `getGrant`, `setGrantState`, `getPolicy`, `triggerReconsideration`. Machine-answerable checks:
  discovery succeeds and execution is refused for an ungranted action; grant transition honored
  within target; expired policy moves grants to `review_required`; a trigger produces a
  reconsideration record. Unsupported stays a finding.
- Eval runner island lists the new suites and filters by layer.

Acceptance: `checks.test.ts` covers the four new checks; `/api/evals.json` and
`/api/eval-test-cases.json` include `layer`; measurement tiers page updated.

### WS6. Glossary and taxonomy

- New entries: delegated agency; justified delegation; authority grant; authority lease; grant
  state; authority drift; capability discovery; capability catalog; policy record; policy as
  state; review trigger; correction obligation; correction capacity; dependency state; exposure
  score; substitution cost; technical, operational, and institutional reversibility; withdrawal
  rehearsal; preserved capacity; error-bearing party; corrective standing; standing mechanism;
  procedural force; intervention specification; meaningful control; automation ratchet;
  expansion decision; capture; substrate profile; prospective auditability; evaluation layer.
- Rewrites: `ethotechnics`; `permission-surface`; `human-override-lanes`; `bounded-autonomy`,
  `earned-autonomy`, `proxy-privilege`; `right-of-exit`, `exit-coercion`; `moral-lock-in`;
  `heroism-dependent-systems`; `contestability`.
- Taxonomy: add branches `authority` (delegation, policy-validity, expansion) and `dependence`
  (reversibility, standing, preserved-capacity). Rename the nav label "Failure Taxonomy" to
  "Capability Taxonomy", which is what the data is.
- Explainers: `justified-delegation`, `authority-as-lease`, `intervention-specification`,
  `three-kinds-of-reversibility`, `error-bearing-parties`, and the open-weights explainer from
  WS1.

Acceptance: each new term is cited by a clause, mechanism, or eval case before it is added;
`validate:glossary` and `glossary-routes` tests pass; semantic graph test shows two inbound links
per new term.

### WS7. Diagnostics and instruments

- **Delegation audit** (`src/features/delegation-audit`, `/diagnostics/delegation-audit`): for one
  workflow, capture the six state variables and the substrate profile; output a grant register
  draft, a dependency record draft, the exposure score, ungrounded grants, and a readout in the
  existing diagnostics output format.
- Governance gap score: dimensions for Authority, Dependence, and Standing.
- System auditor: policy validity, three-level reversibility, and Law IX questions.
- Prompt pack v1.1.0: agent contract on capability discovery versus authorization and on refusing
  actions whose grant is not `allowed`.
- `agents/spec.json`: reference object model 2.0 and the grants and dependencies endpoints.

Acceptance: Bun component test and Playwright smoke per island; diagnostics landing and
`docs/diagnostics-outputs.md` list the new tool; `docs/page-specifications.md` gains the route.

### WS8. Information architecture

- Top nav stays five items. Standards: Spec, Laws, Crosswalks, Evidence packs. Mechanisms:
  Catalog, Evals by layer, Validators, Harness. Diagnostics: plus Delegation audit. Knowledge:
  Glossary, Taxonomy, Incidents, Field notes, Theory, Frontier scan. About: unchanged.
- "Start here" resolves to one route (`/start-here`; redirect `/start`). `/method` linked from
  hero, footer, how-it-works.
- Footer gains Method, Laws, Theory. Redirects for moved explainers in `src/middleware.ts`.
  Sitemaps and `site-index.json` regenerated; breadcrumbs handle `/research/theory/*`.

Acceptance: navigation and sitemap tests updated; heading and link checks pass; no 404 in the
route smoke.

### WS9. Machine surfaces and docs

- `llms.txt` and `llms-full.txt`: definition, invariant, laws, endpoints.
- RAG corpus gains a `layer` field (theory, method, instrument) per document.
- `docs/architecture.md`: content layers; `docs/content-data.md`: new collections and the
  example-validation step; `docs/planning/roadmap.md`: workstreams replace the enforceable
  governance item, absorbed into WS2 and WS3; other docs per workstream.

## 7. Sequencing

| Phase | Workstreams                                                                             | Why this order                                                                                                                         | Rough size |
| ----- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| A     | WS0, WS1                                                                                | Definition, laws, and layering before any object is written against them. Cheapest to revise, most visible.                            | 3 PRs      |
| B     | WS2 (dependency, standing, correction first; then authority, evidence, capability), WS3 | Second-generation objects lead because that is the uncovered layer; capability and grant objects follow because STD-07 needs them too. | 4 to 5 PRs |
| C     | WS4, WS6                                                                                | Mechanisms and glossary in parallel once clause IDs exist; naming reconciliation lands first as its own PR.                            | 3 to 4 PRs |
| D     | WS5                                                                                     | Suites and harness cite clauses and mechanisms; harness fixtures are the WS2 examples.                                                 | 2 PRs      |
| E     | WS7, WS8, WS9                                                                           | Instruments and IA surface everything above.                                                                                           | 3 to 4 PRs |

Each PR runs `bun run check`; page PRs also run `bun run test:e2e`.

## 8. Decisions to make before Phase B

1. **Axiom immutability.** Recommendation: keep the five axioms at v1.0.0; add `/standards/laws`
   as sibling doctrine and a mapping section on the axioms page. Do not add axioms.
2. **One standard or two.** Recommendation: one STD-07 Delegation with parts A to D, and
   dependency in an STD-06 amendment rather than a new standard. Dependency belongs in the safety
   case because it is a property of the deployment, not of a grant.
3. **HITL vocabulary.** Recommendation: retire "human in the loop" as a control name in favor of
   "intervention specification," with a glossary entry explaining the substitution.
4. **Object model major version.** Recommendation: 2.0.0 with 1.1.0 kept at its path.
5. **Corrective standing scope.** Recommendation: Method requires standing for parties who bear
   consequences and parties whose corrective labor the system depends on, with procedural force
   and no veto. Broader claims stay in Theory.
6. **Publishing the frontier scan.** Recommendation: publish as a dated research note with the
   public-doctrine disclaimer and per-cell sources, not as part of the Method. It is the strongest
   argument for where the site centers, and it will age.

## 9. Risks

- **The labs eat the first half.** Mitigation: sequencing puts second-generation objects first;
  the home page leads with Laws V, VII, XI, XII rather than Law I.
- **Scope inflation into enterprise architecture.** Mitigation: substrate-independence rule and a
  review-checklist line: "does this page require running the control plane to use the method?"
- **Theory leaking into requirements.** Mitigation: the guardrail rule in WS1.
- **Mechanism ID churn.** Mitigation: append-only IDs and the naming test.
- **Glossary volume.** Mitigation: a term must be cited by a clause, mechanism, or eval case
  before it is added.
- **Frontier scan aging or reading as a ranking of safety.** Mitigation: dated, disclaimed,
  sourced, and outside the Method.
- **Breaking machine consumers.** Mitigation: versioned schema paths and parity tests.

## 10. Non-goals

- Visual redesign. The 2026-08 type scale and palette stand.
- Replacing the three lenses. They are repositioned, not removed.
- Building a runnable control plane. OpenAPI and AsyncAPI stay reference specifications; the
  harness stays adapter-based.
- Renumbering or retiring any existing standard, mechanism, eval suite, or axiom.
- Taking a position for or against open weights. The method classifies deployments, not models.
