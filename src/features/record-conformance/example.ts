/**
 * A real stream, not a mock-up.
 *
 * These six records are the actual output of `ambit delegation --export` from
 * a capability graph where a credential's declared check had started failing:
 * the capability that broke, the authorization that rested on it, the
 * discrepancy, the revision narrowing the grant, an operator's objection to
 * that narrowing, and the answer refusing it with a reason. Each carries the
 * environment that wrote it, which is what lets a second Ambit graph read this
 * stream without mistaking it for its own output. They are reproduced
 * byte-for-byte so the worked example demonstrates the checker against
 * something that was emitted rather than something written to pass.
 *
 * It earns Level 3, which no stream did when this page shipped. The useful
 * thing to try is deleting the last two records: the same stream drops to
 * Level 2 and the readout names the objection as what it now lacks, which is
 * the demonstration that the levels describe a log rather than a vendor.
 */
export const EXAMPLE_LABEL = "Load a worked example";

/**
 * Ambit's published `server.json`, carrying the real declaration for the real
 * stream below. The registry fields unrelated to delegation are dropped; the
 * declaration itself is verbatim, five levels deep under the MCP registry's
 * `_meta` namespacing — which is why the manifest reader finds a declaration by
 * shape rather than by path.
 */
export const EXAMPLE_MANIFEST = `{
  "name": "io.github.zz-plant/ambit",
  "description": "A capability graph that decides what may run unattended.",
  "_meta": {
    "io.modelcontextprotocol.registry/publisher-provided": {
      "org.ethotechnics.revisable-delegation": {
        "loopPosition": [
          "capability",
          "authorization"
        ],
        "standard": "https://ethotechnics.org/standards/std-07-revisable-delegation-record",
        "schema": "https://ethotechnics.org/api/schema/revisable-delegation-record.schema.json",
        "schemaVersion": "0.1.0",
        "conformanceLevel": 2,
        "kinds": [
          "capability",
          "authorization",
          "discrepancy",
          "revision",
          "objection"
        ],
        "note": "Level 2 for a stream from a graph nobody has objected in. Every record declares standing, so a stream containing an objection and its answer measures at Level 3.",
        "upstream": "derived at runtime from declared sources; see \`ambit delegation\` output. Empty until a person declares one.",
        "downstream": [],
        "notEmitted": {
          "kinds": [
            "belief",
            "action",
            "outcome"
          ],
          "why": "Ambit holds the capability and authorization steps. Its environment adapter is simulated, so an action record from here would attest to a fixture."
        },
        "enforced": "An unattended grant whose hard prerequisite is failing returns CONFIRM at every decision, whether or not any record has been written.",
        "export": "ambit delegation --export",
        "consumes": {
          "kinds": [
            "discrepancy"
          ],
          "how": "ambit delegation ingest <file>, or a source declared with \`ambit delegation source add\` and read on every full verification run",
          "effect": "A foreign discrepancy about a capability this graph knows is recorded as evidence attributed to the sending environment. It does not move a lifecycle: a peer reporting a capability broken does not narrow a grant here, only where the check actually failed.",
          "from": "another Ambit environment, which runs the same tech tree and so names capabilities identically. A source whose system is ambit must name its instance, and cannot name this one."
        },
        "verifier": "https://ethotechnics.org/diagnostics/record-conformance"
      }
    }
  }
}`;

