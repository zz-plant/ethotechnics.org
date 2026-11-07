import {
  decodeAnswers,
  encodeAnswers,
  scoreAnswers,
  selfTestQuestions,
  verdictLine,
  type SelfTestAnswer,
} from "../utils/self-test";
import { readButtonLabel, setButtonLabel } from "./button-label";

const HASH_PREFIX = "#self-test=";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function canAnimate(): boolean {
  return (
    typeof Element !== "undefined" &&
    typeof Element.prototype.animate === "function" &&
    !window.matchMedia(REDUCED_MOTION).matches
  );
}

function springNode(
  stop: HTMLElement,
  spoke: HTMLElement | undefined,
  answer: SelfTestAnswer,
): void {
  if (!canAnimate()) return;
  const shape = stop.querySelector<SVGCircleElement>(
    ".safeguard-map__node-shape",
  );
  const pulse = stop.querySelector<SVGCircleElement>(
    ".safeguard-map__node-pulse",
  );
  if (shape) {
    shape.animate(
      [
        { transform: "scale(0.65)", offset: 0 },
        { transform: "scale(1.22)", offset: 0.42 },
        { transform: "scale(0.94)", offset: 0.72 },
        { transform: "scale(1.03)", offset: 0.88 },
        { transform: "scale(1)", offset: 1 },
      ],
      { duration: 520, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
  }
  if (pulse) {
    pulse.animate(
      [
        { transform: "scale(1)", opacity: 0.65 },
        {
          transform: answer === "y" ? "scale(2.05)" : "scale(1.85)",
          opacity: 0,
        },
      ],
      { duration: 640, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
    );
  }
  if (spoke) {
    spoke.animate(
      [
        { strokeDashoffset: "100", strokeWidth: "3" },
        { strokeDashoffset: "0", strokeWidth: "2" },
      ],
      { duration: 420, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
    );
  }
}

function springScore(scoreEl: HTMLElement): void {
  if (!canAnimate()) return;
  scoreEl.animate(
    [
      { opacity: 0.35, transform: "translateY(4px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    { duration: 280, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
  );
}

function init(): void {
  const form = document.querySelector<HTMLFormElement>("[data-self-test]");
  const result = document.querySelector<HTMLElement>("[data-self-test-result]");
  if (!form || !result) return;

  const holdingEl = result.querySelector<HTMLElement>(
    "[data-self-test-holding]",
  );
  const verdictEl = result.querySelector<HTMLElement>(
    "[data-self-test-verdict]",
  );
  const driftEl = result.querySelector<HTMLUListElement>(
    "[data-self-test-drift]",
  );
  const shareButton = result.querySelector<HTMLButtonElement>(
    "[data-self-test-share]",
  );
  const items = [...form.querySelectorAll<HTMLLIElement>(".self-test__item")];
  // The safeguard map beside the questions: one node per variable, drawn
  // held or drifting as each question is answered, with the count at center.
  const mapFigure = document.querySelector<HTMLElement>("[data-safeguard-map]");
  const mapRing = mapFigure?.querySelector<HTMLElement>("[data-map-ring]");
  const mapStops = [
    ...document.querySelectorAll<HTMLElement>(
      "[data-safeguard-map] [data-map-variable]",
    ),
  ];
  const mapSpokes = [
    ...document.querySelectorAll<HTMLElement>(
      "[data-safeguard-map] [data-map-spoke]",
    ),
  ];
  const mapLabels = [
    ...document.querySelectorAll<HTMLElement>(
      "[data-safeguard-map] [data-map-label]",
    ),
  ];
  const mapScore = document.querySelector<HTMLElement>("[data-map-score]");
  const previousAnswers = new Array<SelfTestAnswer | undefined>(
    selfTestQuestions.length,
  ).fill(undefined);
  let previousScoreText = "–/6";

  const setActiveVariable = (variable: string | undefined): void => {
    for (const stop of mapStops) {
      stop.toggleAttribute(
        "data-active",
        Boolean(variable && stop.dataset.mapVariable === variable),
      );
    }
    for (const spoke of mapSpokes) {
      spoke.toggleAttribute(
        "data-active",
        Boolean(variable && spoke.dataset.mapSpoke === variable),
      );
    }
    for (const label of mapLabels) {
      label.toggleAttribute(
        "data-active",
        Boolean(variable && label.dataset.mapLabel === variable),
      );
    }
  };

  for (const item of items) {
    const variable = item.dataset.variable;
    item.addEventListener("pointerenter", () => setActiveVariable(variable));
    item.addEventListener("pointerleave", () => setActiveVariable(undefined));
    item.addEventListener("focusin", () => setActiveVariable(variable));
    item.addEventListener("focusout", (event) => {
      if (!item.contains(event.relatedTarget as Node | null)) {
        setActiveVariable(undefined);
      }
    });
  }

  const readAnswers = (): (SelfTestAnswer | undefined)[] =>
    selfTestQuestions.map((_, index) => {
      const checked = form.querySelector<HTMLInputElement>(
        `input[name="q${index}"]:checked`,
      );
      return (checked?.value as SelfTestAnswer | undefined) ?? undefined;
    });

  const renderDriftItem = (variable: string): HTMLLIElement | undefined => {
    const item = items.find((el) => el.dataset.variable === variable);
    if (!item) return undefined;
    const li = document.createElement("li");
    const label = document.createElement("strong");
    label.textContent =
      selfTestQuestions.find((q) => q.variable === variable)?.label ?? variable;
    li.appendChild(label);
    li.appendChild(document.createTextNode(` · ${item.dataset.ifNo ?? ""} `));
    if (item.dataset.caseHref && item.dataset.caseTitle) {
      const link = document.createElement("a");
      link.href = item.dataset.caseHref;
      link.textContent = `See it go wrong in ${item.dataset.caseTitle}`;
      li.appendChild(link);
    }
    return li;
  };

  const render = (updateHash: boolean): void => {
    const answers = readAnswers();
    const score = scoreAnswers(answers);

    items.forEach((item, index) => {
      item.dataset.answer = answers[index] ?? "";
    });
    for (const stop of mapStops) {
      const variable = stop.dataset.mapVariable;
      const index = selfTestQuestions.findIndex(
        (question) => question.variable === variable,
      );
      const nextAnswer = answers[index];
      stop.dataset.answer = nextAnswer ?? "";
      const spoke = mapSpokes.find((s) => s.dataset.mapSpoke === variable);
      if (spoke) spoke.dataset.answer = nextAnswer ?? "";
      const label = mapLabels.find((l) => l.dataset.mapLabel === variable);
      if (label) label.dataset.answer = nextAnswer ?? "";
      if (updateHash && nextAnswer && previousAnswers[index] !== nextAnswer) {
        springNode(stop, spoke, nextAnswer);
      }
      previousAnswers[index] = nextAnswer;
    }
    if (mapFigure) {
      mapFigure.dataset.complete = String(score.complete);
      mapFigure.dataset.holding = String(score.holding);
    }
    if (mapRing && updateHash && score.complete && canAnimate()) {
      mapRing.animate(
        [{ strokeDashoffset: "600" }, { strokeDashoffset: "0" }],
        { duration: 750, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
      );
    }
    if (mapScore) {
      const nextScoreText =
        score.answered === 0
          ? "–/6"
          : `${score.holding}/${selfTestQuestions.length}`;
      mapScore.textContent = nextScoreText;
      if (updateHash && nextScoreText !== previousScoreText) {
        springScore(mapScore);
      }
      previousScoreText = nextScoreText;
    }

    if (score.answered === 0) {
      result.hidden = true;
      return;
    }
    result.hidden = false;
    result.dataset.complete = String(score.complete);
    if (holdingEl) holdingEl.textContent = String(score.holding);
    if (verdictEl) {
      verdictEl.textContent = score.complete
        ? verdictLine(score)
        : `${selfTestQuestions.length - score.answered} to go.`;
    }
    if (driftEl) {
      driftEl.textContent = "";
      for (const question of score.drifting) {
        const li = renderDriftItem(question.variable);
        if (li) driftEl.appendChild(li);
      }
    }
    if (updateHash) {
      history.replaceState(
        null,
        "",
        `${location.pathname}${location.search}${HASH_PREFIX}${encodeAnswers(answers)}`,
      );
    }
  };

  const restore = (): void => {
    if (!location.hash.startsWith(HASH_PREFIX)) return;
    const answers = decodeAnswers(location.hash.slice(HASH_PREFIX.length));
    if (!answers) return;
    answers.forEach((answer, index) => {
      if (!answer) return;
      const input = form.querySelector<HTMLInputElement>(
        `input[name="q${index}"][value="${answer}"]`,
      );
      if (input) input.checked = true;
    });
    render(false);
    form.closest("section")?.scrollIntoView({ block: "start" });
  };

  form.addEventListener("change", () => render(true));

  shareButton?.addEventListener("click", () => {
    const original = readButtonLabel(shareButton);
    const reset = () =>
      window.setTimeout(() => {
        setButtonLabel(shareButton, original);
      }, 2000);
    navigator.clipboard
      .writeText(location.href)
      .then(() => {
        setButtonLabel(shareButton, "Link copied");
      })
      .catch(() => {
        setButtonLabel(shareButton, "Copy the address bar");
      })
      .finally(reset);
  });

  restore();
}

init();
