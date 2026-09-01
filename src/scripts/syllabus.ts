// Shapes of the payload rendered into #syllabus-data by src/pages/syllabus.
type SyllabusModule = { id: string; title: string; outcome: string };
type KnowledgeCheck = {
  moduleId: string;
  explanation?: string;
  [key: string]: unknown;
};
type DiagnosticLink = { href: string; title: string };
type ModuleProgress = {
  completed: boolean;
  readingsComplete: boolean;
  quizAnswer: string | null;
  quizCorrect: boolean;
};
type ProgressState = Record<string, ModuleProgress>;

const dataElement = document.querySelector("#syllabus-data");
const parsed = JSON.parse(dataElement?.textContent || "{}") as {
  modules?: SyllabusModule[];
  knowledgeChecks?: KnowledgeCheck[];
  moduleResources?: Record<
    string,
    { diagnostics?: string[]; libraryLink?: { href: string; label: string } }
  >;
  diagnosticLinks?: Record<string, DiagnosticLink>;
};
const modules = parsed.modules ?? [];
const knowledgeChecks = parsed.knowledgeChecks ?? [];
const moduleResources = parsed.moduleResources ?? {};
const diagnosticLinks = parsed.diagnosticLinks ?? {};
const storageKey = "syllabusProgress";

const defaultState = modules.reduce<ProgressState>((state, module) => {
  state[module.id] = {
    completed: false,
    readingsComplete: false,
    quizAnswer: null,
    quizCorrect: false,
  };
  return state;
}, {});

const loadState = (): ProgressState => {
  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return { ...defaultState };
    const parsedState = JSON.parse(stored) as ProgressState;
    return { ...defaultState, ...parsedState };
  } catch (error) {
    console.error("Unable to load syllabus progress", error);
    return { ...defaultState };
  }
};

const saveState = (state: ProgressState) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch (error) {
    console.error("Unable to persist syllabus progress", error);
  }
};

const state = loadState();

const sharedCompleted = new URL(window.location.href).searchParams.get(
  "completed",
);
if (sharedCompleted) {
  sharedCompleted
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .forEach((id) => {
      if (state[id]) {
        state[id] = {
          ...state[id],
          completed: true,
          readingsComplete: true,
          quizCorrect: true,
        };
      }
    });
}

const syllabus = document.querySelector<HTMLElement>("[data-syllabus]");
const certificateList = document.querySelector<HTMLElement>(
  "[data-certificate-list]",
);
const certificateEmpty = document.querySelector<HTMLElement>(
  "[data-certificate-empty]",
);
const shareInput =
  document.querySelector<HTMLInputElement>("[data-share-link]");
const shareStatus = document.querySelector("[data-share-status]");
const shareButton = document.querySelector("[data-share]");
const printButton = document.querySelector("[data-print]");
const exportButton = document.querySelector("[data-export-progress]");
const importButton = document.querySelector("[data-import-progress]");
const importInput = document.querySelector("[data-import-input]");
const resetAllButton = document.querySelector("[data-reset-all]");
const progressSummary = document.querySelector("[data-progress-summary]");
const progressCount = progressSummary?.querySelector<HTMLElement>(
  "[data-progress-count]",
);
const progressModules = progressSummary?.querySelector<HTMLElement>(
  "[data-progress-modules]",
);
const progressReadings = progressSummary?.querySelector<HTMLElement>(
  "[data-progress-readings]",
);
const progressQuiz = progressSummary?.querySelector<HTMLElement>(
  "[data-progress-quiz]",
);
const progressBar = progressSummary?.querySelector<HTMLElement>(
  "[data-progress-bar]",
);

const updateProgressSummary = () => {
  const completedModules = modules.filter(
    (module) => state[module.id]?.completed,
  );
  const completedReadings = modules.filter(
    (module) => state[module.id]?.readingsComplete,
  );
  const completedChecks = modules.filter(
    (module) => state[module.id]?.quizCorrect,
  );
  const count = completedModules.length;
  const readingsCount = completedReadings.length;
  const checksCount = completedChecks.length;
  const total = modules.length;

  if (progressCount) {
    progressCount.textContent = `${count}/${total} modules completed.`;
  }

  if (progressModules) {
    progressModules.textContent = `${count}/${total} modules completed`;
  }

  if (progressReadings) {
    progressReadings.textContent = `${readingsCount}/${total} readings confirmed`;
  }

  if (progressQuiz) {
    progressQuiz.textContent = `${checksCount}/${total} knowledge checks passed`;
  }

  if (progressBar instanceof HTMLProgressElement) {
    progressBar.value = count;
    progressBar.max = total;
  }
};

