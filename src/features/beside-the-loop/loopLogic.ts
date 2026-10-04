/**
 * Beside the loop: the approval queue, one beat at a time.
 *
 * A beat is one reviewer action. Decisions arrive per beat at the router's
 * pace unless the specification states a reach-time target. What an approval
 * or a rejection does, and what the reviewer can see or reach, is decided by
 * the six fields of the intervention specification at the moment of the
 * action. Nothing here is random, so a run can be replayed and tested.
 */
import {
  ARRIVALS_WITH_TARGET,
  ARRIVALS_WITHOUT_TARGET,
  DECISIONS,
  JUSTIFICATION_MIN_LENGTH,
  MIN_DECIDED_FOR_FINDING,
  NEAR_UNANIMITY,
  SPEC_FIELD_IDS,
  TARGET_BEATS,
} from "./config";
import type {
  ActionClass,
  Finding,
  LoopAction,
  LoopState,
  Measures,
  QueueItem,
  Spec,
  SpecFieldId,
} from "./types";

export const emptySpec = (): Spec =>
  Object.fromEntries(SPEC_FIELD_IDS.map((id) => [id, false])) as Spec;

export const fullSpec = (): Spec =>
  Object.fromEntries(SPEC_FIELD_IDS.map((id) => [id, true])) as Spec;

export function specCount(spec: Spec): number {
  return SPEC_FIELD_IDS.filter((id) => spec[id]).length;
}

const arrivalsPerBeat = (spec: Spec) =>
  spec.reach_time_target ? ARRIVALS_WITH_TARGET : ARRIVALS_WITHOUT_TARGET;

function arrive(state: LoopState, count: number): LoopState {
  const items = [...state.items];
  let arrived = state.arrived;
  for (let i = 0; i < count && arrived < DECISIONS.length; i += 1) {
    const decision = DECISIONS[arrived];
    const paused = state.pausedClasses.includes(decision.actionClass);
    const held = state.spec.actions_preventable;
    items.push({
      decision,
      status: paused ? "paused" : "queued",
      // A paused class does not execute. Otherwise, without a preventable
      // action, the router completes on arrival and the reviewer's approval
      // records concurrence.
      effect: paused ? "prevented" : held ? "pending" : "took_effect",
      executedOnArrival: !paused && !held,
      arrivedAt: state.beat,
      opened: false,
      beatsSpent: 0,
    });
    arrived += 1;
  }
  return { ...state, items, arrived };
}

function finishIfDone(state: LoopState): LoopState {
  const queued = state.items.some((item) => item.status === "queued");
  const finished = state.arrived >= DECISIONS.length && !queued;
  return finished === state.finished ? state : { ...state, finished };
}

/** One beat passes: the reviewer acted, and the router kept going. */
function advance(state: LoopState): LoopState {
  const next = { ...state, beat: state.beat + 1 };
  return finishIfDone(arrive(next, arrivalsPerBeat(next.spec)));
}

export function createState(spec: Spec = emptySpec()): LoopState {
  const initial: LoopState = {
    spec,
    beat: 0,
    arrived: 0,
    items: [],
    pausedClasses: [],
    finished: false,
  };
  return arrive(initial, ARRIVALS_WITHOUT_TARGET);
}

export function currentItem(state: LoopState): QueueItem | undefined {
  return state.items.find((item) => item.status === "queued");
}

function updateCurrent(
  state: LoopState,
  update: (item: QueueItem) => QueueItem,
): LoopState {
  const index = state.items.findIndex((item) => item.status === "queued");
  if (index === -1) return state;
  const items = [...state.items];
  items[index] = update(items[index]);
  return { ...state, items };
}

/** Whether a rejection needs a written justification before it counts. */
export function rejectionNeedsJustification(spec: Spec): boolean {
  return !spec.on_disagreement;
}

export function justificationAccepted(text: string | undefined): boolean {
  return (text ?? "").trim().length >= JUSTIFICATION_MIN_LENGTH;
}

