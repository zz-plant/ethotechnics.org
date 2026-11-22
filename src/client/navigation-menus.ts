/**
 * Sitewide navigation controller:
 * - Desktop section popovers (Popover API + CSS Anchor Positioning fallback +
 *   fine-pointer hover preview with click-to-pin).
 * - Mobile/tablet slide-in drawer (<dialog> with scroll-snap swipe-to-dismiss,
 *   IntersectionObserver state sync, and progressive-enhancement fallbacks).
 * - Collapsible drawer sections (expanded by default in HTML for no-JS,
 *   collapsed to the active section on boot).
 * - Scroll-hide header fallback for browsers without CSS scroll-state queries.
 */

const DESKTOP_MEDIA = "(min-width: 1024px)";
const HOVER_MEDIA = "(hover: hover)";
const REDUCED_MOTION_MEDIA = "(prefers-reduced-motion: reduce)";

const supportsCss = (property: string, value?: string): boolean => {
  if (typeof CSS === "undefined" || typeof CSS.supports !== "function") {
    return false;
  }
  return value === undefined
    ? CSS.supports(property)
    : CSS.supports(property, value);
};

const supportsNativePopover = (): boolean =>
  typeof HTMLElement !== "undefined" &&
  Object.hasOwn(HTMLElement.prototype, "popover");

const isPopoverVisible = (popover: HTMLElement, native: boolean): boolean => {
  if (native) {
    try {
      return popover.matches(":popover-open");
    } catch {
      return false;
    }
  }
  return popover.classList.contains(":popover-open");
};

const showNativePopover = (
  popover: HTMLElement,
  source: HTMLButtonElement,
): void => {
  try {
    (
      popover as HTMLElement & {
        showPopover: (options?: { source?: HTMLElement }) => void;
      }
    ).showPopover({ source });
  } catch {
    try {
      popover.showPopover();
    } catch {
      // Ignore if already open or detached.
    }
  }
};

const hideNativePopover = (popover: HTMLElement): void => {
  try {
    popover.hidePopover();
  } catch {
    // Ignore if already closed or detached.
  }
};

const positionFallbackPopover = (
  trigger: HTMLButtonElement,
  popover: HTMLElement,
): void => {
  const triggerRect = trigger.getBoundingClientRect();
  const popoverRect = popover.getBoundingClientRect();
  const margin = 16;

  let top = triggerRect.bottom;
  if (
    top + popoverRect.height > window.innerHeight - margin &&
    triggerRect.top - popoverRect.height >= margin
  ) {
    top = triggerRect.top - popoverRect.height;
  }

  const maxLeft = Math.max(
    margin,
    window.innerWidth - popoverRect.width - margin,
  );
  const left = Math.min(Math.max(margin, triggerRect.left), maxLeft);

  popover.style.top = `${Math.round(top)}px`;
  popover.style.left = `${Math.round(left)}px`;
};

