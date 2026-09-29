# Compensatory work protocol

Status: proposed, September 29, 2026. This is a plan for instruments and a study design. It is not
a finding, and it does not change any public page. The ledger schema and both tests are drafted
as code (see [Implementation](#implementation)); no study has been run. It follows the framing in
[`research-positioning-2026-09.md`](research-positioning-2026-09.md): hypotheses and tests, not a
claim of discovery.

## Research question

Under what conditions can institutions reduce recurring, unwanted compensatory work while
preserving performance, professional discretion, and the capacity to respond to unexpected
demands?

Four linked questions organize the work:

1. **Dependence.** How much routine performance depends on work missing from the institution's
   formal account of its operations?
2. **Distribution.** Who performs that work, who receives its benefits, and where do its costs
   fall?
3. **Authority.** How does workers' influence over institutional decisions affect which
   deficiencies get corrected?
4. **Redesign.** Which interventions remove recurring demands, and which make them easier to
   accommodate?

## What exists and what is missing

| Question     | Existing coverage                                                                                                                                                          | Gap                                                                                          |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Dependence   | [Corrective capacity self-assessment](/diagnostics/corrective-debt-calculator); glossary terms `compensated-performance`, `exception-absorption`, `workaround-presumption` | The self-assessment scores five self-reported answers. It records no individual workarounds. |
| Distribution | [Burden Modeler](/diagnostics/burden-modeler) scores load by driver, and the burden-transfer essays make the argument                                                      | No instrument records who performs, benefits, and bears the cost of one item of work.        |
| Authority    | Standards on contestability and reversal; the challenge-intake answer in the self-assessment                                                                               | No instrument records whether a deficiency, once named, reached someone who could fix it.    |
| Redesign     | The workaround presumption says a recurring workaround presumes upstream failure                                                                                           | No test separates removing a demand from making it easier to absorb.                         |

The presumption is rebuttable, but nothing yet says how to rebut it. Three parts below fill that in.

## Part 1: The compensatory work ledger

One row per recurring item of work. The unit is the item, not the person or the team. A ledger is
kept by the people who do the work, or built with them. A manager's reconstruction is a different
source and is labeled as one.

| Field               | Records                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------- |
| Trigger             | The condition in the formal process that produces the demand.                               |
| Work                | What the person does, in one sentence, in their words.                                      |
| Frequency           | Occurrences per month, counted over at least one full cycle of the institution's calendar.  |
| Time                | Median minutes per occurrence, and whether it happens on paid, unpaid, or personal time.    |
| Performer           | Role, and whether the role holds authority to change the trigger.                           |
| Beneficiary         | Who receives the result: the institution's metrics, a client, a colleague, the performer.   |
| Cost bearer         | Who pays if the work is not done: the performer, the client, a downstream team, the public. |
| Formal record       | Whether the work appears in a job description, a workflow, a time system, or a metric.      |
| Route to correction | The named route by which this item could be reported, and whether anyone has used it.       |
| Classification      | Result of the Part 2 test.                                                                  |

### What the ledger answers

- **Dependence.** Share of a unit's routine output that fails, slows, or degrades when the
  ledger's items are withheld. Estimate it only where the work can be paused or observed
  under a natural break: a holiday, an outage, a staffing gap, or a work-to-rule period. Otherwise
  report time and frequency, and do not report a share.
- **Distribution.** Cross-tabulate performer, beneficiary, and cost bearer. The finding of
  interest is a mismatch: the people who carry the work are not the people who benefit from it, or
  are not the people who could change the trigger.
- **Authority.** For each item, record whether a route to correction exists, whether it has been
  used, and what happened. Compare items raised by staff with more and less standing in the
  institution. The hypothesis is that items raised by lower-standing staff are corrected less
  often, holding frequency and time constant. The ledger can show that pattern. It cannot show why.

## Part 2: Separating unwanted from wanted work

Not all recurring adaptation is compensation. A nurse who adapts a script for one patient is using
judgment. A nurse who rewrites the same field every shift because the software rejects valid
entries is compensating. The workaround presumption needs a test that tells them apart. The test
below asks the performer, and checks the answers against conditions.

Ask four questions of each ledger item.

1. **Refusal.** If the performer stopped doing this, what happens, and to whom? If the cost falls
   on a third party who cannot act for themselves, the work is not freely chosen.
2. **Replacement.** If a formal route did the same job at no extra cost to the performer, would
   they use it? A yes means the work substitutes for a missing formal route.
3. **Ownership.** Does the performer decide when and how to do it, and is the result credited to
   them? Work they control and are credited for behaves like craft. Work they neither control nor
   are credited for behaves like compensation.
4. **Dependence.** Does the formal account of the process assume the work gets done? If a metric,
   a target, or a downstream step is built on it, the institution depends on it.

| Classification | Pattern                                                                                         | Treatment                                                                        |
| -------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Compensation   | Refusal is costly to others, replacement is preferred, ownership is low, dependence is present. | Target for removal. The presumption stands.                                      |
| Discretion     | Performer chooses, would keep it if a formal route existed, and is credited.                    | Preserve. Record it so it survives redesign.                                     |
| Craft          | Performer chooses and values it. The institution does not depend on it.                         | Preserve. Do not count it as debt.                                               |
| Coerced craft  | Reads as craft in interviews, but refusal is penalized or the work is unpaid.                   | Treat as compensation. Check whether the performer has a real option to decline. |
| Unresolved     | Answers conflict or the performer is not free to say.                                           | Do not classify. Record and revisit with a protected channel.                    |

Coerced craft is the main risk. People often describe necessary work as a calling. Ask for the
refusal answer first and separately, and ask it of people who left the role as well as those who
stayed.

The classification is the performer's account plus documented conditions. It is not an objective
fact. Report the share of items in each class, and the share left unresolved, without folding
the unresolved into either side.

## Part 3: Removal or accommodation

Take a ledger item and an intervention. Ask what happened to the item after the intervention, at
the trigger and at the performer. Four outcomes are possible.

| Outcome             | Test                                                                                                |
| ------------------- | --------------------------------------------------------------------------------------------------- |
| Removal             | The trigger no longer occurs. Frequency of the item falls to near zero and stays there.             |
| Reduction at source | The trigger occurs less often because the rule, the data, or the process changed upstream.          |
| Transfer            | The item stops for this performer and appears for another role, another team, or the client.        |
| Accommodation       | The trigger and its frequency are unchanged. The work is faster, better supported, or acknowledged. |

Three checks tell accommodation from removal.

- **Trigger count.** Count occurrences of the trigger, not of the work. If the trigger count is
  unchanged, the intervention accommodated.
- **Follow the residue.** Search the ledger, and the ledgers of adjacent roles, for a new item with
  the same trigger. A new item is a transfer.
- **Reversal.** Withdraw the intervention in a period where that is possible and safe. If the
  work returns at its old frequency, the intervention was carrying the load.

Better software, added staff, training, recognition, and resilience programs are accommodations by
default. They can be worthwhile. They are not counted as redesign unless the trigger count falls.

### Worked illustration (constructed, not from a study)

A benefits office requires applicants to submit proof of income the state already holds. Caseworkers
spend time chasing missing documents.

- A checklist and a reminder text are accommodation. The trigger, a proof request the state need
  not make, still occurs on every application.
- A shared record that fills the field from existing data is reduction at source. The trigger
  occurs only where records disagree.
- Assigning the chasing to a call center is transfer. The item moves to a different ledger.

## Preserving what matters

The research question includes preserving performance, discretion, and surge capacity. Removing
compensatory work can damage all three, so each redesign is measured on all three.

- **Performance.** The same outcome measures the institution used before, plus any outcome it did
  not measure and clients care about.
- **Discretion.** Ledger items classified as discretion or craft before the change. Count how many
  survive, and whether anyone reports losing a choice.
- **Surge capacity.** Response to a demand the process did not anticipate, tested where one occurs
  naturally, or by a tabletop scenario agreed in advance. Some slack in the system is deliberate
  and looks like waste. The ledger records it as an item and the redesign decides whether to keep
  it.

A redesign that lowers ledger load and lowers any of these three is reported as a trade-off, not
a success.

## Study design

Setting: one institution unit where staff agree to keep a ledger. Healthcare is one candidate. The
protocol does not depend on it.

1. **Baseline.** Six weeks of ledger keeping, classification interviews, and the existing outcome
   measures. Run the self-assessment and Burden Modeler at the start, to see whether their scores
   track ledger totals.
2. **Intervention.** Choose one recurring item with high frequency and a clear trigger. Change it
   at the source, with the people who perform it holding a role in the decision.
3. **Comparison.** A comparable unit that keeps the ledger and makes no change, or the same unit
   before and after with a defined lag. State which, and state its limits.
4. **Follow-up.** Six weeks after the change: trigger count, residue search, and the three
   preservation measures.
5. **Report.** Publish the ledger schema, classification counts, unresolved count, and negative
   results. Names, employer identity, and identifiable cases stay out unless participants agree.

### Hypotheses that could fail

- H1. Ledger time in a unit predicts its self-assessment concern score. If not, the
  self-assessment measures something else.
- H2. Items raised by lower-standing staff reach correction less often at equal frequency.
- H3. Interventions classed as reduction at source lower total ledger time in the unit and in
  adjacent units. Accommodations lower it only for the performer.
- H4. Removal does not lower performance or discretion where the removed items were classed as
  compensation. It does where they were classed as discretion.

A study can return the opposite of any of these. Publish it if it does.

## Limits

- Ledgers are self-reported. Performers can under-report work they consider normal.
- The refusal question depends on people feeling safe to answer it. The protocol needs a channel
  the employer cannot read.
- The classification cannot settle a dispute between a worker and a manager about whether work is
  wanted. It records the disagreement.
- A ledger does not weigh work against harm. It says who carries what.
- One unit gives no general estimate. Pooling ledgers across institutions needs a shared schema,
  which this plan does not yet fix.

## Before any of this is claimed

The positioning plan requires a literature comparison before a gap is claimed. Check at least these
lines of work and record where the ledger reproduces them:

- Articulation work and invisible work (Strauss; Star and Strauss).
- Workarounds in information systems (Alter).
- Administrative burden and the time tax (Herd and Moynihan).
- Resilience engineering and work-as-done versus work-as-imagined (Hollnagel; Dekker).
- Exit, voice, and loyalty as an account of how members' complaints reach an organization
  (Hirschman).
- Emotional labor and relational work (Hochschild).

Verify each reference and its findings before citing it on a public page. The list above is a
reading plan, not a bibliography.

## Implementation

- Schema: `public/standards/compensatory-work-ledger.schema.json`, with a valid example in
  `public/standards/examples/`. The standards schema tests validate the example.
- Tests as code: `src/utils/compensatory-work.ts` derives the classification from the four
  answers and the intervention outcome from trigger counts. `checkLedger` reports any recorded
  value the answers do not support, unknown item references, and a zero baseline count.
- The classifier is deliberately conservative. Missing refusal or replacement answers, and partial
  ownership, return `unresolved` rather than a side. The near-zero threshold for removal is 5% of
  the baseline trigger count. Both rules are drafts to revise after the reading in the next
  section and after a pilot.
- The example ledger is constructed, not drawn from a study.

## Proposed next steps

1. Review this plan and the ledger fields with at least one person who does compensatory work.
2. ~~Draft the ledger schema and a validator.~~ Done as JSON Schema plus `checkLedger`. A CSV
   export for people who keep ledgers in a spreadsheet is still open.
3. Write the literature comparison and revise the fields and tests where prior work already
   covers them.
4. Decide whether the redesign test belongs in a new diagnostic or in the casebook's scoring.
5. Add glossary entries for `compensatory-work-ledger`, `coerced-craft`, and `trigger-count` once
   the terms survive step 3.
