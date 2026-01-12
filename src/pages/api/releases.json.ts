import type { APIRoute } from "astro";

import { releaseInfo } from "../../utils/api";

const releases = [
  {
    id: releaseInfo.id,
    label: releaseInfo.label,
    date: releaseInfo.date,
    href: releaseInfo.permalink,
    endpoints: {
      siteIndex: `${releaseInfo.permalink}/site-index.json`,
      standards: `${releaseInfo.permalink}/standards.json`,
      clauses: `${releaseInfo.permalink}/clauses.json`,
      mechanisms: `${releaseInfo.permalink}/mechanisms.json`,
      validators: `${releaseInfo.permalink}/validators.json`,
      glossary: `${releaseInfo.permalink}/glossary.json`,
      findings: `${releaseInfo.permalink}/findings.json`,
      diagnosticResults: `${releaseInfo.permalink}/diagnostic-results.json`,
      antiPatterns: `${releaseInfo.permalink}/anti-patterns.json`,
      evidencePacks: `${releaseInfo.permalink}/evidence-packs.json`,
      ragCorpus: `${releaseInfo.permalink}/rag-corpus.jsonl`,
    },
  },
];

export const GET: APIRoute = () => {
  const payload = {
    meta: {
      generatedAt: new Date().toISOString(),
      count: releases.length,
    },
    releases,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