const initDesktopPopovers = (desktopQuery: MediaQueryList): void => {
  const sectionItems = Array.from(
    document.querySelectorAll<HTMLElement>("[data-nav-section]"),
  );
  if (sectionItems.length === 0) return;

  const nativePopover = supportsNativePopover();
  const useAnchorPositioning = supportsCss("position-area", "block-end");
  const hoverQuery = window.matchMedia(HOVER_MEDIA);

  type SectionEntry = {
    item: HTMLElement;
    trigger: HTMLButtonElement;
    popover: HTMLElement;
    previewed: boolean;
    closeTimer: number | undefined;
  };

  const entries: SectionEntry[] = [];

  for (const item of sectionItems) {
    const trigger = item.querySelector<HTMLButtonElement>("[data-nav-trigger]");
    const popover = item.querySelector<HTMLElement>("[data-nav-popover]");
    if (!trigger || !popover) continue;
    entries.push({
      item,
      trigger,
      popover,
      previewed: false,
      closeTimer: undefined,
    });
  }

  if (entries.length === 0) return;

  const closeEntry = (entry: SectionEntry): void => {
    if (entry.closeTimer !== undefined) {
      window.clearTimeout(entry.closeTimer);
      entry.closeTimer = undefined;
    }
    entry.previewed = false;
    if (nativePopover) {
      if (isPopoverVisible(entry.popover, true)) {
        hideNativePopover(entry.popover);
      }
    } else if (entry.popover.classList.contains(":popover-open")) {
      entry.popover.classList.remove(":popover-open");
      entry.trigger.setAttribute("aria-expanded", "false");
    }
  };

  const openEntryFallback = (entry: SectionEntry): void => {
    for (const other of entries) {
      if (other !== entry) closeEntry(other);
    }
    entry.popover.classList.add(":popover-open");
    entry.trigger.setAttribute("aria-expanded", "true");
    positionFallbackPopover(entry.trigger, entry.popover);
  };

  for (const entry of entries) {
    const { item, trigger, popover } = entry;

    if (nativePopover) {
      popover.addEventListener("toggle", (event) => {
        const opened = event.newState === "open";
        trigger.setAttribute("aria-expanded", String(opened));
        if (!opened) {
          entry.previewed = false;
        } else if (!useAnchorPositioning) {
          positionFallbackPopover(trigger, popover);
        }
      });
    } else {
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        if (isPopoverVisible(popover, false)) {
          if (entry.previewed) {
            entry.previewed = false;
          } else {
            closeEntry(entry);
          }
        } else {
          openEntryFallback(entry);
        }
      });
    }

    item.addEventListener("pointerenter", (event) => {
      if (
        event.pointerType === "touch" ||
        !desktopQuery.matches ||
        !hoverQuery.matches
      ) {
        return;
      }
      if (entry.closeTimer !== undefined) {
        window.clearTimeout(entry.closeTimer);
        entry.closeTimer = undefined;
      }
      if (!isPopoverVisible(popover, nativePopover)) {
        entry.previewed = true;
        if (nativePopover) {
          showNativePopover(popover, trigger);
        } else {
          openEntryFallback(entry);
        }
      }
    });

    item.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "touch" || !entry.previewed) return;
      if (entry.closeTimer !== undefined) {
        window.clearTimeout(entry.closeTimer);
      }
      entry.closeTimer = window.setTimeout(() => {
        entry.closeTimer = undefined;
        if (entry.previewed) {
          closeEntry(entry);
        }
      }, 120);
    });

    if (nativePopover) {
      trigger.addEventListener("click", (event) => {
        if (entry.previewed && isPopoverVisible(popover, true)) {
          entry.previewed = false;
          event.preventDefault();
        }
      });
    }

    item.addEventListener("focusout", (event) => {
      if (!isPopoverVisible(popover, nativePopover)) return;
      const next = event.relatedTarget;
      if (next instanceof Node && !item.contains(next)) {
        closeEntry(entry);
      }
    });

    popover.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof Element && target.closest("a")) {
        closeEntry(entry);
      }
    });
  }

  if (!nativePopover) {
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      const open = entries.find((entry) =>
        isPopoverVisible(entry.popover, false),
      );
      if (!open) return;
      closeEntry(open);
      open.trigger.focus();
    });

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      for (const entry of entries) {
        if (!entry.item.contains(target)) closeEntry(entry);
      }
    });
  }

  if (!useAnchorPositioning || !nativePopover) {
    window.addEventListener(
      "resize",
      () => {
        for (const entry of entries) {
          if (isPopoverVisible(entry.popover, nativePopover)) {
            positionFallbackPopover(entry.trigger, entry.popover);
          }
        }
      },
      { passive: true },
    );
  }

  desktopQuery.addEventListener("change", (event) => {
    if (!event.matches) {
      for (const entry of entries) closeEntry(entry);
    }
  });
};

const initDrawerAccordions = (drawer: HTMLDialogElement): void => {
  const sections = Array.from(
    drawer.querySelectorAll<HTMLElement>("[data-drawer-section]"),
  );

  for (const section of sections) {
    const trigger = section.querySelector<HTMLButtonElement>(
      "[data-drawer-accordion-trigger]",
    );
    const panel = section.querySelector<HTMLElement>(
      "[data-drawer-accordion-panel]",
    );
    if (!trigger || !panel) continue;

    const defaultOpen = section.dataset.defaultOpen === "true";
    trigger.setAttribute("aria-expanded", String(defaultOpen));
    panel.hidden = !defaultOpen;

    trigger.addEventListener("click", () => {
      const nextOpen = trigger.getAttribute("aria-expanded") !== "true";
      trigger.setAttribute("aria-expanded", String(nextOpen));
      panel.hidden = !nextOpen;
    });
  }
};

