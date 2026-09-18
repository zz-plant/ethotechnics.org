# @ethotechnics/conformance

Grades a stream of [STD-07 revisable delegation records](https://ethotechnics.org/standards/std-07-revisable-delegation-record) against the conformance level its emitter declares, and tells you the level it earned. It is the checker behind [ethotechnics.org/diagnostics/record-conformance](https://ethotechnics.org/diagnostics/record-conformance), packaged so a system that emits records can grade its own log in CI.

The checks are mechanical on purpose: whether hashes recompute, whether the chain links, whether references resolve, whether a record says what would change its mind, and whether a discrepancy was answered inside its clock. Nothing here judges whether a belief was right; that is not checkable from a stream.

## CLI

```bash
npx @ethotechnics/conformance records.jsonl --manifest manifest.json
```

```
--manifest <path>        The emitter's manifest; its declaration supplies the claimed level.
--declared-level <0-3>   The claimed level, when there is no manifest.
--as-of <ISO 8601>       Grade clocks against this moment, not now.
--format text|json|github
--fail-on blocking|finding|overclaim|never   Default overclaim.
```

Exit status is the verdict: `0` when nothing at or above the `--fail-on` threshold was found, `1` otherwise, `2` for a usage error. `--format github` writes one workflow-command annotation per finding.

## GitHub Action

```yaml
- uses: zz-plant/ethotechnics.org@main
  with:
    records: logs/delegation.jsonl
    manifest: ethotechnics.manifest.json
```

The action fails the job when the stream earns less than it declares or carries a blocking finding, and exposes `earned-level` and a JSON `report` as outputs.

## Library

```ts
import { auditRecords } from "@ethotechnics/conformance";

const report = await auditRecords(jsonl, { manifest });
report.earnedLevel; // 0 | 1 | 2 | 3 | null
report.findings; // each with a severity and the STD-07 clause it falls under
```

The schema the records are validated against is published at `https://ethotechnics.org/api/schema/revisable-delegation-record.schema.json`.

## Development

The source lives in the site repository and is bundled at publish time:

```bash
cd packages/conformance
bun run build      # dist/cli.js and dist/index.js, dependency-free
npm publish --access public
```
