import { describe, expect, it } from "bun:test";

import {
  CONFORMANCE_LEVELS,
  RECORD_KINDS,
  canonicalizeRevisableDelegationRecord,
  hashRevisableDelegationRecord,
  parseRevisableDelegationRecord,
  sealRevisableDelegationRecord,
  verifyRevisableDelegationRecordHash,
  type UnsealedRevisableDelegationRecord,
} from "./revisable-delegation-record";

type JsonSchema = {
  required: string[];
  properties: Record<string, { enum?: string[] }>;
  examples: unknown[];
  allOf: { if: { properties: { kind: { const: string } } } }[];
};

const loadSchema = async () =>
  (await Bun.file(
    "public/api/schema/revisable-delegation-record.schema.json",
  ).json()) as JsonSchema;

const unsealedAction: UnsealedRevisableDelegationRecord = {
  schema_version: "0.1.0",
  record_id: "ambit:action:deploy_staging:42",
  kind: "action",
  system: { id: "ambit", version: "0.4.1" },
  actor: { id: "agent-session-9", kind: "model", on_behalf_of: "operator" },
  subject: "act:continuous-delivery/deploy_staging",
  summary: "Deployed the staging environment under a confirm-mode authorization.",
  time: {
    as_of: "2026-09-06T10:00:00Z",
    recorded_at: "2026-09-06T10:00:02Z",
  },
  content: { description: "deploy staging", reversible: true },
  depends_on: ["ambit:authorization:deploy_staging"],
  invalidated_by: [{ condition: "authorization revoked", clock: "PT0S" }],
  authority: {
    authorization_record: "ambit:authorization:deploy_staging",
    clauses: ["STD-07.2.1"],
  },
  visibility: "internal",
};

describe("STD-07 revisable delegation record", () => {
  it("accepts every example the JSON schema publishes", async () => {
    const schema = await loadSchema();
    expect(schema.examples.length).toBeGreaterThan(0);
    for (const example of schema.examples) {
      const result = parseRevisableDelegationRecord(example);
      expect(result.success, JSON.stringify(result.success ? null : result.error.issues)).toBe(true);
    }
  });

  it("keeps the JSON schema and the zod parser in step", async () => {
    const schema = await loadSchema();
    expect(schema.properties.kind.enum).toEqual([...RECORD_KINDS]);
    expect(schema.allOf.map((block) => block.if.properties.kind.const)).toEqual([
      ...RECORD_KINDS,
    ]);

    const minimal = { ...unsealedAction, integrity: { algorithm: "sha256", hash: "0".repeat(64) } };
    for (const field of schema.required) {
      const missing: Record<string, unknown> = { ...minimal };
      delete missing[field];
      expect(parseRevisableDelegationRecord(missing).success, `${field} should be required`).toBe(false);
    }
  });

  it("rejects an action with no authorization and a revision with no supersedes", () => {
    const sealedShape = { integrity: { algorithm: "sha256", hash: "0".repeat(64) } };
    const noAuthority = parseRevisableDelegationRecord({
      ...unsealedAction,
      ...sealedShape,
      authority: { clauses: [] },
    });
    expect(noAuthority.success).toBe(false);

    const revision = parseRevisableDelegationRecord({
      ...unsealedAction,
      ...sealedShape,
      kind: "revision",
      content: { reason: "assumption failed" },
      authority: undefined,
    });
    expect(revision.success).toBe(false);
  });

  it("canonicalizes independent of key order and undefined fields", () => {
    const reordered = {
      visibility: unsealedAction.visibility,
      time: { recorded_at: unsealedAction.time.recorded_at, as_of: unsealedAction.time.as_of },
      content: unsealedAction.content,
      summary: unsealedAction.summary,
      subject: unsealedAction.subject,
      actor: unsealedAction.actor,
      system: unsealedAction.system,
      kind: unsealedAction.kind,
      record_id: unsealedAction.record_id,
      schema_version: unsealedAction.schema_version,
      depends_on: unsealedAction.depends_on,
      invalidated_by: unsealedAction.invalidated_by,
      authority: unsealedAction.authority,
      supersedes: undefined,
    } as UnsealedRevisableDelegationRecord;
    expect(canonicalizeRevisableDelegationRecord(reordered)).toBe(
      canonicalizeRevisableDelegationRecord(unsealedAction),
    );
  });

  it("seals, verifies, and chains records", async () => {
    const first = await sealRevisableDelegationRecord(unsealedAction);
    expect(parseRevisableDelegationRecord(first).success).toBe(true);
    expect(await verifyRevisableDelegationRecordHash(first)).toBe(true);
    expect(first.integrity.hash).toBe(await hashRevisableDelegationRecord(unsealedAction));

    const second = await sealRevisableDelegationRecord(
      { ...unsealedAction, record_id: "ambit:action:deploy_staging:43" },
      { priorHash: first.integrity.hash },
    );
    expect(second.integrity.prior_hash).toBe(first.integrity.hash);

    const tampered = { ...first, summary: "Deployed production." };
    expect(await verifyRevisableDelegationRecordHash(tampered)).toBe(false);
  });

  it("publishes four conformance levels", () => {
    expect(Object.keys(CONFORMANCE_LEVELS)).toEqual(["0", "1", "2", "3"]);
  });
});
