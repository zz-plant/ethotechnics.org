/**
 * The twelve laws as structured rows, read from the essay that states them.
 *
 * src/content/standards/laws.mdx is the source of truth and stays prose: each
 * law is a heading, an argument, a blockquoted invariant and a "Binds through"
 * line naming the clauses that hold it. That regularity lets other pages read
 * a law without a second copy of the data; this parses the essay rather than
 * duplicating it, so nothing that reads it can drift from the text.
 *
 * The parse is deliberately strict. A law without an invariant or a binding
 * line is not "partially structured"; it is a law the standards do not yet
 * hold, and the test on this module fails.
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

/**
 * The state variables a law protects: those whose lawRefs on the method page
 * cite it. /standards/laws prints them under each law's heading.
 */
export function variablesForLaw(numeral: string): string[] {
  return methodContent.stateVariables
    .filter((variable) => numeralsIn(variable.lawRefs).includes(numeral))
    .map((variable) => variable.state);
}

export function extractLaws(body: string): LawRow[] {
  const matches = [...body.matchAll(HEADING)];

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
      variables: variablesForLaw(numeral),
    };
  });
}
