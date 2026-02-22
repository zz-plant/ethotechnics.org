export interface NavLink {
  href: string;
  label: string;
  description?: string;
  primary?: boolean;
  mobileFeatured?: boolean;
}

export interface NavSection {
  heading: string;
  description: string;
  links: NavLink[];
}

export interface NavAction {
  href: string;
  label: string;
  variant: "primary" | "ghost" | "ghost-compact";
  icon?: string;
  rel?: string;
  target?: string;
}

export interface NavUtilityLink {
  href: string;
  label: string;
  class: string;
  rel?: string;
  target?: string;
  icon?: string;
}

export const navPrimaryLinks: NavLink[] = [
  {
    href: "/#failure-intake",
    label: "Failure pathways",
    description: "Incident routing",
    primary: true,
    mobileFeatured: true,
  },
  {
    href: "/diagnostics",
    label: "Diagnostics",
    description: "Run quick checks",
    primary: true,
    mobileFeatured: true,
  },
  {
    href: "/standards",
    label: "Standards",
    description: "Read policy language",
    primary: true,
    mobileFeatured: true,
  },
  {
    href: "/crosswalks/framework-map",
    label: "Framework map",
    description: "Buyer and auditor crosswalk",
    primary: true,
  },
  {
    href: "/artifacts",
    label: "Templates",
    description: "Use reusable artifacts",
    primary: true,
  },
  {
    href: "/glossary",
    label: "Glossary",
    description: "Reference shared terms",
    primary: true,
  },
];

export const navSections: NavSection[] = [
  {
    heading: "Institute",
    description: "Core institute routes.",
    links: navPrimaryLinks,
  },
];

const startHereUtilityLink: NavUtilityLink = {
  href: "/start-here",
  label: "Start here",
  class: "nav__utility-link nav__utility-link--primary",
  icon: "lucide:arrow-right",
};

export const navUtilityDesktopLinks: NavUtilityLink[] = [
  startHereUtilityLink,
  {
    href: "https://github.com/zz-plant/ethotechnics",
    label: "GitHub",
    class: "nav__utility-link nav__utility-link--quiet",
    rel: "noopener noreferrer",
    target: "_blank",
    icon: "lucide:github",
  },
  {
    href: "/participate#feedback",
    label: "Send feedback",
    class: "nav__utility-link nav__utility-link--quiet",
    icon: "lucide:message-circle",
  },
  {
    href: "https://ethotechnics.com/studio",
    label: "Ethotechnics Studio",
    class: "nav__utility-link",
    rel: "noopener noreferrer",
    target: "_blank",
    icon: "lucide:arrow-up-right",
  },
];

export const navUtilityMobilePrimaryLinks: NavUtilityLink[] = [
  startHereUtilityLink,
];

export const navActions: NavAction[] = [];
