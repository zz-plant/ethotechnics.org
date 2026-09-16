import { describe, expect, it } from "bun:test";

import schema from "../../../public/standards/intervention-spec.schema.json";
import { DECISIONS, SPEC_FIELD_IDS, SPEC_FIELDS } from "./config";
import {
  createState,
  currentItem,
  emptySpec,
  findings,
  fullSpec,
  measure,
  reduce,
  verdict,
} from "./loopLogic";
import type { LoopAction, LoopState } from "./types";

const run = (state: LoopState, ...actions: LoopAction[]) =>
  actions.reduce(reduce, state);

/** Play a run the way an attentive reviewer with a full spec would. */
function attentiveRun(state: LoopState): LoopState {
  let next = state;
  for (let guard = 0; guard < 200; guard += 1) {
    const item = currentItem(next);
    if (!item) break;
    if (!item.opened) {
      next = reduce(next, { type: "open" });
      continue;
    }
    next = reduce(
      next,
      item.decision.wrong ? { type: "reject" } : { type: "approve" },
    );
  }
  return next;
}

describe("the six switches are the specification's fields", () => {
  it("are all fields the schema requires", () => {
    for (const id of SPEC_FIELD_IDS) {
      expect(schema.required).toContain(id);
      expect(schema.properties).toHaveProperty(id);
    }
  });

  it("are the six conditions Law IX names, and no more", () => {
    expect(SPEC_FIELD_IDS).toHaveLength(6);
    expect(new Set(SPEC_FIELD_IDS).size).toBe(6);
  });

  it("record a value of the type the schema gives the field", () => {
    for (const field of SPEC_FIELDS) {
      const type = (schema.properties as Record<string, { type: string }>)[
        field.id
      ].type;
      const on = field.recorded.on;
      expect(
        type === "array" ? Array.isArray(on) : typeof on === "string",
      ).toBe(true);
    }
  });
});

describe("the scenario", () => {
  it("is fixed and carries wrong decisions whose summaries read as fine", () => {
    const wrong = DECISIONS.filter((decision) => decision.wrong);
    expect(wrong.length).toBeGreaterThanOrEqual(4);
    for (const decision of wrong) {
      expect(decision.summary).not.toMatch(/wrong|error|stale/i);
    }
  });
});

describe("with nothing specified", () => {
  it("executes every decision on arrival, so approval records concurrence", () => {
    const state = createState(emptySpec());
    expect(state.items.every((item) => item.executedOnArrival)).toBe(true);
    expect(state.items.every((item) => item.effect === "took_effect")).toBe(
      true,
    );
  });

  it("cannot open the record", () => {
    const state = createState(emptySpec());
    expect(reduce(state, { type: "open" })).toBe(state);
  });

  it("refuses a rejection without a justification, and a justification still prevents nothing", () => {
    const state = createState(emptySpec());
    expect(reduce(state, { type: "reject" })).toBe(state);
    const rejected = reduce(state, {
      type: "reject",
      justification:
        "The documentation is on file; the router read a stale snapshot.",
    });
    expect(rejected.items[0].status).toBe("rejected");
    expect(rejected.items[0].effect).toBe("took_effect");
  });

  it("prevents no wrong decision when the reviewer approves the rest", () => {
    const state = reduce(createState(emptySpec()), { type: "approveRest" });
    const measures = measure(state);
    expect(state.finished).toBe(true);
    expect(measures.wrongArrived).toBe(
      DECISIONS.filter((decision) => decision.wrong).length,
    );
    expect(measures.wrongPrevented).toBe(0);
    expect(measures.control).toBe(0);
    expect(measures.approvalRate).toBe(1);
  });

  it("opens a §3.5 finding at near-unanimous approval", () => {
    const state = reduce(createState(emptySpec()), { type: "approveRest" });
    const found = findings(state, measure(state));
    expect(
      found.some((finding) => finding.text.includes("Near-unanimous")),
    ).toBe(true);
  });

  it("is recorded as advisory review, not a control", () => {
    const state = createState(emptySpec());
    expect(verdict(state, measure(state)).recordedAs).toBe("advisory review");
  });

  it("lets the backlog grow at the router's pace", () => {
    const state = run(
      createState(emptySpec()),
      { type: "approve" },
      { type: "approve" },
    );
    expect(measure(state).backlog).toBeGreaterThan(3);
  });
});

describe("with everything specified", () => {
  it("holds decisions for the reviewer", () => {
    const state = createState(fullSpec());
    expect(state.items.every((item) => !item.executedOnArrival)).toBe(true);
    expect(state.items.every((item) => item.effect === "pending")).toBe(true);
  });

  it("lets an attentive reviewer prevent every wrong decision", () => {
    const state = attentiveRun(createState(fullSpec()));
    const measures = measure(state);
    expect(state.finished).toBe(true);
    expect(measures.wrongPrevented).toBe(measures.wrongArrived);
    expect(measures.control).toBe(1);
    expect(findings(state, measures)).toHaveLength(0);
  });

  it("stops a paused class from arriving live, with one state change", () => {
    const state = reduce(createState(fullSpec()), {
      type: "pause",
      actionClass: "consequential",
    });
    const finished = reduce(state, { type: "approveRest" });
    const consequential = finished.items.filter(
      (item) => item.decision.actionClass === "consequential",
    );
    expect(consequential.every((item) => item.status === "paused")).toBe(true);
    expect(consequential.every((item) => item.effect === "prevented")).toBe(
      true,
    );
    expect(measure(finished).wrongTookEffect).toBe(0);
  });

  it("is recordable as a control", () => {
    const state = createState(fullSpec());
    const result = verdict(state, measure(state));
    expect(result.recordedAs).toBe("control");
    expect(result.tone).toBe("good");
  });

  it("measures the share reaching the reviewer inside the target", () => {
    const state = attentiveRun(createState(fullSpec()));
    const measures = measure(state);
    expect(measures.insideTarget).not.toBeNull();
    expect(measures.insideTarget).toBeGreaterThan(0);
  });
});

describe("one field at a time", () => {
  it("a preventable action with no disagreement rule still takes effect on rejection", () => {
    const spec = { ...emptySpec(), actions_preventable: true };
    const state = reduce(createState(spec), {
      type: "reject",
      justification:
        "The documentation is on file; the router read a stale snapshot.",
    });
    expect(state.items[0].effect).toBe("took_effect");
  });

  it("a preventable action with a disagreement rule is prevented on rejection", () => {
    const spec = {
      ...emptySpec(),
      actions_preventable: true,
      on_disagreement: true,
    };
    const state = reduce(createState(spec), { type: "reject" });
    expect(state.items[0].effect).toBe("prevented");
  });

  it("a pause is unreachable without states_alterable", () => {
    const state = createState(emptySpec());
    expect(reduce(state, { type: "pause", actionClass: "routine" })).toBe(
      state,
    );
  });

  it("toggling a field mid-run applies from the next beat", () => {
    const started = reduce(createState(emptySpec()), { type: "approve" });
    const toggled = reduce(started, {
      type: "toggle",
      field: "actions_preventable",
    });
    const next = reduce(toggled, { type: "approve" });
    const newest = next.items[next.items.length - 1];
    expect(newest.executedOnArrival).toBe(false);
  });
});
