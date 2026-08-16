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
      "Content licensed under the Creative Commons Attribution 4.0 International License.",
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
      heading: "Institute",
      links: [
        { label: "Start here", href: "/start-here" },
        { label: "Glossary", href: "/glossary" },
        { label: "Standards", href: "/standards" },
        { label: "Diagnostics", href: "/diagnostics" },
        { label: "Evals", href: "/evals" },
      ],
    },
    {
      heading: "Connect",
      links: [
        {
          label: "GitHub",
          href: "https://github.com/zz-plant/ethotechnics",
          external: true,
        },
        { label: "Send feedback", href: "/participate#feedback" },
        { label: "Reference API", href: "/api" },
      ],
    },
  ],
};
