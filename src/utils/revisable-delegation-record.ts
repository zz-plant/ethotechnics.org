import { z } from "zod";

/**
 * STD-07 Revisable Delegation Record: the TypeScript validator that mirrors
 * `public/api/schema/revisable-delegation-record.schema.json`.
 *
 * The JSON schema is the citable artifact; this module is what an emitting
 * system imports so it can validate before it writes, and hash the way STD-07
 * §5 says to. The two are kept in step by
 * `revisable-delegation-record.test.ts`, which validates the schema's own
 * examples through this parser and compares required-field lists.
 */

export const REVISABLE_DELEGATION_RECORD_SCHEMA_VERSION = "0.1.0" as const;

export const REVISABLE_DELEGATION_RECORD_SCHEMA_URL =
  "https://ethotechnics.org/api/schema/revisable-delegation-record.schema.json";

export const REVISABLE_DELEGATION_RECORD_STANDARD_URL =
  "https://ethotechnics.org/standards/std-07-revisable-delegation-record";

export const RECORD_KINDS = [
  "belief",
  "capability",
  "authorization",
  "action",
  "discrepancy",
  "revision",
  "objection",
  "outcome",
] as const;

export type RecordKind = (typeof RECORD_KINDS)[number];

/**
 * Conformance levels from STD-07 §6. An emitting system declares the highest
 * level every record it emits satisfies; a consumer should treat a level as
 * a floor, not a promise about any one record.
 */
export const CONFORMANCE_LEVELS = {
  0: "emitting: valid records with as_of and recorded_at distinguished",
  1: "append-only: supersedes chains and integrity hashes, prior_hash linked",
  2: "dependent: belief, authorization and action records carry depends_on and invalidated_by",
  3: "contestable: contest.standing and a live channel; objection records accepted from outside the system",
} as const;

export type ConformanceLevel = keyof typeof CONFORMANCE_LEVELS;

const dateTime = z.iso.datetime({ offset: true });
const sha256Hex = z.string().regex(/^[0-9a-f]{64}$/);
const nonEmpty = z.string().min(1);

const invalidationSchema = z
  .object({
    condition: nonEmpty,
    check: z.url().optional(),
    clock: z.string().optional(),
  })
  .strict();

const authoritySchema = z
  .object({
    authorization_record: z.string().optional(),
    clauses: z.array(z.string()).optional(),
  })
  .strict();

const contentByKind = {
  belief: z.looseObject({
    proposition: nonEmpty,
    probability: z.number().min(0).max(1).optional(),
    confidence: z.number().min(0).max(1).optional(),
    reference_class: z.string().optional(),
    evidence: z.array(z.string()).optional(),
  }),
  capability: z.looseObject({
    capability_id: nonEmpty,
    state: z.enum(["absent", "configured", "verified", "broken"]),
    requires: z.array(z.string()).optional(),
  }),
  authorization: z.looseObject({
    scope: nonEmpty,
    holder: nonEmpty,
    granted_by: nonEmpty,
    mode: z.enum(["unattended", "confirm", "forbidden"]),
    ceiling: z.string().optional(),
    expires_at: dateTime.optional(),
    revocation_conditions: z.array(z.string()),
  }),
  action: z.looseObject({
    description: nonEmpty,
    reversible: z.boolean(),
    reversal_path: z.string().optional(),
    parameters: z.record(z.string(), z.unknown()).optional(),
  }),
  discrepancy: z.looseObject({
    expected: nonEmpty,
    observed: nonEmpty,
    source: nonEmpty,
    severity: z.enum(["low", "medium", "high"]).optional(),
  }),
  revision: z.looseObject({
    reason: nonEmpty,
    triggered_by: z.array(z.string()).optional(),
  }),
  objection: z.looseObject({
    challenges: nonEmpty,
    standing_basis: nonEmpty,
    requested: nonEmpty,
  }),
  outcome: z.looseObject({
    action_record: nonEmpty,
    result: nonEmpty,
    matched_expectation: z.boolean().nullable().optional(),
    learned: z.string().optional(),
  }),
} satisfies Record<RecordKind, z.ZodType>;

/**
 * The per-kind content shapes, exported so a consumer (and the test suite) can
 * check a content block on its own. They are loose: STD-07 lets an emitter
 * carry vendor keys alongside the declared ones.
 */
export const revisableDelegationRecordContentSchemas = contentByKind;

