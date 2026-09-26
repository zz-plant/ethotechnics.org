/**
 * Home-page scroll enhancement. It never intercepts scroll: it observes
 * positions and writes classes and text. Everything it animates has a
 * correct static state without it, and it does nothing at all under
 * prefers-reduced-motion.
 */

const REDUCED = "(prefers-reduced-motion: reduce)";

function init(): void {
  if (window.matchMedia(REDUCED).matches) return;

  const revealables = [
    ...document.querySelectorAll<HTMLElement>("[data-reveal]"),
  ];
  if (revealables.length === 0) return;

  // Mark the page before hiding anything, so a no-JS reader never sees a
  // hidden state: the attribute only lands when the script is running.
  document.documentElement.setAttribute("data-reveal-ready", "true");

  const reveal = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-inview");
        reveal.unobserve(entry.target);
      }
    },
    { threshold: 0.05, rootMargin: "0px 0px -8% 0px" },
  );
  for (const element of revealables) {
    reveal.observe(element);
  }

  // The record-spine's two ledgers. The panel is a summary of the events
  // list, so once it is being animated it is decorative and hidden from
  const panel = document.querySelector<HTMLElement>("[data-ledger-panel]");
  const rows = [...document.querySelectorAll<HTMLElement>("[data-spine-row]")];
  if (!panel || rows.length === 0) return;

  panel.setAttribute("aria-hidden", "true");
  const countEl = panel.querySelector<HTMLElement>("[data-ledger-count]");
  const statusEl = panel.querySelector<HTMLElement>("[data-ledger-status]");
  const dotEl = panel.querySelector<HTMLElement>("[data-ledger-dot]");
  const badgeEl = panel.querySelector<HTMLElement>("[data-ledger-live-badge]");
  const total = Number.parseInt(panel.dataset.evidenceTotal ?? "5", 10);

  const updateLedger = () => {
    const triggerY = window.innerHeight * 0.65;
    let seen = 0;
    let isHalted = false;

    for (const row of rows) {
      const rect = row.getBoundingClientRect();
      if (rect.top <= triggerY) {
        if (row.dataset.evidence === "true") {
          seen += 1;
        }
        if (row.dataset.halt === "true") {
          isHalted = true;
        }
      }
    }

    if (countEl) {
      if (seen === 0) {
        countEl.textContent = `0 of ${total} warnings and findings recorded so far.`;
      } else if (seen >= total) {
        countEl.textContent = `${total} dated warnings and findings, 2014–2023. None stopped the scheme before the court did.`;
      } else {
        countEl.textContent = `${seen} of ${total} warnings and findings recorded so far.`;
      }
    }

    if (statusEl) {
      if (isHalted) {
        statusEl.textContent =
          "Scheme status: halted, November 2019 (court concession)";
      } else {
        statusEl.textContent =
          "Scheme status: operating under income averaging";
      }
    }

    if (dotEl) {
      if (isHalted) {
        dotEl.setAttribute("data-state", "halted");
      } else {
        dotEl.removeAttribute("data-state");
      }
    }

    if (badgeEl) {
      if (isHalted) {
        badgeEl.textContent = "Halted";
      } else if (seen > 0) {
        badgeEl.textContent = `Finding ${seen}/${total}`;
      } else {
        badgeEl.textContent = "Auditing";
      }
    }

    if (isHalted) {
      panel.classList.add("is-halted");
    } else {
      panel.classList.remove("is-halted");
    }
  };

  updateLedger();

  const ledger = new IntersectionObserver(
    () => {
      updateLedger();
    },
    {
      threshold: [0, 0.25, 0.5, 0.75, 1],
      rootMargin: "0px 0px -25% 0px",
    },
  );
  for (const row of rows) {
    ledger.observe(row);
  }

  window.addEventListener("scroll", updateLedger, { passive: true });
}

init();
