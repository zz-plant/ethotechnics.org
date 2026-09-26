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
      "An open framework for accountable AI systems — proposed standards, mechanisms, and diagnostics.",
    license: {
      label: "Content licensed CC BY-SA 4.0",
      href: "https://creativecommons.org/licenses/by-sa/4.0/",
      external: true,
    },
  },
  navigation: [
    {
      heading: "Method & standards",
      links: [
        { label: "The method", href: "/method" },
        { label: "Twelve laws", href: "/standards/laws" },
        { label: "Standards register", href: "/standards" },
        {
          label: "Regulatory crosswalks",
          href: "/standards/enforceable-governance-crosswalks",
        },
        { label: "Evidence packs", href: "/evidence-packs" },
      ],
    },
    {
      heading: "Mechanisms & diagnostics",
      links: [
        { label: "Mechanisms catalog", href: "/mechanisms" },
        { label: "Diagnostics suite", href: "/diagnostics" },
        { label: "Delegation audit", href: "/diagnostics/delegation-audit" },
        { label: "System auditor", href: "/diagnostics/system-auditor" },
        { label: "Evals & coverage", href: "/evals" },
        { label: "Validators", href: "/validators" },
      ],
    },
    {
      heading: "Knowledge & research",
      links: [
        { label: "Glossary & ontology", href: "/glossary" },
        { label: "Capability taxonomy", href: "/taxonomy" },
        { label: "Failure casebook", href: "/casebook" },
        { label: "Theory & foundations", href: "/research/theory" },
        { label: "Field notes", href: "/field-notes" },
        { label: "Syllabus", href: "/mechanisms#syllabus" },
        { label: "Search", href: "/search" },
      ],
    },
    {
      heading: "Institute & governance",
      links: [
        { label: "Start here", href: "/start" },
        { label: "About the institute", href: "/about" },
        { label: "Governance process", href: "/institute/governance" },
        {
          label: "Security policy",
          href: "/security/vulnerability-disclosure",
        },
        { label: "Send feedback", href: "/participate#feedback" },
        { label: "Reference API", href: "/api" },
      ],
    },
    {
      heading: "Ecosystem & connect",
      links: [
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