export const EXAMPLE_STREAM = `{"schema_version":"0.1.0","record_id":"ambit:capability:credential:k8s#1","kind":"capability","system":{"id":"ambit","instance":"laptop"},"actor":{"id":"ambit","kind":"service"},"subject":"credential:k8s","summary":"Kubeconfig is broken: its declared check is not passing.","time":{"as_of":"2026-09-07T03:18:19.000Z","recorded_at":"2026-09-07T03:18:19.652Z"},"content":{"capability_id":"credential:k8s","state":"broken","ambit_lifecycle":"broken"},"visibility":"internal","contest":{"standing":"anyone who can run the declared check and show it reads otherwise","reversal_clock":"P1D"},"integrity":{"algorithm":"sha256","hash":"7ffdd1b14a19be694afb469a735e79cffcacad8ad534e9853294507a1c7d7c75"}}
{"schema_version":"0.1.0","record_id":"ambit:authorization:1","kind":"authorization","system":{"id":"ambit","instance":"laptop"},"actor":{"id":"declared","kind":"service"},"subject":"combo:deploy/execute","summary":"Deploy may run execute unattended.","time":{"as_of":"2026-09-07T03:18:19.000Z","recorded_at":"2026-09-07T03:18:19.652Z"},"content":{"scope":"everywhere","holder":"any actor","granted_by":"declared","mode":"unattended","revocation_conditions":["a hard prerequisite stops passing its declared check","the capability itself stops passing its declared check"]},"depends_on":["ambit:capability:credential:k8s#1"],"invalidated_by":[{"condition":"Kubeconfig stops passing its declared check","clock":"PT0S"}],"authority":{"clauses":["STD-07.2.2","STD-07.3.4"]},"visibility":"internal","contest":{"standing":"the person who holds or granted this authority","reversal_clock":"P1D"},"integrity":{"algorithm":"sha256","hash":"819bc14a2aa68ebd0cc35be8aba89ef15090d45c1575be0211de2ee06be53a21","prior_hash":"7ffdd1b14a19be694afb469a735e79cffcacad8ad534e9853294507a1c7d7c75"}}
{"schema_version":"0.1.0","record_id":"ambit:discrepancy:1:credential:k8s#1","kind":"discrepancy","system":{"id":"ambit","instance":"laptop"},"actor":{"id":"ambit","kind":"service"},"subject":"credential:k8s","summary":"Kubeconfig was expected to be passing and is broken.","time":{"as_of":"2026-09-07T03:18:19.000Z","recorded_at":"2026-09-07T03:18:19.652Z"},"content":{"expected":"Kubeconfig passing its declared check","observed":"Kubeconfig is broken","source":"ambit declared check","severity":"high"},"depends_on":["ambit:capability:credential:k8s#1"],"authority":{"clauses":["STD-07.3.3"]},"visibility":"internal","contest":{"standing":"anyone who can run the declared check and show it reads otherwise","reversal_clock":"P1D"},"integrity":{"algorithm":"sha256","hash":"2b36559e590ce767a41c46ac4e7e7432ce2645be1e088a670eb825ea34d68daa","prior_hash":"819bc14a2aa68ebd0cc35be8aba89ef15090d45c1575be0211de2ee06be53a21"}}
{"schema_version":"0.1.0","record_id":"ambit:revision:1:credential:k8s#1","kind":"revision","system":{"id":"ambit","instance":"laptop"},"actor":{"id":"ambit","kind":"service"},"subject":"combo:deploy/execute","summary":"Deploy asks a person for execute until Kubeconfig passes again.","time":{"as_of":"2026-09-07T03:18:19.000Z","recorded_at":"2026-09-07T03:18:19.652Z"},"content":{"reason":"Kubeconfig is broken, and the grant depends on it","triggered_by":["ambit:discrepancy:1:credential:k8s#1"],"mode_now":"confirm","mode_declared":"unattended","enforced_by":"canExecute, at every decision"},"depends_on":["ambit:discrepancy:1:credential:k8s#1"],"supersedes":"ambit:authorization:1","authority":{"clauses":["STD-07.1.2","STD-07.3.3"]},"visibility":"internal","contest":{"standing":"the person who holds or granted this authority","reversal_clock":"P1D"},"integrity":{"algorithm":"sha256","hash":"a08ef9b56f4acd807253447484950c42b0d5ec7f022d3f368378bb8062cf8765","prior_hash":"2b36559e590ce767a41c46ac4e7e7432ce2645be1e088a670eb825ea34d68daa"}}
{"schema_version":"0.1.0","record_id":"ambit:objection:ambit:revision:1:credential:k8s#1#1","kind":"objection","system":{"id":"ambit","instance":"laptop"},"actor":{"id":"kj","kind":"human"},"subject":"ambit:revision:1:credential:k8s#1","summary":"kj challenges ambit:revision:1:credential:k8s#1 and asks for reconsideration.","time":{"as_of":"2026-09-07T03:18:19.656Z","recorded_at":"2026-09-07T03:18:19.656Z"},"content":{"challenges":"ambit:revision:1:credential:k8s#1","standing_basis":"I granted this authority","standing_declared":"the person who holds or granted this authority","requested":"reconsideration","changes_nothing_by_itself":"Recording an objection does not widen authority. The narrowing stands until the capability passes its check again or the grant is re-declared."},"depends_on":["ambit:revision:1:credential:k8s#1"],"authority":{"clauses":["STD-07.4.1","STD-07.4.2"]},"visibility":"internal","contest":{"standing":"the person who holds or granted this authority","reversal_clock":"P1D"},"integrity":{"algorithm":"sha256","hash":"65c2f8610b8620e6878ad33b24199552b92cdd8b778bb4f84a0fc5bd3ad94575","prior_hash":"a08ef9b56f4acd807253447484950c42b0d5ec7f022d3f368378bb8062cf8765"}}
{"schema_version":"0.1.0","record_id":"ambit:revision:answer:ambit:objection:ambit:revision:1:credential:k8s#1#1","kind":"revision","system":{"id":"ambit","instance":"laptop"},"actor":{"id":"kj","kind":"human"},"subject":"ambit:revision:1:credential:k8s#1","summary":"kj refuses the objection to ambit:revision:1:credential:k8s#1, and the record stands.","time":{"as_of":"2026-09-07T03:18:19.657Z","recorded_at":"2026-09-07T03:18:19.657Z"},"content":{"answers":"ambit:objection:ambit:revision:1:credential:k8s#1#1","disposition":"refused","reason":"the credential still does not pass its declared check","triggered_by":["ambit:objection:ambit:revision:1:credential:k8s#1#1"],"enforcement_unchanged":"An answer records what a person decided about the record. It does not move any capability lifecycle, so the gate returns what the evidence supports either way."},"depends_on":["ambit:objection:ambit:revision:1:credential:k8s#1#1"],"supersedes":"ambit:objection:ambit:revision:1:credential:k8s#1#1","authority":{"clauses":["STD-07.4.2"]},"visibility":"internal","contest":{"standing":"the person who holds or granted this authority","reversal_clock":"P1D"},"integrity":{"algorithm":"sha256","hash":"2dd173f8352867a6b95e462d081b4fc673bd87604da8afde8db617fdb7efa4ee","prior_hash":"65c2f8610b8620e6878ad33b24199552b92cdd8b778bb4f84a0fc5bd3ad94575"}}`;
