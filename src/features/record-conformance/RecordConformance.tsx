import { useCallback, useRef, useState } from "react";

import {
  auditRecords,
  type ConformanceReport,
  type Severity,
} from "./conformance";
import { EXAMPLE_LABEL, EXAMPLE_MANIFEST, EXAMPLE_STREAM } from "./example";
import "./recordConformance.css";

/**
 * The reader half of STD-07.
 *
 * Everything runs in this component. The records are internal or private by
 * design — one emitter keeps them behind an ownership check, another in a local
 * database — so an auditor that posted them anywhere would be a data-collection
 * surface wearing an auditor's coat. Nothing here leaves the page: no fetch, no
 * upload, no analytics on the contents.
 */

const SEVERITY_LABEL: Record<Severity, string> = {
  blocking: "Blocking",
  finding: "Finding",
  note: "Note",
};

const LEVEL_OPTIONS = [
  { value: "", label: "Not declared" },
  { value: "0", label: "Level 0 — Emitting" },
  { value: "1", label: "Level 1 — Append-only" },
  { value: "2", label: "Level 2 — Dependent" },
  { value: "3", label: "Level 3 — Contestable" },
];

function RecordConformance() {
  const [text, setText] = useState("");
  const [manifest, setManifest] = useState("");
  const [declared, setDeclared] = useState("");
  const [asOf, setAsOf] = useState("");
  const [report, setReport] = useState<ConformanceReport | null>(null);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const run = useCallback(
    async (
      source: string,
      declaredLevel: string,
      asOfValue: string,
      manifestText: string,
    ) => {
      setRunning(true);
      try {
        setReport(
          await auditRecords(source, {
            declaredLevel: declaredLevel === "" ? null : Number(declaredLevel),
            asOf: asOfValue || undefined,
            manifest: manifestText || undefined,
          }),
        );
      } finally {
        setRunning(false);
      }
    },
    [],
  );

  const onFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      const contents = await file.text();
      setText(contents);
      await run(contents, declared, asOf, manifest);
    },
    [declared, asOf, manifest, run],
  );

  const loadExample = useCallback(async () => {
    setText(EXAMPLE_STREAM);
    setManifest(EXAMPLE_MANIFEST);
    setDeclared("");
    setAsOf("");
    await run(EXAMPLE_STREAM, "", "", EXAMPLE_MANIFEST);
  }, [run]);

  const copyReadout = useCallback(async () => {
    if (!report) return;
    const lines = [
      `STD-07 record conformance — ${report.verdict}`,
      `Earned: ${report.earnedLabel}`,
      report.declaredLevel === null
        ? "Declared: not declared"
        : `Declared: Level ${report.declaredLevel}${report.declaration ? ` (from the manifest at ${report.declaration.at})` : ""}`,
      `Records: ${report.parsed} parsed, ${report.rejected.length} rejected`,
      "",
      ...report.findings.map(
        (finding) =>
          `[${SEVERITY_LABEL[finding.severity]}] ${finding.title}${finding.clause ? ` (${finding.clause})` : ""}\n  ${finding.detail}${finding.records.length ? `\n  ${finding.records.join(", ")}` : ""}`,
      ),
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [report]);

  return (
    <div className="record-conformance">
      <div className="record-conformance__grid">
        <section
          className="record-conformance__panel"
          aria-label="The record stream"
        >
          <label
            className="record-conformance__label"
            htmlFor="record-conformance-input"
          >
            Paste a record stream
            <span className="record-conformance__hint">
              Newline-delimited JSON, a JSON array, or an object with a{" "}
              <code>records</code> array. Nothing is uploaded; the audit runs in
              this page.
            </span>
          </label>
          <textarea
            id="record-conformance-input"
            className="record-conformance__textarea"
            value={text}
            spellCheck={false}
            placeholder='{"schema_version":"0.1.0","record_id":"…","kind":"authorization", …}'
            onChange={(event) => setText(event.target.value)}
          />

          <label
            className="record-conformance__label"
            htmlFor="record-conformance-manifest"
          >
            The emitter's manifest <span className="record-conformance__hint">(optional)</span>
            <span className="record-conformance__hint">
              Paste <code>/.well-known/*.json</code>, <code>server.json</code>,
              or whatever the system publishes about itself. The declaration is
              found by shape, so it does not matter how deep it is nested. When
              one is present it supplies the level, and the kinds it claims are
              checked against the kinds actually in the stream.
            </span>
          </label>
          <textarea
            id="record-conformance-manifest"
            className="record-conformance__textarea record-conformance__textarea--short"
            value={manifest}
            spellCheck={false}
            placeholder='{"revisableDelegation":{"standard":"…revisable-delegation-record","conformanceLevel":2,"kinds":["belief"]}}'
            onChange={(event) => setManifest(event.target.value)}
          />

          <div className="record-conformance__row">
            <label
              className="record-conformance__field"
              htmlFor="record-conformance-declared"
            >
              Level the emitter declares
              <select
                id="record-conformance-declared"
                value={declared}
                disabled={manifest.trim().length > 0}
                onChange={(event) => setDeclared(event.target.value)}
              >
                {LEVEL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label
              className="record-conformance__field"
              htmlFor="record-conformance-asof"
            >
              Judge clocks as of
              <input
                id="record-conformance-asof"
                type="datetime-local"
                value={asOf}
                onChange={(event) => setAsOf(event.target.value)}
              />
            </label>
          </div>
          <p className="record-conformance__hint">
            {manifest.trim()
              ? "The manifest is supplying the declared level, so the selector is off. Clear the manifest to set one by hand."
              : "Set the level by hand only when the system publishes no manifest. A declaration read from the artifact the emitter actually serves is the one worth contradicting."}{" "}
            Leave the time blank to use now. Set it to when the stream was
            exported so a clock is judged against the emitter's lateness rather
            than the reviewer's.
          </p>

          <div className="record-conformance__actions">
            <button
              type="button"
              className="record-conformance__button record-conformance__button--primary"
              onClick={() => void run(text, declared, asOf, manifest)}
              disabled={running || text.trim().length === 0}
            >
              {running ? "Auditing…" : "Audit the stream"}
            </button>
            <button
              type="button"
              className="record-conformance__button"
              onClick={() => fileInput.current?.click()}
            >
              Load a file
            </button>
            <button
              type="button"
              className="record-conformance__button"
              onClick={() => void loadExample()}
            >
              {EXAMPLE_LABEL}
            </button>
            <input
              ref={fileInput}
              type="file"
              accept=".ndjson,.jsonl,.json,.txt,application/json"
              hidden
              onChange={(event) => void onFile(event.target.files?.[0])}
            />
          </div>
        </section>

        <section
          className="record-conformance__panel"
          aria-label="The audit readout"
          aria-live="polite"
        >
          {!report ? (
            <p className="record-conformance__empty">
              Paste a stream and run the audit. It checks what the records say
              about each other: whether the hashes hold, whether references
              resolve, whether anything says what would change its mind, and
              whether a discrepancy was ever answered. It does not judge whether
              a belief was correct or an authorization wise, because a stream
              cannot show that.
            </p>
          ) : (
            <>
              <div className="record-conformance__verdict">
                <span className="record-conformance__level">
                  {report.earnedLabel}
                </span>
                <span className="record-conformance__hint">
                  {report.verdict}
                </span>
                <div className="record-conformance__counts">
                  <span className="record-conformance__chip">
                    {report.parsed} parsed
                  </span>
                  {report.rejected.length > 0 && (
                    <span className="record-conformance__chip">
                      {report.rejected.length} rejected
                    </span>
                  )}
                  {Object.entries(report.kinds).map(([kind, count]) => (
                    <span key={kind} className="record-conformance__chip">
                      {count} {kind}
                    </span>
                  ))}
                </div>
              </div>

              {report.declaration && (
                <p className="record-conformance__hint">
                  Read from the manifest at{" "}
                  <code>{report.declaration.at}</code>:{" "}
                  {report.declaration.conformanceLevel === null
                    ? "no usable level"
                    : `Level ${report.declaration.conformanceLevel}`}
                  {report.declaration.kinds.length > 0 &&
                    `, emitting ${report.declaration.kinds.join(", ")}`}
                  .
                </p>
              )}

              {report.blockedFrom.length > 0 && (
                <div>
                  <p className="record-conformance__finding-title">
                    What holds it below the next level
                  </p>
                  <ul className="record-conformance__blocked">
                    {report.blockedFrom.map((entry) => (
                      <li key={entry.level}>
                        Level {entry.level}: {entry.because}.
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {report.findings.length === 0 ? (
                <p className="record-conformance__clean">
                  Nothing to report. Every record validates, the chain holds,
                  and each one says what would end it.
                </p>
              ) : (
                <ul className="record-conformance__findings">
                  {report.findings.map((finding) => (
                    <li
                      key={finding.id}
                      className={`record-conformance__finding record-conformance__finding--${finding.severity}`}
                    >
                      <span className="record-conformance__finding-title">
                        {finding.title}
                      </span>
                      <span className="record-conformance__finding-detail">
                        {finding.detail}
                      </span>
                      <span className="record-conformance__finding-meta">
                        <span>{SEVERITY_LABEL[finding.severity]}</span>
                        {finding.clause && <span>{finding.clause}</span>}
                      </span>
                      {finding.records.length > 0 && (
                        <p className="record-conformance__ids">
                          {finding.records.join(" · ")}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {report.rejected.length > 0 && (
                <div>
                  <p className="record-conformance__finding-title">
                    Entries the schema rejected
                  </p>
                  <ul className="record-conformance__blocked">
                    {report.rejected.map((entry) => (
                      <li key={entry.at}>
                        {entry.at}: {entry.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="record-conformance__actions">
                <button
                  type="button"
                  className="record-conformance__button"
                  onClick={() => void copyReadout()}
                >
                  {copied ? "Copied" : "Copy the readout"}
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default RecordConformance;
