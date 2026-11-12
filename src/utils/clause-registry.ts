/**
 * The clause registry in src/content/standards.ts and the normative MDX are
 * two hands writing the same clauses, and they drift: a registry row can
 * outlive the clause it described, and a document can grow clauses the
 * registry never learned. Anything that presents the registry as "the
 * clauses of this standard" — the register above the text, the count in the
 * catalogue — has to check the two agree first, and count from the document
 * when they do not.
 */
import { getStandardById, standardClauses } from "../content/standards";

const CLAUSE_MARK = /standard-clause-id">(§\d+\.\d+)</g;

/** Clause ids as the document itself marks them, in document order. */
export const documentClauseIds = (body: string): string[] =>
  Array.from(body.matchAll(CLAUSE_MARK), (match) => match[1]);

export interface RegistryComparison {
  /** Registry rows with no marked clause in the document. */
  registryOnly: string[];
  /** Marked clauses the registry has no row for. */
  documentOnly: string[];
  matches: boolean;
}

export const compareRegistryToDocument = (
  standardId: string,
  body: string,
): RegistryComparison => {
  const registry = (standardClauses[standardId] ?? []).map(
    (clause) => clause.displayId,
  );
  const document = new Set(documentClauseIds(body));
  const registrySet = new Set(registry);
  const registryOnly = registry.filter((id) => !document.has(id));
  const documentOnly = [...document].filter((id) => !registrySet.has(id));
  return {
    registryOnly,
    documentOnly,
    matches:
      registry.length > 0 &&
      registryOnly.length === 0 &&
      documentOnly.length === 0,
  };
};

/** A summary item's pointer to the standard text it restates. */
export type ClauseCitation = {
  /** A standard's id, as the registry lists it: "STD-02". */
  standard: string;
  /** Display ids of the clauses cited, "§2.3". None cites the standard whole. */
  clauses?: string[];
};

/**
 * The anchor a marked clause carries on its standard's page: §2.3 becomes
 * clause-2-3. Every <li> that marks a clause in a standards document has one,
 * so a clause can be cited by address rather than by "see Article II".
 */
export const clauseAnchor = (displayId: string): string =>
  `clause-${displayId.replace("§", "").replace(".", "-")}`;

/**
 * The address of a clause, or of the standard when no clause is named. Throws
 * for a standard or clause the registry does not have, so a page that cites
 * one fails the build instead of linking nowhere.
 */
export const clauseHref = (standardId: string, displayId?: string): string => {
  const standard = getStandardById(standardId);
  if (!standard) throw new Error(`No standard ${standardId}`);
  const page = `/standards/${standard.slug}`;
  if (!displayId) return page;
  const known = (standardClauses[standardId] ?? []).some(
    (clause) => clause.displayId === displayId,
  );
  if (!known) throw new Error(`${standardId} has no clause ${displayId}`);
  return `${page}#${clauseAnchor(displayId)}`;
};
