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
  { href: "/#failure-intake", label: "Start with failure", primary: true },
  { href: "/artifacts", label: "Artifacts", primary: true },
  { href: "/standards", label: "Standards", primary: true },
  { href: "/diagnostics", label: "Diagnostics", primary: true },
  { href: "/glossary", label: "Glossary", primary: true },
];

export const navSections: NavSection[] = [
  {
    heading: "Institute",
    description: "Core institute routes.",
    links: navPrimaryLinks,
  },
];

export const navActions: NavAction[] = [];
