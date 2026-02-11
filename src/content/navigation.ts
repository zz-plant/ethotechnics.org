export interface NavLink {
  href: string;
  label: string;
  description?: string;
  primary?: boolean;
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

export const navPrimaryLinks: NavLink[] = [
  {
    href: "/#failure-intake",
    label: "Failure pathways",
    description: "Route from active incidents",
    primary: true,
  },
  {
    href: "/artifacts",
    label: "Templates",
    description: "Reusable governance artifacts",
    primary: true,
  },
  {
    href: "/standards",
    label: "Standards",
    description: "Policy and implementation language",
    primary: true,
  },
  {
    href: "/diagnostics",
    label: "Diagnostics",
    description: "Run quick decision checks",
    primary: true,
  },
  {
    href: "/glossary",
    label: "Glossary",
    description: "Shared terms for teams",
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

export const navActions: NavAction[] = [];
