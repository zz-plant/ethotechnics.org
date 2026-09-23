import { describe, expect, it } from "bun:test";

import {
  cases,
  stateVariables,
  type Case,
  type StateVariableId,
  type Verdict,
} from "../content/casebook";
import {
  FALLBACK_CASE_SLUG,
  pickCase,
  pickNextStep,
  variableForTopic,
} from "./next-step";

const fixture = (
  slug: string,
  verdicts: Partial<Record<StateVariableId, Verdict>>,
): Case =>
  ({
    slug,
    title: slug,
    findings: stateVariables.map(({ id }) => ({
      variable: id,
      verdict: verdicts[id] ?? "held",
      finding: "",
      clauses: [],
      laws: [id === "standing" ? "VII" : "II"],
    })),
  }) as unknown as Case;

const fixtures: Case[] = [
  fixture("broad", { standing: "failed", evidence: "failed" }),
  fixture("robodebt", { authority: "failed", standing: "failed" }),
  fixture("narrow", { standing: "failed" }),
  fixture("drift-only", { dependency: "drifted" }),
];

describe("variableForTopic", () => {
  it("maps plain topic words to a state variable", () => {
    expect(variableForTopic("Contestability")).toBe("standing");
    expect(variableForTopic("decision-appealed")).toBe("standing");
    expect(variableForTopic("Authority as lease")).toBe("authority");
    expect(variableForTopic("Repair log", "repair-log")).toBe("correction");
    expect(variableForTopic("Failure state: Can’t stop")).toBe("correction");
    expect(variableForTopic("Vendor lock-in")).toBe("dependency");
    expect(variableForTopic("Evidence pack")).toBe("evidence");
    expect(variableForTopic("Model drift")).toBe("capability");
  });

  it("scores by hit count and breaks ties by variable order", () => {
    expect(variableForTopic("appeal and recourse after a stop")).toBe(
      "standing",
    );
    expect(variableForTopic("audit", "appeal")).toBe("evidence");
  });

  it("returns undefined when nothing matches", () => {
    expect(variableForTopic("Institute", undefined, null)).toBeUndefined();
    expect(variableForTopic()).toBeUndefined();
  });
});

describe("pickCase", () => {
  it("takes the failed case with the fewest failures", () => {
    const pick = pickCase("standing", fixtures);
    expect(pick.entry.slug).toBe("narrow");
    expect(pick.finding.variable).toBe("standing");
    expect(pick.finding.verdict).toBe("failed");
    expect(pick.law).toBe("VII");
  });

  it("breaks ties by casebook order", () => {
    expect(pickCase("evidence", fixtures).entry.slug).toBe("broad");
    expect(pickCase("authority", fixtures).entry.slug).toBe("robodebt");
  });

  it("falls back to Robodebt's finding for a variable no case failed", () => {
    const pick = pickCase("dependency", fixtures);
    expect(pick.entry.slug).toBe(FALLBACK_CASE_SLUG);
    expect(pick.finding.variable).toBe("dependency");
  });

  it("falls back to Robodebt's first failure with no variable", () => {
    const pick = pickCase(undefined, fixtures);
    expect(pick.entry.slug).toBe(FALLBACK_CASE_SLUG);
    expect(pick.finding.verdict).toBe("failed");
  });
});

describe("pickNextStep against the casebook", () => {
  it("keeps the fallback case in the casebook", () => {
    expect(cases.some((entry) => entry.slug === FALLBACK_CASE_SLUG)).toBe(true);
  });

  it("returns a finding for the requested variable and a law it cites", () => {
    for (const { id } of stateVariables) {
      const pick = pickCase(id);
      expect(pick.finding.variable, id).toBe(id);
      expect(pick.finding.laws, id).toContain(pick.law);
    }
  });

  it("is deterministic for the same topic", () => {
    const first = pickNextStep("Contestability", "contestability");
    const second = pickNextStep("Contestability", "contestability");
    expect(first.entry.slug).toBe(second.entry.slug);
  });
});
