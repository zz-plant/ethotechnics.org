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
    expect(ids).toHaveLength(20);
  });

  it("matches the documents whose register is shown", () => {
    for (const id of ["STD-01", "STD-07", "STD-08"]) {
      expect(compareRegistryToDocument(id, bodyFor(id))).toEqual({
        registryOnly: [],
        documentOnly: [],
        matches: true,
      });
    }
  });

  // Known drift, recorded so a reconciliation has to update this test and a
  // new gap cannot appear silently. While these hold, neither standard shows
  // a register and the catalogue counts from the document.
  it("records where the registry and the document still disagree", () => {
    expect(compareRegistryToDocument("STD-02", bodyFor("STD-02"))).toEqual({
      registryOnly: ["§6.1", "§6.2", "§6.3", "§7.1", "§7.2", "§7.3"],
      documentOnly: [],
      matches: false,
    });
    const std06 = compareRegistryToDocument("STD-06", bodyFor("STD-06"));
    expect(std06.registryOnly).toEqual([]);
    expect(std06.documentOnly).toHaveLength(11);
    expect(std06.matches).toBe(false);
  });

  it("covers every standard with a registry", () => {
    for (const id of Object.keys(standardClauses)) {
      expect(bodyFor(id).length, `${id} has a document`).toBeGreaterThan(0);
    }
  });
});
