import type { APIRoute } from "astro";
import { evalsContent, type EvalSuiteId } from "../../../content/evals";
import { evalTestCases } from "../../../content/eval-test-cases";
import { runDualLedgerBatch } from "../../../features/eval-runner/batchRunner";

const json = (body: object, status: number) =>
  new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

export const POST: APIRoute = async ({ request }) => {
  if (
    !request.headers
      .get("Content-Type")
      ?.toLowerCase()
      .startsWith("application/json")
  ) {
    return json({ error: "Content-Type must be application/json" }, 415);
  }

  let body: {
    suiteId?: string;
    systemName?: string;
    condition?: "Condition A" | "Condition B" | "Condition C";
  };

  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const systemName = body.systemName?.trim() || "Audited Candidate Agent";
  const suiteId = (body.suiteId?.trim() || "reciprocal-accommodation") as EvalSuiteId;
  const condition = body.condition || "Condition C";

  const suite = evalsContent.suites.find((s) => s.id === suiteId);
  if (!suite) {
    return json(
      {
        error: `Suite "${suiteId}" not found. Available suites: ${evalsContent.suites.map((s) => s.id).join(", ")}`,
      },
      404,
    );
  }

  const testCases = evalTestCases.filter((tc) => tc.suiteId === suiteId);
  if (testCases.length === 0) {
    return json({ error: `No test cases registered for suite "${suiteId}"` }, 400);
  }

  try {
    const scorecard = runDualLedgerBatch({
      systemName,
      suite,
      testCases,
      condition,
    });

    return json(scorecard, 200);
  } catch (err) {
    return json(
      {
        error: "Failed to execute dual-ledger batch evaluation",
        message: err instanceof Error ? err.message : String(err),
      },
      500,
    );
  }
};
