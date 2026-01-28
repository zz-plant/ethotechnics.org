import type { APIContext } from "astro";

const DEFAULT_TITLE = "Ethotechnics Institute";
const DEFAULT_DESCRIPTION =
  "Standards, mechanisms, and validators for accountable system governance.";
const WIDTH = 1200;
const HEIGHT = 630;

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const buildSvg = (title: string, description: string) => {
  const safeTitle = escapeXml(title);
  const safeDescription = escapeXml(description);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-gradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f6f2e9" />
      <stop offset="100%" stop-color="#efe8dc" />
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg-gradient)" />
  <rect x="48" y="48" width="${WIDTH - 96}" height="${HEIGHT - 96}" rx="32" fill="#fdfbf7" stroke="#d9d1c3" />
  <foreignObject x="96" y="110" width="${WIDTH - 192}" height="${HEIGHT - 220}">
    <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex;flex-direction:column;gap:24px;height:100%;font-family:'Plus Jakarta Sans','Helvetica Neue',Arial,sans-serif;color:#1a1713;">
      <div style="font-size:20px;letter-spacing:0.2em;text-transform:uppercase;color:#7a6f62;">Ethotechnics Institute</div>
      <div style="font-size:64px;font-weight:600;line-height:1.1;">${safeTitle}</div>
      <div style="font-size:28px;line-height:1.4;color:#5c5348;">${safeDescription}</div>
    </div>
  </foreignObject>
  <circle cx="1044" cy="152" r="56" fill="none" stroke="#1a1713" stroke-width="2" />
  <circle cx="1044" cy="152" r="28" fill="none" stroke="#1a1713" stroke-width="1.5" />
  <path d="M1044 128L1056 152L1044 176L1032 152Z" fill="none" stroke="#1a1713" stroke-width="1.5" />
</svg>`;
};

export function GET({ request }: APIContext) {
  const url = new URL(request.url);
  const title = url.searchParams.get("title")?.trim() || DEFAULT_TITLE;
  const description =
    url.searchParams.get("description")?.trim() || DEFAULT_DESCRIPTION;

  return new Response(buildSvg(title, description), {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
