import type { ValidatorEntry } from "../content/validators";

export type Level = "red" | "yellow" | "green";

const SEVERITY: Record<Level, string> = {
  green: "low",
  yellow: "medium",
  red: "high",
};

/**
 * Runs one validator: restores the draft, scores the form on submit, shows
 * the report card, and offers the result as JSON. The page supplies only the
 * scoring rule. The wording for each level comes from the validator's entry in
 * content/validators.ts, which the form writes into `data-validator-meta`.
 *
 * Everything is looked up inside `root`: /validators carries three forms, and
 * a document-wide query ran the first form's rule for all of them.
 */
export const initValidatorForm = <Inputs>(
  root: HTMLElement,
  score: (inputs: Inputs) => Level,
) => {
  const form = root.querySelector<HTMLFormElement>("[data-validator-form]");
  const report = root.querySelector<HTMLElement>("[data-validator-report]");
  const pill = root.querySelector<HTMLElement>("[data-validator-pill]");
  const output = root.querySelector<HTMLOutputElement>(
    "[data-validator-output]",
  );
  const fix = root.querySelector<HTMLElement>("[data-validator-fix]");
  if (!form?.dataset.validatorMeta || !report || !pill || !output) return;

  const validator = JSON.parse(form.dataset.validatorMeta) as ValidatorEntry;
  const storageKey = `validator-${validator.slug}`;

  const readInputs = () => {
    const data = new FormData(form);
    return Object.fromEntries(
      validator.inputs.map(({ name, type }) => [
        name,
        type === "number" ? Number(data.get(name)) : data.get(name),
      ]),
    );
  };

  const buildResult = (level: Level, message: string) => ({
    result_id: crypto.randomUUID(),
    generated_at: new Date().toISOString(),
    validator_id: validator.id,
    standard_id: validator.standardRef,
    inputs: readInputs(),
    status: level,
    severity: SEVERITY[level],
    risk_statement: message,
    violated_clauses: {
      green: [],
      yellow: validator.clauseRefs.slice(0, 2),
      red: validator.clauseRefs,
    }[level],
    recommended_mechanisms: validator.mechanismRefs,
    next_actions: [
      `Apply ${validator.mechanismRefs.join(", ")} safeguards.`,
      "Re-run the validator after remediation.",
    ],
  });

  let latestResult: ReturnType<typeof buildResult> | null = null;

  const saveDraft = () => {
    const payload = Object.fromEntries(new FormData(form).entries());
    sessionStorage.setItem(storageKey, JSON.stringify(payload));
  };

  const restoreDraft = () => {
    const saved = sessionStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as Record<string, string>;
      Object.entries(parsed).forEach(([key, value]) => {
        const field = form.elements.namedItem(key);
        if (
          field instanceof HTMLInputElement ||
          field instanceof HTMLSelectElement
        ) {
          field.value = String(value);
        }
      });
    } catch (error) {
      console.error(`Unable to restore ${validator.title} draft`, error);
    }
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      form.querySelector<HTMLElement>(":invalid")?.focus();
      return;
    }

    const level = score(readInputs() as Inputs);
    const message =
      validator.thresholds.find((threshold) => threshold.level === level)
        ?.summary ?? "";

    pill.classList.remove(
      "status-pill--red",
      "status-pill--yellow",
      "status-pill--green",
    );
    pill.classList.add(`status-pill--${level}`);
    pill.textContent = level.charAt(0).toUpperCase() + level.slice(1);
    output.textContent = message;
    // A green result has nothing to fix.
    fix?.toggleAttribute("hidden", level === "green");
    latestResult = buildResult(level, message);
    report.removeAttribute("hidden");
    report.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  root
    .querySelector<HTMLButtonElement>("[data-validator-download]")
    ?.addEventListener("click", () => {
      if (!latestResult) return;
      const blob = new Blob([JSON.stringify(latestResult, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${validator.id.toLowerCase()}-result.json`;
      link.click();
      URL.revokeObjectURL(url);
    });

  restoreDraft();
  form.addEventListener("input", saveDraft);
  form.addEventListener("blur", saveDraft, true);
};
