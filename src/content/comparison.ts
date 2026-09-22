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
    "The Institute stays open and self-serve. Studio support is optional when you need a delivery partner or facilitation.",
  overviewDescription:
    "Use the Institute when you want open guidance; we point you to the Studio when hands-on help is faster.",
  panelDescription:
    "Use the Institute when you want open guidance. Escalate to Studio when timing, risk, or facilitation demand a partner.",
  escalationDescription:
    "The Ethotechnics Institute stays open and self-serve; the Studio steps in when you need facilitation, mediation, or delivery support.",
};

export const instituteStudioComparisonContent: InstituteStudioComparisonContent =
  {
    eyebrow: "Where to start",
    heading: "Institute or Studio?",
    description:
      "Ethotechnics.org is the Institute: open guides and diagnostics you can run yourself. The Studio runs facilitated engagements when you need a delivery partner.",
    cards: [
      {
        eyebrow: "Institute",
        title: "Open guidance and self-serve diagnostics.",
        description:
          "Work from the open-source mechanisms catalog, and run a diagnostic yourself for a first reading of readiness.",
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
        title: "Facilitated engagements when you need a partner.",
        description:
          "Bring in the Studio for bespoke facilitation, governance escalations, or embedded delivery support.",
        actions: [
          {
            label: "Visit the Studio",
            href: "https://ethotechnics.com",
            variant: "primary",
            rel: "noopener noreferrer",
          },
          {
            label: "Email the Studio team",
            href: "mailto:studio@ethotechnics.org",
            variant: "ghost",
          },
        ],
      },
    ],
  };
