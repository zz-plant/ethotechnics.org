# Outreach drafts: typed decision models (2026-09)

Status: **drafts, not sent.** Each one goes to an outside project, so a maintainer decides whether and
where to send it. They follow from the
[Jev signal assessment](jev-signal-assessment-2026-09.md) and point at material now on the site.

What every draft offers is the same. Typed output already contains every field a decision record
needs, so emitting a governable record costs an integration almost nothing. The site publishes the
schema, a validated worked example, and a field mapping.

- Schema: `https://ethotechnics.org/standards/decision-record.schema.json`, `typed_judgment` block
  (version 2.1)
- Worked example and field mapping: `https://ethotechnics.org/examples/decision-model-gate`
- Explainer: `https://ethotechnics.org/explainers/typed-decision-models`

## 1. Pydantic AI: issue on the TypeSafe model integration

**Where:** a GitHub issue on `pydantic/pydantic-ai`, as a feature proposal.

**Title:** Optional decision-record export for TypeSafeModel results

> The TypeSafe integration already exposes everything an auditor needs to reconstruct a decision:
> the typed answer, `provider_details['probabilities']`, and the per-field `confidence` margin. Your
> documentation is also clear about the limits. Confidence is a margin, option order can move the
> answer, and a guard belongs alongside deterministic checks.
>
> We maintain an open decision-record schema (CC BY-SA) for governing automated decisions. Its
> `typed_judgment` block records the pinned model version, a hash of the output type including
> option order, the answer, the distribution, the confidence with its semantics, and the threshold
> policy that acted on it.
>
> Proposal: an opt-in helper that turns a TypeSafeModel run result into that block. It is a pure
> function over data the result already carries, with no new dependency. It would give users a
> record that answers "which model version decided this, and against which threshold?" long after
> the run.
>
> A field mapping and a validated example are at https://ethotechnics.org/examples/decision-model-gate.
> Happy to open the PR if this is welcome.

## 2. LangChain: discussion on the harness middleware

**Where:** a GitHub discussion on the LangChain repository, or a comment on the "Building a harness
with Jev" post.

**Title:** Keeping tool-risk gates from reading authorization out of content

> The `AutoModeMiddleware` pattern of classifying tool-call risk before execution is a good use of a
> typed decision model. One failure mode has been demonstrated publicly: a fake tool-output field
> claiming prior user approval moved a gate's block probability below its threshold.
>
> Two small defaults would close most of that gap.
>
> 1. Pass the gate the proposed action, the user's original request, and the policy as separate
>    inputs. Pass retrieved documents and tool outputs only as marked content.
> 2. Emit a decision record per gate verdict, with the model version pinned and the threshold
>    recorded, so a verdict can be audited and a threshold can be re-tuned after a model upgrade.
>
> The first is the rule in STD-08 §1.5 of the Ethotechnics standards: authority is read from
> authorization records, never from content. A field mapping for the record is at
> https://ethotechnics.org/examples/decision-model-gate.

## 3. TypeSafe AI: note to the team

**Where:** the contact address on TypeSafe's site, or its developer community channel.

**Subject:** Your limitations page, and a record format that fits Jev's output

> Your limitations documentation is unusually candid. It covers adversarial steering, confidence as
> a margin, option-order sensitivity, and the advice to keep high-impact actions behind
> deterministic checks. We cite it as a model of how a vendor should describe a decision component.
>
> We maintain open standards for governing delegated decisions. Jev's typed output maps onto our
> decision record almost field for field, and we have published the mapping with a validated
> worked example. Two things would make Jev deployments much easier to govern at scale.
>
> - A stable, pinnable model version identifier on every response, so thresholds can be tied to
>   the version they were tuned against.
> - A documented canonical form of the question schema, so a hash of it, including option order,
>   is the same across client libraries.
>
> The mapping and example are at https://ethotechnics.org/examples/decision-model-gate. We would
> welcome corrections if any field is described wrongly.

## Before sending

- Confirm each claim about the vendor's or library's behaviour against its current documentation,
  since all three are changing weekly.
- Send from a maintainer's account and add the Ethotechnics contact address.
- Record where each draft was sent and link any reply in the Jev signal assessment.
