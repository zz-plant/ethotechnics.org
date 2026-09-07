import { RECORD_KINDS } from "../../utils/revisable-delegation-record";

import type { ConformanceFinding, ConformanceReport } from "./conformance";

/** Just the part of a report this comparison needs. */
type StreamShape = Pick<ConformanceReport, "parsed" | "kinds">;

/**
 * Reading an emitter's own manifest, so the stream can be checked against what
 * its author said about it rather than against a level a reviewer picked from a
 * dropdown.
 *
 * A declaration is a public artifact and the stream usually is not: Whether
 * serves `/.well-known/whether-agent.json` to anyone and its records only to
 * the operator who owns them; Ambit publishes `server.json` and keeps its
 * records in a local database. So this takes the manifest as text alongside the
 * stream rather than fetching it. That keeps the promise the rest of this
 * feature makes — nothing leaves the page — and it works for the emitters that
 * exist, which a URL box would not.
 *
 * The declaration is found by shape, not by path. Whether nests it one level
 * deep under `revisableDelegation`; Ambit buries it five deep under the MCP
 * registry's `_meta` namespacing. Both are legitimate homes in their own
 * format, and a checker that insisted on one of them would simply not read the
 * other.
 */

export type DelegationDeclaration = {
  /** Where in the manifest it was found, so an author can go fix it. */
  at: string;
  conformanceLevel: number | null;
  kinds: string[];
  systemId: string | null;
  records: string | null;
  verifier: string | null;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asString = (value: unknown): string | null =>
  typeof value === "string" && value.trim() ? value.trim() : null;

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];

/**
 * A declaration is any object carrying a `conformanceLevel` alongside a
 * `standard` naming STD-07. Requiring both is what keeps an unrelated
 * `conformanceLevel` in some other vocabulary from being read as one of these.
 */
function collect(value: unknown, path: string, found: DelegationDeclaration[]): void {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => collect(entry, `${path}[${index}]`, found));
    return;
  }
  if (!isObject(value)) return;

  const standard = asString(value.standard);
  if ("conformanceLevel" in value && standard?.includes("revisable-delegation")) {
    const level = value.conformanceLevel;
    found.push({
      at: path || "(root)",
      conformanceLevel: typeof level === "number" && Number.isInteger(level) ? level : null,
      kinds: asStringArray(value.kinds),
      systemId: asString(value.systemId) ?? asString(value.system),
      records: asString(value.records),
      verifier: asString(value.verifier),
    });
  }

  for (const [key, entry] of Object.entries(value)) {
    collect(entry, path ? `${path}.${key}` : key, found);
  }
}

export type ManifestReadResult =
  | { ok: true; declaration: DelegationDeclaration }
  | { ok: false; reason: string };

export function readManifest(text: string): ManifestReadResult {
  const trimmed = text.trim();
  if (!trimmed) return { ok: false, reason: "no manifest given" };

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return { ok: false, reason: "the manifest is not valid JSON" };
  }

  const found: DelegationDeclaration[] = [];
  collect(parsed, "", found);

  if (!found.length) {
    return {
      ok: false,
      reason:
        "no revisable-delegation declaration in this manifest: nothing carries a conformanceLevel next to a standard naming STD-07",
    };
  }
  if (found.length > 1) {
    return {
      ok: false,
      reason: `this manifest declares ${found.length} conformance levels (${found
        .map((entry) => entry.at)
        .join(", ")}); a system that says two things about itself has not said one`,
    };
  }
  return { ok: true, declaration: found[0] };
}

const KNOWN_KINDS = new Set<string>(RECORD_KINDS);

/**
 * What the manifest claims, against what the stream shows. The declared level
 * is already checked by the audit itself; these are the two claims a level
 * alone cannot reach.
 */
export function compareDeclaration(
  declaration: DelegationDeclaration,
  report: StreamShape,
): ConformanceFinding[] {
  const findings: ConformanceFinding[] = [];
  if (!report.parsed) return findings;

  const present = new Set(Object.keys(report.kinds));
  const declared = declaration.kinds;

  const unknown = declared.filter((kind) => !KNOWN_KINDS.has(kind));
  if (unknown.length) {
    findings.push({
      id: "manifest-unknown-kind",
      severity: "finding",
      title: `The manifest declares ${unknown.length === 1 ? "a kind" : "kinds"} the standard does not define`,
      detail: `STD-07 defines eight record kinds. ${unknown.join(", ")} ${unknown.length === 1 ? "is" : "are"} not among them, so no reader can know what to expect.`,
      clause: "STD-07 §2",
      records: [],
    });
  }

  const missing = declared.filter((kind) => KNOWN_KINDS.has(kind) && !present.has(kind));
  if (missing.length) {
    findings.push({
      id: "manifest-kind-absent",
      severity: "finding",
      title: `The manifest claims ${missing.length === 1 ? "a kind" : "kinds"} this stream does not contain`,
      detail: `Declared but absent: ${missing.join(", ")}. Either the stream is a partial export, or the manifest describes an intention rather than what the system emits.`,
      clause: "STD-07 §6",
      records: [],
    });
  }

  const undeclared = [...present].filter((kind) => !declared.includes(kind));
  if (declared.length && undeclared.length) {
    findings.push({
      id: "manifest-kind-undeclared",
      severity: "finding",
      title: `The stream contains ${undeclared.length === 1 ? "a kind" : "kinds"} the manifest does not declare`,
      detail: `Present but undeclared: ${undeclared.join(", ")}. A consumer that read the manifest to decide what to handle would drop these.`,
      clause: "STD-07 §6",
      records: [],
    });
  }

  return findings;
}
