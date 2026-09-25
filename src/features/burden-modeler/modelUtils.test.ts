import { describe, expect, it } from "bun:test";
import { burdenDrivers } from "./config";
import { buildDefaultRatings, calculateBurdenModel } from "./modelUtils";
import type { BurdenRatings } from "./types";

const withUniformRating = (rating: number): BurdenRatings =>
  burdenDrivers.reduce<BurdenRatings>((acc, driver) => {
    acc[driver.id] = rating;
    return acc;
  }, {} as BurdenRatings);

describe("calculateBurdenModel", () => {
  it("returns a healthy burden level for low scores", () => {
    const result = calculateBurdenModel(withUniformRating(1));

    expect(result.burdenLevel).toBe("Healthy");
    expect(result.burdenIndex).toBeGreaterThan(0);
    expect(result.hotspots).toHaveLength(3);
    expect(result.topSegments).toHaveLength(3);
  });

  it("raises the burden index as scores climb", () => {
    const baseline = calculateBurdenModel(withUniformRating(2)).burdenIndex;
    const elevated = calculateBurdenModel(withUniformRating(8)).burdenIndex;

    expect(elevated).toBeGreaterThan(baseline);
  });

  it("builds default ratings at midpoint", () => {
    const defaults = buildDefaultRatings();
    const values = Object.values(defaults);

    expect(values).toHaveLength(burdenDrivers.length);
    expect(values.every((value) => value === 5)).toBe(true);
  });

  it("handles NaN, negative, and out-of-bound ratings without producing NaN", () => {
    const badRatings: BurdenRatings = {
      ...withUniformRating(NaN),
      "decision-cadence": -10,
      "exception-handling": 999,
    };
    const result = calculateBurdenModel(badRatings);

    expect(Number.isFinite(result.burdenIndex)).toBe(true);
    expect(result.burdenIndex).toBeGreaterThanOrEqual(0);
    expect(result.burdenIndex).toBeLessThanOrEqual(100);
    for (const score of result.categoryScores) {
      expect(Number.isFinite(score.value)).toBe(true);
      expect(Number.isFinite(score.delta)).toBe(true);
    }
  });
});
