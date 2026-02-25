import wasmUrl from "@resvg/resvg-wasm/index_bg.wasm?url";

const DEFAULT_TITLE = "Ethotechnics Institute";
const DEFAULT_DESCRIPTION =
  "Standards, mechanisms, and validators for accountable system governance.";
const WIDTH = 1200;
const HEIGHT = 630;

const OG_TEMPLATES = [
  "default",
  "home",
  "standards",
  "glossary",
  "taxonomy",
  "mechanisms",
  "editorial",
] as const;

type OgTemplate = (typeof OG_TEMPLATES)[number];

type TemplateStyle = {
  label: string;
  kicker: string;
  gradientStart: string;
  gradientEnd: string;
  accent: string;
  marker: string;
};

const templateStyles: Record<OgTemplate, TemplateStyle> = {
  default: {
    label: "Reference",
    kicker: "Accountable systems, made legible",
    gradientStart: "#f6f2e9",
    gradientEnd: "#efe8dc",
    accent: "#5c5348",
    marker: "◆",
  },
  home: {
    label: "Institute",
    kicker: "The reference standard for accountable systems",
    gradientStart: "#efe8dc",
    gradientEnd: "#e7ddcf",
    accent: "#5f4a2f",
    marker: "◎",
  },
  standards: {
    label: "Standards",
    kicker: "Public technical standards for governance",
    gradientStart: "#eceff6",
    gradientEnd: "#e0e8f8",
    accent: "#304b73",
    marker: "◈",
  },
  glossary: {
    label: "Glossary",
    kicker: "Operational language for ethical technology",
    gradientStart: "#eef5ed",
    gradientEnd: "#e3efe0",
    accent: "#2f6346",
    marker: "◉",
  },
  taxonomy: {
    label: "Taxonomy",
    kicker: "Design and governance domains in context",
    gradientStart: "#f2edf7",
    gradientEnd: "#e7deef",
    accent: "#5f477d",
    marker: "⬢",
  },
  mechanisms: {
    label: "Mechanisms",
    kicker: "Implementation patterns and reusable primitives",
    gradientStart: "#edf2f7",
    gradientEnd: "#dfe8f3",
    accent: "#2f536f",
    marker: "✦",
  },
  editorial: {
    label: "Editorial",
    kicker: "Research, incidents, and field notes",
    gradientStart: "#f7efea",
    gradientEnd: "#efdfd6",
    accent: "#7a4334",
    marker: "✶",
  },
};

const MAX_TITLE_CHARS = 98;
const MAX_DESCRIPTION_CHARS = 185;

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const trimToLength = (value: string, maxLength: number) => {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
};

const normalizePath = (value?: string) => {
  if (!value) return "/";
  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.toLowerCase();
};

const isOgTemplate = (value: string): value is OgTemplate =>
  OG_TEMPLATES.includes(value as OgTemplate);

const inferTemplateFromPath = (path?: string): OgTemplate => {
  const normalizedPath = normalizePath(path);

  if (normalizedPath === "/") return "home";
  if (normalizedPath.startsWith("/standards")) return "standards";
  if (normalizedPath.startsWith("/glossary")) return "glossary";
  if (
    normalizedPath.startsWith("/taxonomy") ||
    normalizedPath.startsWith("/governance") ||
    normalizedPath.startsWith("/delivery") ||
    normalizedPath.startsWith("/assurance") ||
    normalizedPath.startsWith("/experience")
  ) {
    return "taxonomy";
  }
  if (
    normalizedPath.startsWith("/mechanisms") ||
    normalizedPath.startsWith("/library") ||
    normalizedPath.startsWith("/validators")
  ) {
    return "mechanisms";
  }
  if (
    normalizedPath.startsWith("/research") ||
    normalizedPath.startsWith("/incidents") ||
    normalizedPath.startsWith("/field-notes") ||
    normalizedPath.startsWith("/explainers")
  ) {
    return "editorial";
  }

  return "default";
};

const resolveOgTemplate = (template?: string, path?: string): OgTemplate => {
  const normalizedTemplate = template?.trim().toLowerCase();
  if (normalizedTemplate && isOgTemplate(normalizedTemplate)) {
    return normalizedTemplate;
  }

  return inferTemplateFromPath(path);
};

const buildOgSvg = (
  title: string,
  description: string,
  options?: { template?: string; path?: string },
) => {
  const ogTemplate = resolveOgTemplate(options?.template, options?.path);
  const style = templateStyles[ogTemplate];
  const safeTitle = escapeXml(trimToLength(title, MAX_TITLE_CHARS));
  const safeDescription = escapeXml(
    trimToLength(description, MAX_DESCRIPTION_CHARS),
  );
  const safeKicker = escapeXml(style.kicker);
  const safeLabel = escapeXml(style.label);
  const safeMarker = escapeXml(style.marker);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-gradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${style.gradientStart}" />
      <stop offset="100%" stop-color="${style.gradientEnd}" />
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg-gradient)" />
  <rect x="48" y="48" width="${WIDTH - 96}" height="${HEIGHT - 96}" rx="32" fill="#fdfbf7" stroke="#d9d1c3" />
  <rect x="48" y="531" width="${WIDTH - 96}" height="51" rx="0" fill="${style.accent}" />
  <circle cx="1044" cy="152" r="56" fill="none" stroke="${style.accent}" stroke-width="2" />
  <circle cx="1044" cy="152" r="28" fill="none" stroke="${style.accent}" stroke-width="1.5" />
  <path d="M1044 128L1056 152L1044 176L1032 152Z" fill="none" stroke="${style.accent}" stroke-width="1.5" />
  <foreignObject x="96" y="100" width="${WIDTH - 192}" height="${HEIGHT - 230}">
    <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex;flex-direction:column;gap:20px;height:100%;font-family:'Plus Jakarta Sans','Helvetica Neue',Arial,sans-serif;color:#1a1713;">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:16px;">
        <div style="font-size:20px;letter-spacing:0.2em;text-transform:uppercase;color:#7a6f62;">Ethotechnics Institute</div>
        <div style="font-size:20px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${style.accent};">${safeLabel}</div>
      </div>
      <div style="font-size:60px;font-weight:650;line-height:1.08;max-width:900px;">${safeTitle}</div>
      <div style="font-size:28px;line-height:1.35;color:#433d35;max-width:900px;">${safeDescription}</div>
      <div style="margin-top:auto;font-size:21px;line-height:1.35;color:${style.accent};font-weight:600;">${safeMarker} ${safeKicker}</div>
    </div>
  </foreignObject>
</svg>`;
};

let resvgInitPromise: Promise<void> | null = null;

const initResvg = async () => {
  if (!resvgInitPromise) {
    resvgInitPromise = (async () => {
      const [{ initWasm }, response] = await Promise.all([
        import("@resvg/resvg-wasm"),
        fetch(wasmUrl),
      ]);
      await initWasm(await response.arrayBuffer());
    })();
  }

  await resvgInitPromise;
};

const renderOgPng = async (
  title: string,
  description: string,
  options?: { template?: string; path?: string },
) => {
  await initResvg();
  const { Resvg } = await import("@resvg/resvg-wasm");
  const svg = buildOgSvg(title, description, options);
  const renderer = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: WIDTH,
    },
  });

  return renderer.render().asPng();
};

export {
  buildOgSvg,
  renderOgPng,
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  HEIGHT,
  WIDTH,
  OG_TEMPLATES,
  resolveOgTemplate,
};
