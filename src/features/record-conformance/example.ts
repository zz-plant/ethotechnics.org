/**
 * A real stream, not a mock-up.
 *
 * These six records are the actual output of `ambit delegation --export` from
 * a capability graph where a credential's declared check had started failing:
 * the capability that broke, the authorization that rested on it, the
 * discrepancy, the revision narrowing the grant, an operator's objection to
 * that narrowing, and the answer refusing it with a reason. They are reproduced
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
        "upstream": [],
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
          "how": "ambit delegation ingest <file>",
          "effect": "A foreign discrepancy about a capability this graph knows is recorded as evidence attributed to the sending system. It does not move a lifecycle, so no remote system can narrow a grant here by sending a file."
        },
        "verifier": "https://ethotechnics.org/diagnostics/record-conformance"
      }
    }
  }
}`;

export const EXAMPLE_STREAM = `{"schema_version":"0.1.0","record_id":"ambit:capability:credential:k8s#1","kind":"capability","system":{"id":"ambit"},"actor":{"id":"ambit","kind":"service"},"subject":"credential:k8s","summary":"Kubeconfig is broken: its declared check is not passing.","time":{"as_of":"2026-09-07T02:14:17.000Z","recorded_at":"2026-09-07T02:14:17.239Z"},"content":{"capability_id":"credential:k8s","state":"broken","ambit_lifecycle":"broken"},"visibility":"internal","contest":{"standing":"anyone who can run the declared check and show it reads otherwise","reversal_clock":"P1D"},"integrity":{"algorithm":"sha256","hash":"9ecaee5621d8f3ccaa24fe2248957d0e7c47c70ef0872184186722ed8a95ecf1"}}
{"schema_version":"0.1.0","record_id":"ambit:authorization:1","kind":"authorization","system":{"id":"ambit"},"actor":{"id":"declared","kind":"service"},"subject":"combo:deploy/execute","summary":"Deploy may run execute unattended.","time":{"as_of":"2026-09-07T02:14:17.000Z","recorded_at":"2026-09-07T02:14:17.239Z"},"content":{"scope":"everywhere","holder":"any actor","granted_by":"declared","mode":"unattended","revocation_conditions":["a hard prerequisite stops passing its declared check","the capability itself stops passing its declared check"]},"depends_on":["ambit:capability:credential:k8s#1"],"invalidated_by":[{"condition":"Kubeconfig stops passing its declared check","clock":"PT0S"}],"authority":{"clauses":["STD-07.2.2","STD-07.3.4"]},"visibility":"internal","contest":{"standing":"the person who holds or granted this authority","reversal_clock":"P1D"},"integrity":{"algorithm":"sha256","hash":"1b2104ed8cdad259e8c005f9fb629b7bdcad29310ff3b236f0c45c9f6bcc72e5","prior_hash":"9ecaee5621d8f3ccaa24fe2248957d0e7c47c70ef0872184186722ed8a95ecf1"}}
{"schema_version":"0.1.0","record_id":"ambit:discrepancy:1:credential:k8s#1","kind":"discrepancy","system":{"id":"ambit"},"actor":{"id":"ambit","kind":"service"},"subject":"credential:k8s","summary":"Kubeconfig was expected to be passing and is broken.","time":{"as_of":"2026-09-07T02:14:17.000Z","recorded_at":"2026-09-07T02:14:17.239Z"},"content":{"expected":"Kubeconfig passing its declared check","observed":"Kubeconfig is broken","source":"ambit declared check","severity":"high"},"depends_on":["ambit:capability:credential:k8s#1"],"authority":{"clauses":["STD-07.3.3"]},"visibility":"internal","contest":{"standing":"anyone who can run the declared check and show it reads otherwise","reversal_clock":"P1D"},"integrity":{"algorithm":"sha256","hash":"08dc1844713735bd8b3bb9f9e2af4c56fcc17389187c6f7a379fea537c06adb7","prior_hash":"1b2104ed8cdad259e8c005f9fb629b7bdcad29310ff3b236f0c45c9f6bcc72e5"}}
{"schema_version":"0.1.0","record_id":"ambit:revision:1:credential:k8s#1","kind":"revision","system":{"id":"ambit"},"actor":{"id":"ambit","kind":"service"},"subject":"combo:deploy/execute","summary":"Deploy asks a person for execute until Kubeconfig passes again.","time":{"as_of":"2026-09-07T02:14:17.000Z","recorded_at":"2026-09-07T02:14:17.239Z"},"content":{"reason":"Kubeconfig is broken, and the grant depends on it","triggered_by":["ambit:discrepancy:1:credential:k8s#1"],"mode_now":"confirm","mode_declared":"unattended","enforced_by":"canExecute, at every decision"},"depends_on":["ambit:discrepancy:1:credential:k8s#1"],"supersedes":"ambit:authorization:1","authority":{"clauses":["STD-07.1.2","STD-07.3.3"]},"visibility":"internal","contest":{"standing":"the person who holds or granted this authority","reversal_clock":"P1D"},"integrity":{"algorithm":"sha256","hash":"fe80e366638c1a61deb7b49463c192643f32516ad409e5c6c53e5e720947dfee","prior_hash":"08dc1844713735bd8b3bb9f9e2af4c56fcc17389187c6f7a379fea537c06adb7"}}
{"schema_version":"0.1.0","record_id":"ambit:objection:ambit:revision:1:credential:k8s#1#1","kind":"objection","system":{"id":"ambit"},"actor":{"id":"kj","kind":"human"},"subject":"ambit:revision:1:credential:k8s#1","summary":"kj challenges ambit:revision:1:credential:k8s#1 and asks for reconsideration.","time":{"as_of":"2026-09-07T02:14:17.242Z","recorded_at":"2026-09-07T02:14:17.242Z"},"content":{"challenges":"ambit:revision:1:credential:k8s#1","standing_basis":"I granted this authority","standing_declared":"the person who holds or granted this authority","requested":"reconsideration","changes_nothing_by_itself":"Recording an objection does not widen authority. The narrowing stands until the capability passes its check again or the grant is re-declared."},"depends_on":["ambit:revision:1:credential:k8s#1"],"authority":{"clauses":["STD-07.4.1","STD-07.4.2"]},"visibility":"internal","contest":{"standing":"the person who holds or granted this authority","reversal_clock":"P1D"},"integrity":{"algorithm":"sha256","hash":"aedf51d8ad0a9c386040c90e8d51f2e211a38bc39a7bed4ec7218e97b8be74dc","prior_hash":"fe80e366638c1a61deb7b49463c192643f32516ad409e5c6c53e5e720947dfee"}}
{"schema_version":"0.1.0","record_id":"ambit:revision:answer:ambit:objection:ambit:revision:1:credential:k8s#1#1","kind":"revision","system":{"id":"ambit"},"actor":{"id":"kj","kind":"human"},"subject":"ambit:revision:1:credential:k8s#1","summary":"kj refuses the objection to ambit:revision:1:credential:k8s#1, and the record stands.","time":{"as_of":"2026-09-07T02:14:17.242Z","recorded_at":"2026-09-07T02:14:17.242Z"},"content":{"answers":"ambit:objection:ambit:revision:1:credential:k8s#1#1","disposition":"refused","reason":"the credential still does not pass its declared check","triggered_by":["ambit:objection:ambit:revision:1:credential:k8s#1#1"],"enforcement_unchanged":"An answer records what a person decided about the record. It does not move any capability lifecycle, so the gate returns what the evidence supports either way."},"depends_on":["ambit:objection:ambit:revision:1:credential:k8s#1#1"],"supersedes":"ambit:objection:ambit:revision:1:credential:k8s#1#1","authority":{"clauses":["STD-07.4.2"]},"visibility":"internal","contest":{"standing":"the person who holds or granted this authority","reversal_clock":"P1D"},"integrity":{"algorithm":"sha256","hash":"9a9d7d13c300bc40d59c6dd7843d41316e64bb5bc394d4c4db821f0a5b07da30","prior_hash":"aedf51d8ad0a9c386040c90e8d51f2e211a38bc39a7bed4ec7218e97b8be74dc"}}`;
