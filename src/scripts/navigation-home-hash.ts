const initializeHomeNavigationHashState = () => {
  const hashLinks = Array.from(
    document.querySelectorAll<HTMLAnchorElement>(
      'a[data-nav-hash-link="true"]',
    ),
  );

  if (!hashLinks.length) {
    return;
  }

  const clearHashCurrent = () => {
    hashLinks.forEach((link) => {
      if (link.getAttribute("aria-current") === "location") {
        link.removeAttribute("aria-current");
      }
    });
  };

  const setCurrentHashLink = (hash: string) => {
    clearHashCurrent();
    if (!hash) return;

    const match = hashLinks.find((link) => {
      const linkHash = link.getAttribute("href")?.split("#")[1];
      return linkHash ? `#${linkHash}` === hash : false;
    });

    if (match) {
      match.setAttribute("aria-current", "location");
    }
  };

  const sections: Array<{ hash: string; element: HTMLElement }> = [];

  hashLinks.forEach((link) => {
    const hash = link.getAttribute("href")?.split("#")[1];
    if (!hash) return;
    const element = document.getElementById(hash);
    if (!element) return;
    sections.push({ hash: `#${hash}`, element });
  });

  const observer =
    sections.length > 0
      ? new IntersectionObserver(
          (entries) => {
            const visible = entries
              .filter((entry) => entry.isIntersecting)
              .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (visible) {
              const match = sections.find(
                (section) => section.element === visible.target,
              );
              if (match) {
                setCurrentHashLink(match.hash);
              }
            }
          },
          {
            rootMargin: "-30% 0px -55% 0px",
            threshold: [0.2, 0.4, 0.65],
          },
        )
      : null;

  sections.forEach((section) => {
    observer?.observe(section.element);
  });

  setCurrentHashLink(window.location.hash || "");
  window.addEventListener("hashchange", () => {
    setCurrentHashLink(window.location.hash || "");
  });
};

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeHomeNavigationHashState,
  );
} else {
  initializeHomeNavigationHashState();
}
