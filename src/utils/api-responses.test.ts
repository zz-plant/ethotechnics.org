import { describe, expect, it } from "bun:test";

import {
  createDiagnosticResultsResponse,
  createValidatorsResponse,
} from "./api-responses";
import { diagnosticResultsCatalog, getValidatorsForApi } from "./api";

describe("createValidatorsResponse", () => {
  it("returns validators payload with shared metadata", async () => {
    const response = createValidatorsResponse();
    const payload: any = await response.json();

    expect(response.headers.get("Content-Type")).toBe(
      "application/json; charset=utf-8",
    );
    expect(payload.meta.count).toBe(getValidatorsForApi().length);
    expect(typeof payload.meta.release.id).toBe("string");
    expect(payload.meta.permalink).toBe("/validators");
    expect(payload.validators.length).toBe(payload.meta.count);
  });
});

describe("createDiagnosticResultsResponse", () => {
  it("returns catalog results keyed under results", async () => {
    const response = createDiagnosticResultsResponse();
    const payload: any = await response.json();

    expect(payload.meta.count).toBe(diagnosticResultsCatalog.length);
    expect(payload.results.length).toBe(diagnosticResultsCatalog.length);
  });
});
