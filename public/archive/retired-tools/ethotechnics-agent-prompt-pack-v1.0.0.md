# Ethotechnics agent prompt pack v1.0.0

Use this pack to run consistent onboarding, decision reviews, conflict resolution, and diagnostics
sessions.

- **Invocation name:** `ethotechnics-agent-prompt-pack-v1.0.0`
- **Version:** v1.0.0
- **Filename:** `ethotechnics-agent-prompt-pack-v1.0.0.md`

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
