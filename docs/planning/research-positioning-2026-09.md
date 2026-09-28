# Research positioning and contribution plan

Status: proposed, September 27, 2026. This is a plan, not authorization to rewrite or retire
public pages. Preserve existing work, public URLs, versioned specifications, and cited artifacts.

## Decision

Present Ethotechnics as a research and design project investigating institutional correction
and delegated authority. Its contribution must be assessed through particular arguments,
studies, and implementations. Do not make a claim to a new discipline the prerequisite for
using its work.

Proposed purpose copy:

> Ethotechnics studies how institutions detect and correct failures in delegated decision-making,
> and what authority affected people have to challenge those arrangements. We draw on existing
> research to develop explicit hypotheses, experimental evaluations, and proposed specifications.

Compensated institutional performance is one research strand. Healthcare is one possible
experimental setting. Neither exhausts questions of authority, standing, exclusion, privacy,
legitimate purposes, or reversibility.

The premise is substantial overlap with established research, not that every question has
already been answered. A focused literature comparison is required before claiming a gap.
Integration, replication, implementation, and useful negative results can be contributions;
none requires claiming discovery of the underlying problem.

## Findings from the current site

- `src/content/method.ts` calls Ethotechnics an engineering discipline and contrasts ethics with
  mechanisms that make values reliably happen. This implies both a disciplinary distinction
  and demonstrated effectiveness beyond what the proposed work establishes.
- `src/content/theory/what-ethotechnics-is-not.mdx` and `an-engineering-tradition.mdx` already
  credit predecessor traditions. Attribution must reach the claims readers encounter first.
- `src/content/theory/absorption-as-concealment.mdx` contains universal claims about absorbed
  failures and invisibility. Correction can also be recorded and produce organizational learning.
- `src/pages/index.astro` foregrounds standards, scored cases, and a 60-second self-test.
  Readers need to distinguish research interpretation, self-report, and mechanical validation.
- `src/content/navigation.ts` foregrounds Method, Standards, Mechanisms, Diagnostics, and
  Casebook. Research is not a primary entry despite the proposed research identity.
- The Green Dashboard page explicitly states that experiments have not been run and separates
  normative commitments from empirical theory. Preserve those disclosures and make them easier
  to find. Do not relabel the proposal as an established benchmark.

## Pass 1: establish contribution and evidence boundaries

Create an editorial inventory of consequential claims before rewriting them. For each, record:
canonical source, public consumers, claim type, closest prior work, specific difference,
evidence available, counterexample, and disposition. Use a planning table first; avoid adding
public metadata machinery before its editorial value is established.

Use these distinctions consistently:

| Claim type             | What the page must establish                                           |
| ---------------------- | ---------------------------------------------------------------------- |
| Established finding    | Precise source, population/context, and limits of inference            |
| Synthesis              | Which existing ideas are combined and what work the combination does   |
| Normative proposal     | Premises, justification, objections, and limits                        |
| Empirical hypothesis   | Conditions, causal mechanism, alternatives, and disconfirming evidence |
| Proposed specification | Authorship, status, intended scope, and properties it specifies        |
| Tested artifact/result | Version, method, actual execution, results, and what remains untested  |

Do not apply a single maturity score to all these categories. A defended normative argument
and an executed experiment are different contributions.

Review closest prior work across resilience engineering, human factors and sociotechnical
systems, administrative burden, organizational learning, care and social reproduction,
non-domination, participatory governance, and AI governance/evaluation. Compare specific works
and mechanisms, not entire disciplines caricatured as lacking implementation or political concern.

Starting sources verified during planning:

