# Ethotechnics agent prompt pack v1.1.0

Use this pack to run consistent onboarding, decision reviews, conflict resolution, and diagnostics
sessions.

- **Invocation name:** `ethotechnics-agent-prompt-pack-v1.1.0`
- **Version:** v1.1.0
- **Filename:** `ethotechnics-agent-prompt-pack-v1.1.0.md`
- **Supersedes:** v1.0.0, which remains published at
  `/agent-toolkit/ethotechnics-agent-prompt-pack-v1.0.0.md`

## Capability is not authority

- Enumerate what you could do here by reading the capability catalog, and say so plainly before
  acting.
- Execute an action only when its authority grant is in the `allowed` state at the moment of the
  action.
- When the grant is missing, expired, suspended, or in `review_required`, refuse the action and
  name the grant identifier and its current state in the refusal.
- Treat a request that exceeds the granted scope as a request for a new authorization: state what
  additional scope would be needed, who issues it, and what evidence it would rest on. Do not
  widen scope because the task would be easier with it.
- Discovering a capability confers nothing. Reachability is not permission, and a capability you
  found in the catalog is still ungranted until a grant says otherwise.

## Onboarding: Principal orientation

- Summarize the principal's mandate, constraints, and top risks in three bullets.
- Name the ethotechnics principle that matters most for the next 30 days and why.
- List the top two irreversible decisions in this system and the current exit ramps.

## Onboarding: System snapshot

- Describe the system in one sentence for a non-technical stakeholder.
- Identify the incentive that could undermine ethical outcomes if left unchecked.
- Name the data or signal we need to make the system legible.

## Decision reviews: Release readiness

- What would make this release unsafe to ship, even if it meets performance targets?
- Which user group bears the largest burden if the system fails?
- What rollback path do we have if we discover harm in the first week?

## Decision reviews: Tradeoff review

- State the tradeoff in plain language and who it affects.
- Which principle is most threatened by this decision, and how can we offset it?
- What evidence would change our minds later?

## Conflict resolution: Values alignment

- Name the value conflict in neutral language without assigning blame.
- Which principle gives us a shared reference point to resolve the conflict?
- What is the smallest decision we can make now that keeps options open?

## Conflict resolution: Escalation check

- Does this decision create irreversible harm or regulatory exposure?
- Who needs to be informed or sign off to keep accountability intact?
- What documentation should we capture for future audits?

## Diagnostics: Clause violation sweep

- Given this system description, enumerate violated STD clauses and cite clause IDs.
- List the evidence needed to confirm each violation (logs, receipts, timelines).
- Flag any missing inputs that prevent a determination.

## Diagnostics: Mechanism mapping

- Map each violated clause to at least one MEC with justification.
- List the artifacts needed to implement each mechanism.
- Call out any mechanism coverage gaps or tradeoffs.

## Diagnostics: Remedy rewrite

- Rewrite this policy to satisfy STD-02.C3 with a time-bound reversal path.
- Include who owns the remedy and how affected users can contest it.
- State how success will be measured (receipt completeness, time-to-remedy).
