/**
 * The six conditions Law IX names, as the fields of the intervention
 * specification that carries them (intervention-spec.schema.json). The test
 * on the logic module holds this list to the schema's required fields.
 */
export type SpecFieldId =
  | "information_available"
  | "actions_preventable"
  | "states_alterable"
  | "on_disagreement"
  | "incentives"
  | "reach_time_target";

export type Spec = Record<SpecFieldId, boolean>;

export type ActionClass = "routine" | "consequential";

export type Decision = {
  id: string;
  /** What the router says it did, which is all a reviewer sees by default. */
  summary: string;
  /** What the underlying record shows, visible only with information_available. */
  record: string;
  /** Whether the decision is wrong. Only the record says so. */
  wrong: boolean;
  actionClass: ActionClass;
};

export type ItemStatus = "queued" | "approved" | "rejected" | "paused";

export type Effect = "pending" | "took_effect" | "prevented";

export type QueueItem = {
  decision: Decision;
  status: ItemStatus;
  effect: Effect;
  /** True when the action executed on arrival, before any reviewer saw it. */
  executedOnArrival: boolean;
  arrivedAt: number;
  decidedAt?: number;
  opened: boolean;
  /** Reviewer beats spent on this item: one to decide, one more to read the record. */
  beatsSpent: number;
  dissent?: string;
};

export type LoopState = {
  spec: Spec;
  beat: number;
  arrived: number;
  items: QueueItem[];
  pausedClasses: ActionClass[];
  finished: boolean;
};

export type LoopAction =
  | { type: "toggle"; field: SpecFieldId }
  | { type: "open" }
  | { type: "approve" }
  | { type: "reject"; justification?: string }
  | { type: "pause"; actionClass: ActionClass }
  | { type: "approveRest" }
  | { type: "reset" };

export type Measures = {
  decided: number;
  approved: number;
  rejected: number;
  approvalRate: number | null;
  medianBeatsPerApproval: number | null;
  insideTarget: number | null;
  wrongArrived: number;
  wrongPrevented: number;
  wrongTookEffect: number;
  control: number | null;
  backlog: number;
  remaining: number;
};

export type Finding = { clause: string; text: string };
