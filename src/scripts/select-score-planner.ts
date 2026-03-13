type Tier = {
  label: string;
  min: number;
  status: "green" | "yellow" | "red";
  summary: string;
};

type PlannerConfig = {
  formSelector: string;
  resultsSelector: string;
  scoreSelector: string;
  tierSelector: string;
  summarySelector: string;
  shareSelector: string;
  copySelector: string;
  storageKey: string;
  fields: string[];
  scoreMatrix: Record<string, Record<string, number>>;
  tiers: Tier[];
  restoreErrorMessage: string;
};

const isValidSelection = (
  fields: string[],
  scoreMatrix: PlannerConfig["scoreMatrix"],
  values: Record<string, string>,
) =>
  fields.every((field) => {
    const fieldMatrix = scoreMatrix[field] ?? {};
    return typeof fieldMatrix[values[field] ?? ""] === "number";
  });

const calculateScore = (
  fields: string[],
  scoreMatrix: PlannerConfig["scoreMatrix"],
  values: Record<string, string>,
) =>
  fields.reduce((total, field) => {
    const fieldMatrix = scoreMatrix[field] ?? {};
    return total + (fieldMatrix[values[field] ?? ""] ?? 0);
  }, 0);

const getTier = (tiers: Tier[], score: number) =>
  tiers.find((tier) => score >= tier.min) ?? tiers[tiers.length - 1];

export const initializeSelectScorePlanner = (config: PlannerConfig) => {
  const form = document.querySelector<HTMLFormElement>(config.formSelector);
  const results = document.querySelector<HTMLElement>(config.resultsSelector);
  const scoreValue = document.querySelector<HTMLElement>(config.scoreSelector);
  const tierLabel = document.querySelector<HTMLElement>(config.tierSelector);
  const summaryText = document.querySelector<HTMLElement>(
    config.summarySelector,
  );
  const shareInput = document.querySelector<HTMLInputElement>(
    config.shareSelector,
  );
  const copyButton = document.querySelector<HTMLButtonElement>(
    config.copySelector,
  );

  if (!form) {
    return;
  }

  const readFieldValue = (data: FormData, field: string) => {
    const fieldValue = data.get(field);
    return typeof fieldValue === "string" ? fieldValue : "";
  };

  const setShareUrl = (
    values: Record<string, string>,
    score: number,
    tier: string,
  ) => {
    const url = new URL(window.location.href);

    config.fields.forEach((field) => {
      url.searchParams.set(field, values[field] ?? "");
    });

    url.searchParams.set("score", String(score));
    url.searchParams.set("tier", tier.toLowerCase());
    history.replaceState(null, "", url.toString());

    if (shareInput) {
      shareInput.value = url.toString();
    }
  };

  const saveDraft = () => {
    if (typeof sessionStorage === "undefined") return;
    const data = new FormData(form);
    const payload = Object.fromEntries(
      config.fields.map((field) => [field, readFieldValue(data, field)]),
    );
    sessionStorage.setItem(config.storageKey, JSON.stringify(payload));
  };

  const restoreDraft = () => {
    if (typeof sessionStorage === "undefined") return null;
    const saved = sessionStorage.getItem(config.storageKey);
    if (!saved) return null;

    try {
      return JSON.parse(saved) as Record<string, string>;
    } catch (error) {
      console.error(config.restoreErrorMessage, error);
      return null;
    }
  };

  const renderResults = (values: Record<string, string>) => {
    if (!results || !scoreValue || !tierLabel || !summaryText) return;

    const score = calculateScore(config.fields, config.scoreMatrix, values);
    const tier = getTier(config.tiers, score);

    scoreValue.textContent = `${score} / 100`;
    tierLabel.textContent = tier.label;
    tierLabel.classList.remove(
      "status-pill--green",
      "status-pill--yellow",
      "status-pill--red",
    );
    tierLabel.classList.add(`status-pill--${tier.status}`);
    summaryText.textContent = tier.summary;
    results.hidden = false;
    setShareUrl(values, score, tier.label);
  };

  const readFormValues = (): Record<string, string> => {
    const data = new FormData(form);
    return Object.fromEntries(
      config.fields.map((field) => [field, readFieldValue(data, field)]),
    );
  };

  const applyValuesToForm = (values: Record<string, string>) => {
    config.fields.forEach((field) => {
      const nextValue = values[field];
      const control = form.elements.namedItem(field);
      if (
        control instanceof HTMLSelectElement &&
        typeof nextValue === "string"
      ) {
        control.value = nextValue;
      }
    });
  };

  const applyParams = () => {
    const params = new URLSearchParams(window.location.search);
    const paramValues = Object.fromEntries(
      config.fields.map((field) => [field, params.get(field) ?? ""]),
    );

    if (isValidSelection(config.fields, config.scoreMatrix, paramValues)) {
      applyValuesToForm(paramValues);
      renderResults(paramValues);
      return;
    }

    const stored = restoreDraft();
    if (!stored) return;
    if (!isValidSelection(config.fields, config.scoreMatrix, stored)) return;

    applyValuesToForm(stored);
    renderResults(stored);
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      const firstInvalid = form.querySelector<HTMLElement>(":invalid");
      firstInvalid?.focus();
      return;
    }

    const values = readFormValues();

    if (isValidSelection(config.fields, config.scoreMatrix, values)) {
      renderResults(values);
      results?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  copyButton?.addEventListener("click", () => {
    if (!(shareInput instanceof HTMLInputElement)) return;
    shareInput.select();

    const copy = async () => {
      try {
        await navigator.clipboard.writeText(shareInput.value);
      } catch {
        // fall back to manual copy
      }
    };

    void copy();
  });

  applyParams();
  form.addEventListener("input", saveDraft);
  form.addEventListener("blur", saveDraft, true);
};
