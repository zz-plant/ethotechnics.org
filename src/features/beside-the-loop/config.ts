import type { ActionClass, Decision, SpecFieldId } from "./types";

export const CLAUSE_REFS = {
  partC: {
    label: "STD-08 Part C",
    href: "/standards/std-08-delegation#part-c",
  },
  lawIX: { label: "Law IX", href: "/standards/laws#law-ix" },
  schema: {
    label: "intervention-spec.schema.json",
    href: "/standards/intervention-spec.schema.json",
  },
  audit: { label: "Delegation Audit", href: "/diagnostics/delegation-audit" },
};

export type SpecField = {
  id: SpecFieldId;
  question: string;
  off: string;
  on: string;
  /** The value the field takes in the recorded specification, off and on. */
  recorded: { off: string | string[] | null; on: string | string[] };
};

/**
 * The six fields, in the order Law IX names them: information, authority to
 * prevent, ability to alter state, a defined response, incentives, time.
 */
export const SPEC_FIELDS: SpecField[] = [
  {
    id: "information_available",
    question: "Can the reviewer see the problem?",
    off: "Only the router's one-line summary. The record it decided on is not available.",
    on: "The decision record and the documents it rests on. Reading them costs a beat.",
    recorded: {
      off: [],
      on: ["decision record", "source documents", "policy version"],
    },
  },
  {
    id: "actions_preventable",
    question: "Does the action wait for the reviewer?",
    off: "The action executed on arrival. Approval records concurrence.",
    on: "Deny and hold actions are held until the reviewer decides.",
    recorded: { off: [], on: ["deny", "hold"] },
  },
  {
    id: "states_alterable",
    question: "Can the reviewer change a governing state?",
    off: "Approve or reject one item at a time. Nothing else is reachable.",
    on: "The reviewer can move the grant for an action class to review_required, which pauses the class.",
    recorded: { off: [], on: ["grant.state → review_required"] },
  },
  {
    id: "on_disagreement",
    question: "What happens when the reviewer disagrees?",
    off: "A written justification, escalated to a manager. The decision stands while it is read.",
    on: "The action pauses and the objection is answered inside the reversal clock.",
    recorded: {
      off: "dissent logged; the system prevails",
      on: "action pauses; objection answered inside the reversal clock",
    },
  },
  {
    id: "incentives",
    question: "What is the reviewer measured on?",
    off: "Throughput. The queue has to be clear by the end of the shift.",
    on: "Catches. Wrong decisions prevented are counted; clearing the queue is not.",
    recorded: {
      off: "queue cleared by end of shift",
      on: "wrong decisions prevented; throughput not scored",
    },
  },
  {
    id: "reach_time_target",
    question: "Is there time to act?",
    off: "No target. Decisions arrive at the router's pace, three per beat.",
    on: "A stated target. Consequential decisions are paced so one arrives per beat.",
    recorded: { off: null, on: "PT2H" },
  },
];

export const SPEC_FIELD_IDS = SPEC_FIELDS.map((field) => field.id);

/** Arrivals per reviewer beat, with and without a reach-time target. */
export const ARRIVALS_WITHOUT_TARGET = 3;
export const ARRIVALS_WITH_TARGET = 1;

/** Beats an item may wait before it is outside the reach-time target. */
export const TARGET_BEATS = 3;

/** Approval rate at which STD-08 §3.5 calls the arrangement a finding. */
export const NEAR_UNANIMITY = 0.95;

/** Decisions before the §3.5 rate is read at all. */
export const MIN_DECIDED_FOR_FINDING = 8;

/** Characters a justification must run to when disagreement has no defined response. */
export const JUSTIFICATION_MIN_LENGTH = 40;

export const ACTION_CLASS_LABELS: Record<ActionClass, string> = {
  routine: "routine",
  consequential: "consequential",
};

const d = (
  id: string,
  actionClass: ActionClass,
  summary: string,
  record: string,
  wrong = false,
): Decision => ({ id, actionClass, summary, record, wrong });

/**
 * Sixteen decisions from a prior-authorization router, in arrival order.
 * Five are wrong, and every wrong one has a summary that reads as fine; only
 * the record says otherwise. Fixed, so a run is reproducible.
 */
export const DECISIONS: Decision[] = [
  d(
    "4410",
    "routine",
    "Approve #4410 — MRI lumbar, policy 7.2 criteria met",
    "Six weeks of conservative treatment documented. Criteria met.",
  ),
  d(
    "4411",
    "consequential",
    "Deny #4411 — no clinical documentation on file",
    "No documents attached to the request. Denial reasons match the record.",
  ),
  d(
    "4412",
    "routine",
    "Approve #4412 — physical therapy renewal, 12 visits",
    "Progress notes attached. Renewal within policy limits.",
  ),
  d(
    "4413",
    "consequential",
    "Deny #4413 — no clinical documentation on file",
    "Documentation was attached two days ago. The router read a snapshot taken before the upload.",
    true,
  ),
  d(
    "4414",
    "routine",
    "Approve #4414 — generic substitution, formulary tier 1",
    "Formulary match confirmed.",
  ),
  d(
    "4415",
    "consequential",
    "Hold #4415 — pending peer review, oncology",
    "Peer review requested per policy 12.1 for this drug class.",
  ),
  d(
    "4416",
    "consequential",
    "Deny #4416 — service not covered under plan",
    "The member changed plans on the 1st. The router matched the old plan's exclusions.",
    true,
  ),
  d(
    "4417",
    "routine",
    "Approve #4417 — durable medical equipment, standard wheelchair",
    "Prescription and mobility assessment attached.",
  ),
  d(
    "4418",
    "consequential",
    "Deny #4418 — duplicate request within 30 days",
    "The earlier request was withdrawn by the provider. The router counted a withdrawn request as a duplicate.",
    true,
  ),
  d(
    "4419",
    "routine",
    "Approve #4419 — lab panel, annual",
    "Annual panel within benefit period.",
  ),
  d(
    "4420",
    "consequential",
    "Hold #4420 — provider credential check pending",
    "Provider NPI verification in progress; hold matches policy.",
  ),
  d(
    "4421",
    "consequential",
    "Deny #4421 — step therapy not attempted",
    "The step-therapy drug is contraindicated in the attached allergy record. Policy 9.4 waives the step in that case.",
    true,
  ),
  d(
    "4422",
    "routine",
    "Approve #4422 — telehealth follow-up",
    "Follow-up within 30 days of a covered visit.",
  ),
  d(
    "4423",
    "consequential",
    "Deny #4423 — out-of-network facility",
    "Facility is in network as of a contract dated last month. The router's network table is stale.",
    true,
  ),
  d(
    "4424",
    "routine",
    "Approve #4424 — vaccination, adult schedule",
    "Covered under preventive benefit.",
  ),
  d(
    "4425",
    "consequential",
    "Deny #4425 — no clinical documentation on file",
    "No documents attached. Denial reasons match the record.",
  ),
];
