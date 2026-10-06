import { describe, expect, it } from "bun:test";

import { resolveDoi } from "./doi";

describe("resolveDoi", () => {
  it("reads a bare DOI and a resolver URL", () => {
    expect(resolveDoi("10.5281/zenodo.1234567")).toEqual({
      id: "10.5281/zenodo.1234567",
      href: "https://doi.org/10.5281/zenodo.1234567",
    });
    expect(resolveDoi("https://doi.org/10.5281/zenodo.1234567")?.id).toBe(
      "10.5281/zenodo.1234567",
    );
    expect(resolveDoi(" http://dx.doi.org/10.1000/xyz123 ")?.href).toBe(
      "https://doi.org/10.1000/xyz123",
    );
  });

  it("returns nothing for a placeholder or an empty field", () => {
    expect(resolveDoi("Pending Zenodo deposit")).toBeNull();
    expect(resolveDoi("Not yet minted")).toBeNull();
    expect(resolveDoi("10.")).toBeNull();
    expect(resolveDoi("")).toBeNull();
    expect(resolveDoi(undefined)).toBeNull();
    expect(resolveDoi(null)).toBeNull();
  });
});
