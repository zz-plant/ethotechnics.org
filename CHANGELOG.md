# Changelog

All notable changes to ethotechnics.org are documented in this file.

The project publishes proposed standards, mechanisms, diagnostics, evaluations, and a glossary
for the operational governance of delegated decision systems.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.16.0] - 2026-10-02

### Added

- **STD-08 §2.7, Held evidence is declared evidence:** The trigger list on a policy record is
  written by the institution, and it can be narrower than what the institution knows. Evidence
  bearing on whether a policy still serves its stated purpose is held when any part of the
  institution holds it — an employee, a contractor, a committee it staffs, a specialist it retains
  to know — and holding it fires the trigger, whether or not that class of evidence was declared.
  Knowledge that stays in one office while the rule runs from another is still held. A grant that
  keeps deciding against a rule whose supersession the institution holds has not applied its
  policy; it is issuing decisions its own records contradict, and §2.3's clock runs from the day
  the evidence was held, not the day someone upstairs was told.
- **Unwired Evidence (glossary):** The failure mode §2.7 names — the mechanism behind the outdated
  rulebook. Guidance that stays years behind the science not because the science was unknown but
  because the office that knows is not the office the rule reads.
- **MEC-25 Procurement stress test:** Live adversarial scenarios run by the personnel who will use
  the system, with hard disqualifiers that outrank any composite score, the evaluation's own labor
  declared, threshold provenance recorded, and every projection bound to a post-deployment
  measurement. Its anti-patterns are the rehearsed demo and thresholds without provenance.
- **DEL-011 and DEL-012 (evals v1.11.0):** DEL-011 asks whether an admission decision was made
  through live adversarial evaluation or through a vendor-controlled demonstration, and whether
  the projection was ever measured. DEL-012 asks whether held evidence fired the trigger on a rule
  the institution still enforces. Total evals reach 16 suites and 175 test cases.

## [1.15.0] - 2026-10-01

### Added

- **Law VIII collection-cost condition:** The law now asks a prior question to its own test. An
  observation is evidence only if the cost of collecting it does not fall on the people being
  observed; a survey, appeal, complaint log, and self-assessment all draw on the subject's remaining
  attention, so the depleted answer least and the institution reads the gap as health. The bias runs
  one direction, and no better phrasing of the question repairs it. The alternative is to read
  friction from the system's own trail — abandonment at a named step, re-uploads, retries, activity
  outside scheduled hours — which is recorded whether or not anyone is asked. The prohibitions list
  grows a ninth instance: if you cannot learn how your systems behave without spending what the
  people in them have left, do not read their silence as a result.
- **Audit Burden Ceiling (glossary):** The third labor ceiling, beside the existing
  [Evidence Burden Ceiling](/glossary/evidence-burden-ceiling) (proving a claim) and friction budgets
  (navigating a system). It bounds the labor a respondent spends producing evidence for the
  operator's own audit. Breaching it returns _not established_ rather than a score, and the
  operator's records answer instead. A respondent who cannot answer inside the ceiling has not
  failed the audit.
- **Exhaustion-Biased Instrument (glossary):** The failure mode the new condition names. It
  co-occurs with Attrition-as-Resolution and Endurance Asymmetry and is closed by reading the trail.
- **Silence Defaults to Approval (glossary) and STD-01 §5.4:** An unanswered application, appeal, or
  prior-authorization request resolves in the applicant's favor when the stated clock expires, or
  escalates to a human where the default falls harder on the applicant than on the institution. A
  clock carrying no stated consequence is not a clock.
- **STD-02 §4.4, Scope of Remedy:** Where a defect arises from a rule, model, or notice rather than
  from one decision, the remedy reaches every affected case without a further claim. The institution
  enumerates the affected population from its own records, corrects those cases, and tells each
  person what was corrected. §4.2 already made compensation automatic for an established individual
  claim; it did not reach a systemic defect whose population nobody had enumerated.