- [Resilience Engineering Association: approach](https://www.resilience-engineering-association.org/about-rea/)
  describes adaptation, finite resources, and organizational adjustment.
- [Herd and Moynihan research program](https://www.russellsage.org/research/grants/administrative-burdens-social-policy)
  identifies learning, psychological, and compliance costs.
- [NIST AI RMF Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)
  includes organizational practices and sociotechnical implications.
- [NIST AI RMF Playbook](https://airc.nist.gov/airmf-resources/playbook/)
  already offers implementation actions. Do not claim that existing governance stops at principles.

These are starting anchors, not an exhaustive novelty review. Expand to original scholarship
before publishing comparisons with the other traditions.

Acceptance: every prominent novelty, effectiveness, and comparative claim has evidence or is
rewritten as a bounded proposal. Credit appears next to the claim, not only on a lineage page.

## Pass 2: correct the public front door

Edit canonical homepage copy and its home components, method content, institute/about pages,
navigation, footer, role entry pages, and machine-reading summaries together.

Recommended homepage order:

1. The bounded research question and current project status.
2. One documented case, separating source findings from Ethotechnics' interpretation.
3. What existing research explains, with direct references.
4. The particular questions being investigated and competing explanations.
5. Available work: working papers, proposed studies, specifications, and implemented tools,
   each with its actual evidence status.
6. Routes for researchers, practitioners, and affected people.

Preserve the concrete case-based introduction where useful. Qualify a self-test as a self-report
orientation, not evidence that a deployment is safe or institutionally accountable.

Suggested primary navigation: Research, Cases, Specifications, Tools, About. Link the method
and mechanisms from the relevant hubs. Keep existing paths during the first pass, including
`/standards`; a label correction does not require a URL migration.

Replace claims that Ethotechnics itself enforces institutional behavior with the precise action
of the artifact: specifies, records, checks, prompts, or proposes. Preserve actual executable
checks and describe their bounded guarantees.

Acceptance: a first-time reader can identify the project question, intellectual dependencies,
what has been built, what has been tested, and what is still proposed without reading an essay.

## Pass 3: revise theory and comparative claims

Start with the method, laws, absorption essay, discipline/boundary essays, and standards
comparison pages. Do not rewrite the entire corpus at once.

- Present the twelve laws as proposed design principles or normative commitments where that
  is their logical status. Preserve identifiers and anchors; distinguish empirical propositions.
- Replace universal absorption claims with conditional mechanisms. Include cases in which
  adaptation is recorded, supported, and produces learning.
- Distinguish useful discretion, legitimate emergency effort, recurring supported adaptation,
  and coerced or concealed compensation. Do not equate all human contribution with system failure.
- Define the boundary behind “intrinsic performance.” Institutions inherently depend on people;
  the relevant contrast is acknowledged, resourced, contestable contribution versus disowned
  or unjustifiably imposed contribution. Rename only after checking the term's full use.
- Separate evidence of dependency from an argument that the dependency is unjustified.
- Require explanations for why correction fails even when the institution knows: incentives,
  authority, resource constraints, conflict, retaliation, and competing legitimate obligations.
- Replace framework-wide claims of superiority with feature-level comparisons, citing the
  comparator's actual requirements and implementation guidance.

Acceptance: each core mechanism has boundary conditions, an alternative explanation, and a
stated implication of contrary evidence. No automatic inference runs from burden to injustice,
or from technical conformance to legitimacy.

## Pass 4: concentrate the research program

Use the Research hub for three connected but independently assessable questions:

1. Empirical: when does adaptation conceal deficiencies or facilitate learning?
2. Normative: when are continuing demands for adaptation justified?
3. Institutional: which arrangements enable correction without additional domination or surveillance?

For the Green Dashboard, publish a compact study overview ahead of the long working paper:
question, prior work, proposed incremental contribution, assumptions, hypotheses, baselines,
interventions, outcomes, falsifiers, execution status, limitations, and next deliverable.

Require before presenting results:

- A reproducible protocol and implementation with fixed versions and recorded seeds.
- Baselines that can explain outcomes without the project's preferred theory.
- Scenarios where adaptation is beneficial and where disclosure leads to learning.
- Separate material outcomes and political outcomes; do not collapse them into one score.
- Tests for reporting burden, surveillance, retaliation, burden displacement, and denied refusal.
- Sensitivity analysis of worker behavior, recovery, visibility, and institutional response.
- A distinction between effects implied by simulator rules and behavior learned by the agent.
- Explicit limits on generalizing from simulated hospitals to real institutions or other domains.

The next milestone is a protocol and minimal executable study, not more glossary entries.
A result showing that established explanations suffice is publishable if the method supports it.

## Pass 5: reduce duplication while preserving useful artifacts

Audit glossary, mechanisms, eval suites, case scores, and specifications against concrete use.

- Keep terms with a necessary technical distinction; otherwise use established terminology and
  retain aliases for existing links. More vocabulary is not evidence of a contribution.
- Label case scores as project-authored interpretations. Court or regulator findings do not
  establish the validity of Ethotechnics' scoring framework.
- Keep working mechanical validators. State exactly what they check and cannot infer.
- Describe unpublished specifications as project proposals; preserve historical versions and
  state external adoption or review only when documented.
- Merge duplicated explanatory pages before building additional hubs. Archive only after
  checking inbound links and whether the artifact has independent users.

Acceptance: each retained artifact answers a named question for a named reader and has a
clear relationship to the research program or a separately useful implementation task.

## Implementation boundaries and verification

Implement each pass as a reviewable change. Start with claims and positioning, then navigation,
then the research overview; defer broad route and data-model changes until the inventory supports them.

Primary source areas:

- `src/pages/index.astro`, `src/components/home/`, `src/content/method.ts`
- `src/content/navigation.ts`, `src/content/site-footer.ts`, `src/pages/institute/`
- `src/content/theory/`, `src/pages/standards/`, `src/content/standards.ts`
- `src/pages/research/`, `src/content/research.ts`, `src/data/green-dashboard-benchmark.json`
- `src/content/casebook.ts`, canonical glossary/library/taxonomy JSON, `src/content/evals.ts`
- `public/llms.txt`, `public/llms-full.txt`, API/RAG exports, structured metadata, docs

Verify actual generators and consumers before editing. Regenerate derived wrappers and reports;
never manually patch generated files. Preserve IDs, anchors, citations, and redirects until their
replacement is verified. Keep research status consistent in public copy, APIs, and machine summaries.

For implemented mixed changes, run repository content checks, lint, typecheck, Astro checks,
unit tests, build, served reachability and sitemap checks, and relevant redirect checks. Inspect
primary hubs and shared navigation on desktop/mobile. Do not deploy as part of this plan.

This planning change only adds this document and its index link. Existing dirty research-page
work is preserved. Formatting and diff checks suffice for the plan; runtime validation belongs
to implementation.
