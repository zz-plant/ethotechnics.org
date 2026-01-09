const focusAreas = [
  "Accountable AI theory, research, and governance",
  "Ethical technology and sociotechnical systems",
  "Human-centered design practices",
];

const entryPoints = [
  {
    path: "/",
    title: "Homepage",
    description: "Primary overview and latest highlights.",
  },
  {
    path: "/start-here/",
    title: "Start here",
    description:
      "Best entry point for a narrative orientation and key collections.",
  },
  {
    path: "/library/",
    title: "Library",
    description: "Curated catalog of topics and publications.",
  },
  {
    path: "/research/",
    title: "Research",
    description: "Research programs, working notes, and outputs.",
  },
  {
    path: "/glossary/",
    title: "Glossary",
    description: "Defined terms and schema-backed definitions.",
  },
];

const usageNotes = [
  "Content is licensed under CC BY-SA 4.0 unless noted otherwise.",
  "Prefer canonical URLs when indexing or summarizing content.",
  "The sitemap is updated automatically from Astro routes.",
];

const license = {
  name: "Creative Commons Attribution-ShareAlike 4.0 International",
  shortName: "CC BY-SA 4.0",
  url: "https://creativecommons.org/licenses/by-sa/4.0/",
};

const absoluteUrl = (path: string, siteUrl: URL) =>
  new URL(path, siteUrl).toString();

export type LlmsEntryPoint = {
  title: string;
  description: string;
  url: string;
};

export type LlmsData = {
  name: string;
  description: string;
  baseUrl: string;
  focus: string[];
  entryPoints: LlmsEntryPoint[];
  resources: {
    sitemap: string;
    robots: string;
    llmsTxt: string;
    llmsJson: string;
  };
  usageNotes: string[];
  license: typeof license;
};

export const fallbackSite = "https://ethotechnics.org";

export const buildLlmsData = (siteUrl: URL): LlmsData => {
  const baseUrl = siteUrl.toString();

  return {
    name: "Ethotechnics Institute",
    description:
      "An open-source library for accountable AI theory, research, and governance focused on human-centered systems.",
    baseUrl,
    focus: focusAreas,
    entryPoints: entryPoints.map((entry) => ({
      title: entry.title,
      description: entry.description,
      url: absoluteUrl(entry.path, siteUrl),
    })),
    resources: {
      sitemap: absoluteUrl("/sitemap.xml", siteUrl),
      robots: absoluteUrl("/robots.txt", siteUrl),
      llmsTxt: absoluteUrl("/llms.txt", siteUrl),
      llmsJson: absoluteUrl("/llms.json", siteUrl),
    },
    usageNotes,
    license,
  };
};

export const renderLlmsText = (data: LlmsData) => {
  const focus = data.focus.map((item) => `- ${item}`).join("\n");
  const entryPointsText = data.entryPoints
    .map((entry) => `- ${entry.title}: ${entry.url}\n  ${entry.description}`)
    .join("\n");
  const usage = data.usageNotes.map((note) => `- ${note}`).join("\n");

  return `# ${data.name}

## Purpose
${data.description}

## Focus areas
${focus}

## Recommended entry points
${entryPointsText}

## Machine-readable resources
- Sitemap: ${data.resources.sitemap}
- Robots: ${data.resources.robots}
- LLMs (text): ${data.resources.llmsTxt}
- LLMs (json): ${data.resources.llmsJson}

## Usage notes
${usage}

## License
${data.license.name} (${data.license.shortName})\n${data.license.url}
`;
};
