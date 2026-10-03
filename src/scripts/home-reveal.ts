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

}

init();
