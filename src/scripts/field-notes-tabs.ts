const escapeHash = (value: string) => {
  if (typeof CSS === 'undefined' || !CSS.escape) {
    return value;
  }

  return CSS.escape(value);
};

const initializeFieldNotes = (container: HTMLElement) => {
  const tabs = Array.from(container.querySelectorAll<HTMLAnchorElement>('[data-field-notes-tab]'));
  const panels = Array.from(container.querySelectorAll<HTMLElement>('[data-field-notes-panel]'));
  const entries = Array.from(container.querySelectorAll<HTMLElement>('[data-field-notes-entry]'));
  const headings = Array.from(container.querySelectorAll<HTMLElement>('[data-field-notes-heading]'));
  const defaultFormat = container.dataset.defaultFormat ?? tabs[0]?.dataset.format ?? '';

  if (tabs.length === 0) {
    return;
  }

  const scrollToHash = (hash: string) => {
    if (!hash) {
      return;
    }

    const target = container.querySelector('#' + escapeHash(hash));

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const setActiveFormat = (format: string) => {
    const resolvedFormat = tabs.some((tab) => tab.dataset.format === format) ? format : defaultFormat;

    tabs.forEach((tab) => {
      const isActive = tab.dataset.format === resolvedFormat;

      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
      tab.parentElement?.classList.toggle('pill-list__item--active', isActive);
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.format === resolvedFormat;

      panel.hidden = !isActive;
    });

    headings.forEach((heading) => {
      const isActive = heading.dataset.format === resolvedFormat;

      heading.hidden = !isActive;
    });
  };

  const syncFromHash = () => {
    const hash = window.location.hash.replace('#', '');

    if (!hash) {
      setActiveFormat(defaultFormat);
      return;
    }

    const matchingTab = tabs.find((tab) => tab.dataset.format === hash);

    if (matchingTab) {
      setActiveFormat(hash);
      scrollToHash(hash);
      return;
    }

    const matchingEntry = entries.find((entry) => entry.id === hash);

    if (matchingEntry) {
      const entryFormat = matchingEntry.dataset.format ?? defaultFormat;

      setActiveFormat(entryFormat);
      scrollToHash(hash);
    }
  };

  const maybeSyncFromHash = () => {
    if (!('IntersectionObserver' in window)) {
      syncFromHash();
      return;
    }

    const observer = new IntersectionObserver((entriesList) => {
      entriesList.forEach((entry) => {
        if (entry.isIntersecting) {
          syncFromHash();
          observer.disconnect();
        }
      });
    });

    observer.observe(container);
  };

  const activateTab = (tab: HTMLAnchorElement) => {
    const format = tab.dataset.format ?? defaultFormat;

    setActiveFormat(format);
    tab.focus();

    if (format) {
      window.location.hash = format;
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', (event) => {
      event.preventDefault();
      activateTab(tab);
    });

    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
        return;
      }

      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        event.preventDefault();
      }

      const currentIndex = tabs.indexOf(event.currentTarget as HTMLAnchorElement);

      if (currentIndex === -1) {
        return;
      }

      let targetIndex = currentIndex;

      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        targetIndex = (currentIndex + 1) % tabs.length;
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        targetIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (event.key === 'Home') {
        targetIndex = 0;
      } else if (event.key === 'End') {
        targetIndex = tabs.length - 1;
      }

      const targetTab = tabs[targetIndex];

      if (targetTab) {
        activateTab(targetTab);
      }
    });
  });

  window.addEventListener('hashchange', syncFromHash);
  maybeSyncFromHash();
};

const initFieldNotesTabs = () => {
  const containers = Array.from(document.querySelectorAll<HTMLElement>('[data-field-notes]'));

  containers.forEach(initializeFieldNotes);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFieldNotesTabs);
} else {
  initFieldNotesTabs();
}
