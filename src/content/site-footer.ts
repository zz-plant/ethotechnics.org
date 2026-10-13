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
  // The footer holds what no menu does: the Institute itself and the ways to
  // reach it. It used to repeat the Browse panel's four sections as well, so
  // every page carried the same twenty links twice, once in the header and
  // once here. The map lives in the header now and nowhere else.
  navigation: [
    {
      heading: "The Institute",
      links: [
        { label: "About the Institute", href: "/about" },
        { label: "Governance process", href: "/institute/governance" },
        { label: "The record", href: "/record" },
        {
          label: "Security policy",
          href: "/security/vulnerability-disclosure",
        },
      ],
    },
    {
      heading: "Connect",
      links: [
        { label: "Send feedback", href: "/participate#feedback" },
        { label: "Reference API", href: "/api" },
        { label: "RSS feed", href: "/rss.xml" },
        {
          label: "GitHub",
          href: "https://github.com/zz-plant/ethotechnics.org",
          external: true,
        },
        // The page says who does the work and that he wrote the framework; a
        // footer label has room for neither, so the link goes there first.
        { label: "Commissioned work", href: "/institute/commissioned-work" },
      ],
    },
  ],
};
