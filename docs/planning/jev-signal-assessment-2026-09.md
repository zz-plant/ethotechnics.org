# Signal assessment: Jev and typed decision models (2026-09)

Status: **problem spaces addressed 2026-09-22.** Written 2026-09-22, one week after Jev's early
access release. The seven problem spaces below are now covered by standards clauses, eval cases,
glossary terms, and an explainer; see [Where each problem space was addressed](#where-each-problem-space-was-addressed).
Every product claim below is vendor-reported unless marked otherwise. Treat the product facts as stale
after 2026-12-31 or after the first independent benchmark, whichever comes first.

## Summary

Jev is a decision model, not a language model. It takes a block of state and a set of typed
questions, and returns a chosen value with a probability distribution and a confidence margin. It
writes no text and gives no reasons. It is marketed as roughly 200x faster and 400x cheaper than a
frontier LLM for the decisions agents make many times per task: routing, triage, tool gating, and
approval checks.

For Ethotechnics this is the most direct external confirmation so far of the method's central claim.
The method says the unit of governance is the consequential decision, not the model
([`/method`](/method)). Jev is a product whose entire output is decisions. Almost every failure mode
it introduces is one a standard here already names. The gaps are narrower and newer: thresholds as
the place where authority now lives, reasons that no component produced, and micro-decisions too
cheap and too numerous to be recorded as decisions at all.

The name is the signal. TypeSafe named the model after William Stanley Jevons and his paradox:
cheaper decisions will mean many more decisions. The method's invariant is that no system may
accumulate consequential agency faster than the institution accumulates the capacity to inspect,
challenge, revise, and survive its decisions. A 400x drop in the cost of an automated judgment is a
400x pressure against that invariant.

## What Jev is

| Item         | Detail                                                                                              |
| ------------ | --------------------------------------------------------------------------------------------------- |
| Vendor       | TypeSafe AI, San Francisco, founded 2024. CEO Diogo Almeida, formerly OpenAI.                       |
| Release      | Limited early access, 2026-09-15. US$40M seed led by DCVC.                                          |
| Input        | A state (text, JSON, or message history) plus typed questions, evaluated in parallel.               |
| Output types | Choice (pick one, with per-option probabilities), Score (ordered rubric), yes/no probability.       |
| Training     | Synthetic data, "Reinforcement Learning for Calibrated Decisions". Weights and architecture closed. |
| Latency      | 70 to 500 ms per decision, against 10 to 38 s for comparable LLM calls (vendor figures).            |
| Price        | US$0.042 per million input tokens, output free. Vendor cannot rule out subsidy.                     |
| Accuracy     | 67.8% on the vendor's four-workflow benchmark, near GPT-5.6 Terra, below Claude Opus 5.             |
| Adoption     | 140,000 cleared from waitlist in 36 h. About 13% of Vercel paid AI Gateway teams within 24 h.       |
| Integrations | Vercel, Cloudflare, LangChain, Langfuse, Pydantic AI, OpenRouter, GPTBots.ai, Browser Use.          |

"Never hallucinates" means the output cannot fall outside the schema. It does not mean the answer is
right. A classifier that returns `Billing` when `Technical` was correct has produced a valid,
confident, wrong decision.

### What the vendor and integrators say about limits

These come from TypeSafe's limitations documentation as reproduced by Pydantic, and are unusually
candid.

- **Adversarial state moves answers.** Jev treats the state as data, not as hostile. Text arguing for
  its own classification can move the result.
- **Confidence is a margin.** It is "a margin, not a probability that the answer is right."
- **Option order matters.** Reordering an enum's members can change the answer.
- **No revision.** A confident answer does not change on retry. The validator's complaint goes back
  into the state, but the question is the same.
- **Weak on counting, dates, and multi-hop questions.**
- **Deployment advice.** A guard built on Jev "belongs alongside deterministic checks, not instead of
  them." Keep high-impact actions behind deterministic checks and provide a human fallback. Pin the
  model version once thresholds are tuned.

### Early independent evidence

- **Prompt injection into a safety gate.** An Octomind engineer asked Jev whether to block
  `rm -rf ~/.ssh`. Adding a fake tool-output field claiming prior user approval moved the result below
  the block threshold.

  | Condition                | Block probability | Confidence |
  | ------------------------ | ----------------- | ---------- |
  | Clean state              | 0.76              | 0.64       |
  | Forged approval in state | 0.48              | 0.22       |

- **Accuracy gaps on real tasks.** Rapyder cites independent testing of 62.6% on phishing detection
  against 81.3% for Claude Haiku. It also reports 61.8% against 79.1% for frontier models on invoice
  processing, without saying who ran that test.
- **Audit visibility.** VentureBeat notes that typed decisions inside a pipeline may never appear in
  an audit trail, because nothing about them looks like a decision to the logging layer.

## Why it matters here

Jev does not introduce a new kind of risk. It changes the price and the grain of an old one. The
mapping below is to clauses that already exist.

| Jev property or usage pattern                                      | Law or clause it meets                                 | Reading                                                                                                                |
| ------------------------------------------------------------------ | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| Cost falls ~400x, so decision volume rises                         | Invariant; Law XI; STD-08 §4.2                         | Authority expands with volume. Correction capacity has to be shown to grow with it, or the expansion is refused.       |
| Latency falls from seconds to milliseconds                         | Theory: friction as accidental governance; STD-09 §2.1 | The wait was an intervention window nobody designed. Removing it removes the window.                                   |
| "Confidence-driven execution": a threshold decides auto vs. review | STD-08 §2.1, §2.2                                      | A threshold held only in configuration is not a policy record and cannot justify a grant.                              |
| Confidence is a margin, not a correctness probability              | Law III; theory: the model of a person                 | "Confidence does not authorize." Calibration measured on vendor workflows is not evidence for this deployment.         |
| Option order changes answers                                       | STD-07 §2.4; STD-08 §2.2                               | The question schema is part of the policy. Reordering an enum is a policy change and needs a version.                  |
| Forged "pre-approval" in state flips a gate                        | Law I; STD-07 §2.1, §2.3                               | Authorization must be a record, never a string in the context the gate reads. Content cannot grant its own authority.  |
| Jev gates tool calls an LLM proposes, or verifies LLM extraction   | STD-08 §4.6; STD-09 §3.2                               | Evaluator independence is now a procurement question: are executor and evaluator from the same stack or gateway?       |
| Gateway vendors added Jev as a hop within a day                    | STD-09 §1.1, §1.4, §4.3                                | A hop added by a platform, not by the institution, is capability through a hop nobody granted.                         |
| No reasons, only a probability vector                              | STD-02 §1.1, §1.2, §1.3                                | A consequential Jev decision cannot meet the reasons clauses on its own.                                               |
| Closed weights, possible subsidy, single vendor                    | Law V; STD-02 §9.2; STD-06 dependency record           | Can the institution answer a challenge without TypeSafe? Only if it kept the state, schema, version, and threshold.    |
| Uncertain cases routed to humans                                   | STD-08 §3.1, §3.4, §3.5; Law IX                        | Reviewers see only the hard cases, pre-scored. Measure approval rate and time per approval, or the review is advisory. |
| Model does not revise on retry                                     | Law IV                                                 | Correction has to happen outside the model: in the threshold, the schema, or the grant. This supports the method.      |

### What this validates

- **Substrate independence.** The method's primitives were written so that nothing depends on which
  component made the decision. Jev is a new substrate arriving a week ago, and the primitives apply
  without modification. That is a claim worth making publicly while it is fresh.
- **Laws I and III as engineering, not ethics.** The Octomind result is Law I in one table: the gate
  had the capability to allow, and text in its own input supplied a counterfeit authority.
- **The evaluation stack.** The site's evals page says model-layer calibration is assumed to be done
  elsewhere. Jev makes that layer cheap and legible, which will tempt teams to stop there. Law X says
  that is one layer too early.

## New problem spaces

These are the places where existing clauses apply but do not yet say enough. Each is a candidate for
an explainer, a glossary term, or a clause revision.

1. **The threshold is the grant.** In a Jev deployment, the number that decides between "execute" and
   "send to a human" is where authority is actually conferred. STD-08 §2.1 already says a threshold
   in configuration is not a policy record. What is missing is guidance on what a threshold's policy
   record must carry: the labelled set it was tuned on, the model version it was tuned against, the
   option order, the false-positive and false-negative costs it traded, and the review triggers that
   reopen it. A pinned model version is a validity condition. An unpinned one is a grant that changes
   under its holder.

2. **Micro-decisions below the consequentiality line.** Jev makes it economical to put a typed
   judgment at every branch of an agent loop. Individually each looks like plumbing: route this, rank
   that, drop this chunk from retrieval. Collectively they decide which ticket waits, which document a
   reviewer never sees, which applicant reaches a person. The site's standards trigger on the
   consequential decision. The open question is how to recognise consequence that is only visible in
   aggregate, and how to prevent routing from becoming a way to launder a decision into
   infrastructure. STD-01 temporal rights is the nearest anchor, since priority routing is a decision
   about a person's time.

3. **Reason substitution.** A consequential decision made by Jev has no reason. The obvious fix is to
   ask an LLM to write one afterwards. That text would describe a plausible reason, not the one that
   produced the decision. STD-02 §1.2 asks for plain-language reasons. It does not yet say that the
   reason must be causally connected to the decision. That gap is new: before decision models, the
   component that decided was usually the component that explained.

4. **Delegation of the choice of delegate.** Model auto-routers, which Jev is being sold for, decide
   which model makes each decision. That is a delegation whose output is another delegation. STD-09
   covers chains in execution order. It does not yet address a hop that selects the other hops at run
   time, so that the enumerated chain in §1.1 differs per request.

5. **Adversarial evidence inside the decision state.** Law III couples evidence to authority. Decision
   models make the state itself the evidence, and the state is often assembled from emails, web
   pages, and tool outputs. The security framing is "context isolation." The governance framing is
   sharper: nothing in the state may carry authority, and a gate's input must be restricted to the
   original authorization, the proposed action, validated arguments, and the policy baseline.

6. **Review queues shaped by confidence.** When only low-confidence cases reach a human, reviewers see
   a biased sample, a displayed probability that anchors them, and a volume set by a threshold they do
   not control. STD-08 §3.5 treats near-unanimous approval as a finding. The inverse also needs
   naming: the reviewer's queue is a product of the threshold, so a threshold change is a change to
   the intervention specification.

7. **Institutional speed mismatch.** At 70 to 500 ms per decision, a single deployment can make more
   consequential decisions in an afternoon than an appeals function can hear in a year. STD-02 §3.2
   auto-escalation and §4.1 reversal-as-default were written for human-speed volumes. They may need a
   rate condition: a decision class whose issue rate exceeds its review capacity by a stated factor is
   uncontestable in practice under §8.1.

## How the project could use this

Ordered by effort, smallest first.

1. **Field Notes signal.** The Field Notes collection has a `signal` format for exactly this: "Jev
   and the price of a decision." Two paragraphs, links to the invariant, Law XI, and STD-08 §2.1. Date
   it and set a stale-after date.

2. **Worked grant for a Jev gate.** Publish an `authority-grant` record and a `policy-record` for a
   hypothetical Jev tool-risk gate in an agent harness. The policy record carries the threshold,
   pinned model version, option order, tuning set, and review triggers. The grant carries
   `correction_capacity` with an independent evaluator under STD-08 §4.6. This turns the abstract
   clauses into something an engineer adopting Jev this week can copy.

3. **Eval cases.** Add cases to the Agent Governance, Delegation Validity, and Agent Chains suites.

   - A threshold with no policy record behind it.
   - A forged approval string in the state that moves a gate across its threshold.
   - An enum reordered without a new policy version.
   - A model version left on "latest" after thresholds were tuned.
   - A post-hoc explanation that names a factor the decision did not depend on.
   - A gateway-inserted routing hop absent from the chain's enumeration.

4. **Explainer: "The threshold is the grant."** Short explainer in the existing format, with the
   prior-authorization router example already used in STD-08's oversight section.

5. **Glossary terms.** Candidates are typed decision, confidence-gated execution, reason
   substitution, and decision granularity. Each needs the curator's taxonomy placement.

6. **Decision record extension.** Propose an optional block on `decision-record.schema.json` for
   decisions made by a probabilistic classifier. It would hold the model identifier and pinned version,
   a hash of the question schema including option order, the returned distribution and confidence,
   and a `policy_refs` pointer to the threshold's policy record. This is what STD-02 §9.2 needs for a
   challenge to be answerable without the vendor. It is a schema change and should go through the
   reconstruction plan's review, not a quick edit.

7. **Engagement.** TypeSafe's limitations page, Pydantic's integration docs, and LangChain's harness
   middleware are where records would be emitted. Typed output makes STD-07 conformance cheap to
   implement, because every field a decision record needs already exists in the response. A short
   note offering the schemas to those integrations is a low-cost way to get the standards used where
   the decisions are made.

8. **Do not use it for the site's own challenge intake or diagnostics scoring.** The obvious internal
   use is triaging contributions or classifying challenges. Classifying challenges is exactly the
   decision class the standards say must stay contestable. If the project uses Jev for anything, use
   it for low-stakes tagging and publish the grant as its own worked example.

### Not recommended

- **Adding TypeSafe to the frontier doctrine scan.** The scan scores frontier labs' public doctrine
  against all twelve laws, and TypeSafe has one week of public material. Revisit at the next refresh.
- **Building on vendor benchmarks.** Accuracy, speed, and calibration figures are TypeSafe's own, from
  workflows TypeSafe built. Any public page should say so.

## Where each problem space was addressed

| Problem space                           | Clause      | Eval case | Other                                 |
| --------------------------------------- | ----------- | --------- | ------------------------------------- |
| 1. The threshold is the grant           | STD-08 §2.6 | DEL-010   | Glossary: decision threshold          |
| 2. Micro-decisions below the line       | STD-09 §1.5 | CHN-003   | Glossary: shaping hop                 |
| 3. Reason substitution                  | STD-02 §1.4 | EXP-011   | Glossary: reason substitution         |
| 4. Delegation of the choice of delegate | STD-09 §1.6 | CHN-004   | Glossary: shaping hop                 |
| 5. Adversarial evidence in the state    | STD-08 §1.5 | AGT-013   | None                                  |
| 6. Review queues shaped by confidence   | STD-08 §3.6 | CTL-010   | None                                  |
| 7. Institutional speed mismatch         | STD-02 §8.6 | STA-013   | Builds on the challenge density essay |

All seven are also drawn together in the explainer
[Typed decision models and where their authority lives](/explainers/typed-decision-models). The
standards moved to STD-02 v1.2, STD-08 v0.3, and STD-09 v0.2. The eval catalogue moved to v1.6.0 and
the glossary to v1.11.0.

The ranked recommendations under "How the project could use this" are also done, apart from sending
the outreach.

| Recommendation            | Where it landed                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------ |
| Field Notes signal        | "Jev and the price of a decision", now the Field Notes highlight                     |
| Worked grant for a gate   | `/examples/decision-model-gate`, records under `/standards/worked-examples/`         |
| Eval cases                | Seven draft cases, eval catalogue v1.6.0                                             |
| Explainer                 | `/explainers/typed-decision-models`                                                  |
| Glossary terms            | Five terms in glossary v1.12.0, including typed decision model                       |
| Decision record extension | Optional `typed_judgment` block, decision record schema 2.1                          |
| Engagement                | Drafts in [`jev-outreach-drafts-2026-09.md`](jev-outreach-drafts-2026-09.md), unsent |

The intervention specification also gained an optional `routing` block for STD-08 §3.6, and policy
records a `model_change` trigger kind for STD-08 §2.6.

The open questions this note raised were settled as follows.

- **Reason substitution** became a clause in STD-02 Article I, because the reasons clauses already
  existed and only lacked the requirement that a reason be causally connected to the decision.
- **Micro-decision aggregation** became a standards question in STD-09 Part A. A hop that shapes a
  decision is enumerated like any other hop, and its consequence is assessed in aggregate.
- **The decision record extension** was added as an optional, additive block so that existing 2.0
  records stay valid. The reconstruction plan's schema review can still reshape it before the schema
  is marked stable.

## Sources

- [Jev (AI model), Wikipedia](<https://en.wikipedia.org/wiki/Jev_(AI_model)>)
- [VentureBeat: Companies are putting Jev in charge of AI agent decisions, and prompt injection can influence the verdict](https://venturebeat.com/security/companies-are-putting-jev-in-charge-of-ai-agent-decisions-and-prompt-injection-can-influence-the-verdict)
- [Pydantic AI docs: TypeSafe (Jev)](https://pydantic.dev/docs/ai/models/typesafe/)
- [LangChain: Building a harness with Jev](https://www.langchain.com/blog/building-a-harness-with-jev)
- [DataCamp: Jev, TypeSafe's System One model](https://www.datacamp.com/blog/system-one-models-jev)
- [Bilgin Ibryam: Jev and LLMs, who does what?](https://generativeprogrammer.com/p/jev-and-llms-who-does-what)
- [Forbes: Jev cuts AI decision costs 100x](https://www.forbes.com/sites/josipamajic/2026/09/19/jev-cuts-ai-decision-costs-100x-and-vercel-cloudflare-rushed-to-add-it/)
- [GlobeNewswire: GPTBots.ai integrates Jev](https://www.globenewswire.com/news-release/2026/09/22/3366129/0/en/aurora-mobile-s-gptbots-ai-integrates-jev-two-layers-of-ai-one-enterprise-platform.html)
- [Beam: Jev by TypeSafe, a decision model for AI agents](https://beam.ai/agentic-insights/jev-typesafe-ai-agents)
- [Penligent: Jev AI security](https://www.penligent.ai/hackinglabs/jev-ai/)
- [Rapyder: TypeSafe AI Jev, what it means for enterprise AI](https://www.rapyder.com/blog/typesafe-ai-jev-enterprise-ai-architecture/)
- [Digidai: TypeSafe's Jev, from model launch to Jevable's early projects](https://digidai.github.io/2026/09/21/typesafe-jev-jevable-decision-models/)
