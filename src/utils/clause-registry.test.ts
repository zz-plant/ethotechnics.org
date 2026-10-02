import { describe, expect, it } from "bun:test";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { standardClauses } from "../content/standards";
import {
  compareRegistryToDocument,
  documentClauseIds,
} from "./clause-registry";

const dir = join(import.meta.dir, "../content/standards");
const bodyFor = (standardId: string) => {
  const file = readdirSync(dir).find((name) =>
    name.toLowerCase().startsWith(`${standardId.toLowerCase()}-`),
  );
  return file ? readFileSync(join(dir, file), "utf8") : "";
};

describe("the clause registry against the normative documents", () => {
  it("reads clause ids in document order", () => {
    const ids = documentClauseIds(bodyFor("STD-08"));
    expect(ids.slice(0, 3)).toEqual(["§1.1", "§1.2", "§1.3"]);
    expect(ids).toHaveLength(24);
  });

  it("matches the documents whose register is shown", () => {
    for (const id of ["STD-01", "STD-06", "STD-07", "STD-08", "STD-09"]) {
      expect(compareRegistryToDocument(id, bodyFor(id))).toEqual({
        registryOnly: [],
        documentOnly: [],
        matches: true,
      });
    }
  });

  // STD-02's Articles VI and VII were registered before they were written;
  // the reconciliation is complete, and this now guards against a new gap
  // appearing silently rather than recording an old one.
  it("records where the registry and the document still disagree", () => {
    expect(compareRegistryToDocument("STD-02", bodyFor("STD-02"))).toEqual({
      registryOnly: [],
      documentOnly: [],
      matches: true,
    });
  });

  it("covers every standard with a registry", () => {
    for (const id of Object.keys(standardClauses)) {
      expect(bodyFor(id).length, `${id} has a document`).toBeGreaterThan(0);
    }
  });
});
