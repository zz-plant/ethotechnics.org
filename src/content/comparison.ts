import { studio, studioMailto, studioSummary } from "./studio";

export type ComparisonAction = {
  label: string;
  href: string;
  variant: "primary" | "ghost";
  rel?: string;
};

export type ComparisonCard = {
  eyebrow: string;
  title: string;
  description: string;
  actions: ComparisonAction[];
};

export type InstituteStudioComparisonContent = {
  eyebrow: string;
  heading: string;
  description: string;
  cards: ComparisonCard[];
};

export const instituteStudioGuidance = {
  callout:
    "The Institute stays open and self-serve. The Studio takes commissioned safety evaluation for healthcare AI.",
  overviewDescription:
    "Use the Institute for open guidance. The Studio is for a health plan, a healthcare AI company, or an investor that wants an outside evaluation of one system.",
  panelDescription:
    "Use the Institute when you want open guidance. Commission the Studio when a healthcare AI system needs an outside evaluation.",
  escalationDescription:
    "The Institute stays open and self-serve. The Studio takes four kinds of commissioned work, all on healthcare AI: a safeguards review, a readiness sprint, investor diligence, and a clinical AI safety evaluation.",
};

export const instituteStudioComparisonContent: InstituteStudioComparisonContent =
  {
    eyebrow: "Where to start",
    heading: "Institute or Studio?",
    description:
      "Ethotechnics.org is the Institute: open guides and diagnostics you can run yourself. Ethotechnics.com is the Studio: commissioned safety evaluation for healthcare AI.",
    cards: [
      {
        eyebrow: "Institute",
        title: "Open guidance and self-serve diagnostics.",
        description:
          "Work from the openly licensed mechanisms catalog (CC BY-SA 4.0), and run a diagnostic yourself for a first reading of readiness.",
        actions: [
          {
            label: "Browse mechanisms",
            href: "/mechanisms",
            variant: "primary",
          },
          { label: "Run a diagnostic", href: "/diagnostics", variant: "ghost" },
        ],
      },
      {
        eyebrow: "Studio",
        title: "Commissioned evaluation of healthcare AI.",
        description: studioSummary,
        actions: [
          {
            label: "Visit the Studio",
            href: "https://ethotechnics.com",
            variant: "primary",
            rel: "noopener noreferrer",
          },
          {
            label: `Email ${studio.email}`,
            href: studioMailto(),
            variant: "ghost",
          },
        ],
      },
    ],
  };
