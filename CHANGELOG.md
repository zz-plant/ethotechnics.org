# Changelog

All notable changes to ethotechnics.org are documented in this file.

The project publishes proposed standards, mechanisms, diagnostics, evaluations, and a glossary
for the operational governance of delegated decision systems.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
