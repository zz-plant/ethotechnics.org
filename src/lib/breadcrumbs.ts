import { stripBrandSuffix } from "../utils/seo/document-title";
import { sectionLabel } from "../utils/seo/route-type";

export interface BreadcrumbInputItem {
  name: string;
  url: string;
}

export interface BreadcrumbItem {
  name: string;
  href: string;
  absoluteUrl: string;
}

const titleizeSegment = (segment: string) =>
  segment
    .split("-")
    .filter(Boolean)
    .map((part) => {
      if (/^[A-Z0-9]{2,}$/.test(part)) {
        return part;
      }

      if (/^[a-z]{2,}\d+$/.test(part)) {
        return part.toUpperCase();
      }

      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");

const cleanPageTitle = (title?: string) => {
  if (!title) {
    return undefined;
  }

  return stripBrandSuffix(title);
};

const normalizeHref = (url: string, siteBase: string) => {
  const parsed = new URL(url, siteBase);

  if (parsed.origin === new URL(siteBase).origin) {
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  }

  return parsed.toString();
};

/**
 * Path segments that name no page. The worked examples live at
 * /use-cases/examples/<slug>, and their index was folded into /use-cases, so
 * a crumb for the segment would link a redirect.
 */
const SEGMENTS_WITHOUT_A_PAGE = new Set(["/use-cases/examples"]);

export const normalizeBreadcrumbItems = ({
  siteBase,
  currentPath,
  title,
  breadcrumbItems,
}: {
  siteBase: string;
  currentPath: string;
  title?: string;
  breadcrumbItems?: BreadcrumbInputItem[];
}): BreadcrumbItem[] => {
  const fallbackItems = () => {
    const segments = currentPath.split("/").filter(Boolean);
    const currentLabel = cleanPageTitle(title);

    return [
      { name: "Home", url: new URL("/", siteBase).toString() },
      ...segments.flatMap((segment, index) => {
        const isLast = index === segments.length - 1;
        const path = `/${segments.slice(0, index + 1).join("/")}`;
        if (!isLast && SEGMENTS_WITHOUT_A_PAGE.has(path)) return [];
        // A section hub carries its sentence-case name ("Evidence packs",
        // not "Evidence Packs").
        const label =
          isLast && currentLabel
            ? currentLabel
            : (sectionLabel(path) ?? titleizeSegment(segment));

        return [{ name: label, url: new URL(path, siteBase).toString() }];
      }),
    ];
  };

  const sourceItems = breadcrumbItems?.length
    ? breadcrumbItems
    : fallbackItems();
  const seen = new Set<string>();

  return sourceItems
    .map((item) => {
      const absoluteUrl = new URL(item.url, siteBase).toString();

      return {
        name: item.name,
        href: normalizeHref(item.url, siteBase),
        absoluteUrl,
      };
    })
    .filter((item) => {
      const key = `${item.name}|${item.absoluteUrl}`;
      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
};