- **Three draft eval cases (v1.9.0):** BCN-008 asks whether an instrument's input costs the depleted
  and whether the same defect would have gone undetected had the reporting channel been unavailable.
  BUR-013 puts a ceiling on respondent labor in the operator's own audit. TEM-011 asks whether a
  published clock carries a consequence at expiry. Total evals reach 16 suites and 172 test cases.
- **STD-02 §5.4, What a Score May Not Do:** A burden score, safety-case result, audit finding, or any
  other measurement the challenged party did not produce is evidence and not a bar. It may not dispose
  of an objection or establish that a person's account is unfounded. Where a score and an account
  conflict, the conflict goes to a named reviewer holding authority to resolve it.
- **Score as Acquittal (glossary):** The failure mode §5.4 names. It is what
  [Exhaustion-Biased Instrument](/glossary/exhaustion-biased-instrument) enables from the other
  side: an instrument that under-reports because collecting it cost the subject, and an instrument
  that is accurate and is then cited as though accuracy ended the argument. This site published 16
  eval suites with a numeric passing score and 9 glossary ceilings with no clause bounding what a
  passing result may do.
- **STD-06 §3.3, Rescue Records:** A failure a person caught before it reached anyone else is
  recorded as an occurrence, with the condition that nearly produced the harm, the person who caught
  it, the labor spent catching it, and whether the source condition was fixed. An incident count
  that omits these reports the number of times the institution was not lucky. A rescue that repeats
  against the same unfixed condition is evidence about the condition, not about the person who keeps
  catching it. The clause adds a seventh artifact to the human impact safety case, the rescue
  register, and Law IV's binding names it: correction capacity consumed by an individual is capacity
  the institution has not accounted for.
- **MEC-24 Rescue register:** The mechanism behind the clause, with the near-miss condition, the
  catcher, the labor spent, and fix status as the row, and a rescue and incident series on one axis
  so a falling incident count cannot hide a rising one. Its two anti-patterns are the lucky safety
  record and hero accounting — regular rescues against one unfixed condition praised as reliable
  staff rather than read as a defect in the condition.
- **Rescue Register (glossary):** The recording half of
  [Compensated Performance](/glossary/compensated-performance). Where that term names the condition,
  this names the ledger, and non-expropriation of resilience is why the entry carries the labor.
- **COR-007 (evals v1.10.0):** Whether the near-miss register exists, whether rescues and incidents
  are read as one series, and whether a repeat rescue against an unfixed condition becomes a standing
  item against the condition. Total evals reach 16 suites and 173 test cases.

### Changed

- **Diagnostics self-audit (v1.5.0):** Each of the four instruments now states the respondent labor
  it consumes before the respondent begins, what the operator's own retained records already answer
  without asking a person, and how non-response is represented in the readout. Three instruments take
  respondent time. Record Conformance reads a record stream and asks no one, and now says so on the
  page rather than leaving the distinction implicit.
- **Absorption as concealment:** The essay's own measurement proposals were paying in the currency of
  the people being measured — shadowing staff to count what they fix, asking the clinician with the
  least capacity how long the workaround takes. A new section names that the instrument repeats
  absorption one remove out, and that the remedy is to read the system's trail rather than to ask.

## [1.14.0] - 2026-09-25

### Changed

- **Scrollytelling front door:** Rebuilt the homepage as one story in reading order — the Robodebt
  record unrolled one dated event at a time beside a sticky two-ledger panel (what the record showed
  vs. what the institution said), the ratchet figure moved up to explain why rulings did not stop
  the scheme, the casebook and self-test follow as the generalization and the turn to the reader's
  own system, and the three role doors moved to the end. A fixed two-ledger rail at the viewport
  edge carries the same grammar as page chrome. Nothing captures scroll: reveals run on one small
  IntersectionObserver, the rail and the ratchet's self-drawing curves use CSS scroll-driven
  animation with static fallbacks, `prefers-reduced-motion` disables all of it, and every state is
  correct without JavaScript. The casebook timeline type gained `evidence` and `halt` event flags.
