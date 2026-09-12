/**
 * One catalogue of the governance properties this project can actually check.
 *
 * Two instruments here check things. The Tier 1 harness
 * (src/harness/checks.ts) probes a running system through an adapter: it
 * starts a job, asks it to stop, and times the answer. The record conformance
 * checker (src/features/record-conformance) reads a stream of STD-07 records
 * after the fact and grades what they say about each other. They were built at
 * different times against different standards, and they overlap: harness
 * DEL-006 asks whether a trigger produced a reconsideration record, and the
 * conformance finding `unanswered-discrepancy` asks whether a discrepancy was
 * ever answered. Those are one claim observed from two sides, and until now
 * nothing in the repo said so.
 *
 * This catalogue names the claim, not the instrument. Each property carries up
 * to two probes — one that watches a live system, one that reads what it
 * emitted — and the coverage of a property is how many of those exist. A
 * property with one probe can only be checked by whoever holds that kind of
 * access. A property with none is named here anyway, because the alternative
 * is a framework whose unfalsifiable claims are invisible next to its
 * falsifiable ones.
 *
 * checkable-properties.test.ts asserts the mapping is total in both
 * directions: every harness check id and every conformance finding id belongs
 * to exactly one property, and every probe names a real id. Adding a check
 * without cataloguing it fails the build.
 */

import { tier1Checks, type Tier1CheckId } from "../harness/checks";
import {
  CONFORMANCE_FINDING_IDS,
  type ConformanceFindingId,
} from "../features/record-conformance/conformance";

/** The six state variables the laws are written over. */
export type StateVariable =
  | "capability"
  | "authority"
  | "evidence"
  | "dependency"
  | "standing"
  | "correction";

/**
 * A way of observing whether a property holds.
 *
 * `live` needs an adapter against a running system and answers in real time.
 * `emitted` needs a record stream and answers afterwards. The distinction is
 * not cosmetic: they are available to different people. A vendor can run the
 * live probe on itself; a regulator or a counterparty usually can only read
 * what was emitted.
 */
export type Probe =
  | { observes: "live"; id: Tier1CheckId; what: string }
  | { observes: "emitted"; id: ConformanceFindingId; what: string };

export type CheckableProperty = {
  id: string;
  title: string;
  /** The claim as an assertion that can be false. */
  claim: string;
  /** Law anchors on /standards/laws, e.g. "law-i". */
  laws: string[];
  variables: StateVariable[];
  probes: Probe[];
  /**
   * What an observation would have to catch, for the side that has none. Set
   * on every property that is not probed from both sides — including the ones
   * probed from neither, where it is the whole content of the entry.
   */
  gap?: string;
};

