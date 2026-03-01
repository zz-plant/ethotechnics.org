const ARTIFACT_ID = "BB-01";
const DEFAULT_VERSION = "1.0.0";
const form = document.querySelector<HTMLFormElement>("[data-burden-form]");
const exportStatus = document.querySelector<HTMLElement>(
  "[data-export-status]",
);
const compareInput = document.querySelector<HTMLTextAreaElement>(
  "[data-compare-input]",
);
const compareButton = document.querySelector<HTMLButtonElement>(
  "[data-compare-button]",
);
const compareResults = document.querySelector<HTMLElement>(
  "[data-compare-results]",
);
const compareList = document.querySelector<HTMLUListElement>(
  "[data-compare-list]",
);

type HarmRole = {
  role: string;
  description: string;
};

type BurdenEstimate = {
  role: string;
  type: string;
  estimate: {
    min: number | null;
    likely: number | null;
    max: number | null;
    unit: string;
  };
  assumptions: string;
};

type BurdenTotal = {
  role: string;
  time_hours: number | null;
  money_usd: number | null;
  delay_days: number | null;
  cognitive_load: number | null;
  humiliation: number | null;
  risk_exposure: number | null;
  risk_rationale: string;
};

type AbsorberEntry = {
  role: string;
  type: string;
  absorber: string;
  notes: string;
};

type BurdenCeiling = {
  role: string;
  type: string;
  threshold: string;
  unit: string;
  condition: string;
};

type EnforcementTrigger = {
  role: string;
  threshold: string;
  action: string;
  owner: string;
  timeframe: string;
};

type RepairPathway = {
  entry_points: string;
  required_documents: string;
  promised_turnaround: string;
  interim_protections: string;
};

type RevisionEntry = {
  version: string;
  revision: string;
  date: string;
  summary: string;
};

type Worksheet = {
  artifact_id: string;
  artifact_version: string;
  worksheet_id: string;
  revision: string;
  timestamp: string;
  system_name: string;
  system_action: string;
  worst_case_error: string;
  harm_roles: HarmRole[];
  burden_estimates: BurdenEstimate[];
  burden_totals: BurdenTotal[];
  absorbers: AbsorberEntry[];
  burden_ceiling: BurdenCeiling[];
  enforcement_triggers: EnforcementTrigger[];
  repair_pathway: RepairPathway;
  owner: string;
  review_cadence: string;
  assumptions: string;
  revision_history: RevisionEntry[];
};

const rowConfigs = [
  {
    listSelector: "[data-role-list]",
    templateSelector: "[data-role-template]",
    addSelector: "[data-add-role]",
  },
  {
    listSelector: "[data-burden-list]",
    templateSelector: "[data-burden-template]",
    addSelector: "[data-add-burden]",
  },
  {
    listSelector: "[data-total-list]",
    templateSelector: "[data-total-template]",
    addSelector: "[data-add-total]",
  },
  {
    listSelector: "[data-absorber-list]",
    templateSelector: "[data-absorber-template]",
    addSelector: "[data-add-absorber]",
  },
  {
    listSelector: "[data-ceiling-list]",
    templateSelector: "[data-ceiling-template]",
    addSelector: "[data-add-ceiling]",
  },
  {
    listSelector: "[data-trigger-list]",
    templateSelector: "[data-trigger-template]",
    addSelector: "[data-add-trigger]",
  },
];

const addRow = (list: Element | null, template: HTMLTemplateElement | null) => {
  if (!list || !template) return;
  const clone = template.content.cloneNode(true) as DocumentFragment;
  list.appendChild(clone);
};

const setupRepeater = () => {
  rowConfigs.forEach(({ listSelector, templateSelector, addSelector }) => {
    const list = document.querySelector(listSelector);
    const template =
      document.querySelector<HTMLTemplateElement>(templateSelector);
    const addButton = document.querySelector<HTMLButtonElement>(addSelector);
    addButton?.addEventListener("click", () => addRow(list, template));
    addRow(list, template);
    list?.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const removeButton = target.closest("[data-remove-row]");
      if (!removeButton) return;
      const row = target.closest(
        "[data-role-row], [data-burden-row], [data-total-row], [data-absorber-row], [data-ceiling-row], [data-trigger-row]",
      );
      row?.remove();
    });
  });
};

