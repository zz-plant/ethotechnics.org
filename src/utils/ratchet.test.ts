import { describe, expect, it } from "bun:test";

import schema from "../../public/standards/authority-grant.schema.json";
import {
  accrete,
  authorizedHistory,
  EXPANSION_REASON,
  RATCHET,
} from "./ratchet";

describe("the ratchet", () => {
  it("doubles the scope in three years without a single review", () => {
    const result = accrete(RATCHET);
    expect(result.reviewsFired).toBe(0);
    expect(result.finalScope).toBeGreaterThan(2);
    expect(result.scope).toHaveLength(RATCHET.months + 1);
  });

  it("would fire every month if the threshold were the step size", () => {
    const result = accrete({ ...RATCHET, reviewThresholdPct: RATCHET.stepPct });
    expect(result.reviewsFired).toBe(RATCHET.months);
  });
});

describe("the authorized history", () => {
  it("records one issue and one expansion per widening", () => {
    const history = authorizedHistory(RATCHET);
    expect(history).toHaveLength(RATCHET.months + 1);
    expect(history[0].reason).toBe("issued");
    expect(
      history.slice(1).every((entry) => entry.reason === EXPANSION_REASON),
    ).toBe(true);
  });

  it("uses transition reasons and states the grant schema allows", () => {
    const reasons: string[] =
      schema.properties.state_history.items.properties.reason.enum;
    const from: string[] =
      schema.properties.state_history.items.properties.from.enum;
    const to: string[] =
      schema.properties.state_history.items.properties.to.enum;
    expect(reasons).toContain(EXPANSION_REASON);
    for (const entry of authorizedHistory(RATCHET)) {
      expect(reasons).toContain(entry.reason);
      expect(from).toContain(entry.from);
      expect(to).toContain(entry.to);
    }
  });
});
