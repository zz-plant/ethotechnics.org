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
  // assistive technology; the events remain the content.
  const panel = document.querySelector<HTMLElement>("[data-ledger-panel]");
  const rows = [...document.querySelectorAll<HTMLElement>("[data-spine-row]")];
  if (!panel || rows.length === 0) return;

  panel.setAttribute("aria-hidden", "true");
  const countEl = panel.querySelector<HTMLElement>("[data-ledger-count]");
  const statusEl = panel.querySelector<HTMLElement>("[data-ledger-status]");
  const dotEl = panel.querySelector<HTMLElement>("[data-ledger-dot]");

  let seen = 0;
  if (countEl) countEl.textContent = "Warnings and findings so far: 0";
  if (statusEl) statusEl.textContent = "Scheme status: operating";

  const ledger = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const row = entry.target as HTMLElement;
        if (row.dataset.evidence === "true") {
          seen += 1;
          if (countEl) {
            countEl.textContent = `Warnings and findings so far: ${seen}`;
          }
        }
        if (row.dataset.halt === "true") {
          panel.classList.add("is-halted");
          if (statusEl) {
            statusEl.textContent = "Scheme status: halted, November 2019";
          }
          if (dotEl) dotEl.setAttribute("data-state", "halted");
        }
        ledger.unobserve(row);
      }
    },
    { threshold: 0.4, rootMargin: "0px 0px -35% 0px" },
  );
  for (const row of rows) {
    ledger.observe(row);
  }
}

init();
