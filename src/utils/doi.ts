/**
 * A DOI is printed only when one exists. Content carries placeholders such
 * as "Pending Zenodo deposit" in its `doi` field until a deposit is made;
 * shown as a DOI, a placeholder claims a persistent identifier nobody can
 * resolve. Accepts "10.5281/zenodo.123" and "https://doi.org/10.5281/zenodo.123".
 */
export interface Doi {
  /** The bare identifier, "10.5281/zenodo.123". */
  id: string;
  /** Its resolver URL. */
  href: string;
}

export const resolveDoi = (value: string | null | undefined): Doi | null => {
  const id = (value ?? "").trim().replace(/^https?:\/\/(dx\.)?doi\.org\//i, "");
  return /^10\.\d{4,9}\/\S+$/.test(id)
    ? { id, href: `https://doi.org/${id}` }
    : null;
};