const updateCertificate = () => {
  if (!certificateList) return;
  certificateList.innerHTML = "";

  const completedModules = modules.filter(
    (module) => state[module.id]?.completed,
  );
  if (certificateEmpty) {
    certificateEmpty.hidden = completedModules.length > 0;
  }

  completedModules.forEach((module) => {
    const resources = moduleResources[module.id] ?? {};
    const diagnostics =
      resources.diagnostics
        ?.map((slug) => diagnosticLinks[slug])
        .filter(Boolean) ?? [];
    const entry = document.createElement("li");
    entry.className = "certificate__item";

    const content = document.createElement("div");
    const title = document.createElement("p");
    title.className = "eyebrow";
    title.textContent = module.title;
    const outcome = document.createElement("p");
    outcome.className = "muted small";
    outcome.textContent = module.outcome;
    content.appendChild(title);
    content.appendChild(outcome);

    const links = document.createElement("div");
    links.className = "certificate__links";

    if (resources.libraryLink) {
      const libraryLink = document.createElement("a");
      libraryLink.href = resources.libraryLink.href;
      libraryLink.textContent = resources.libraryLink.label;
      links.appendChild(libraryLink);
    }

    diagnostics.forEach((diag) => {
      const diagnosticLink = document.createElement("a");
      diagnosticLink.href = diag.href;
      diagnosticLink.textContent = diag.title;
      links.appendChild(diagnosticLink);
    });

    entry.appendChild(content);
    entry.appendChild(links);
    certificateList.appendChild(entry);
  });
};

const updateShareLink = () => {
  if (!shareInput) return;
  const completedModules = modules
    .filter((module) => state[module.id]?.completed)
    .map((module) => module.id);
  if (completedModules.length === 0) {
    shareInput.value = "";
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.set("completed", completedModules.join(","));
  shareInput.value = url.toString();
};

const exportProgress = () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "syllabus-progress.json";
  link.click();
  URL.revokeObjectURL(url);
  if (shareStatus) {
    shareStatus.textContent = "Exported your syllabus progress as JSON.";
  }
};

const importProgress = (payload: ProgressState | null) => {
  if (!payload || typeof payload !== "object") {
    if (shareStatus) {
      shareStatus.textContent =
        "Import failed. The file did not match the expected structure.";
    }
    return;
  }

  modules.forEach((module) => {
    if (payload[module.id]) {
      state[module.id] = {
        ...defaultState[module.id],
        ...payload[module.id],
      };
    }
  });
  saveState(state);
  modules.forEach((module) => updateModuleUI(module.id));
  updateCertificate();
  updateShareLink();
  updateProgressSummary();
  if (shareStatus) {
    shareStatus.textContent = "Imported syllabus progress from JSON.";
  }
};

const updateModuleUI = (moduleId: string) => {
  const moduleElement = syllabus?.querySelector(`[data-module="${moduleId}"]`);
  const moduleState = state[moduleId];
  const moduleCheck = knowledgeChecks.find(
    (item) => item.moduleId === moduleId,
  );
  if (!moduleElement || !moduleState) return;

  const completeButton =
    moduleElement.querySelector<HTMLButtonElement>("[data-complete]");
  const resetButton =
    moduleElement.querySelector<HTMLButtonElement>("[data-reset]");
  const status = moduleElement.querySelector<HTMLElement>("[data-status]");
  const readingCheckbox =
    moduleElement.querySelector<HTMLInputElement>("[data-reading]");
  const quizFeedback = moduleElement.querySelector<HTMLElement>(
    "[data-quiz-feedback]",
  );
  const quizOptions =
    moduleElement.querySelectorAll<HTMLInputElement>("[data-quiz-option]");

  if (readingCheckbox) {
    readingCheckbox.checked = moduleState.readingsComplete;
  }

  quizOptions.forEach((input) => {
    const isMatch = input.value === String(moduleState.quizAnswer);
    input.checked = isMatch;
  });

  const readyForCompletion =
    moduleState.readingsComplete && moduleState.quizCorrect;
  if (completeButton) {
    completeButton.disabled = !readyForCompletion;
    completeButton.textContent = moduleState.completed
      ? "Completed"
      : "Mark module complete";
    completeButton.setAttribute("aria-pressed", String(moduleState.completed));
  }

  if (resetButton) {
    resetButton.disabled = false;
  }

  if (status) {
    status.textContent = moduleState.completed
      ? "Module finished. You can reset it or generate the shareable certificate below."
      : readyForCompletion
        ? "Ready to mark complete. Save your progress to update the certificate."
        : "Required readings and a correct knowledge check unlock the completion button.";
  }

  if (quizFeedback) {
    if (moduleState.quizCorrect) {
      quizFeedback.textContent =
        moduleCheck?.explanation ??
        "Correct. You can mark the module complete after confirming the readings.";
      quizFeedback.classList.add("syllabus-module__feedback--success");
    } else if (moduleState.quizAnswer !== null) {
      quizFeedback.textContent =
        "Not quite. Re-read the required artifacts and try again.";
      quizFeedback.classList.remove("syllabus-module__feedback--success");
    } else {
      quizFeedback.textContent =
        "Select the correct statement to unlock completion.";
      quizFeedback.classList.remove("syllabus-module__feedback--success");
    }
  }
};