export const checkableProperties: CheckableProperty[] = [
  {
    id: "authority-is-not-capability",
    title: "Reaching an action is not permission to take it",
    claim:
      "A system that can discover and physically perform an action refuses it without a grant naming that action class.",
    laws: ["law-i"],
    variables: ["capability", "authority"],
    probes: [
      {
        observes: "live",
        id: "DEL-002",
        what: "enumerates the capabilities the system can reach, then attempts one no grant covers and requires refusal",
      },
    ],
    gap: "A record probe would need refusals in the stream. STD-07 records what was authorized, not what was reached and declined, so a log that never mentions an ungranted attempt is indistinguishable from one where none occurred.",
  },
  {
    id: "grant-state-governs-action",
    title: "The grant's state is the one the executor obeys",
    claim:
      "When a grant moves to suspended, revoked or under review, the next action under it is refused, within the transition budget.",
    laws: ["law-i", "law-ii"],
    variables: ["authority"],
    probes: [
      {
        observes: "live",
        id: "DEL-001",
        what: "transitions a grant and times how long the executor keeps acting on the old state",
      },
    ],
    gap: "A record probe would need the grant's state at the moment of each action, not just at issue. The authority grant object carries state; the record stream references the grant by id and does not snapshot it.",
  },
  {
    id: "chain-boundary-governs-composition",
    title: "The chain boundary governs the composition, not a hop",
    claim:
      "A chain of delegations is measured and stopped as one composition: the composed window is measured from decision records and leaves a human something to act inside, and one boundary intervention halts every enumerated hop.",
    laws: ["law-ix", "law-iv"],
    variables: ["authority", "correction"],
    probes: [
      {
        observes: "live",
        id: "CHN-001",
        what: "reads the composed window a chain leaves after upstream latency, measured from decision records",
      },
      {
        observes: "live",
        id: "CHN-002",
        what: "exercises the boundary intervention and requires one receipt covering every enumerated hop",
      },
    ],
    gap: "A record probe would need per-hop latency joined to a halt receipt covering the same chain. STD-07 sees each hop's records without seeing the composition, which is the gap STD-09's chain field and MEC-20's boundary intervention exist to close.",
  },
  {
    id: "authority-expires-with-its-justification",
    title: "Authority ends when the reason for it goes stale",
    claim:
      "Every grant names a condition or deadline that ends it, and reaching that point moves the grant to review rather than letting it continue.",
    laws: ["law-ii"],
    variables: ["authority", "evidence"],
    probes: [
      {
        observes: "live",
        id: "DEL-005",
        what: "expires the policy behind a grant and checks the grant leaves the active state without anyone intervening",
      },
      {
        observes: "emitted",
        id: "no-clock",
        what: "flags beliefs and authorizations that state no time by which they would be revisited",
      },
    ],
  },
  {
    id: "evidence-and-authority-stay-coupled",
    title: "An authorization points at the evidence it rests on",
    claim:
      "Every belief, authorization and action names what it depends on, names what would defeat it, and those references resolve.",
    laws: ["law-iii"],
    variables: ["evidence", "authority"],
    probes: [
      {
        observes: "emitted",
        id: "ungrounded",
        what: "flags records that state nothing that would end them",
      },
      {
        observes: "emitted",
        id: "no-dependence",
        what: "flags records that name nothing they depend on",
      },
      {
        observes: "emitted",
        id: "dangling-reference",
        what: "flags dependence and defeat references that point at records not in the stream",
      },
    ],
    gap: "A live probe would have to invalidate a premise and watch whether the authorization resting on it changes state. That needs an adapter capability no current check uses: the ability to retract evidence the system has already accepted.",
  },
  {
    id: "the-record-is-complete",
    title: "Every action taken reaches the record",
    claim:
      "The audit trail contains an entry for every action the system performed, with its timing, reasoning and outcome.",
    laws: ["law-viii", "law-xii"],
    variables: ["evidence", "correction"],
    probes: [
      {
        observes: "live",
        id: "AGT-003",
        what: "drives a known set of actions and compares them against what the audit trail returns",
      },
    ],
    gap: "Completeness is the one property a record stream cannot check about itself. Nothing inside a log reveals the action that was never written to it; only comparison against an independently known set of actions can.",
  },
  {
    id: "the-record-is-tamper-evident",
    title: "A changed record is a detectable record",
    claim:
      "Every record carries a hash over its own content, and recomputing it reproduces what the record claims.",
    laws: ["law-viii", "law-xii"],
    variables: ["evidence"],
    probes: [
      {
        observes: "emitted",
        id: "invalid-records",
        what: "rejects entries that are not valid records of any declared kind",
      },
      {
        observes: "emitted",
        id: "missing-hash",
        what: "flags records that carry no content hash",
      },
      {
        observes: "emitted",
        id: "hash-mismatch",
        what: "recomputes each hash and flags the ones that do not match",
      },
    ],
    gap: "A live probe would have to alter a stored record through some path other than the emitter and check the system notices. That is a tampering test, and running it against a production system is a different kind of engagement from the rest of the harness.",
  },
  {
    id: "the-record-is-continuous",
    title: "The record has no gaps anyone can hide in",
    claim:
      "Records link to their predecessors, every record is reachable through that chain, and no link points at something absent.",
    laws: ["law-viii", "law-xii"],
    variables: ["evidence"],
    probes: [
      {
        observes: "emitted",
        id: "chain-break",
        what: "follows each previous-record link and flags the ones that do not resolve",
      },
      {
        observes: "emitted",
        id: "unchained",
        what: "flags records that sit outside the chain entirely",
      },
    ],
    gap: "The live equivalent is the completeness probe above: continuity within an export says nothing about an export that began late or ended early.",
  },
  {
    id: "stopping-is-operational",
    title: "Stop means the work ceases, not that the request was received",
    claim:
      "A stop request is acknowledged and the work actually ceases within the stop budget.",
    laws: ["law-vi", "law-ix"],
    variables: ["capability", "correction"],
    probes: [
      {
        observes: "live",
        id: "STP-005",
        what: "starts a job, requests a stop, and polls until the system reports the work has ceased or the budget elapses",
      },
    ],
    gap: "A record probe would need the stop request and the cessation as separate timestamped records. STD-07 has no stop record kind; an intervention record exists but does not distinguish acknowledgement from cessation.",
  },
  {
    id: "a-human-can-alter-system-state",
    title: "Oversight that changes nothing is not oversight",
    claim:
      "A human decision that contradicts the system's changes what the system does, rather than being logged alongside it.",
    laws: ["law-ix"],
    variables: ["standing", "correction"],
    probes: [
      {
        observes: "live",
        id: "AGT-007",
        what: "issues an override and checks the system's subsequent behaviour reflects it",
      },
    ],
    gap: "An emitted probe would need the system's intended action recorded before the override, so the two can be compared. Records name the action taken; they rarely name the action that was about to be taken.",
  },
  {
    id: "reversal-reaches-the-affected",
    title: "A reversal that nobody is told about is not a remedy",
    claim:
      "When a decision is reversed, the parties it affected are notified, told what was reversed and told why.",
    laws: ["law-vi", "law-vii"],
    variables: ["standing", "correction"],
    probes: [
      {
        observes: "live",
        id: "REV-003",
        what: "reverses a decision and checks each affected party receives a notification carrying subject and reason",
      },
    ],
    gap: "A record probe would need the notification itself to be a record. Reversal appears in STD-07 as a correction; who was told is outside the stream.",
  },
  {
    id: "challenges-produce-reconsideration",
    title: "A challenge changes state or it is theatre",
    claim:
      "A raised discrepancy produces a reconsideration record, and it does so within the clock the system declared for it.",
    laws: ["law-vii", "law-viii", "law-xii"],
    variables: ["standing", "correction"],
    probes: [
      {
        observes: "live",
        id: "DEL-006",
        what: "raises a trigger against a live grant and checks a reconsideration record appears",
      },
      {
        observes: "emitted",
        id: "unanswered-discrepancy",
        what: "flags discrepancies in the stream that no later record answers",
      },
      {
        observes: "emitted",
        id: "late-answer",
        what: "flags discrepancies answered after the deadline the emitter itself declared",
      },
    ],
  },
  {
    id: "time-costs-are-disclosed",
    title: "The system says how long it will take, before it takes it",
    claim:
      "Each stage the person waits through was estimated in advance, and the estimate is within tolerance of what it cost.",
    laws: ["law-vii"],
    variables: ["standing"],
    probes: [
      {
        observes: "live",
        id: "TEM-007",
        what: "compares each stage's advertised duration against its measured duration",
      },
    ],
    gap: "An emitted probe would need estimates in the record, not just outcomes. Nothing in STD-07 asks a system to write down what it predicted, which also makes the prediction unfalsifiable after the fact.",
  },
  {
    id: "imposed-delay-does-not-accumulate",
    title: "Waiting does not compound across interactions",
    claim:
      "Time the system imposes on a person does not grow with the number of interactions they have already had.",
    laws: ["law-v", "law-vii"],
    variables: ["dependency", "standing"],
    probes: [
      {
        observes: "live",
        id: "TEM-005",
        what: "runs a sequence of interactions and checks imposed delay does not trend upward across them",
      },
    ],
    gap: "An emitted probe would need per-person interaction history, which is exactly the data a conformance checker should not require. This one may be correctly live-only.",
  },
  {
    id: "declared-conformance-is-earned",
    title: "A claimed level is a claim, and it can be wrong",
    claim:
      "What a system declares about its own records — the level it claims, the kinds it says it emits — matches what the records show.",
    laws: ["law-xii"],
    variables: ["evidence"],
    probes: [
      {
        observes: "emitted",
        id: "overclaimed",
        what: "compares the declared conformance level against the level the stream earns",
      },
      {
        observes: "emitted",
        id: "manifest-unreadable",
        what: "reports that a supplied declaration could not be parsed, so nothing was checked against it",
      },
      {
        observes: "emitted",
        id: "manifest-unknown-kind",
        what: "flags declared record kinds the standard does not define",
      },
      {
        observes: "emitted",
        id: "manifest-kind-absent",
        what: "flags kinds the declaration claims and the stream does not contain",
      },
      {
        observes: "emitted",
        id: "manifest-kind-undeclared",
        what: "flags kinds in the stream the declaration omits",
      },
    ],
    gap: "The live equivalent would ask a running system for its own declaration and compare it against observed behaviour. No adapter capability exposes a manifest.",
  },
  {
    id: "standing-is-proportional-to-exposure",
    title: "The people who bear the error can act on it",
    claim:
      "Whoever bears the consequence of a decision holds a standing to contest it that does not depend on the operator's goodwill.",
    laws: ["law-vii"],
    variables: ["standing"],
    probes: [],
    gap: "Neither instrument checks this. The record checker can see that records name a standing to object, and does — but naming a party is not granting them a route, and the checker has no way to tell whether the route exists or whether anyone outside the operator has ever used it. A live probe would have to attempt a challenge as an outside party, which means an adapter that is not the operator's. That is the hardest and most load-bearing gap in this catalogue.",
  },
  {
    id: "correction-capacity-is-assessed",
    title: "The ability to correct is measured, not assumed",
    claim:
      "Each grant carries a dated assessment of whether detection, challenge, standing, review, authority to modify, reversible transitions and post-correction operability actually exist.",
    laws: ["law-iv"],
    variables: ["correction"],
    probes: [],
    gap: "The authority grant schema requires `correction_capacity` with all seven components and an `assessed_at`. Nothing validates the assessment against reality: a grant asserting all seven and a grant that has them are the same document. Individual components are probed elsewhere in this catalogue — stopping, override, reversal notice, challenge — so the missing piece is binding those results back to the grant that claimed them.",
  },
  {
    id: "dependence-stays-within-budget",
    title: "The capacity to do it another way is still there",
    claim:
      "Capacities the delegation displaced are still exercised often enough to remain available, and their decay is recorded rather than discovered.",
    laws: ["law-v"],
    variables: ["dependency"],
    probes: [],
    gap: "The dependency record carries `last_exercised`, a retained/degrading/lost status and whether the capacity was replenished or consumed since the last assessment. Nothing reads those. A checker over dependency records would be the cheapest real probe missing from this repo: the fields already exist and the arithmetic is trivial.",
  },
  {
    id: "governance-capacity-scales-with-automation",
    title: "Success raises the burden it must carry",
    claim:
      "As automated volume grows, the capacity to review, challenge and correct grows with it rather than staying fixed.",
    laws: ["law-xi"],
    variables: ["correction", "dependency"],
    probes: [],
    gap: "This is a ratio between two quantities neither instrument observes: decisions made and corrections the organisation can actually process. It is measurable — both numbers exist inside any operator — but not from a record stream or an adapter, which is a reason to be honest about it rather than to drop it.",
  },
  {
    id: "evaluation-sits-at-the-outermost-layer",
    title: "The eval is at the layer where the harm appears",
    claim:
      "The consequential decision, not the model call, is the unit that gets evaluated.",
    laws: ["law-x"],
    variables: ["evidence"],
    probes: [],
    gap: "Not a property of a system under test but of the testing programme around it, so it will never have a probe here. It is catalogued because leaving it out would let the framework's most-cited claim escape the accounting that every other claim is held to.",
  },
];