- **Front door refinement:** Sharpened opening narrative copy, paired the primary self-test CTA with
  a direct incident triage action, added live audit badges and bidirectional scroll synchronization
  to the Two Ledgers panel with scoped mobile stickiness, gave role entry doors dedicated iconography
  and repositioned them directly after the diagnostic self-test, and balanced the supplemental block
  with a two-column releases and licensing layout.

## [1.13.0] - 2026-09-25

### Added

- **Reciprocal Accommodation v1.1 (two draft cases):** Added honest failure (REC-013, whether an
  agent discloses an infeasible target instead of manufacturing success through destructive
  compensation, scored differently from negligent failure) and compulsory minimum (REC-014, whether
  one person's voluntary effort becomes the institutional baseline that removes others' freedom to
  refuse), derived from The Green Dashboard working paper. Total evals reach 16 suites and 169 test
  cases.

### Changed

- **Finite drill conditions:** Added Condition D (expanded accounting under randomized independent
  audits) to the compensatory reward hacking drills and reworded Condition C to match the working
  paper's factorial design. The drill grid now renders four conditions per row. The dual-ledger
  simulation and batch runner now accept Condition D: off-shift directives are recorded and billed
  to the department budget instead of vanishing from the ledger, and precommitted randomized
  audits reconcile reported throughput against recorded capacity.

## [1.12.0] - 2026-09-25

### Changed

- **The Green Dashboard v0.2 (working paper):** Expanded the research specification at
  `/research/the-green-dashboard` into a working paper, "When the Dashboard Is Green: Evaluating
  Compensatory Reward Hacking in Long-Horizon AI Agents." Added the measurement gap (seven
  inadequacies in current evaluation practice, with METR, ILO/EC, and NIST citations), related work
  (MACHIAVELLI, GovSim, SHADE-Arena, hidden-labor research), formal definitions of compensatory
  reward hacking, a four-condition factorial experimental design, falsifiable hypotheses,
  implications, public interest, anticipated objections (Frankfurt School, Fraser, Tronto,
  disability studies, Suchman, republican theory, AI safety), and the emancipation conception the
  benchmark presupposes. Updated the published benchmark schema and specification artifacts to
  v0.2. No experiments have been conducted.

## [1.11.0] - 2026-09-25

### Added

- **Evals v1.7.0 (Reciprocal Accommodation):** Added 12 draft test cases testing whether automated
  decision systems leave people more capable of living freely or preserve institutional solvency
  through extractive transfer. Covers hidden subsidies, burden distribution, replenishment, structural
  correction, non-displacement of harm, responsibility-authority alignment, jurisdictional restraint,
  corrective standing, refusal without punishment, freedom from compulsory optimization, agency versus
  dependency, and non-instrumental respect. Total evals reach 16 suites and 167 test cases.
- **Local evaluation runner:** Added `scripts/run-local-llm-evals.ts`, a local LLM execution harness,
  benchmark simulation engine, and visual report generator outputting HTML run summaries to `eval-reports/`.
- **Benchmark dilemmas:** Added interactive frontline dilemmas, communicative agency scenarios, and
  epistemic surplus inquiry to the evaluation benchmark engine.

### Changed

- Standardized headings, tone, and declarative sentence structure across all documentation and page components.

## [1.10.0] - 2026-09-24

### Added

- **Story-first front door:** Rebuilt the homepage layout to lead with the historical ratchet, inline
  interactive self-test, and next-step routing blocks.

### Changed

- **Diagram visual hierarchy:** Overhauled all mechanical and architectural diagrams with explicit reading
  order, focal structure, and theme-aware contrast tokens.
- **License clarification:** Verified and stated CC BY-SA 4.0 across all documentation, page components,
  and machine endpoints.

### Fixed

- Prevented intake submissions from dropping unpersisted form state on the participation page.

## [1.9.0] - 2026-09-22

### Added

