import { describe, expect, it } from "bun:test";

import {
  allAgent,
  allHuman,
  assertPropertyCopy,
  createState,
  fromChain,
  nothingRebuilt,
  properties,
  PROPERTY_IDS,
  setParty,
  speed,
  STEP_IDS,
  toggleRebuilt,
  type PropertyCopy,
} from "./frictionLogic";

const copy = (ids: string[]): PropertyCopy[] =>
  ids.map((id) => ({
    id: id as PropertyCopy["id"],
    title: id,
    provided: "",
    removed: "",
    rebuilt: "",
    rebuiltRef: { label: "", href: "" },
  }));

describe("the accidental control system", () => {
  it("supplies all five properties in full when every step is a person", () => {
    const values = fromChain(allHuman());
    for (const id of PROPERTY_IDS) {
      expect(values[id]).toBe(1);
    }
  });

  it("supplies none of them when the agent is the whole chain", () => {
    const values = fromChain(allAgent());
    for (const id of PROPERTY_IDS) {
      expect(values[id]).toBe(0);
    }
  });

  it("is slow exactly where it is safe", () => {
    expect(speed(allHuman()).cycleHours).toBeGreaterThan(90);
    expect(speed(allAgent()).cycleHours).toBeLessThan(1);
    expect(speed(allAgent()).perDay).toBeGreaterThan(speed(allHuman()).perDay);
  });

  it("loses renewal most completely: one person at the start renews nothing after", () => {
    const chain = { ...allAgent(), gather: "human" as const };
    const values = fromChain(chain);
    expect(values.renewal).toBe(0);
    expect(values.stoppability).toBeGreaterThan(0);
  });

  it("treats the agent as one party, so two agent steps in a row add no review", () => {
    const one = { ...allHuman(), draft: "agent" as const };
    const two = { ...one, check: "agent" as const };
    expect(fromChain(two).review).toBeLessThan(fromChain(one).review);
    expect(fromChain(two).diversity).toBeLessThan(fromChain(one).diversity);
  });
});

describe("rebuilding on purpose", () => {
  it("restores one property in full without touching the others or the speed", () => {
    let state = createState();
    for (const step of STEP_IDS) state = setParty(state, step, "agent");
    const before = properties(state);
    const after = properties(toggleRebuilt(state, "renewal"));
    expect(after.renewal).toBe(1);
    for (const id of PROPERTY_IDS.filter((entry) => entry !== "renewal")) {
      expect(after[id]).toBe(before[id]);
    }
    expect(speed(state.chain).label).toContain("minutes");
  });

  it("starts with nothing rebuilt", () => {
    expect(Object.values(nothingRebuilt()).every((value) => !value)).toBe(true);
  });
});

describe("the essay's copy is held to the figure", () => {
  it("accepts the five properties in any order and returns them in the figure's", () => {
    const ordered = assertPropertyCopy(
      copy(["renewal", "review", "latency", "stoppability", "diversity"]),
    );
    expect(ordered.map((entry) => entry.id)).toEqual([...PROPERTY_IDS]);
  });

  it("fails the build when the essay drops or renames one", () => {
    expect(() => assertPropertyCopy(copy(["review", "latency"]))).toThrow();
    expect(() =>
      assertPropertyCopy(
        copy(["review", "latency", "diversity", "stoppability", "hesitation"]),
      ),
    ).toThrow();
  });
});
