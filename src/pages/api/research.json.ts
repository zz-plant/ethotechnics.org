import type { APIRoute } from "astro";

import { researchContent } from "../../content/research";

export const GET: APIRoute = async () => {
  const payload = {
    meta: {
      generatedAt: new Date().toISOString(),
      permalink: researchContent.permalink,
      updated: researchContent.updated,
    },
    orientation: researchContent.orientationCards,
    bridgeArtifacts: researchContent.bridgeArtifacts,
    agenda: researchContent.agenda,
    focusAreas: researchContent.focusAreas,
    publications: researchContent.publications,
    standardsTimeline: researchContent.standardsTimeline,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