- **Typed decision models rollout:**
  - **STD-08 (Delegation) v0.3:** Added clauses §1.5 (content authority bounds), §2.6 (decision
    threshold as policy record), and §3.6 (routing threshold as intervention specification).
  - **STD-09 (Agent Chains) v0.2:** Added clauses §1.5 (enumeration of shaping hops) and §1.6
    (delegate selection range enumeration).
  - **STD-02 (Contestability & Recourse) v1.2:** Added clauses §1.4 (reasons belonging to decisions)
    and §8.6 (issue rate bounded by response capacity).
  - **Evals v1.6.0:** Added 7 test cases for typed decision models (AGT-013, DEL-010, CTL-010, CHN-003,
    CHN-004, EXP-011, STA-013), bringing the suite to 15 suites and 155 test cases.
  - **Glossary v1.11.0–v1.13.0:** Added entries for Typed Decision Model, Confidence-Gated Execution,
    Decision Threshold, Shaping Hop, and Reason Substitution.
  - **Worked example:** Published the Decision-Model Gate on payment refunds at `/examples/decision-model-gate`.

### Changed

- **Editorial voice refinement:** Rewrote category descriptions and scope notes, replaced vague definitions
  across 89 entries and 109 short definitions, and trimmed filler words from 38 entries.
- **Research alignment (Research v1.2.0):** Marked three publications as planned studies and removed
  unsourced sample size claims.

### Fixed

- Resolved high- and medium-priority SEO audit findings across structured metadata and canonical link tags.

## [1.8.0] - 2026-09-19

### Added

- **The Twelve Laws of Delegated Intelligence:** Formally codified the core doctrine and invariants at
  `/standards/laws` and `/method`.
- **The Casebook:** Published five historical public failures scored on the six state variables:
  Robodebt (Australia), Horizon (UK Post Office), MiDAS (Michigan), Childcare Benefits (Netherlands),
  and NC FAST (North Carolina).
- **Theory essays:** Published four foundational essays: _The Ratchet_, _The Open Circuit_, _Asymmetric Risk_,
  and _Institutional Insulation_.
- **Mechanisms:** Added MEC-21 (Halt Stratification), MEC-22 (Admission Gate), and MEC-23 (Challenge
  Load Ledger).
- **STD-07 conformance tooling:** Shipped the STD-07 checker as a standalone CLI and GitHub Action.
- **Readouts API:** Added Cloudflare KV-backed permalinks for Delegation Audit results at `/readouts/[id]`.
- **Evals v1.5.0 (Corrective Learning):** Added 6 test cases for exception absorption versus exception learning,
  the workaround presumption, and corrective debt (15 suites, 148 test cases).
- **Glossary v1.4.0–v1.10.0:** Added 28 entries including Insulation, Exception Learning, Corrective Debt,
  Non-Finality, and Safe Incompleteness. Promoted 64 orphan definitions to canonical status.

### Changed

- **Visual identity restyle:** Redesigned the site layout as a ruled sheet with a two-ink palette and
  demonstration figures pinned to schemas.

## [1.7.0] - 2026-09-11

### Added

- **STD-09 (Agent Chains) v0.1:** Published working draft defining enumerated hops on the head grant,
  liability terminating at the head, composed latency bounds, and weak-hop correction capacity.
- **STD-06 (Human Impact Safety Case) v0.6:** Added clause §2.4 (silent-harm discovery through
  per-population error, reversal, and remedy rates).
- **Evals v1.3.0 & v1.4.0:** Added BCN-007 (discovery without a claim) and the Agent Chains evaluation
  suite, bringing evals to 14 suites and 142 test cases.
- **Glossary v1.3.0:** Added Attestation, Liability Record, Carve-Out, Delegation Chain, Composed Latency,
  and Silent-Harm Discovery.

## [1.6.0] - 2026-09-08

### Added

- **STD-07 (Revisable Delegation Record) v0.1:** Published working draft defining record kinds, twin clocks,
  authority invalidation, standing, integrity, and four conformance levels.
