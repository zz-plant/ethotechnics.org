import type { APIRoute } from "astro";
import {
  buildSnapshot,
  runDelegationAudit,
} from "../../features/delegation-audit/auditLogic";
import { resolveEnv } from "../../utils/cloudflare-env";
import { loadReadout, type ReadoutEnv } from "../../utils/readouts";

/** The stored inputs and the tool's current result for them, as one object. */
export const GET: APIRoute = async ({ params, locals }) => {
  const store = (await resolveEnv<ReadoutEnv>(locals))?.READOUTS;
  const record = store ? await loadReadout(store, params.id ?? "") : null;
  if (!record) {
    return new Response(JSON.stringify({ error: "Readout not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
  const result = runDelegationAudit(record.inputs);
  const snapshot = buildSnapshot(record.inputs, result, record.captured_at);
  return new Response(JSON.stringify({ id: params.id, ...snapshot }, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
};
