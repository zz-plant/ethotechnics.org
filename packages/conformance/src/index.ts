/**
 * @ethotechnics/conformance — the STD-07 record conformance checker.
 *
 * The same code the site runs at /diagnostics/record-conformance, exported
 * so an emitting system can grade its own log in CI. Everything is
 * re-exported from the site's source; the package build bundles it.
 */
export {
  auditRecords,
  extractCandidates,
  durationMs,
  CONFORMANCE_FINDING_IDS,
  type ConformanceFinding,
  type ConformanceFindingId,
  type ConformanceReport,
  type EarnedLevel,
  type Severity,
} from "../../../src/features/record-conformance/conformance";
export {
  readManifest,
  compareDeclaration,
  type DelegationDeclaration,
  type ManifestReadResult,
} from "../../../src/features/record-conformance/manifest";
export {
  hashRevisableDelegationRecord,
  parseRevisableDelegationRecord,
  RECORD_KINDS,
  CONFORMANCE_LEVELS,
  REVISABLE_DELEGATION_RECORD_SCHEMA_URL,
  REVISABLE_DELEGATION_RECORD_SCHEMA_VERSION,
  REVISABLE_DELEGATION_RECORD_STANDARD_URL,
  type RevisableDelegationRecord,
} from "../../../src/utils/revisable-delegation-record";
