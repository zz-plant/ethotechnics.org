import { z } from "zod";
import type { AuditInput } from "../features/delegation-audit/types";

/**
 * Shareable diagnostic readouts.
 *
 * A readout is the inputs a team gave a diagnostic, stored under a random id,
 * plus the moment they were captured. Only the inputs are stored. The readout
 * page reruns the diagnostic on them at render time, so a readout says what
 * the tool says about those inputs today, and nobody can publish a score the
 * tool did not produce. The tool version that produced the page is printed on
 * it; if the scoring changes, the page changes with it, and says so.
 */

export const READOUT_TOOL_IDS = ["delegation-audit"] as const;
export type ReadoutToolId = (typeof READOUT_TOOL_IDS)[number];

/** Bytes of JSON a readout may carry. The tool's inputs are a few KB. */
export const MAX_READOUT_BYTES = 32 * 1024;
/** How long a readout stays retrievable. Wrangler's KV takes seconds. */
export const READOUT_TTL_SECONDS = 365 * 24 * 60 * 60;

const answer3 = z.enum(["yes", "partial", "no"]);
const recency = z.enum(["recent", "this-year", "stale", "never"]);
const shortText = z.string().max(200);

export const delegationAuditInputSchema = z.object({
  workflow: shortText,
  capabilityListSeparate: answer3,
  actionClasses: z
    .array(
      z.object({
        id: z.string().max(64),
        name: shortText,
        authorizer: shortText,
        evidenceBasis: z.string().max(600),
        forWhom: shortText,
        expiry: z.enum(["stated", "automatic", "none"]),
        lastChecked: recency,
      }),
    )
    .max(40),
  policyReviewTrigger: z.enum(["yes", "no", "unknown"]),
  policyExpiry: z.enum(["yes", "no", "unknown"]),
  dependents: z
    .array(
      z.object({
        id: z.string().max(64),
        kind: z.enum(["workflow", "role", "customer", "downstream_software"]),
        name: shortText,
        criticality: z.enum(["low", "medium", "high", "critical"]),
      }),
    )
    .max(40),
  substitutionCostStaffWeeks: z.number().min(0).max(100_000),
  correctionLatencyHours: z.number().min(0).max(1_000_000),
  alternativeExercised: recency,
  errorBearingParties: z.string().max(600),
  canRaise: z.enum(["direct", "via-staff", "no"]),
  namedResponder: z.enum(["yes", "no"]),
  responseDeadline: z.enum(["yes", "no"]),
  challengeEffect: z.enum(["system-state", "own-case", "none"]),
  canStop: z.enum(["tested", "untested", "no"]),
  institutionKeepsFunctioning: z.enum(["yes", "degraded", "no"]),
  expertiseRetained: z.enum(["exercised", "held", "no"]),
}) satisfies z.ZodType<AuditInput>;

export const readoutRequestSchema = z.object({
  tool_id: z.enum(READOUT_TOOL_IDS),
  inputs: delegationAuditInputSchema,
});

export type ReadoutRequest = z.infer<typeof readoutRequestSchema>;

/** What KV holds. `v` is the record format, not the tool version. */
export type StoredReadout = {
  v: 1;
  tool_id: ReadoutToolId;
  captured_at: string;
  inputs: AuditInput;
};

export const storedReadoutSchema = z.object({
  v: z.literal(1),
  tool_id: z.enum(READOUT_TOOL_IDS),
  captured_at: z.string(),
  inputs: delegationAuditInputSchema,
}) satisfies z.ZodType<StoredReadout>;

/** The subset of the KV namespace API the readouts use. */
export type ReadoutStore = {
  get(key: string, type: "text"): Promise<string | null>;
  put(
    key: string,
    value: string,
    options?: { expirationTtl?: number },
  ): Promise<void>;
};

export type ReadoutEnv = {
  READOUTS?: ReadoutStore;
  READOUT_RATE_LIMITER?: {
    limit(options: { key: string }): Promise<{ success: boolean }>;
  };
};

const ID_ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789";
export const READOUT_ID_PATTERN = /^[a-km-z2-9]{16}$/;

/** Sixteen characters from a 32-letter alphabet: eighty bits of randomness. */
export function newReadoutId(
  random: (bytes: Uint8Array) => Uint8Array = (bytes) =>
    crypto.getRandomValues(bytes),
): string {
  const bytes = random(new Uint8Array(16));
  let id = "";
  for (const byte of bytes) id += ID_ALPHABET[byte % ID_ALPHABET.length];
  return id;
}

export function isReadoutId(value: string): boolean {
  return READOUT_ID_PATTERN.test(value);
}

const keyFor = (id: string) => `readout:${id}`;

export async function saveReadout(
  store: ReadoutStore,
  request: ReadoutRequest,
  capturedAt: string = new Date().toISOString(),
  id: string = newReadoutId(),
): Promise<{ id: string; record: StoredReadout }> {
  const record: StoredReadout = {
    v: 1,
    tool_id: request.tool_id,
    captured_at: capturedAt,
    inputs: request.inputs,
  };
  await store.put(keyFor(id), JSON.stringify(record), {
    expirationTtl: READOUT_TTL_SECONDS,
  });
  return { id, record };
}

export async function loadReadout(
  store: ReadoutStore,
  id: string,
): Promise<StoredReadout | null> {
  if (!isReadoutId(id)) return null;
  const raw = await store.get(keyFor(id), "text");
  if (!raw) return null;
  const parsed = storedReadoutSchema.safeParse(JSON.parse(raw));
  return parsed.success ? parsed.data : null;
}

export const readoutPath = (id: string) => `/readouts/${id}`;
