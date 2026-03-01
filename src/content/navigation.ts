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
    href: "/institute",
    label: "About",
    description: "Who we are",
    primary: true,
    mobileFeatured: true,
  },
  {
    href: "/standards",
    label: "Specs",
    description: "Read standards",
    primary: true,
    mobileFeatured: true,
  },
  {
    href: "/examples",
    label: "Examples",
    description: "See binding walkthroughs",
    primary: true,
    mobileFeatured: true,
  },
  {
    href: "/applications",
    label: "Applications",
    description: "Deployable operating patterns",
    primary: true,
  },
  {
    href: "/bindings",
    label: "Adoption",
    description: "Bind controls to delivery",
    primary: true,
  },
  {
    href: "/participate",
    label: "Contact",
    description: "Reach the institute",
    primary: true,
  },
  {
    href: "/security/vulnerability-disclosure",
    label: "Security",
    description: "Report vulnerabilities",
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
