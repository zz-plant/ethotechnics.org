/**
 * The accessible name of a Markdown table's scroll box (ProseTable.astro):
 * its column headings, in order. Reads the table's rendered HTML, because
 * that is what an MDX component receives.
 */
const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  "#39": "'",
  nbsp: " ",
};

const decode = (text: string): string =>
  text.replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (_, name: string) => {
    return ENTITIES[name] ?? "";
  });

export const tableLabel = (html: string): string => {
  const head = /<thead[\s>][\s\S]*?<\/thead>/i.exec(html)?.[0] ?? html;
  const headings = [...head.matchAll(/<th[\s>][\s\S]*?<\/th>/gi)]
    .map(([cell]) =>
      decode(cell.replace(/<[^>]*>/g, ""))
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean);
  return headings.length > 0 ? headings.join(", ") : "Table";
};
