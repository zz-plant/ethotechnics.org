/**
 * Shows the section map once the intro's links scroll away, marks the section
 * the reader is in, and publishes the header's bottom edge as a CSS variable
 * so anything sticky can sit below it rather than behind it.
 */

const publishNavOffset = () => {
  const nav = document.querySelector<HTMLElement>("[data-nav]");
  const bottom = nav ? Math.round(nav.getBoundingClientRect().bottom) : 0;
  document.documentElement.style.setProperty("--nav-bottom", `${bottom}px`);
  return bottom;
};

const initializeSectionNav = () => {
  publishNavOffset();
  window.addEventListener("resize", publishNavOffset, { passive: true });

  const bar = document.querySelector<HTMLElement>("[data-section-nav]");
  if (!bar) return;

  const introAnchors = document.querySelector<HTMLElement>(
    ".page-intro__anchors",
  );
  const links = Array.from(
    bar.querySelectorAll<HTMLAnchorElement>("[data-section-link]"),
  );
  const targets = links
    .map((link) => document.getElementById(link.dataset.sectionLink ?? ""))
    .filter((el): el is HTMLElement => el !== null);
  if (targets.length === 0) return;

  // Visible only after the intro's own list has gone; a map beside the map it
  // duplicates is noise. Measured on scroll rather than observed: an
  // IntersectionObserver only reports changes in intersection, and a jump
  // from below the fold to above it (a hash link, a restored scroll position)
  // never intersects at all.
  const introPassed = () =>
    !introAnchors || introAnchors.getBoundingClientRect().bottom < 0;

  // The current section is the last target whose top has passed the bar.
  const setCurrent = () => {
    bar.hidden = !introPassed();
    const line = (publishNavOffset() || 0) + bar.offsetHeight + 8;
    let current: HTMLElement | null = null;
    for (const target of targets) {
      if (target.getBoundingClientRect().top <= line) current = target;
    }
    for (const link of links) {
      const isCurrent = current?.id === link.dataset.sectionLink;
      if (isCurrent) {
        link.setAttribute("aria-current", "location");
        link.scrollIntoView({ block: "nearest", inline: "nearest" });
      } else {
        link.removeAttribute("aria-current");
      }
    }
  };
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setCurrent();
        ticking = false;
      });
    },
    { passive: true },
  );
  setCurrent();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeSectionNav, {
    once: true,
  });
} else {
  initializeSectionNav();
}
