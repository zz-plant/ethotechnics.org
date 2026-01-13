import type { APIRoute } from "astro";

const repoSlug = "ethotechnics/et3";

export const GET: APIRoute = () => {
  const payload = {
    meta: {
      generatedAt: new Date().toISOString(),
      repo: repoSlug,
    },
    badges: {
      siteChecks: {
        label: "Site checks",
        image: `https://github.com/${repoSlug}/actions/workflows/site-checks.yml/badge.svg`,
        href: `https://github.com/${repoSlug}/actions/workflows/site-checks.yml`,
      },
      license: {
        label: "CC BY-SA 4.0",
        image: "https://licensebuttons.net/l/by-sa/4.0/88x31.png",
        href: "https://creativecommons.org/licenses/by-sa/4.0/",
      },
    },
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
