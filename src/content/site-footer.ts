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
      label: "Content licensed CC BY 4.0",
      href: "https://creativecommons.org/licenses/by/4.0/",
      external: true,
    },
  },
  navigation: [
    {
      heading: "Method & Standards",
      links: [
        { label: "The Method", href: "/method" },
        { label: "Twelve Laws", href: "/standards/laws" },
        { label: "Standards Register", href: "/standards" },
        {
          label: "Regulatory Crosswalks",
          href: "/standards/enforceable-governance-crosswalks",
        },
        { label: "Evidence Packs", href: "/evidence-packs" },
      ],
    },
    {
      heading: "Mechanisms & Diagnostics",
      links: [
        { label: "Mechanisms Catalog", href: "/mechanisms" },
        { label: "Diagnostics Suite", href: "/diagnostics" },
        { label: "Delegation Audit", href: "/diagnostics/delegation-audit" },
        { label: "System Auditor", href: "/diagnostics/system-auditor" },
        { label: "Evals & Coverage", href: "/evals" },
        { label: "Validators", href: "/validators" },
      ],
    },
    {
      heading: "Knowledge & Research",
      links: [
        { label: "Glossary & Ontology", href: "/glossary" },
        { label: "Capability Taxonomy", href: "/taxonomy" },
        { label: "Failure Casebook", href: "/casebook" },
        { label: "Theory & Foundations", href: "/research/theory" },
        { label: "Field Notes", href: "/field-notes" },
        { label: "Search", href: "/search" },
      ],
    },
    {
      heading: "Institute & Governance",
      links: [
        { label: "Start Here", href: "/start" },
        { label: "About the Institute", href: "/about" },
        { label: "Governance Process", href: "/institute/governance" },
        {
          label: "Security Policy",
          href: "/security/vulnerability-disclosure",
        },
        { label: "Send Feedback", href: "/participate#feedback" },
        { label: "Reference API", href: "/api" },
      ],
    },
    {
      heading: "Ecosystem & Connect",
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
        { label: "RSS Feed", href: "/rss.xml" },
      ],
    },
  ],
};
