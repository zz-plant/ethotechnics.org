/**
 * The twelve laws as structured rows, read from the essay that states them.
 *
 * src/content/standards/laws.mdx is the source of truth and stays prose: each
 * law is a heading, an argument, a blockquoted invariant and a "Binds through"
 * line naming the clauses that hold it. That regularity is what makes a
 * reference grid possible without a second copy of the data — this parses the
 * essay rather than duplicating it, so the grid cannot drift from the text.
 *
 * The parse is deliberately strict. A law without an invariant or a binding
 * line is not "partially structured"; it is a law the standards do not yet
 * hold, and the test on this module fails rather than rendering a blank cell.
 */

import { methodContent } from "../content/method";

export type LawRow = {
  /** Anchor on /standards/laws, e.g. "law-iv". */
  id: string;
  numeral: string;
  title: string;
  invariant: string;
  bindsThrough: string;
  /** State variables whose lawRefs cite this law, from the method page. */
  variables: string[];
};

const HEADING =
  /<h3 id="(law-[ivx]+)">\s*Law ([IVX]+)\.\s*([\s\S]*?)\s*<\/h3>/g;

const collapse = (text: string) => text.replace(/\s+/g, " ").trim();

/** "Laws II, III" → ["II", "III"]; "Law I" → ["I"]. */
const numeralsIn = (refs: string) =>
  (refs.match(/\b[IVX]+\b/g) ?? []).filter((n) => /^[IVX]+$/.test(n));

export function extractLaws(body: string): LawRow[] {
  const matches = [...body.matchAll(HEADING)];
  const variablesByNumeral = new Map<string, string[]>();
  for (const variable of methodContent.stateVariables) {
    for (const numeral of numeralsIn(variable.lawRefs)) {
      variablesByNumeral.set(numeral, [
        ...(variablesByNumeral.get(numeral) ?? []),
        variable.state,
      ]);
    }
  }

  return matches.map((match, index) => {
    const [, id, numeral, rawTitle] = match;
    const start = match.index + match[0].length;
    const end = matches[index + 1]?.index ?? body.length;
    const section = body.slice(start, end);

    const invariant = section.match(/^>\s*(.+)$/m)?.[1];
    const binds = section.match(/^Binds through:\s*(.+)$/m)?.[1];
    if (!invariant) throw new Error(`${id} has no blockquoted invariant`);
    if (!binds) throw new Error(`${id} has no "Binds through" line`);

    return {
      id: id,
      numeral: numeral,
      title: collapse(rawTitle),
      invariant: collapse(invariant),
      bindsThrough: collapse(binds).replace(/\.$/, ""),
      variables: variablesByNumeral.get(numeral) ?? [],
    };
  });
}
