const stickyNav = document.querySelector(".diagnostics__sticky-jump");
const mobileDisclosures = Array.from(
  document.querySelectorAll("[data-collapse-mobile]"),
);

const syncMobileDisclosures = () => {
  if (mobileDisclosures.length === 0) {
    return;
  }

  const isMobile = window.matchMedia("(max-width: 899px)").matches;

  mobileDisclosures.forEach((disclosure) => {
    if (!(disclosure instanceof HTMLDetailsElement)) {
      return;
    }

    disclosure.open = !isMobile;
  });
};

syncMobileDisclosures();
window.addEventListener("resize", syncMobileDisclosures, { passive: true });

if (stickyNav) {
  const stickyLinks = Array.from(
    stickyNav.querySelectorAll("[data-sticky-link]"),
  );
  const stickyTargets = stickyLinks
    .map((link) =>
      document.querySelector(link.getAttribute("data-sticky-link") ?? ""),
    )
    .filter((target): target is Element => target !== null);

  const setActiveLink = (targetId: string) => {
    stickyLinks.forEach((link) => {
      const href = link.getAttribute("data-sticky-link");
      const isActive = href === targetId;
      link.classList.toggle("is-active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  if (stickyTargets.length > 0 && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries[0]?.target?.id) {
          setActiveLink(`#${visibleEntries[0].target.id}`);
        }
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0.1, 0.35, 0.6],
      },
    );

    stickyTargets.forEach((target) => observer.observe(target));
  }
}

export {};
