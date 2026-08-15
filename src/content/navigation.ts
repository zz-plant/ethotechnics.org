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
    href: "/start-here",
    label: "Start here",
    description: "Find the right resource fast",
    primary: true,
    mobileFeatured: true,
  },
  {
    href: "/standards",
    label: "Standards",
    description: "Use citable requirements",
    primary: true,
    mobileFeatured: true,
  },
  {
    href: "/diagnostics",
    label: "Tools",
    description: "Run a practical check",
    primary: true,
    mobileFeatured: true,
  },
  {
    href: "/examples",
    label: "Examples",
    description: "See worked examples",
    primary: true,
  },
  {
    href: "/about",
    label: "About",
    description: "Who maintains this work",
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
  {
    href: "/applications",
    label: "Applications",
    class: "nav__utility-link nav__utility-link--quiet",
  },
  {
    href: "/bindings",
    label: "Adopt",
    class: "nav__utility-link nav__utility-link--quiet",
  },
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
    label: "Feedback",
    class: "nav__utility-link nav__utility-link--quiet",
    icon: "lucide:message-circle",
  },
  {
    href: "/participate",
    label: "Contact",
    class: "nav__utility-link nav__utility-link--quiet",
    icon: "lucide:mail",
  },
  {
    href: "/security/vulnerability-disclosure",
    label: "Security",
    class: "nav__utility-link nav__utility-link--quiet",
    icon: "lucide:shield",
  },
  {
    href: "https://ethotechnics.com/studio/",
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
