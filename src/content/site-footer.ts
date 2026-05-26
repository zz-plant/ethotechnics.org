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
        { label: "Field Notes", href: "/field-notes" },
        { label: "How Studio fits", href: "/institute/how-studio-fits" },
      ],
    },
    {
      heading: "Network",
      links: [
        {
          label: "Ethotechnics Studio",
          href: "https://ethotechnics.com",
          external: true,
        },
        {
          label: "The Crumple Zone",
          href: "https://thecrumple.zone",
          external: true,
        },
        {
          label: "Kanav Jain (kanav.net)",
          href: "https://kanav.net",
          external: true,
        },
      ],
    },
    {
      heading: "Connect",
      links: [
        { label: "Reference API", href: "/api" },
        {
          label: "GitHub",
          href: "https://github.com/zz-plant/ethotechnics",
          external: true,
        },
        { label: "Send feedback", href: "/participate#feedback" },
        { label: "Security", href: "/security/vulnerability-disclosure" },
      ],
    },
  ],
};
