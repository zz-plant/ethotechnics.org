import { afterAll, beforeAll, expect, it } from "bun:test";

beforeAll(async () => {
  document.body.innerHTML = `
    <form data-burden-form>
      <div data-burden-row><input data-field="role" value="Claimant"><input data-field="type" value="time"><input data-field="likely" value="4"></div>
      <input data-field="repair_sla" value="48 hours">
    </form>
    <textarea data-compare-input></textarea><button data-compare-button></button>
    <div data-compare-results hidden><ul data-compare-list></ul></div>`;
  await import("./burden-budget-worksheet");
});
afterAll(() => {
  document.body.innerHTML = "";
});

it("detects edited values within an existing burden row and repair pathway", () => {
  const previous = {
    artifact_id: "BB-01",
    artifact_version: "1.1.0",
    revision: "",
    system_name: "",
    system_action: "",
    worst_case_error: "",
    owner: "",
    review_cadence: "",
    claimed_saving: "",
    unfunded_lines: "",
    assumptions: "",
    harm_roles: [],
    burden_estimates: [
      {
        role: "Claimant",
        type: "time",
        estimate: { min: null, likely: 2, max: null, unit: "" },
        assumptions: "",
      },
    ],
    burden_totals: [],
    absorbers: [],
    burden_ceiling: [],
    enforcement_triggers: [],
    governability_costs: [],
    revision_history: [],
    repair_pathway: {
      entry_points: "",
      required_documents: "",
      promised_turnaround: "24 hours",
      interim_protections: "",
    },
  };
  document.querySelector<HTMLTextAreaElement>("textarea")!.value =
    JSON.stringify(previous);
  document.querySelector<HTMLButtonElement>("button")!.click();
  const text = document.querySelector("ul")!.textContent;
  expect(text).toContain("burden_estimates changed");
  expect(text).toContain("repair_pathway changed");
});

it("reports non-object JSON instead of comparing it as a worksheet", () => {
  document.querySelector<HTMLTextAreaElement>("textarea")!.value = "null";
  document.querySelector<HTMLButtonElement>("button")!.click();
  expect(document.querySelector("ul")!.textContent).toContain(
    "Invalid worksheet",
  );
});
