import { describe, expect, it } from "bun:test";

import schema from "../../../public/standards/dependency-record.schema.json";
import {
  ALTERNATIVE_STATUSES,
  CAPACITY_STATUSES,
  EXPOSURE_TOLERANCE,
  exposureScore,
  LEVELS,
  preservedCapacities,
  recordExcerpt,
  rehearse,
  REHEARSAL_OUTCOMES,
  replenishAlternative,
  report,
  retainExpertise,
  verdict,
  YEAR_ONE,
  YEAR_THREE,
} from "./withdrawalLogic";

describe("the figure is held to the dependency record", () => {
  it("draws the three levels the schema requires", () => {
    expect([...LEVELS].sort()).toEqual(
      [...schema.properties.reversibility.required].sort(),
    );
  });

  it("offers the rehearsal outcomes the schema allows", () => {
    expect([...REHEARSAL_OUTCOMES].sort()).toEqual(
      [
        ...schema.properties.last_withdrawal_rehearsal.properties.outcome.enum,
      ].sort(),
    );
  });

  it("offers the alternative statuses the schema allows", () => {
    expect([...ALTERNATIVE_STATUSES].sort()).toEqual(
      [...schema.properties.alternatives.items.properties.status.enum].sort(),
    );
  });

  it("reports preserved capacities in the schema's statuses", () => {
    expect([...CAPACITY_STATUSES].sort()).toEqual(
      [
        ...schema.properties.preserved_capacities.items.properties.status.enum,
      ].sort(),
    );
    for (const capacity of preservedCapacities(YEAR_THREE)) {
      expect(CAPACITY_STATUSES).toContain(capacity.status);
    }
  });

  it("computes the exposure score by the schema's formula", () => {
    const score = exposureScore(YEAR_ONE);
    expect(score.score).toBe(
      score.dependency_depth *
        score.substitution_cost *
        score.correction_latency,
    );
    for (const key of schema.properties.exposure_score.required) {
      expect(score).toHaveProperty(key);
    }
  });

  it("emits feasibility as the schema shapes it", () => {
    const excerpt = recordExcerpt(YEAR_ONE);
    for (const level of LEVELS) {
      expect(excerpt.reversibility[level]).toHaveProperty("feasible");
      expect(excerpt.reversibility[level]).toHaveProperty("evidence");
    }
  });
});

describe("the switch stays green while the verdict decays", () => {
  it("is technically feasible in every state", () => {
    expect(report(YEAR_ONE).technical.feasible).toBe(true);
    expect(report(YEAR_THREE).technical.feasible).toBe(true);
  });

  it("cannot be thrown in year three", () => {
    const levels = report(YEAR_THREE);
    expect(levels.operational.feasible).toBe(false);
    expect(levels.institutional.feasible).toBe(false);
    expect(verdict(levels).thrown).toBe(false);
    expect(verdict(levels).tone).toBe("bad");
  });

  it("is only a rehearsal away in year one", () => {
    const before = report(YEAR_ONE);
    expect(before.operational.feasible).toBe(false);
    expect(before.institutional.feasible).toBe(true);
    expect(verdict(before).tone).toBe("warn");
    const after = report(rehearse(YEAR_ONE));
    expect(after.operational.feasible).toBe(true);
    expect(verdict(after).thrown).toBe(true);
  });

  it("fails a rehearsal when nobody retains the expertise", () => {
    const nobody = { ...YEAR_ONE, expertiseRoles: 0 };
    expect(rehearse(nobody).rehearsal).toBe("failed");
    expect(report(rehearse(nobody)).operational.feasible).toBe(false);
  });

  it("does not let rehearsal alone move the institutional level in year three", () => {
    const rehearsed = report(rehearse(YEAR_THREE));
    expect(rehearsed.institutional.feasible).toBe(false);
  });

  it("lowers exposure when the alternative is replenished", () => {
    const degraded = exposureScore(YEAR_THREE).score;
    const replenished = exposureScore(replenishAlternative(YEAR_THREE)).score;
    expect(replenished).toBeLessThan(degraded);
  });

  it("restores currency when expertise is retained", () => {
    const retained = retainExpertise(YEAR_THREE);
    expect(retained.expertiseMonthsSince).toBe(0);
    expect(retained.expertiseRoles).toBeGreaterThanOrEqual(2);
  });

  it("sits under the tolerance in year one and far over it in year three", () => {
    expect(exposureScore(YEAR_ONE).score).toBeLessThan(EXPOSURE_TOLERANCE);
    expect(exposureScore(YEAR_THREE).score).toBeGreaterThan(
      EXPOSURE_TOLERANCE * 5,
    );
  });

  it("handles negative and NaN inputs safely without producing negative or NaN scores", () => {
    const score = exposureScore({
      ...YEAR_ONE,
      dependents: -5,
      substitutionWeeks: NaN,
      correctionLatencyHours: -12,
    });
    expect(Number.isFinite(score.score)).toBe(true);
    expect(score.score).toBe(0);
    expect(score.dependency_depth).toBe(0);
    expect(score.correction_latency).toBe(0);
  });
});
