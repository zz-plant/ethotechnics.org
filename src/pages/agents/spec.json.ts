import type { APIRoute } from "astro";
import agentSafetyObjectModel from "../../data/agents-spec.json";

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(JSON.stringify(agentSafetyObjectModel, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
