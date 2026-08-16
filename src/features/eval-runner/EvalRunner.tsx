import { useCallback, useEffect, useMemo, useState } from "react";
import { suiteOptions, getSuiteForSlug, getTestCasesForSuite } from "./config";
import { buildEmptyResults, buildSummary, calculatePass } from "./runnerLogic";
import type { TestCaseResult, RunSummary } from "./types";
import "./evalRunner.css";

const STORAGE_KEY = "eval-runner-state";

type SavedState = {
  selectedSuiteSlug: string | null;
  systemName: string;
  results: TestCaseResult[];
  currentIndex: number;
  isComplete: boolean;
};

function loadState(): SavedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedState;
  } catch {
    return null;
  }
}

function saveState(state: SavedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function EvalRunner() {
  const [hydrated, setHydrated] = useState(false);
  const [selectedSuiteSlug, setSelectedSuiteSlug] = useState<string | null>(
    null,
  );
  const [systemName, setSystemName] = useState("");
  const [results, setResults] = useState<TestCaseResult[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [summary, setSummary] = useState<RunSummary | null>(null);
  const [criteriaOpen, setCriteriaOpen] = useState(false);

  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setSelectedSuiteSlug(saved.selectedSuiteSlug);
      setSystemName(saved.systemName);
      setResults(saved.results);
      setCurrentIndex(saved.currentIndex);
      setIsComplete(saved.isComplete);
      if (saved.isComplete && saved.selectedSuiteSlug) {
        const s = getSuiteForSlug(saved.selectedSuiteSlug);
        if (s) setSummary(buildSummary(saved.results, s, saved.systemName));
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveState({
      selectedSuiteSlug,
      systemName,
      results,
      currentIndex,
      isComplete,
    });
  }, [
    selectedSuiteSlug,
    systemName,
    results,
    currentIndex,
    isComplete,
    hydrated,
  ]);

  const suite = useMemo(
    () => (selectedSuiteSlug ? getSuiteForSlug(selectedSuiteSlug) : undefined),
    [selectedSuiteSlug],
  );
  const testCases = useMemo(
    () => (selectedSuiteSlug ? getTestCasesForSuite(selectedSuiteSlug) : []),
    [selectedSuiteSlug],
  );
  const currentTestCase = testCases[currentIndex];
  const currentResult = results[currentIndex];
  const totalCases = testCases.length;

  const handleSelectSuite = useCallback((slug: string) => {
    setSelectedSuiteSlug(slug);
    const tcs = getTestCasesForSuite(slug);
    setResults(buildEmptyResults(tcs));
    setCurrentIndex(0);
    setIsComplete(false);
    setSummary(null);
    setCriteriaOpen(false);
  }, []);

  const updateResult = useCallback(
    (testCaseId: string, patch: Partial<TestCaseResult>) => {
      setResults((prev) =>
        prev.map((r) => (r.testCaseId === testCaseId ? { ...r, ...patch } : r)),
      );
    },
    [],
  );

  const handleScoreChange = useCallback(
    (testCaseId: string, score: number) => {
      const result = results.find((r) => r.testCaseId === testCaseId);
      if (!result) return;
      const passed = calculatePass(score, result.maxScore);
      updateResult(testCaseId, { score, passed });
    },
    [results, updateResult],
  );

  const handleEvidenceChange = useCallback(
    (testCaseId: string, evidence: string) => {
      updateResult(testCaseId, { evidence });
    },
    [updateResult],
  );

  const handleNotesChange = useCallback(
    (testCaseId: string, notes: string) => {
      updateResult(testCaseId, { notes });
    },
    [updateResult],
  );

  const goToNext = useCallback(() => {
    if (currentIndex < totalCases - 1) setCurrentIndex((prev) => prev + 1);
  }, [currentIndex, totalCases]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  }, [currentIndex]);

  const handleSubmitAll = useCallback(() => {
    if (!suite) return;
    const s = buildSummary(results, suite, systemName || "Unnamed system");
    setSummary(s);
    setIsComplete(true);
  }, [results, suite, systemName]);

  const handleReset = useCallback(() => {
    setSelectedSuiteSlug(null);
    setSystemName("");
    setResults([]);
    setCurrentIndex(0);
    setIsComplete(false);
    setSummary(null);
    setCriteriaOpen(false);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const handleExport = useCallback(() => {
    if (!summary) return;
    const blob = new Blob([JSON.stringify(summary, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const slug = selectedSuiteSlug || "eval";
    anchor.href = url;
    anchor.download = `eval-run-${slug}-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }, [summary, selectedSuiteSlug]);

  if (!hydrated) {
    return <div className="panel panel--glass eval-runner" data-eval-runner />;
  }

  if (!selectedSuiteSlug) {
    return (
      <div className="panel panel--glass eval-runner" data-eval-runner>
        <div className="eval-runner__header">
          <p className="eyebrow">Eval Runner</p>
          <h2>Run a governance eval suite</h2>
          <p className="muted">
            Select a suite, score each test case against your system, and
            receive a grade.
          </p>
        </div>
        <div className="eval-selector">
          {suiteOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className="input-card eval-selector__card"
              onClick={() => handleSelectSuite(opt.slug)}
            >
              <p className="eval-selector__title">{opt.title}</p>
              <p className="muted small">
                {opt.testCount} test cases &middot; {opt.estimatedTime}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (isComplete && summary) {
    const gradeClass = `grade-${summary.grade.toLowerCase()}`;

    return (
      <div className="panel panel--glass eval-runner" data-eval-runner>
        <div className="eval-runner__header">
          <p className="eyebrow">{summary.suiteTitle}</p>
          <h2>Eval complete</h2>
          <p className="muted">System under test: {summary.systemName}</p>
        </div>

        <div className={`eval-results__grade ${gradeClass}`}>
          <span className="eval-results__score">{summary.aggregateScore}%</span>
          <span className="eval-results__badge">{summary.grade}</span>
        </div>

        <p className="muted small">
          Completed {new Date(summary.completedAt).toLocaleString()}
        </p>

        <div className="eval-results">
          <h3>Per-test-case breakdown</h3>
          {summary.results.map((r) => {
            const tc = testCases.find((t) => t.id === r.testCaseId);
            return (
              <div key={r.testCaseId} className="eval-result-row">
                <div className="eval-result-row__header">
                  <span className="eval-result-row__id">{r.testCaseId}</span>
                  <span className="eval-result-row__title">
                    {tc?.title ?? ""}
                  </span>
                  <span
                    className={`eval-result-row__score ${r.passed ? "eval-result-row__score--pass" : "eval-result-row__score--fail"}`}
                  >
                    {r.score}/{r.maxScore}
                  </span>
                </div>
                {r.evidence && (
                  <p className="muted small eval-result-row__evidence">
                    {r.evidence}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="eval-actions">
          <button type="button" className="button ghost" onClick={handleExport}>
            Export results
          </button>
          <button
            type="button"
            className="button ghost button--warning"
            onClick={handleReset}
          >
            Start over
          </button>
        </div>
      </div>
    );
  }

  if (!currentTestCase || !currentResult) {
    return (
      <div className="panel panel--glass eval-runner" data-eval-runner>
        <p className="muted">No test cases found for this suite.</p>
        <button type="button" className="button ghost" onClick={handleReset}>
          Back to suite selection
        </button>
      </div>
    );
  }

  const severityClass = `severity--${currentTestCase.severity}`;
  const progressPct =
    totalCases > 0 ? ((currentIndex + 1) / totalCases) * 100 : 0;

  return (
    <div className="panel panel--glass eval-runner" data-eval-runner>
      <div className="eval-runner__header">
        <div className="eval-runner__title-row">
          <div>
            <p className="eyebrow">{suite?.title ?? ""}</p>
            <h2>
              Test case {currentIndex + 1} of {totalCases}
            </h2>
          </div>
          <button
            type="button"
            className="button ghost button--compact"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
        <div
          className="eval-progress"
          role="progressbar"
          aria-valuenow={currentIndex + 1}
          aria-valuemin={1}
          aria-valuemax={totalCases}
        >
          <div
            className="eval-progress__fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="input-card eval-question">
        <div className="eval-question__header">
          <span className="eval-question__id">{currentTestCase.id}</span>
          <span className={`badge ${severityClass}`}>
            {currentTestCase.severity}
          </span>
        </div>
        <h3>{currentTestCase.title}</h3>
        <p className="muted">{currentTestCase.description}</p>

        <div className="eval-question__anchors">
          <p className="muted small">Score</p>
          <div className="eval-question__radio-group">
            {currentTestCase.scoringRubric.anchors.map((anchor) => (
              <label key={anchor.score} className="eval-question__radio">
                <input
                  type="radio"
                  name={`score-${currentTestCase.id}`}
                  value={anchor.score}
                  checked={currentResult.score === anchor.score}
                  onChange={() =>
                    handleScoreChange(currentTestCase.id, anchor.score)
                  }
                />
                <span className="eval-question__radio-label">
                  {anchor.score} — {anchor.label}
                </span>
                <span className="muted small eval-question__radio-desc">
                  {anchor.description}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="eval-question__field">
          <label
            className="input-card__label"
            htmlFor={`evidence-${currentTestCase.id}`}
          >
            Evidence
          </label>
          <textarea
            id={`evidence-${currentTestCase.id}`}
            className="input eval-question__textarea"
            rows={3}
            value={currentResult.evidence}
            onChange={(e) =>
              handleEvidenceChange(currentTestCase.id, e.target.value)
            }
            placeholder="Describe or link to supporting evidence..."
          />
        </div>

        <div className="eval-question__field">
          <label
            className="input-card__label"
            htmlFor={`notes-${currentTestCase.id}`}
          >
            Notes
          </label>
          <textarea
            id={`notes-${currentTestCase.id}`}
            className="input eval-question__textarea"
            rows={2}
            value={currentResult.notes}
            onChange={(e) =>
              handleNotesChange(currentTestCase.id, e.target.value)
            }
            placeholder="Optional notes..."
          />
        </div>

        <button
          type="button"
          className="button ghost button--compact"
          onClick={() => setCriteriaOpen((prev) => !prev)}
        >
          {criteriaOpen ? "Hide" : "Show"} pass/fail criteria
        </button>
        {criteriaOpen && (
          <div className="eval-question__criteria">
            <div>
              <p className="muted small" style={{ fontWeight: 600 }}>
                Pass criteria
              </p>
              <ul className="muted small">
                {currentTestCase.passCriteria.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="muted small" style={{ fontWeight: 600 }}>
                Fail indicators
              </p>
              <ul className="muted small">
                {currentTestCase.failIndicators.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="eval-actions">
        <button
          type="button"
          className="button ghost"
          disabled={currentIndex === 0}
          onClick={goToPrev}
        >
          Previous
        </button>
        <span className="muted small">
          {currentIndex + 1} / {totalCases}
        </span>
        {currentIndex < totalCases - 1 ? (
          <button type="button" className="button" onClick={goToNext}>
            Next
          </button>
        ) : (
          <button
            type="button"
            className="button primary"
            onClick={handleSubmitAll}
          >
            Submit all
          </button>
        )}
      </div>
    </div>
  );
}

export default EvalRunner;
