import { normalizePath } from "./route-type";

const OG_TEMPLATES = [
  "default",
  "home",
  "standards",
  "glossary",
  "taxonomy",
  "mechanisms",
  "editorial",
] as const;

type OgTemplate = (typeof OG_TEMPLATES)[number];

const isOgTemplate = (value: string): value is OgTemplate =>
  OG_TEMPLATES.includes(value as OgTemplate);

const inferOgTemplateFromPath = (path?: string): OgTemplate => {
  const normalizedPath = normalizePath(path ?? "/").toLowerCase();

  if (normalizedPath === "/") return "home";
  if (normalizedPath.startsWith("/standards")) return "standards";
  if (normalizedPath.startsWith("/glossary")) return "glossary";
  if (
    normalizedPath.startsWith("/taxonomy") ||
    normalizedPath.startsWith("/governance") ||
    normalizedPath.startsWith("/delivery") ||
    normalizedPath.startsWith("/assurance") ||
    normalizedPath.startsWith("/experience")
  ) {
    return "taxonomy";
  }
  if (
    normalizedPath.startsWith("/mechanisms") ||
    normalizedPath.startsWith("/library") ||
    normalizedPath.startsWith("/validators")
  ) {
    return "mechanisms";
  }
  if (
    normalizedPath.startsWith("/research") ||
    normalizedPath.startsWith("/incidents") ||
    normalizedPath.startsWith("/field-notes") ||
    normalizedPath.startsWith("/explainers")
  ) {
    return "editorial";
  }

  return "default";
};

const resolveOgTemplate = (template?: string, path?: string): OgTemplate => {
  const normalizedTemplate = template?.trim().toLowerCase();
  if (normalizedTemplate && isOgTemplate(normalizedTemplate)) {
    return normalizedTemplate;
  }

  return inferOgTemplateFromPath(path);
};

export {
  OG_TEMPLATES,
  inferOgTemplateFromPath,
  isOgTemplate,
  resolveOgTemplate,
};
export type { OgTemplate };