export function reduce(state: LoopState, action: LoopAction): LoopState {
  switch (action.type) {
    case "toggle": {
      const field: SpecFieldId = action.field;
      return { ...state, spec: { ...state.spec, [field]: !state.spec[field] } };
    }
    case "reset":
      return createState(state.spec);
    case "open": {
      if (!state.spec.information_available) return state;
      const item = currentItem(state);
      if (!item || item.opened) return state;
      return advance(
        updateCurrent(state, (current) => ({
          ...current,
          opened: true,
          beatsSpent: current.beatsSpent + 1,
        })),
      );
    }
    case "approve": {
      if (!currentItem(state)) return state;
      return advance(
        updateCurrent(state, (current) => ({
          ...current,
          status: "approved",
          effect: "took_effect",
          decidedAt: state.beat,
          beatsSpent: current.beatsSpent + 1,
        })),
      );
    }
    case "reject": {
      if (!currentItem(state)) return state;
      if (
        rejectionNeedsJustification(state.spec) &&
        !justificationAccepted(action.justification)
      ) {
        return state;
      }
      const spec = state.spec;
      return advance(
        updateCurrent(state, (current) => ({
          ...current,
          status: "rejected",
          // A rejection prevents the action only if the action was waiting
          // and the specification says what a disagreement does. Otherwise
          // it is dissent on the record, and the system prevails.
          effect:
            current.executedOnArrival || !spec.on_disagreement
              ? "took_effect"
              : "prevented",
          decidedAt: state.beat,
          beatsSpent: current.beatsSpent + 1,
          dissent: spec.on_disagreement ? undefined : action.justification,
        })),
      );
    }
    case "pause": {
      if (!state.spec.states_alterable) return state;
      if (state.pausedClasses.includes(action.actionClass)) return state;
      const actionClass: ActionClass = action.actionClass;
      const items = state.items.map((item) =>
        item.status === "queued" && item.decision.actionClass === actionClass
          ? {
              ...item,
              status: "paused" as const,
              // What already executed stays executed; the pause stops what
              // was still waiting and everything that has not arrived.
              effect: item.executedOnArrival
                ? ("took_effect" as const)
                : ("prevented" as const),
              decidedAt: state.beat,
            }
          : item,
      );
      return advance({
        ...state,
        items,
        pausedClasses: [...state.pausedClasses, actionClass],
      });
    }
    case "approveRest": {
      let next = state;
      // Bounded by the queue: each approval is a beat, and beats bring
      // arrivals, so the loop ends when everything has arrived and been seen.
      for (let guard = 0; guard < DECISIONS.length * 4; guard += 1) {
        if (!currentItem(next)) break;
        next = reduce(next, { type: "approve" });
      }
      return next;
    }
    default:
      return state;
  }
}

const median = (values: number[]): number | null => {
  const finiteValues = values.filter((v) => Number.isFinite(v));
  if (finiteValues.length === 0) return null;
  const sorted = [...finiteValues].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
};

/** STD-08 §3.4: the measures a specification owes per review period. */
export function measure(state: LoopState): Measures {
  const decided = state.items.filter(
    (item) => item.status === "approved" || item.status === "rejected",
  );
  const approved = decided.filter((item) => item.status === "approved");
  const rejected = decided.filter((item) => item.status === "rejected");
  const wrong = state.items.filter((item) => item.decision.wrong);
  const wrongPrevented = wrong.filter((item) => item.effect === "prevented");
  const wrongTookEffect = wrong.filter((item) => item.effect === "took_effect");
  const reached = decided.filter(
    (item) =>
      item.decidedAt !== undefined &&
      item.decidedAt - item.arrivedAt <= TARGET_BEATS,
  );
  return {
    decided: decided.length,
    approved: approved.length,
    rejected: rejected.length,
    approvalRate: decided.length ? approved.length / decided.length : null,
    medianBeatsPerApproval: median(approved.map((item) => item.beatsSpent)),
    insideTarget:
      state.spec.reach_time_target && decided.length
        ? reached.length / decided.length
        : null,
    wrongArrived: wrong.length,
    wrongPrevented: wrongPrevented.length,
    wrongTookEffect: wrongTookEffect.length,
    control: wrong.length ? wrongPrevented.length / wrong.length : null,
    backlog: state.items.filter((item) => item.status === "queued").length,
    remaining: DECISIONS.length - state.arrived,
  };
}

/** STD-08 §3.5: the patterns that open a reconsideration of the specification. */
export function findings(state: LoopState, measures: Measures): Finding[] {
  const out: Finding[] = [];
  if (
    measures.decided >= MIN_DECIDED_FOR_FINDING &&
    measures.approvalRate !== null &&
    measures.approvalRate >= NEAR_UNANIMITY
  ) {
    out.push({
      clause: "§3.5",
      text: `Near-unanimous approval: ${measures.approved} of ${measures.decided}. The control has not been shown to be one.`,
    });
  }
  if (
    state.spec.information_available &&
    measures.approved >= MIN_DECIDED_FOR_FINDING &&
    measures.medianBeatsPerApproval !== null &&
    measures.medianBeatsPerApproval < 2
  ) {
    out.push({
      clause: "§3.5",
      text: "Median time per approval is too short for the record to have been read.",
    });
  }
  return out;
}

export type Verdict = {
  recordedAs: "control" | "advisory review";
  tone: "good" | "warn" | "bad";
  text: string;
};

/** STD-08 §3.3: what the arrangement may be recorded as. */
export function verdict(state: LoopState, measures: Measures): Verdict {
  const { spec } = state;
  const specified = specCount(spec);
  if (!spec.states_alterable || !spec.actions_preventable) {
    const reason = !spec.states_alterable
      ? "states_alterable is empty"
      : "the actions the reviewer can prevent are not the actions the router takes";
    return {
      recordedAs: "advisory review",
      tone: "bad",
      text: `Recorded as advisory review, not a control (§3.3): ${reason}. ${specified} of 6 fields specified.`,
    };
  }
  if (specified < SPEC_FIELD_IDS.length) {
    return {
      recordedAs: "control",
      tone: "warn",
      text: `Recordable as a control, ${specified} of 6 fields specified. The unspecified fields are where it will fail under load.`,
    };
  }
  const control =
    measures.control === null
      ? "not yet tested"
      : `${Math.round(measures.control * 100)}%`;
  return {
    recordedAs: "control",
    tone: "good",
    text: `Recordable as a control: all six fields specified. Wrong decisions prevented so far: ${control}.`,
  };
}
