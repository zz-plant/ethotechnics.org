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
    licenseBadge: { src: string; alt: string };
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
      "An open framework for accountable AI systems — proposed standards, mechanisms, and diagnostics. Content licensed under Creative Commons Attribution 4.0 International (CC BY 4.0).",
    license: {
      label: "View the CC BY 4.0 license",
      href: "https://creativecommons.org/licenses/by/4.0/",
      external: true,
    },
    licenseBadge: {
      src: "https://licensebuttons.net/l/by/4.0/88x31.png",
      alt: "Creative Commons Attribution 4.0 International License badge",
    },
  },
  navigation: [
    {
      heading: "Standards & Tools",
      links: [
        { label: "Standards", href: "/standards" },
        { label: "Diagnostics & Tools", href: "/diagnostics" },
        { label: "Mechanisms & Patterns", href: "/mechanisms" },
        { label: "Evals & Benchmarks", href: "/evals" },
        { label: "Validators", href: "/validators" },
      ],
    },
    {
      heading: "Knowledge Base",
      links: [
        { label: "Glossary & Ontology", href: "/glossary" },
        { label: "Taxonomy", href: "/taxonomy" },
        { label: "Field Notes", href: "/field-notes" },
        { label: "Library Index", href: "/library" },
        { label: "Search", href: "/search" },
      ],
    },
    {
      heading: "Institute & Governance",
      links: [
        { label: "Start Here", href: "/start" },
        { label: "About the Institute", href: "/about" },
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
        {
          label: "CC BY 4.0 License",
          href: "https://creativecommons.org/licenses/by/4.0/",
          external: true,
        },
      ],
    },
  ],
};