const baseRecordSchema = z
  .object({
    schema_version: z.literal(REVISABLE_DELEGATION_RECORD_SCHEMA_VERSION),
    record_id: nonEmpty,
    kind: z.enum(RECORD_KINDS),
    system: z
      .object({
        id: nonEmpty,
        version: z.string().optional(),
        origin: z.url().optional(),
      })
      .strict(),
    actor: z
      .object({
        id: nonEmpty,
        kind: z.enum(["human", "model", "service", "institution"]),
        on_behalf_of: z.string().optional(),
      })
      .strict(),
    subject: nonEmpty,
    summary: nonEmpty,
    time: z
      .object({
        as_of: dateTime,
        recorded_at: dateTime,
        available_at: dateTime.optional(),
        valid_until: dateTime.optional(),
      })
      .strict(),
    content: z.record(z.string(), z.unknown()),
    depends_on: z.array(z.string()).optional(),
    invalidated_by: z.array(invalidationSchema).optional(),
    authority: authoritySchema.optional(),
    supersedes: z.string().optional(),
    visibility: z.enum(["public", "internal", "private"]),
    contest: z
      .object({
        standing: nonEmpty,
        channel: z.url().optional(),
        reversal_clock: z.string().optional(),
      })
      .strict()
      .optional(),
    integrity: z
      .object({
        algorithm: z.literal("sha256"),
        hash: sha256Hex,
        prior_hash: sha256Hex.optional(),
        signature: z.string().optional(),
      })
      .strict(),
  })
  .strict();

export const revisableDelegationRecordSchema = baseRecordSchema.superRefine(
  (record, ctx) => {
    const contentResult = contentByKind[record.kind].safeParse(record.content);
    if (!contentResult.success) {
      for (const issue of contentResult.error.issues) {
        ctx.addIssue({
          ...issue,
          path: ["content", ...issue.path],
        });
      }
    }

    if (record.kind === "action" && !record.authority?.authorization_record) {
      ctx.addIssue({
        code: "custom",
        path: ["authority", "authorization_record"],
        message:
          "STD-07 §2.1: an action record must name the authorization it ran under.",
      });
    }

    if (record.kind === "revision" && !record.supersedes) {
      ctx.addIssue({
        code: "custom",
        path: ["supersedes"],
        message: "STD-07 §1.2: a revision must name the record it supersedes.",
      });
    }
  },
);

export type RevisableDelegationRecord = z.infer<typeof baseRecordSchema>;

/** A record before its integrity block has been computed. */
export type UnsealedRevisableDelegationRecord = Omit<
  RevisableDelegationRecord,
  "integrity"
>;

const sortKeysDeep = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, entryValue]) => entryValue !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return Object.fromEntries(
      entries.map(([key, entryValue]) => [key, sortKeysDeep(entryValue)]),
    );
  }
  return value;
};

/**
 * STD-07 §5.1 canonical serialization: the record without its integrity
 * block, keys sorted recursively, no insignificant whitespace, UTF-8.
 */
export const canonicalizeRevisableDelegationRecord = (
  record: UnsealedRevisableDelegationRecord | RevisableDelegationRecord,
): string => {
  const rest: Record<string, unknown> = { ...record };
  delete rest.integrity;
  return JSON.stringify(sortKeysDeep(rest));
};

const toHex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");

export const hashRevisableDelegationRecord = async (
  record: UnsealedRevisableDelegationRecord | RevisableDelegationRecord,
): Promise<string> => {
  const bytes = new TextEncoder().encode(
    canonicalizeRevisableDelegationRecord(record),
  );
  return toHex(await crypto.subtle.digest("SHA-256", bytes));
};

/**
 * Attach an integrity block. `priorHash` chains the record to the previous
 * one in the same system's stream (conformance level 1).
 */
export const sealRevisableDelegationRecord = async (
  record: UnsealedRevisableDelegationRecord,
  options: { priorHash?: string } = {},
): Promise<RevisableDelegationRecord> => {
  const hash = await hashRevisableDelegationRecord(record);
  return {
    ...record,
    integrity: {
      algorithm: "sha256",
      hash,
      ...(options.priorHash ? { prior_hash: options.priorHash } : {}),
    },
  };
};

export const verifyRevisableDelegationRecordHash = async (
  record: RevisableDelegationRecord,
): Promise<boolean> =>
  (await hashRevisableDelegationRecord(record)) === record.integrity.hash;

export const parseRevisableDelegationRecord = (value: unknown) =>
  revisableDelegationRecordSchema.safeParse(value);
