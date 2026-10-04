import { describe, expect, it } from "bun:test";

import grantSchema from "../../public/standards/authority-grant.schema.json";
import reconsiderationSchema from "../../public/standards/reconsideration.schema.json";
import {
  buildReconsideration,
  describeWire,
  TILES,
  TRIGGER_KINDS,
  WIRE_TARGETS,
} from "./theater-test";

describe("the theater test is held to the published objects", () => {
  it("offers exactly the trigger kinds a reconsideration may cite", () => {
    const fromSchema = [
      ...reconsiderationSchema.properties.trigger.properties.kind.enum,
    ].sort();
    expect([...TRIGGER_KINDS].sort()).toEqual(fromSchema);
  });

  it("wires only to states the grant can be in, and never back to allowed", () => {
    const states: string[] = grantSchema.properties.state.enum;
    for (const target of WIRE_TARGETS) {
      expect(states).toContain(target);
    }
    expect(WIRE_TARGETS).not.toContain("allowed");
  });

  it("emits a record with every field the schema requires", () => {
    const [tile] = TILES;
    const record = buildReconsideration(
      tile,
      { tileId: tile.id, trigger: "elapsed_time", to: "review_required" },
      "2026-09-15T00:00:00.000Z",
      1,
    );
    for (const key of reconsiderationSchema.required) {
      expect(record).toHaveProperty(key);
    }
    expect(record.schema_version).toMatch(
      new RegExp(reconsiderationSchema.properties.schema_version.pattern),
    );
    expect(reconsiderationSchema.properties.outcome.enum).toContain(
      record.outcome,
    );
    expect(
      reconsiderationSchema.properties.subject.properties.kind.enum,
    ).toContain(record.subject.kind);
    expect(record.evidence_delta).toContain(tile.reading);
  });

  it("states the rule in the words the record carries", () => {
    const [tile] = TILES;
    const rule = describeWire(tile, {
      tileId: tile.id,
      trigger: "incident",
      to: "suspended",
    });
    expect(rule).toContain("an incident is opened");
    expect(rule).toContain("suspended");
  });
});

describe("the dashboard as usually built", () => {
  it("has six tiles with distinct ids", () => {
    expect(TILES).toHaveLength(6);
    expect(new Set(TILES.map((tile) => tile.id)).size).toBe(6);
  });

  it("carries the oversight tile the essay names as beside the loop", () => {
    expect(TILES.some((tile) => tile.kind === "oversight")).toBe(true);
  });
});
