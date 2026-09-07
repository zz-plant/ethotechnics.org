/**
 * A real stream, not a mock-up.
 *
 * These four records are the actual output of `ambit delegation --export` from
 * a capability graph where a credential's declared check had started failing:
 * the capability that broke, the authorization that rested on it, the
 * discrepancy, and the revision narrowing the grant. They are reproduced
 * byte-for-byte so the worked example demonstrates the checker against
 * something that was emitted rather than something written to pass.
 *
 * It earns Level 2 and stops there, which is the more useful demonstration: the
 * readout names what holds it below Level 3 rather than congratulating it.
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
          "revision"
        ],
        "note": "Level 2 is claimed for the four kinds listed and nothing else. Nothing reads these records yet.",
        "upstream": [],
        "downstream": [],
        "notEmitted": {
          "kinds": [
            "belief",
            "action",
            "objection",
            "outcome"
          ],
          "why": "Ambit holds the capability and authorization steps. Its environment adapter is simulated, so an action record from here would attest to a fixture."
        },
        "enforced": "An unattended grant whose hard prerequisite is failing returns CONFIRM at every decision, whether or not any record has been written.",
        "export": "ambit delegation --export"
      }
    }
  }
}`;

export const EXAMPLE_STREAM = `{"schema_version":"0.1.0","record_id":"ambit:capability:credential:k8s#1","kind":"capability","system":{"id":"ambit"},"actor":{"id":"ambit","kind":"service"},"subject":"credential:k8s","summary":"Kubeconfig is broken: its declared check is not passing.","time":{"as_of":"2026-09-06T21:26:04.000Z","recorded_at":"2026-09-06T21:26:05.088Z"},"content":{"capability_id":"credential:k8s","state":"broken","ambit_lifecycle":"broken"},"visibility":"internal","integrity":{"algorithm":"sha256","hash":"225043a8c5a89eec16384e88f8a9cc7c20f63ea8460dda0ad4d3c2a8a9bd5271"}}
{"schema_version":"0.1.0","record_id":"ambit:authorization:1","kind":"authorization","system":{"id":"ambit"},"actor":{"id":"declared","kind":"service"},"subject":"combo:deploy/execute","summary":"Deploy may run execute unattended.","time":{"as_of":"2026-09-06T21:26:04.000Z","recorded_at":"2026-09-06T21:26:05.088Z"},"content":{"scope":"everywhere","holder":"any actor","granted_by":"declared","mode":"unattended","revocation_conditions":["a hard prerequisite stops passing its declared check","the capability itself stops passing its declared check"]},"depends_on":["ambit:capability:credential:k8s#1"],"invalidated_by":[{"condition":"Kubeconfig stops passing its declared check","clock":"PT0S"}],"authority":{"clauses":["STD-07.2.2","STD-07.3.4"]},"visibility":"internal","contest":{"standing":"the person who holds or granted this authority","reversal_clock":"P1D"},"integrity":{"algorithm":"sha256","hash":"5bed029c35cdddfea04520ee156c44d74bf5aa28c8277076bc2f2023465dd1a9","prior_hash":"225043a8c5a89eec16384e88f8a9cc7c20f63ea8460dda0ad4d3c2a8a9bd5271"}}
{"schema_version":"0.1.0","record_id":"ambit:discrepancy:1:credential:k8s#1","kind":"discrepancy","system":{"id":"ambit"},"actor":{"id":"ambit","kind":"service"},"subject":"credential:k8s","summary":"Kubeconfig was expected to be passing and is broken.","time":{"as_of":"2026-09-06T21:26:04.000Z","recorded_at":"2026-09-06T21:26:05.088Z"},"content":{"expected":"Kubeconfig passing its declared check","observed":"Kubeconfig is broken","source":"ambit declared check","severity":"high"},"depends_on":["ambit:capability:credential:k8s#1"],"authority":{"clauses":["STD-07.3.3"]},"visibility":"internal","integrity":{"algorithm":"sha256","hash":"e54bf41efdd37852d070de9700b41c8c845e9adfcdc5d453c5c8d16f06169017","prior_hash":"5bed029c35cdddfea04520ee156c44d74bf5aa28c8277076bc2f2023465dd1a9"}}
{"schema_version":"0.1.0","record_id":"ambit:revision:1:credential:k8s#1","kind":"revision","system":{"id":"ambit"},"actor":{"id":"ambit","kind":"service"},"subject":"combo:deploy/execute","summary":"Deploy asks a person for execute until Kubeconfig passes again.","time":{"as_of":"2026-09-06T21:26:04.000Z","recorded_at":"2026-09-06T21:26:05.088Z"},"content":{"reason":"Kubeconfig is broken, and the grant depends on it","triggered_by":["ambit:discrepancy:1:credential:k8s#1"],"mode_now":"confirm","mode_declared":"unattended","enforced_by":"canExecute, at every decision"},"depends_on":["ambit:discrepancy:1:credential:k8s#1"],"supersedes":"ambit:authorization:1","authority":{"clauses":["STD-07.1.2","STD-07.3.3"]},"visibility":"internal","contest":{"standing":"the person who holds or granted this authority","reversal_clock":"P1D"},"integrity":{"algorithm":"sha256","hash":"ef3a778eccffde94d313af363f327b357679bee7233942b3225b3feb2ff199e4","prior_hash":"e54bf41efdd37852d070de9700b41c8c845e9adfcdc5d453c5c8d16f06169017"}}`;
