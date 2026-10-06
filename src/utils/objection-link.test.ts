import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";

import { standardClauses } from "../content/standards";
import { objectionIssueUrl, objectionTitle } from "./objection-link";
import { OBJECTION_FORM_LABELS, OBJECTION_LABELS } from "./objections";

describe("objectionIssueUrl", () => {
  it("opens the objection form with the clause filled in", () => {
    const url = new URL(objectionIssueUrl("STD-02", "§2.2"));
    expect(url.origin + url.pathname).toBe(
      "https://github.com/zz-plant/ethotechnics.org/issues/new",
    );
    expect(url.searchParams.get("template")).toBe("objection.yml");
    expect(url.searchParams.get("standard")).toBe("STD-02");
    expect(url.searchParams.get("clause")).toBe("§2.2");
    expect(url.searchParams.get("title")).toBe("Objection: STD-02 §2.2");
  });

  it("percent-encodes the section sign and spaces", () => {
    const url = objectionIssueUrl("STD-08", "§1.1");
    expect(url).toContain("clause=%C2%A71.1");
    expect(url).toContain("title=Objection%3A%20STD-08%20%C2%A71.1");
    expect(url).not.toContain(" ");
  });

  it("names the clause in the title", () => {
    expect(objectionTitle("STD-09", "§1.5")).toBe("Objection: STD-09 §1.5");
  });
});

describe("the objection form", () => {
  const form = readFileSync(
    new URL("../../.github/ISSUE_TEMPLATE/objection.yml", import.meta.url),
    "utf8",
  );

  it("lists every standard that has clauses, so each link can prefill", () => {
    for (const standardId of Object.keys(standardClauses)) {
      if ((standardClauses[standardId] ?? []).length === 0) continue;
      expect(form).toContain(`- ${standardId}\n`);
    }
  });

  it("has a field for each query key the link sets", () => {
    for (const id of ["standard", "clause"]) {
      expect(form).toContain(`id: ${id}\n`);
    }
  });

  it("labels each field with the heading the workflow parses", () => {
    for (const [id, label] of Object.entries(OBJECTION_FORM_LABELS)) {
      expect(form).toContain(
        `id: ${id}\n    attributes:\n      label: ${label}\n`,
      );
    }
  });

  it("files the issue under the objection label", () => {
    expect(form).toContain(`labels: ["${OBJECTION_LABELS.objection}"]`);
  });
});
