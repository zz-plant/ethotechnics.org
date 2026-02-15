import { describe, expect, it } from "bun:test";

import {
  createBadgesResponse,
  createChangelogResponse,
  createCrosswalksResponse,
  createDiagnosticResultsResponse,
  createPostMarketMonitoringResponse,
  createReleasesResponse,
  createValidatorsResponse,
} from "./api-responses";
import {
  diagnosticResultsCatalog,
  getValidatorsForApi,
  releaseInfo,
} from "./api";

type ValidatorsPayload = {
  meta: { count: number; release: { id: string }; permalink: string };
  validators: unknown[];
};

type DiagnosticResultsPayload = {
  meta: { count: number };
  results: unknown[];
};

type ChangelogPayload = {
  meta: { count: number };
  entries: Array<{ date: string }>;
};

type ReleasesPayload = {
  meta: { count: number };
  releases: Array<{ href: string }>;
};

type BadgesPayload = {
  meta: { repo: string };
  badges: { siteChecks: { href: string } };
};

type CrosswalksPayload = {
  meta: { count: number; permalink: string };
  controls: Array<{ frameworks: { euAiAct: string }; href: string }>;
};

type PostMarketMonitoringPayload = {
  meta: { count: number; permalink: string };
  stages: Array<{ stage: string; refs: string[]; href: string }>;
};

const parseJson = async <T>(response: Response): Promise<T> =>
  (await response.json()) as T;

describe("createValidatorsResponse", () => {
  it("returns validators payload with shared metadata", async () => {
    const response = createValidatorsResponse();
    const payload = await parseJson<ValidatorsPayload>(response);

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
    const payload = await parseJson<DiagnosticResultsPayload>(response);

    expect(payload.meta.count).toBe(diagnosticResultsCatalog.length);
    expect(payload.results.length).toBe(diagnosticResultsCatalog.length);
  });
});

describe("createChangelogResponse", () => {
  it("returns sorted changelog entries with count metadata", async () => {
    const payload = await parseJson<ChangelogPayload>(
      createChangelogResponse(),
    );

    expect(payload.meta.count).toBe(payload.entries.length);

    for (let index = 1; index < payload.entries.length; index += 1) {
      expect(
        new Date(payload.entries[index - 1].date).getTime(),
      ).toBeGreaterThanOrEqual(new Date(payload.entries[index].date).getTime());
    }
  });
});

describe("createReleasesResponse", () => {
  it("returns current release permalink and count metadata", async () => {
    const payload = await parseJson<ReleasesPayload>(createReleasesResponse());

    expect(payload.meta.count).toBe(payload.releases.length);
    expect(payload.releases[0]?.href).toBe(releaseInfo.permalink);
  });
});

describe("createBadgesResponse", () => {
  it("includes repository metadata and workflow badge links", async () => {
    const payload = await parseJson<BadgesPayload>(createBadgesResponse());

    expect(payload.meta.repo).toBe("zz-plant/ethotechnics");
    expect(payload.badges.siteChecks.href).toContain(
      "github.com/zz-plant/ethotechnics/actions/workflows/site-checks.yml",
    );
  });
});

describe("createCrosswalksResponse", () => {
  it("returns enforceable governance crosswalk controls", async () => {
    const payload = await parseJson<CrosswalksPayload>(
      createCrosswalksResponse(),
    );

    expect(payload.meta.count).toBeGreaterThan(0);
    expect(payload.meta.permalink).toBe(
      "/standards/enforceable-governance-crosswalks",
    );
    expect(payload.controls[0]?.frameworks.euAiAct.length).toBeGreaterThan(0);
    expect(payload.controls[0]?.href).toBe(
      "/standards/enforceable-governance-crosswalks",
    );
  });
});

describe("createPostMarketMonitoringResponse", () => {
  it("returns post-market monitoring stages", async () => {
    const payload = await parseJson<PostMarketMonitoringPayload>(
      createPostMarketMonitoringResponse(),
    );

    expect(payload.meta.count).toBeGreaterThan(0);
    expect(payload.meta.permalink).toBe("/incidents");
    expect(payload.stages[0]?.stage.length).toBeGreaterThan(0);
    expect(payload.stages[0]?.refs.length).toBeGreaterThan(0);
    expect(payload.stages[0]?.href).toBe("/incidents");
  });
});
