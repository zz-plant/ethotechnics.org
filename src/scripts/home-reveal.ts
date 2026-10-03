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

  // The record spine's chip counts the rail as it passes: one unanswered
  // warning at a time, resolving into the full count once the halt row is
  // seen. Without the script the chip carries the server-rendered total.
  const chip = document.querySelector<HTMLElement>("[data-spine-chip]");
  const railRows = [
    ...document.querySelectorAll<HTMLElement>("[data-spine-row]"),
  ];
  if (!chip || railRows.length === 0) return;
  const total = Number.parseInt(chip.dataset.warningsTotal ?? "0", 10);

  const updateChip = () => {
    const seenLine = window.innerHeight;
    let seen = 0;
    let halted = false;
    for (const row of railRows) {
      if (row.getBoundingClientRect().bottom <= seenLine) {
        if (row.dataset.state === "unanswered") seen += 1;
        if (row.dataset.state === "halt") halted = true;
      }
    }
    if (seen === 0) {
      chip.textContent = `0 of ${total} unanswered`;
    } else if (seen >= total && halted) {
      chip.textContent = `${total} unanswered · 1 halt`;
    } else if (seen >= total) {
      chip.textContent = `${total} of ${total} unanswered`;
    } else {
      chip.textContent = `${seen} of ${total} unanswered`;
    }
  };

  updateChip();
  window.addEventListener("scroll", updateChip, { passive: true });
}

init();