const fieldValue = (parent: Element, field: string) => {
  const input = parent.querySelector(`[data-field="${field}"]`);
  if (
    input instanceof HTMLInputElement ||
    input instanceof HTMLTextAreaElement ||
    input instanceof HTMLSelectElement
  ) {
    return input.value.trim();
  }
  return "";
};

const parseNumber = (value: string) => {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const collectRows = <T>(
  selector: string,
  mapper: (row: Element) => T,
  isEmpty: (row: T) => boolean,
) => {
  if (!form) return [] as T[];
  return Array.from(form.querySelectorAll(selector))
    .map(mapper)
    .filter((row) => !isEmpty(row));
};

const buildWorksheet = (): Worksheet | null => {
  if (!form) return null;
  const worksheetId =
    form.dataset.worksheetId ??
    globalThis.crypto?.randomUUID?.() ??
    `worksheet-${Date.now()}`;
  form.dataset.worksheetId = worksheetId;

  const systemName = fieldValue(form, "system_name");
  const systemAction = fieldValue(form, "system_action");
  const worstCaseError = fieldValue(form, "worst_case_error");
  const assumptions = fieldValue(form, "assumptions");
  const owner = fieldValue(form, "owner");
  const reviewCadence = fieldValue(form, "review_cadence");
  const revision = fieldValue(form, "revision");
  const version = fieldValue(form, "version") || DEFAULT_VERSION;
  const changelog = fieldValue(form, "changelog");

  const harmRoles = collectRows(
    "[data-role-row]",
    (row) => ({
      role: fieldValue(row, "role"),
      description: fieldValue(row, "description"),
    }),
    (row) => !row.role && !row.description,
  );

  const burdens = collectRows(
    "[data-burden-row]",
    (row) => ({
      role: fieldValue(row, "role"),
      type: fieldValue(row, "type"),
      estimate: {
        min: parseNumber(fieldValue(row, "min")),
        likely: parseNumber(fieldValue(row, "likely")),
        max: parseNumber(fieldValue(row, "max")),
        unit: fieldValue(row, "unit"),
      },
      assumptions: fieldValue(row, "assumptions"),
    }),
    (row) => !row.role && !row.type,
  );

  const burdenTotals = collectRows(
    "[data-total-row]",
    (row) => ({
      role: fieldValue(row, "role"),
      time_hours: parseNumber(fieldValue(row, "time")),
      money_usd: parseNumber(fieldValue(row, "money")),
      delay_days: parseNumber(fieldValue(row, "delay")),
      cognitive_load: parseNumber(fieldValue(row, "cognitive")),
      humiliation: parseNumber(fieldValue(row, "humiliation")),
      risk_exposure: parseNumber(fieldValue(row, "risk")),
      risk_rationale: fieldValue(row, "rationale"),
    }),
    (row) =>
      !row.role &&
      row.time_hours === null &&
      row.money_usd === null &&
      row.delay_days === null &&
      row.cognitive_load === null &&
      row.humiliation === null &&
      row.risk_exposure === null &&
      !row.risk_rationale,
  );

  const absorbers = collectRows(
    "[data-absorber-row]",
    (row) => ({
      role: fieldValue(row, "role"),
      type: fieldValue(row, "type"),
      absorber: fieldValue(row, "absorber"),
      notes: fieldValue(row, "notes"),
    }),
    (row) => !row.role && !row.type && !row.absorber,
  );

  const burdenCeiling = collectRows(
    "[data-ceiling-row]",
    (row) => ({
      role: fieldValue(row, "role"),
      type: fieldValue(row, "type"),
      threshold: fieldValue(row, "threshold"),
      unit: fieldValue(row, "unit"),
      condition: fieldValue(row, "condition"),
    }),
    (row) => !row.role && !row.type && !row.threshold,
  );

  const enforcementTriggers = collectRows(
    "[data-trigger-row]",
    (row) => ({
      role: fieldValue(row, "role"),
      threshold: fieldValue(row, "threshold"),
      action: fieldValue(row, "action"),
      owner: fieldValue(row, "owner"),
      timeframe: fieldValue(row, "timeframe"),
    }),
    (row) => !row.role && !row.threshold && !row.action,
  );

  const repairPathway: RepairPathway = {
    entry_points: fieldValue(form, "repair_entry"),
    required_documents: fieldValue(form, "repair_documents"),
    promised_turnaround: fieldValue(form, "repair_sla"),
    interim_protections: fieldValue(form, "repair_interim"),
  };

  return {
    artifact_id: ARTIFACT_ID,
    artifact_version: version,
    worksheet_id: worksheetId,
    revision,
    timestamp: new Date().toISOString(),
    system_name: systemName,
    system_action: systemAction,
    worst_case_error: worstCaseError,
    harm_roles: harmRoles,
    burden_estimates: burdens,
    burden_totals: burdenTotals,
    absorbers,
    burden_ceiling: burdenCeiling,
    enforcement_triggers: enforcementTriggers,
    repair_pathway: repairPathway,
    owner,
    review_cadence: reviewCadence,
    assumptions,
    revision_history: changelog
      ? [
          {
            version,
            revision,
            date: new Date().toISOString().slice(0, 10),
            summary: changelog,
          },
        ]
      : [],
  };
};

const downloadFile = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

const toMarkdown = (worksheet: Worksheet) => {
  return `---\nartifact_id: "${worksheet.artifact_id}"\nartifact_version: "${worksheet.artifact_version}"\nworksheet_id: "${worksheet.worksheet_id}"\ntimestamp: "${worksheet.timestamp}"\nsystem_name: "${worksheet.system_name}"\n---\n\n# Burden budget worksheet\n\n## 1) System action\n${worksheet.system_action || ""}\n\n## 2) Worst-case error\n${worksheet.worst_case_error || ""}\n\n## 3) Who experiences harm\n${worksheet.harm_roles
    .map(
      (role) =>
        `- ${role.role}${role.description ? ` — ${role.description}` : ""}`,
    )
    .join("\n")}\n\n## 4) Forms of burden\n${worksheet.burden_estimates
    .map(
      (item) =>
        `- ${item.role} | ${item.type} | ${item.estimate.min ?? ""} / ${item.estimate.likely ?? ""} / ${item.estimate.max ?? ""} ${item.estimate.unit || ""} | ${item.assumptions || ""}`,
    )
    .join(
      "\n",
    )}\n\n## 5) Estimated burden totals (optional)\n${worksheet.burden_totals
    .map(
      (total) =>
        `- ${total.role} | ${total.time_hours ?? ""} hrs | ${total.money_usd ?? ""} USD | ${total.delay_days ?? ""} days | cognitive ${total.cognitive_load ?? ""} | humiliation ${total.humiliation ?? ""} | risk ${total.risk_exposure ?? ""} (${total.risk_rationale || ""})`,
    )
    .join("\n")}\n\n## 6) Who absorbs the burden\n${worksheet.absorbers
    .map(
      (item) =>
        `- ${item.role} | ${item.type} | ${item.absorber} | ${item.notes || ""}`,
    )
    .join("\n")}\n\n## 7) Maximum acceptable burden\n${worksheet.burden_ceiling
    .map(
      (item) =>
        `- ${item.role} | ${item.type} | ${item.threshold} ${item.unit || ""} | ${item.condition || ""}`,
    )
    .join("\n")}\n\n## 8) Enforcement trigger\n${worksheet.enforcement_triggers
    .map(
      (item) =>
        `- ${item.role} | ${item.threshold} | ${item.action} | ${item.owner} | ${item.timeframe}`,
    )
    .join(
      "\n",
    )}\n\n## 9) Repair pathway\n- Entry points: ${worksheet.repair_pathway.entry_points || ""}\n- Required documents: ${worksheet.repair_pathway.required_documents || ""}\n- Promised turnaround: ${worksheet.repair_pathway.promised_turnaround || ""}\n- Interim protections: ${worksheet.repair_pathway.interim_protections || ""}\n\n## 10) Owner + review cadence\n- Owner: ${worksheet.owner || ""}\n- Review cadence: ${worksheet.review_cadence || ""}\n\n## Assumptions\n${worksheet.assumptions || ""}\n\n## Revision history\n${worksheet.revision_history
    .map(
      (item) =>
        `- ${item.version || ""} (${item.revision || ""}) ${item.date || ""}: ${item.summary || ""}`,
    )
    .join("\n")}`;
};

const toCsv = (worksheet: Worksheet) => {
  const rows = [
    ["record_type", "section", "field", "value", "notes"],
    ["meta", "artifact", "artifact_id", worksheet.artifact_id, ""],
    ["meta", "artifact", "artifact_version", worksheet.artifact_version, ""],
    ["meta", "worksheet", "worksheet_id", worksheet.worksheet_id, ""],
    ["meta", "worksheet", "timestamp", worksheet.timestamp, ""],
    ["meta", "system", "system_name", worksheet.system_name, ""],
    ["system", "system", "system_action", worksheet.system_action, ""],
    ["system", "system", "worst_case_error", worksheet.worst_case_error, ""],
    ["system", "assumptions", "assumptions", worksheet.assumptions, ""],
  ];

  worksheet.harm_roles.forEach((role) => {
    rows.push(["harm_role", "harm", role.role, role.description || "", ""]);
  });

  worksheet.burden_estimates.forEach((item) => {
    rows.push([
      "burden",
      "estimate",
      `${item.role} | ${item.type}`,
      `${item.estimate.min ?? ""}|${item.estimate.likely ?? ""}|${item.estimate.max ?? ""} ${item.estimate.unit || ""}`,
      item.assumptions || "",
    ]);
  });

  worksheet.burden_totals.forEach((item) => {
    rows.push([
      "burden",
      "total",
      item.role,
      `time:${item.time_hours ?? ""}h money:${item.money_usd ?? ""} delay:${item.delay_days ?? ""} cognitive:${item.cognitive_load ?? ""} humiliation:${item.humiliation ?? ""} risk:${item.risk_exposure ?? ""}`,
      item.risk_rationale || "",
    ]);
  });

  worksheet.absorbers.forEach((item) => {
    rows.push([
      "absorber",
      "allocation",
      `${item.role} | ${item.type}`,
      item.absorber,
      item.notes || "",
    ]);
  });

  worksheet.burden_ceiling.forEach((item) => {
    rows.push([
      "ceiling",
      "threshold",
      `${item.role} | ${item.type}`,
      `${item.threshold} ${item.unit || ""}`,
      item.condition || "",
    ]);
  });

  worksheet.enforcement_triggers.forEach((item) => {
    rows.push([
      "trigger",
      "enforcement",
      `${item.role} | ${item.threshold}`,
      `${item.action} | ${item.owner} | ${item.timeframe}`,
      "",
    ]);
  });

  rows.push([
    "repair",
    "pathway",
    "entry_points",
    worksheet.repair_pathway.entry_points,
    "",
  ]);
  rows.push([
    "repair",
    "pathway",
    "required_documents",
    worksheet.repair_pathway.required_documents,
    "",
  ]);
  rows.push([
    "repair",
    "pathway",
    "promised_turnaround",
    worksheet.repair_pathway.promised_turnaround,
    "",
  ]);
  rows.push([
    "repair",
    "pathway",
    "interim_protections",
    worksheet.repair_pathway.interim_protections,
    "",
  ]);
  rows.push(["owner", "owner", "owner", worksheet.owner, ""]);
  rows.push(["owner", "owner", "review_cadence", worksheet.review_cadence, ""]);

  worksheet.revision_history.forEach((item) => {
    rows.push([
      "revision",
      "history",
      item.version || "",
      item.summary || "",
      item.date || "",
    ]);
  });

  return rows
    .map((row) =>
      row
        .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
        .join(","),
    )
    .join("\n");
};

const printPdf = (worksheet: Worksheet) => {
  const lines = [
    "Burden budget worksheet",
    `System: ${worksheet.system_name}`,
    `Action: ${worksheet.system_action}`,
    `Worst-case error: ${worksheet.worst_case_error}`,
    "",
    "Harmed roles:",
    ...worksheet.harm_roles.map(
      (role) =>
        `- ${role.role}${role.description ? ` — ${role.description}` : ""}`,
    ),
    "",
    "Burden estimates:",
    ...worksheet.burden_estimates.map(
      (item) =>
        `- ${item.role} | ${item.type} | ${item.estimate.min ?? ""}/${item.estimate.likely ?? ""}/${item.estimate.max ?? ""} ${item.estimate.unit || ""}`,
    ),
    "",
    "Burden ceiling:",
    ...worksheet.burden_ceiling.map(
      (item) =>
        `- ${item.role} | ${item.type} | ${item.threshold} ${item.unit || ""}`,
    ),
    "",
    "Enforcement trigger:",
    ...worksheet.enforcement_triggers.map(
      (item) => `- ${item.threshold} | ${item.action} | ${item.owner}`,
    ),
    "",
    "Repair pathway:",
    `Entry points: ${worksheet.repair_pathway.entry_points}`,
    `Required documents: ${worksheet.repair_pathway.required_documents}`,
    `Promised turnaround: ${worksheet.repair_pathway.promised_turnaround}`,
    `Interim protections: ${worksheet.repair_pathway.interim_protections}`,
    "",
    `Owner: ${worksheet.owner}`,
    `Review cadence: ${worksheet.review_cadence}`,
  ];

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  const printDocument = printWindow.document;
  printDocument.title = "Burden budget worksheet";

  const style = printDocument.createElement("style");
  style.textContent = `
      body { font-family: Arial, sans-serif; margin: 32px; font-size: 12px; }
      h1 { font-size: 18px; margin-bottom: 12px; }
      pre { white-space: pre-wrap; }
    `;
  printDocument.head.appendChild(style);

  const heading = printDocument.createElement("h1");
  heading.textContent = "Burden budget worksheet";

  const content = printDocument.createElement("pre");
  content.textContent = lines.join("\n");

  printDocument.body.appendChild(heading);
  printDocument.body.appendChild(content);
  printWindow.focus();
  printWindow.print();
};

const updateStatus = (message: string) => {
  if (!exportStatus) return;
  exportStatus.textContent = message;
};

const handleExport = (format: string) => {
  const worksheet = buildWorksheet();
  if (!worksheet) return;
  const baseName = `burden-budget-worksheet-${worksheet.worksheet_id}`;

  if (format === "md") {
    downloadFile(toMarkdown(worksheet), `${baseName}.md`, "text/markdown");
    updateStatus("Markdown export ready.");
    return;
  }

  if (format === "csv") {
    downloadFile(toCsv(worksheet), `${baseName}.csv`, "text/csv");
    updateStatus("CSV export ready.");
    return;
  }

  if (format === "json") {
    downloadFile(
      JSON.stringify(worksheet, null, 2),
      `${baseName}.json`,
      "application/json",
    );
    updateStatus("JSON export ready.");
    return;
  }

  if (format === "pdf") {
    printPdf(worksheet);
    updateStatus("PDF export opened in print dialog.");
  }
};

const compareWorksheets = () => {
  if (!compareInput || !compareList || !compareResults) return;
  const worksheet = buildWorksheet();
  if (!worksheet) return;
  let previous: Partial<Worksheet>;
  try {
    previous = JSON.parse(compareInput.value || "{}") as Partial<Worksheet>;
  } catch {
    compareResults.hidden = false;
    compareList.replaceChildren();
    const invalidItem = document.createElement("li");
    invalidItem.textContent = "Invalid JSON provided.";
    compareList.appendChild(invalidItem);
    return;
  }

  type ComparableField =
    | "system_name"
    | "system_action"
    | "worst_case_error"
    | "owner"
    | "review_cadence"
    | "assumptions";
  const fields: ComparableField[] = [
    "system_name",
    "system_action",
    "worst_case_error",
    "owner",
    "review_cadence",
    "assumptions",
  ];
  const changes = fields
    .filter((field) => worksheet[field] !== previous[field])
    .map((field) => `${field} changed`);

  if (
    worksheet.harm_roles.length !== (previous.harm_roles?.length ?? 0) ||
    worksheet.burden_estimates.length !==
      (previous.burden_estimates?.length ?? 0)
  ) {
    changes.push("role or burden rows changed");
  }

  if (
    worksheet.burden_ceiling.length !== (previous.burden_ceiling?.length ?? 0)
  ) {
    changes.push("burden ceiling rows changed");
  }

  if (
    worksheet.enforcement_triggers.length !==
    (previous.enforcement_triggers?.length ?? 0)
  ) {
    changes.push("enforcement trigger rows changed");
  }

  compareResults.hidden = false;
  compareList.replaceChildren();

  if (changes.length === 0) {
    const noDiffItem = document.createElement("li");
    noDiffItem.textContent = "No differences detected in compared fields.";
    compareList.appendChild(noDiffItem);
    return;
  }

  changes.forEach((change) => {
    const item = document.createElement("li");
    item.textContent = change;
    compareList.appendChild(item);
  });
};

setupRepeater();

document
  .querySelectorAll<HTMLButtonElement>("[data-export]")
  .forEach((button) => {
    button.addEventListener("click", () => {
      const format = button.dataset.export || "";
      handleExport(format);
    });
  });

compareButton?.addEventListener("click", compareWorksheets);
