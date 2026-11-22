# Institutional Revisability Index — 3-Axis Profile (idea #11)

**Status:** Design note — folds in #4 (Epistemic-Friction Metrics) and #17 (Constitutional Stopping Mechanisms)
**Date:** 2026-11-18
**Owner:** ethotechnics.org standards + diagnostics

---

## 1. Why a profile, not a score

The revisability index (#11) scores institutions across Possibility, Authority, and
Necessity. The single most important design constraint: **do not collapse the
three axes into one composite number.**

An institution can score high on Possibility (transparent anomalies, surfaced
contradictions) while scoring zero on Authority (no standing for anyone to alter
the governing rule). A composite score would mask that failure mode behind an
average. The theory explicitly rejects flattening revisability into a single
number or turnover rate; the index must preserve the three axes as a **profile**
with explicit failure-mode flags when one axis masks another.

This note defines that profile and the two dependencies that give it teeth:
#4 (epistemic friction) supplies measurable content for the Possibility axis, and
#17 (stopping mechanisms) supplies enforceable mechanics for Authority and
Necessity.

---

## 2. The three axes

### 2.1 Possibility

_How socio-technical arrangements shape what people can recognize, imagine, and
pursue — and whether high-performing systems clarify or obscure alternatives._

Measures whether the institution's own performance leaves participants more or
less able to notice anomalies, formulate objections, and imagine alternatives.

Inputs (drawn from #4, Epistemic-Friction Metrics):

- **Anomaly surfacing rate**: share of detected anomalies that reach a human with
  standing, vs. being auto-resolved or absorbed into a metric.
- **Epistemic friction preserved**: whether an oversight step actually forces a
  pause, a second read, or a dissenting view, or is a rubber-stamp (measured as
  time-to-decision, dissent recorded, override rate).
- **Alternative articulation**: whether the institution records rejected
  alternatives and the reasons for rejection, or only the chosen path.
- **Unassisted capability signal**: whether participants can still perform the
  task when the tool is off (proxy: override accuracy, anomaly detection rate
  without the tool).

### 2.2 Authority

_How arrangements determine who can make discoveries consequential — procedural
responsiveness vs. standing to set agendas and revise rules._

Measures who can actually change the governing rule, not just file a ticket.

Inputs (drawn from #17, Constitutional Stopping Mechanisms):

- **Rule-change standing**: which roles/accounts can propose, and which can
  ratify, a change to the governing rule (not just to an operational parameter).
- **Sunset clause presence**: whether automated workflows carry enforceable
  expiry or re-authorization gates.
- **Kill-switch reachability**: whether a third party (not the system's owner)
  can halt the system, and how long that takes.
- **Re-authorization cadence**: how often the system must be re-authorized by a
  body with standing, and whether that body is independent of the operator.

### 2.3 Necessity

_How arrangements create, conceal, reproduce, or reduce dependencies — the
material, epistemic, and organizational cost of doing otherwise._

Measures the cost of opting out, challenging, or replacing the system.

Inputs (drawn from #17 and from the casebook):

- **Exit cost**: data portability, interoperability, switching cost (technical
  and organizational).
- **Challenge cost**: time, money, and standing required to contest a decision
  (from STD-02 contestability).
- **Dependency reproduction**: whether the system's success increases or
  decreases participants' need for it over time (the "workaround subsidy" signal).
- **Lock-in indicators**: benevolent lock-in patterns (high performance that
  raises the cost of alternatives).

---

## 3. Failure-mode flags

The profile is not a score; it is a vector plus flags. Flags fire when axes
diverge in ways that mask a problem:

| Flag                              | Condition                                       | Meaning                                                                                                 |
| --------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `POSSIBILITY_MASKS_AUTHORITY`     | Possibility high, Authority zero/low            | The institution surfaces anomalies beautifully but no one can act on them. "Participatory theater."     |
| `AUTHORITY_WITHOUT_NECESSITY`     | Authority high, Necessity high                  | Those with standing to change rules have no incentive to reduce dependency (they benefit from lock-in). |
| `NECESSITY_HIDDEN_BY_POSSIBILITY` | Necessity high, Possibility high                | The system is transparent about its own operation but opaque about the cost of leaving.                 |
| `STAGNANT`                        | All three low                                   | Bureaucracy: nothing surfaces, nothing changes, dependency is total.                                    |
| `HIGH_CHURN_NO_POWER`             | Possibility high, Authority low, Necessity high | Lots of feedback and activity, no rule change, high exit cost. The "absorption" pattern.                |

These flags are the point of keeping the axes separate: a composite score would
hide every one of them.

---

## 4. Mapping to existing standards

| Axis / input              | Existing standard                            | Extension needed                                                                              |
| ------------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Epistemic friction (#4)   | STD-02 (contestability), STD-08 (delegation) | Add friction metrics (time-to-decision, dissent recorded, override rate) as measurable fields |
| Stopping mechanisms (#17) | STD-07 (revisable delegation record)         | Add sunset-clause, re-authorization-gate, and kill-switch fields to the delegation record     |
| Rule-change standing      | STD-08 (delegation)                          | Add "who can ratify a rule change" as distinct from "who can change an operational parameter" |
| Exit cost / lock-in       | STD-01 (temporal rights), casebook           | Add interoperability/portability checks to the casebook scoring                               |

The index does **not** replace these standards; it reads across them.

---

## 5. Relationship to the 6-safeguard scaffolding

Ethotechnics already scores institutions on six safeguards (what the system can
do, what it is permitted to do, the evidence behind the permission, how hard it
would be to do without, who can challenge it, who can halt it). The 3-axis
profile is a **second lens** over the same evidence:

- Safeguards 1–3 (capability, permission, evidence) feed **Possibility** and
  **Authority**.
- Safeguards 4–6 (irreplaceability, challenge, halt) feed **Authority** and
  **Necessity**.

The safeguards ask "does this institution have the right parts?" The profile
asks "do those parts actually leave people more capable of altering, challenging,
or becoming less dependent on the system?" — which is the baseline test in
`kanav.net/research/`.

---

## 6. What this is NOT

- Not a composite score. Never aggregate P, A, N into one number.
- Not a replacement for the 6-safeguard scoring. A second lens.
- Not a clinical or medical instrument. Institutional/organizational scope only.
- Not an automated verdict. A diagnostic profile a human reads.

---

## 7. Next steps

1. Add epistemic-friction metric fields to STD-02 and STD-08 (as a draft
   amendment, not a new standard).
2. Add sunset-clause / re-authorization / kill-switch fields to STD-07.
3. Build a diagnostic page on ethotechnics that renders the 3-axis profile +
   failure-mode flags for a given institution (input: its scored safeguards).
4. Pilot on the five casebook cases to see whether the flags fire on the
   known failures (Robodebt, Toeslagenaffaire, Post Office Horizon, Ofqual 2020,
   Apple Card).

_This is a design note. Standard amendments and the diagnostic page follow in
separate PRs._