const bindModule = (moduleId: string) => {
  const moduleElement = syllabus?.querySelector(`[data-module="${moduleId}"]`);
  const moduleState = state[moduleId];
  if (!moduleElement || !moduleState) return;

  const readingCheckbox =
    moduleElement.querySelector<HTMLInputElement>("[data-reading]");
  const completeButton =
    moduleElement.querySelector<HTMLButtonElement>("[data-complete]");
  const resetButton =
    moduleElement.querySelector<HTMLButtonElement>("[data-reset]");
  const quizOptions =
    moduleElement.querySelectorAll<HTMLInputElement>("[data-quiz-option]");

  readingCheckbox?.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    moduleState.readingsComplete = target.checked;
    if (!target.checked) {
      moduleState.completed = false;
    }
    saveState(state);
    updateModuleUI(moduleId);
    updateCertificate();
    updateShareLink();
    updateProgressSummary();
  });

  quizOptions.forEach((option) => {
    option.addEventListener("change", (event) => {
      const input = event.target;
      if (!(input instanceof HTMLInputElement)) return;
      moduleState.quizAnswer = input.value;
      moduleState.quizCorrect = input.dataset.correct === "true";
      if (!moduleState.quizCorrect) {
        moduleState.completed = false;
      }
      saveState(state);
      updateModuleUI(moduleId);
      updateCertificate();
      updateShareLink();
      updateProgressSummary();
    });
  });

  completeButton?.addEventListener("click", () => {
    if (completeButton.disabled) return;
    moduleState.completed = true;
    saveState(state);
    updateModuleUI(moduleId);
    updateCertificate();
    updateShareLink();
    updateProgressSummary();
  });

  resetButton?.addEventListener("click", () => {
    state[moduleId] = { ...defaultState[moduleId] };
    saveState(state);
    updateModuleUI(moduleId);
    updateCertificate();
    updateShareLink();
    updateProgressSummary();
  });
};

const initialize = () => {
  modules.forEach((module) => {
    bindModule(module.id);
    updateModuleUI(module.id);
  });
  updateCertificate();
  updateShareLink();
  updateProgressSummary();
};

initialize();

resetAllButton?.addEventListener("click", () => {
  modules.forEach((module) => {
    state[module.id] = { ...defaultState[module.id] };
    updateModuleUI(module.id);
  });
  saveState(state);
  updateCertificate();
  updateShareLink();
  updateProgressSummary();
  if (shareStatus) {
    shareStatus.textContent =
      "All progress reset. Complete a module to generate a new shareable link.";
  }
});

const onShare = async () => {
  updateShareLink();
  if (!shareStatus) return;
  if (!shareInput || !shareInput.value) {
    shareStatus.textContent =
      "Complete a module before generating a shareable link.";
    return;
  }

  try {
    await navigator.clipboard.writeText(shareInput.value);
    shareStatus.textContent = "Copied the shareable link to your clipboard.";
  } catch {
    shareStatus.textContent =
      "Copy failed. Manually select the link and copy it.";
  }
};

shareButton?.addEventListener("click", () => {
  void onShare();
});

printButton?.addEventListener("click", () => {
  updateCertificate();
  window.print();
});

exportButton?.addEventListener("click", () => {
  exportProgress();
});

importButton?.addEventListener("click", () => {
  if (importInput instanceof HTMLInputElement) {
    importInput.value = "";
    importInput.click();
  }
});

importInput?.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(
        typeof reader.result === "string" ? reader.result : "{}",
      ) as ProgressState;
      importProgress(imported);
    } catch (error) {
      console.error("Unable to import progress", error);
      if (shareStatus) {
        shareStatus.textContent =
          "Import failed. The file did not parse as JSON.";
      }
    }
  };
  reader.readAsText(file);
});

export {};
