export type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type FooterSection = {
  heading: string;
  links: FooterLink[];
};

export type SiteFooterContent = {
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
    license: FooterLink;
    licenseBadge: {
      src: string;
      alt: string;
    };
  };
  cta?: {
    heading: string;
    description: string;
    links: FooterLink[];
  };
  navigation: FooterSection[];
};

export const siteFooter: SiteFooterContent = {
  identity: {
    heading: "Identity",
    brand: {
      name: "Ethotechnics Institute",
      href: "/",
      ariaLabel: "Ethotechnics Institute home",
      logoSrc: "/favicon.svg",
      logoAlt: "Ethotechnics Institute seal",
    },
    description:
      "Content licensed under the Creative Commons Attribution-ShareAlike 4.0 International License.",
    license: {
      label: "View the CC BY-SA 4.0 license",
      href: "https://creativecommons.org/licenses/by-sa/4.0/",
      external: true,
    },
    licenseBadge: {
      src: "https://licensebuttons.net/l/by-sa/4.0/88x31.png",
      alt: "Creative Commons Attribution-ShareAlike 4.0 International License badge",
    },
  },
  cta: {
    heading: "Get oriented fast",
    description:
      "Start with the guided pathways or browse the latest field notes to see governance in practice.",
    links: [
      { label: "Start here", href: "/start-here" },
      { label: "Browse Field Notes", href: "/field-notes" },
    ],
  },
  navigation: [
    {
      heading: "Network",
      links: [
        { label: "About the framework", href: "/about" },
        { label: "Ethotechnics Institute", href: "/institute" },
        {
          label: "Ethotechnics Studio",
          href: "https://ethotechnics.com",
          external: true,
        },
        { label: "The Crumple Zone", href: "https://thecrumple.zone", external: true },
      ],
    },
    {
      heading: "Studio",
      links: [
        {
          label: "How Studio fits",
          href: "/institute/how-studio-fits",
        },
        {
          label: "Ethotechnics Studio (.com)",
          href: "https://ethotechnics.com/studio",
          external: true,
        },
      ],
    },
    {
      heading: "Connect",
      links: [
        { label: "Reference API", href: "/api" },
        { label: "Vulnerability disclosure policy", href: "/security/vulnerability-disclosure" },
        { label: "security.txt", href: "/.well-known/security.txt" },
        { label: "Send feedback", href: "/participate#feedback" },
        {
          label: "The Crumple Zone",
          href: "https://thecrumple.zone",
          external: true,
        },
        {
          label: "Ethotechnics on GitHub",
          href: "https://github.com/zz-plant/ethotechnics",
          external: true,
        },
        {
          label: "GitHub discussions",
          href: "https://github.com/zz-plant/ethotechnics/discussions",
          external: true,
        },
      ],
    },
  ],
};
