import { describe, expect, it } from "bun:test";

import { formatDocumentTitle, stripBrandSuffix } from "./document-title";

describe("formatDocumentTitle", () => {
  it("appends the brand to a bare page name", () => {
    expect(formatDocumentTitle("Retired tools")).toBe(
      "Retired tools — Ethotechnics",
    );
  });

  it("replaces either legacy brand suffix instead of doubling it", () => {
    expect(formatDocumentTitle("Theory — Ethotechnics Institute")).toBe(
      "Theory — Ethotechnics",
    );
    expect(formatDocumentTitle("Field notes — Ethotechnics")).toBe(
      "Field notes — Ethotechnics",
    );
  });

  it("keeps one dash by turning a dash inside the name into a colon", () => {
    expect(formatDocumentTitle("STD-01 — The Temporal Bill of Rights")).toBe(
      "STD-01: The Temporal Bill of Rights — Ethotechnics",
    );
    expect(
      formatDocumentTitle(
        "Casebook — five public failures, scored — Ethotechnics",
      ),
    ).toBe("Casebook: five public failures, scored — Ethotechnics");
  });

  it("leaves an en dash range alone", () => {
    expect(formatDocumentTitle("Terms that drifted, 2019–2024")).toBe(
      "Terms that drifted, 2019–2024 — Ethotechnics",
    );
  });

  it("returns an opted-out title as passed", () => {
    const home =
      "Ethotechnics Institute — who has to act when a system is wrong?";
    expect(formatDocumentTitle(home, { suffix: false })).toBe(home);
    expect(
      formatDocumentTitle("Abstention — Ethotechnics glossary", {
        suffix: false,
      }),
    ).toBe("Abstention — Ethotechnics glossary");
  });
});

describe("stripBrandSuffix", () => {
  it("removes only a trailing brand", () => {
    expect(stripBrandSuffix("What Ethotechnics is not — Ethotechnics")).toBe(
      "What Ethotechnics is not",
    );
    expect(stripBrandSuffix("Abstention — Ethotechnics glossary")).toBe(
      "Abstention — Ethotechnics glossary",
    );
  });
});
