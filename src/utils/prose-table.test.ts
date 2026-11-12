import { describe, expect, it } from "bun:test";
import { tableLabel } from "./prose-table";

describe("tableLabel", () => {
  it("names a table by its column headings", () => {
    const html = `
      <thead><tr>
        <th style="text-align:left">Dimension</th>
        <th style="text-align:left">Genuine <strong>necessity</strong></th>
        <th>Cost &amp; time</th>
      </tr></thead>
      <tbody><tr><th>Origin</th><td>Scarcity</td></tr></tbody>`;
    expect(tableLabel(html)).toBe("Dimension, Genuine necessity, Cost & time");
  });

  it("reads header cells anywhere when there is no thead", () => {
    expect(tableLabel("<tr><th>Form</th><th>Claim</th></tr>")).toBe(
      "Form, Claim",
    );
  });

  it("falls back to a plain name when no cell is a heading", () => {
    expect(tableLabel("<tbody><tr><td>x</td></tr></tbody>")).toBe("Table");
  });
});
