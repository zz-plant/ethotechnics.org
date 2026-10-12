type FooterLink = { label: string; href: string; external?: boolean };

type SiteFooterContent = {
  identity: {
    heading: string;
    brand: {
      name: string;
      href: string;
      ariaLabel: string;
      logoSrc: string;
      logoAlt: string;
    };
    description: string;
    license: { label: string; href: string; external: boolean };
  };
  navigation: Array<{ heading: string; links: FooterLink[] }>;
};

export const siteFooter: SiteFooterContent = {
  identity: {
    heading: "Ethotechnics Institute",
    brand: {
      name: "Ethotechnics Institute",
      href: "/",
      ariaLabel: "Ethotechnics Institute home",
      logoSrc: "/favicon.svg",
      logoAlt: "Ethotechnics Institute seal",
    },
    description:
      "Proposed standards, mechanisms, and diagnostics for keeping automated decision systems answerable, whether or not they use AI.",
    license: {
      label: "Content licensed CC BY-SA 4.0",
      href: "https://creativecommons.org/licenses/by-sa/4.0/",
      external: true,
    },
  },
  // The footer mirrors the Browse panel's four sections (see
  // src/content/navigation.ts) so the two taxonomies cannot drift, plus one
  // Institute column for the site itself.
  navigation: [
    {
      heading: "Method",
      links: [
        { label: "The method", href: "/method" },
        { label: "Twelve laws", href: "/standards/laws" },
        { label: "Low-leverage work", href: "/low-leverage" },
        { label: "Standards register", href: "/standards" },
        { label: "Evidence packs", href: "/evidence-packs" },
        {
          label: "Regulatory crosswalks",
          href: "/standards/enforceable-governance-crosswalks",
        },
      ],
    },
    {
      heading: "Mechanisms & evals",
      links: [
        { label: "Mechanisms catalog", href: "/mechanisms" },
        { label: "Eval suites", href: "/evals" },
        { label: "What we can check", href: "/evals/coverage" },
        { label: "Validators", href: "/validators" },
        { label: "Measurement tiers", href: "/measurement-tiers" },
      ],
    },
    {
      heading: "Tools",
      links: [
        { label: "Delegation audit", href: "/diagnostics/delegation-audit" },
        {
          label: "Workload modeler",
          href: "/diagnostics/burden-modeler",
        },
        {
          label: "Record conformance",
          href: "/diagnostics/record-conformance",
        },
        {
          label: "Self-defense checks",
          href: "/diagnostics/self-defense-tools",
        },
        { label: "Which tool for your system", href: "/use-cases" },
        { label: "All tools", href: "/diagnostics" },
      ],
    },
    {
      heading: "Knowledge",
      links: [
        { label: "Glossary", href: "/glossary" },
        { label: "Practice taxonomy", href: "/taxonomy" },
        { label: "Failure casebook", href: "/casebook" },
        { label: "Field notes", href: "/field-notes" },
        { label: "Theory & foundations", href: "/research/theory" },
      ],
    },
    {
      heading: "Institute & connect",
      links: [
        { label: "Start here", href: "/start" },
        { label: "About the Institute", href: "/about" },
        { label: "Governance process", href: "/institute/governance" },
        { label: "The record", href: "/record" },
        { label: "Reference API", href: "/api" },
        {
          label: "Security policy",
          href: "/security/vulnerability-disclosure",
        },
        { label: "Send feedback", href: "/participate#feedback" },
        {
          label: "GitHub",
          href: "https://github.com/zz-plant/ethotechnics.org",
          external: true,
        },
        {
          label: "Ethotechnics Studio",
          href: "https://ethotechnics.com",
          external: true,
        },
        { label: "RSS feed", href: "/rss.xml" },
      ],
    },
  ],
};