const initMobileDrawer = (desktopQuery: MediaQueryList): void => {
  const drawer = document.querySelector<HTMLDialogElement>("[data-nav-drawer]");
  const openBtn = document.querySelector<HTMLButtonElement>(
    "[data-nav-drawer-open]",
  );
  if (!drawer || !openBtn) return;

  const scroller = drawer.querySelector<HTMLElement>(
    "[data-nav-drawer-scroller]",
  );
  const sheet = drawer.querySelector<HTMLElement>("[data-nav-drawer-sheet]");
  const closeBtn = drawer.querySelector<HTMLButtonElement>(
    "[data-nav-drawer-close]",
  );
  if (!scroller || !sheet) return;

  initDrawerAccordions(drawer);

  const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_MEDIA);
  const hasScrollTimeline = supportsCss("animation-timeline: scroll()");
  const hasScrollInitialTarget = supportsCss(
    "scroll-initial-target",
    "nearest",
  );

  let hasEntered = false;
  let closeTimer: number | undefined;
  let enterTimer: number | undefined;

  const clearTimers = (): void => {
    if (closeTimer !== undefined) {
      window.clearTimeout(closeTimer);
      closeTimer = undefined;
    }
    if (enterTimer !== undefined) {
      window.clearTimeout(enterTimer);
      enterTimer = undefined;
    }
  };

  const syncBackdropFallback = (): void => {
    if (hasScrollTimeline) return;
    const width = sheet.offsetWidth;
    const ratio =
      width > 0
        ? Math.min(1, Math.max(0, scroller.scrollLeft / width))
        : drawer.open
          ? 1
          : 0;
    drawer.style.setProperty("--drawer-backdrop", ratio.toFixed(3));
  };

  const finishClose = (): void => {
    clearTimers();
    hasEntered = false;
    if (drawer.open) {
      drawer.close();
    }
    openBtn.setAttribute("aria-expanded", "false");
    if (!hasScrollTimeline) {
      drawer.style.setProperty("--drawer-backdrop", "0");
    }
  };

  const openDrawer = async (): Promise<void> => {
    if (drawer.open) return;
    clearTimers();
    hasEntered = false;

    drawer.showModal();
    openBtn.setAttribute("aria-expanded", "true");

    const sheetWidth = sheet.offsetWidth;
    if (reducedMotionQuery.matches || sheetWidth === 0) {
      scroller.scrollLeft = sheetWidth;
      hasEntered = true;
      if (!hasScrollTimeline) {
        drawer.style.setProperty("--drawer-backdrop", "1");
      }
      return;
    }

    if (!hasScrollInitialTarget || scroller.scrollLeft !== 0) {
      scroller.scrollTo({ left: 0, behavior: "instant" });
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );
      if (!drawer.open) return;
    }

    scroller.scrollTo({ left: scroller.scrollWidth, behavior: "auto" });
    syncBackdropFallback();

    enterTimer = window.setTimeout(() => {
      enterTimer = undefined;
      if (drawer.open) hasEntered = true;
    }, 350);
  };

  const closeDrawer = (): void => {
    if (!drawer.open) return;
    const sheetWidth = sheet.offsetWidth;
    if (
      reducedMotionQuery.matches ||
      sheetWidth === 0 ||
      scroller.scrollLeft <= 1
    ) {
      finishClose();
      return;
    }

    hasEntered = true;
    scroller.scrollTo({ left: 0, behavior: "auto" });
    clearTimers();
    closeTimer = window.setTimeout(() => {
      closeTimer = undefined;
      finishClose();
    }, 450);
  };

  if (typeof IntersectionObserver !== "undefined") {
    const visibleThreshold = 1 / Math.max(window.innerWidth, 320);
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries.at(-1);
        if (!entry || !drawer.open) return;
        if (entry.intersectionRatio >= 0.99) {
          hasEntered = true;
          openBtn.setAttribute("aria-expanded", "true");
        } else if (entry.intersectionRatio < visibleThreshold && hasEntered) {
          finishClose();
        }
      },
      { root: drawer, threshold: [visibleThreshold, 1] },
    );
    observer.observe(sheet);
  }

  if (!hasScrollTimeline) {
    scroller.addEventListener("scroll", syncBackdropFallback, {
      passive: true,
    });
  }

  openBtn.addEventListener("click", () => {
    void openDrawer();
  });

  closeBtn?.addEventListener("click", closeDrawer);

  drawer.addEventListener("click", (event) => {
    if (event.target instanceof Node && !sheet.contains(event.target)) {
      closeDrawer();
    }
  });

  drawer.addEventListener("cancel", (event) => {
    if (event.cancelable) {
      event.preventDefault();
      closeDrawer();
    }
  });

  drawer.addEventListener("close", () => {
    clearTimers();
    hasEntered = false;
    openBtn.setAttribute("aria-expanded", "false");
    if (!hasScrollTimeline) {
      drawer.style.setProperty("--drawer-backdrop", "0");
    }
  });

  sheet.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof Element && target.closest("a")) {
      finishClose();
    }
  });

  desktopQuery.addEventListener("change", (event) => {
    if (event.matches && drawer.open) {
      finishClose();
    }
  });
};

const initScrollHideFallback = (): void => {
  if (supportsCss("container-type", "scroll-state")) return;

  const nav = document.querySelector<HTMLElement>("[data-nav]");
  if (!nav) return;

  const root = document.documentElement;
  let lastY = Math.max(0, window.scrollY);
  const hideDelta = 8;
  const revealDelta = 4;

  window.addEventListener(
    "scroll",
    () => {
      const maxScroll = Math.max(0, root.scrollHeight - window.innerHeight);
      const y = Math.max(0, Math.min(window.scrollY, maxScroll));
      if (y === lastY) return;

      const threshold = nav.offsetHeight || 56;
      if (y <= threshold) {
        root.classList.remove("nav--hidden");
        lastY = y;
        return;
      }

      if (y > lastY + hideDelta) {
        root.classList.add("nav--hidden");
        lastY = y;
      } else if (y < lastY - revealDelta) {
        root.classList.remove("nav--hidden");
        lastY = y;
      }
    },
    { passive: true },
  );
};

export const initializeNavigationMenus = (): void => {
  const desktopQuery = window.matchMedia(DESKTOP_MEDIA);
  initDesktopPopovers(desktopQuery);
  initMobileDrawer(desktopQuery);
  initScrollHideFallback();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeNavigationMenus, {
    once: true,
  });
} else {
  initializeNavigationMenus();
}
