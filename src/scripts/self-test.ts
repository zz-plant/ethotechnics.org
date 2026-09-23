import {
  decodeAnswers,
  encodeAnswers,
  scoreAnswers,
  selfTestQuestions,
  verdictLine,
  type SelfTestAnswer,
} from "../utils/self-test";

const HASH_PREFIX = "#self-test=";

function init(): void {
  const form = document.querySelector<HTMLFormElement>("[data-self-test]");
  const result = document.querySelector<HTMLElement>(
    "[data-self-test-result]",
  );
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
  const items = [
    ...form.querySelectorAll<HTMLLIElement>(".self-test__item"),
  ];

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
      link.textContent = `See it go wrong in ${item.dataset.caseTitle} →`;
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
    const original = shareButton.textContent;
    const reset = () =>
      window.setTimeout(() => {
        shareButton.textContent = original;
      }, 2000);
    navigator.clipboard
      .writeText(location.href)
      .then(() => {
        shareButton.textContent = "Link copied";
      })
      .catch(() => {
        shareButton.textContent = "Copy the address bar";
      })
      .finally(reset);
  });

  restore();
}

init();
