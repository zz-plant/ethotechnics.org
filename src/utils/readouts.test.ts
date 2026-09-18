import { describe, expect, it } from "bun:test";

import { buildDefaultInput } from "../features/delegation-audit/config";
import {
  isReadoutId,
  loadReadout,
  newReadoutId,
  readoutRequestSchema,
  saveReadout,
  type ReadoutStore,
} from "./readouts";

const memoryStore = (): ReadoutStore & { data: Map<string, string> } => {
  const data = new Map<string, string>();
  return {
    data,
    get: async (key) => data.get(key) ?? null,
    put: async (key, value) => {
      data.set(key, value);
    },
  };
};

describe("readout ids", () => {
  it("are sixteen characters from the unambiguous alphabet", () => {
    for (let i = 0; i < 50; i += 1) {
      const id = newReadoutId();
      expect(isReadoutId(id)).toBe(true);
    }
    expect(isReadoutId("readout:abc")).toBe(false);
    expect(isReadoutId("l0o1l0o1l0o1l0o1")).toBe(false);
    expect(isReadoutId("")).toBe(false);
  });

  it("derive from the bytes given", () => {
    const zeros = newReadoutId((bytes) => bytes.fill(0));
    expect(zeros).toBe("aaaaaaaaaaaaaaaa");
  });
});

describe("readout schema", () => {
  it("accepts the tool's default input", () => {
    const parsed = readoutRequestSchema.safeParse({
      tool_id: "delegation-audit",
      inputs: buildDefaultInput(),
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects unknown tools, oversize fields, and bad enums", () => {
    const inputs = buildDefaultInput();
    expect(
      readoutRequestSchema.safeParse({ tool_id: "other", inputs }).success,
    ).toBe(false);
    expect(
      readoutRequestSchema.safeParse({
        tool_id: "delegation-audit",
        inputs: { ...inputs, workflow: "x".repeat(201) },
      }).success,
    ).toBe(false);
    expect(
      readoutRequestSchema.safeParse({
        tool_id: "delegation-audit",
        inputs: { ...inputs, canStop: "maybe" },
      }).success,
    ).toBe(false);
  });
});

describe("readout storage", () => {
  it("round-trips inputs and nothing else", async () => {
    const store = memoryStore();
    const inputs = { ...buildDefaultInput(), workflow: "Refund approvals" };
    const { id } = await saveReadout(
      store,
      { tool_id: "delegation-audit", inputs },
      "2026-09-17T12:00:00.000Z",
    );
    expect(isReadoutId(id)).toBe(true);

    const stored = JSON.parse(store.data.get(`readout:${id}`) ?? "{}");
    // No result, score, or verdict is stored; the page recomputes them.
    expect(Object.keys(stored).sort()).toEqual([
      "captured_at",
      "inputs",
      "tool_id",
      "v",
    ]);

    const loaded = await loadReadout(store, id);
    expect(loaded?.inputs.workflow).toBe("Refund approvals");
    expect(loaded?.captured_at).toBe("2026-09-17T12:00:00.000Z");
  });

  it("returns null for unknown or malformed ids and corrupt records", async () => {
    const store = memoryStore();
    expect(await loadReadout(store, "not-an-id")).toBeNull();
    expect(await loadReadout(store, "bbbbbbbbbbbbbbbb")).toBeNull();
    store.data.set("readout:cccccccccccccccc", JSON.stringify({ v: 1 }));
    expect(await loadReadout(store, "cccccccccccccccc")).toBeNull();
  });
});
