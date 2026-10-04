import { expect, it } from "bun:test";
import type { APIContext } from "astro";
import { POST } from "../src/pages/api/evals/batch";

const request = (body: unknown) =>
  POST({
    request: new Request("https://example.test/api/evals/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  } as APIContext);

it("labels synthetic output and never claims operational verification", async () => {
  const response = await request({});
  const result = await response.json();
  expect(result.evidenceBasis).toBe("synthetic");
  expect(result.limitations).toContain(
    "No deployment or operational logs were inspected.",
  );
  expect(result.visibleScore.taskCompletionRate).toBeNull();
  expect(result.visibleScore.speedIndex).toBeNull();
  expect(
    result.results.every((r: { evidence: string }) =>
      r.evidence.startsWith("Synthetic scenario:"),
    ),
  ).toBe(true);
  expect(JSON.stringify(result)).not.toContain("verified in operational logs");
});

it.each([
  null,
  [],
  { condition: "bogus" },
  { condition: ["Condition C"] },
  { condition: {} },
  { condition: null },
  { systemName: 42 },
  { suiteId: false },
])("rejects malformed requests: %j", async (body) => {
  const response = await request(body);
  expect(response.status).toBe(400);
});