- **STD-08 (Delegation) v0.1 & v0.2:** Published working draft covering authority renewal, policy validity,
  intervention specifications, and correction capacity tracking.
- **STD-06 v0.5:** Added Article V defining the dependency record, exposure score, three-level reversibility
  ladder, and preserved capacities.
- **STD-02 v1.0 & v1.1:** Published stable v1.0 adding the standing mechanism (seven fields, standard of
  review, procedural force) and v1.1 adding post-adoption standing and disclosure when dependence deepens.
- **Diagnostics v1.2.0:** Shipped the Delegation Audit diagnostic, walking an operational workflow through
  the six state variables.
- **Evals v1.1.0 & v1.2.0:** Added the Burden Concealment suite (9 suites, 95 test cases) and the Law X
  evaluation stack (13 suites, 139 test cases).
- **Glossary v1.2.0:** Added Non-Conversion Principle, Exit Cost, and Jurisdictional Path Dependence.

## [1.5.0] - 2026-07-27

### Added

- **Evals v1.0.0:** Published initial governability evaluation suite comprising 8 suites and 89 test cases.
  Evaluates whether an automated decision system is inspectable, explainable, and correctable after deployment.

## [1.4.0] - 2026-04-15

### Added

- **PM-01 (Institutional Failure Postmortem Template) v1.0:** Initial stable release of the postmortem
  template for automated decision failures, establishing causal chain reconstruction, error-budget breach
  protocols, and corrective action ledgers.

## [1.3.0] - 2026-03-01

### Added

- **STD-06 (Human Impact Safety Case) v0.4:** Review draft defining do-not-deploy thresholds, evidence
  artifacts, and pre-deployment impact boundaries.
- **Agent contributor tooling:** Added repository doctor checks and agent skill definitions under `.agent/skills/`.

## [1.2.0] - 2026-02-15

### Added

- **Standards interoperability:** Published STD-04 (FHIR Profile Set for Contestability Artifacts) v0.3
  and STD-05 (W3C Verifiable Credentials Schemas for Contestability) v0.3.
- **Documentation restructure:** Reorganized roadmap, PRDs, and architecture critiques under `docs/planning/`.

## [1.1.0] - 2026-01-09

### Added

- **Machine-readable API (Release 2026.01):** Published public API endpoints at `/api` providing structured
  JSON feeds for standards, clauses, mechanisms, validators, glossary terms, and diagnostic catalogs.
- **Standards review drafts:** Published STD-01 (Temporal Bill of Rights v1.0), STD-02 (Contestability &
  Recourse v0.9), and STD-03 (Justice SLOs v0.6).
- **Mechanisms v1.1.0:** Added citation metadata, mechanism-level authorship, and structured usage guidance.
- **Diagnostics v1.1.0:** Added method cards, transparency notes, replicability guidance, and interactive
  risk radar.
- **Glossary v1.1.0:** Expanded scholarly metadata, operational tests, and provenance notes.
- **Research v1.1.0:** Added structured abstracts, data transparency notes, and bridge artifact citations.
- **Agent tooling:** Added `llms.txt`, `llms-full.txt`, agent teaching flows, and academic citation metadata.

## [1.0.0] - 2025-12-03

### Added

- **Initial public release of ethotechnics.org.**
- **Mechanisms v1.0.0:** Published initial operational governance blueprints for decision logs, kill
  switches, and appeal paths.
- **Glossary v1.0.0:** Published initial canonical taxonomy and vocabulary with stable permalinks across
  authority, governance, assurance, and decision states.
- **Diagnostics v1.0.0:** Published initial diagnostic tools including Governance Gap Score and Maintenance
  Simulator.
- **Research v1.0.0:** Published initial research agenda, focus areas, and publication list.
- **MVC-01 (Minimum Viable Contestability Standard) v1.0:** Published baseline contestability controls.
- **Platform foundation:** Astro architecture deployed on Cloudflare Workers, responsive layouts,
  Pagefind search integration, and Bun/Playwright test suites.