export type Coverage = "both" | "live-only" | "emitted-only" | "none";

export const coverageOf = (property: CheckableProperty): Coverage => {
  const live = property.probes.some((probe) => probe.observes === "live");
  const emitted = property.probes.some((probe) => probe.observes === "emitted");
  if (live && emitted) return "both";
  if (live) return "live-only";
  if (emitted) return "emitted-only";
  return "none";
};

export const COVERAGE_LABELS: Record<Coverage, string> = {
  both: "Checked from both sides",
  "live-only": "Only checkable against a running system",
  "emitted-only": "Only checkable from emitted records",
  none: "Named, not yet checkable",
};

/** Every check id the harness exposes, for the totality test and for pages. */
export const allLiveCheckIds: readonly Tier1CheckId[] = tier1Checks.map(
  (check) => check.id,
);

export const allEmittedFindingIds: readonly ConformanceFindingId[] =
  CONFORMANCE_FINDING_IDS;

export const getCheckableProperty = (id: string) =>
  checkableProperties.find((property) => property.id === id);

/** Which property a given probe id belongs to, for cross-linking from either tool. */
export const propertyForProbe = (
  id: Tier1CheckId | ConformanceFindingId,
): CheckableProperty | undefined =>
  checkableProperties.find((property) =>
    property.probes.some((probe) => probe.id === id),
  );
