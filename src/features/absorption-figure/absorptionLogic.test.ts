import { describe, expect, it } from "bun:test";

import { evalsContent } from "../../content/evals";
import {
  ABSORPTION_LAYER,
  absorbedShare,
  DEFAULT_PARAMS,
  dependence,
  EVENT_MONTH,
  eventJump,
  LAYER_SEES,
  MONTHS,
  simulate,
  trueRate,
} from "./absorptionLogic";

describe("the instrument and the truth", () => {
  it("never reports more than the true rate", () => {
    for (const point of simulate(DEFAULT_PARAMS)) {
      expect(point.reported).toBeLessThanOrEqual(point.trueRate);
    }
  });

  it("reports exactly the true rate when nobody absorbs", () => {
    for (const point of simulate({ ...DEFAULT_PARAMS, competence: 0 })) {
      expect(point.reported).toBeCloseTo(point.trueRate, 10);
    }
  });

  it("keeps the true rate close to flat", () => {
    const rates = Array.from({ length: MONTHS + 1 }, (_, m) => trueRate(m));
    expect(Math.max(...rates) - Math.min(...rates)).toBeLessThan(0.015);
  });

  it("improves the reported rate as dependence deepens", () => {
    const points = simulate(DEFAULT_PARAMS);
    expect(dependence(MONTHS)).toBeGreaterThan(dependence(0));
    expect(points[MONTHS].reported).toBeLessThan(points[0].reported);
    expect(points[MONTHS].absorbed).toBeGreaterThan(points[0].absorbed);
  });

  it("is the same on every run", () => {
    expect(simulate(DEFAULT_PARAMS)).toEqual(simulate(DEFAULT_PARAMS));
  });
});

describe("the concealment ending", () => {
  it("jumps when the system is extended to a site with no absorbers", () => {
    const jump = eventJump(simulate({ ...DEFAULT_PARAMS, extend: true }));
    expect(jump).toBeGreaterThan(1);
  });

  it("jumps when the absorbing staff are cut", () => {
    const jump = eventJump(simulate({ ...DEFAULT_PARAMS, cut: true }));
    expect(jump).toBeGreaterThan(0.5);
  });

  it("does not move the true rate at the event", () => {
    const points = simulate({ ...DEFAULT_PARAMS, extend: true, cut: true });
    expect(
      Math.abs(points[EVENT_MONTH].trueRate - points[EVENT_MONTH - 1].trueRate),
    ).toBeLessThan(0.01);
  });

  it("leaves the months before the event untouched", () => {
    const quiet = simulate(DEFAULT_PARAMS);
    const loud = simulate({ ...DEFAULT_PARAMS, extend: true });
    expect(loud.slice(0, EVENT_MONTH)).toEqual(quiet.slice(0, EVENT_MONTH));
  });

  it("caps the absorbed share below one", () => {
    expect(
      absorbedShare(MONTHS, 1, { extend: false, cut: false }),
    ).toBeLessThan(1);
  });
});

describe("the layering point is held to the evaluation stack", () => {
  it("names every layer the eval index names, and no others", () => {
    const fromEvals = evalsContent.evaluationStack.layers
      .map((layer) => layer.id)
      .sort();
    expect(Object.keys(LAYER_SEES).sort()).toEqual(fromEvals);
  });

  it("places the evaluation that sees absorption at the institution", () => {
    expect(
      evalsContent.evaluationStack.layers.some(
        (layer) => layer.id === ABSORPTION_LAYER,
      ),
    ).toBe(true);
    expect(LAYER_SEES[ABSORPTION_LAYER]).toContain("shadow");
  });

  it("handles empty/short points arrays and NaN competence safely", () => {
    expect(eventJump([])).toBe(0);
    expect(eventJump(null as unknown as [])).toBe(0);

    const points = simulate({ ...DEFAULT_PARAMS, competence: NaN });
    expect(points).toHaveLength(MONTHS + 1);
    for (const p of points) {
      expect(Number.isFinite(p.reported)).toBe(true);
      expect(Number.isFinite(p.absorbed)).toBe(true);
      expect(Number.isFinite(p.uncounted)).toBe(true);
    }
  });
});
