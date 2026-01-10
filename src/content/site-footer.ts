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
  navigation: [
    {
      heading: "Network",
      links: [
        { label: "Ethotechnics Institute", href: "/institute" },
        {
          label: "Ethotechnics Studio",
          href: "https://ethotechnics.com",
          external: true,
        },
        { label: "Syadvada", href: "https://syadvada.org", external: true },
      ],
    },
    {
      heading: "Work with the Studio",
      links: [
        {
          label: "Need help implementing this? Visit the Studio",
          href: "https://ethotechnics.com/studio",
          external: true,
        },
      ],
    },
    {
      heading: "Connect",
      links: [
        {
          label: "Signals newsletter",
          href: "https://signals.ethotechnics.org",
          external: true,
        },
        {
          label: "Ethotechnics on GitHub",
          href: "https://github.com/ethotechnics",
          external: true,
        },
      ],
    },
  ],
};
