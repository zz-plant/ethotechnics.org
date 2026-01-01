export type PatternBundleEntry = {
  slug: string;
  title: string;
  summary: string;
  filters: string[];
  cues: string[];
  diagnostics: string[];
  steps: string[];
  artifacts: { name: string; purpose: string }[];
  example: { title: string; description: string };
};

const BUNDLE_STORAGE_KEY = 'pattern-bundle-selection';
const normalizeHash = (hash: string) => hash.replace('#', '');
const hashFromFilter = (filter: string | null) => `#${filter ?? 'patterns'}`;

export const composePatternBundle = (entries: PatternBundleEntry[]) => {
  const lines = [
    '# Pattern bundle',
    `Generated from ethotechnics.org/library on ${new Date().toISOString().slice(0, 10)}`,
    '',
  ];

  entries.forEach((entry) => {
    lines.push(`## ${entry.title}`, entry.summary, '');

    if (entry.cues.length) {
      lines.push('### Cues', ...entry.cues.map((cue) => `- ${cue}`), '');
    }

    if (entry.steps.length) {
      lines.push('### Steps', ...entry.steps.map((step, index) => `${index + 1}. ${step}`), '');
    }

    if (entry.artifacts.length) {
      lines.push('### Artifacts');
      entry.artifacts.forEach((artifact) => {
        lines.push(`- **${artifact.name}** — ${artifact.purpose}`);
      });
      lines.push('');
    }

    lines.push('### Example', `- ${entry.example.title}`, '', entry.example.description, '');

    if (entry.diagnostics.length) {
      lines.push('### Diagnostics', ...entry.diagnostics.map((diagnostic) => `- ${diagnostic}`), '');
    }
  });

  return lines.join('\n');
};

const initializePatternFilter = (root: HTMLElement) => {
  const filters = (root.getAttribute('data-filters') ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  const filterLabels = JSON.parse(root.getAttribute('data-filter-labels') ?? '{}') as Record<
    string,
    string
  >;
  const filterButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-filter]'));
  const searchInput = root.querySelector<HTMLInputElement>('[data-search-input]');
  const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-pattern-card]'));
  const selectionInputs = Array.from(root.querySelectorAll<HTMLInputElement>('[data-pattern-select]'));
  const bundleLink = root.querySelector<HTMLAnchorElement>('[data-bundle-link]');
  const bundleStatus = root.querySelector<HTMLElement>('[data-selection-status]');
  const downloadButton = root.querySelector<HTMLButtonElement>('[data-download-bundle]');
  const printButton = root.querySelector<HTMLButtonElement>('[data-print-bundle]');
  const copyBundleButton = root.querySelector<HTMLButtonElement>('[data-copy-bundle]');
  const emailForm = root.querySelector<HTMLFormElement>('[data-email-form]');
  const emailInput = root.querySelector<HTMLInputElement>('[data-bundle-email]');
  const emailSubmit = root.querySelector<HTMLButtonElement>('[data-email-submit]');
  const emailStatus = root.querySelector<HTMLElement>('[data-email-status]');
  const emptyState = root.querySelector<HTMLElement>('[data-empty]');
  const status = root.querySelector<HTMLElement>('[data-filter-status]');
  const patternPayloads = new Map<string, PatternBundleEntry>();

  cards.forEach((card) => {
    const payloadElement = card.querySelector<HTMLScriptElement>('[data-pattern-payload]');
    const payloadContent = payloadElement?.textContent ?? '';

    if (!payloadContent) {
      return;
    }

    try {
      const parsed = JSON.parse(payloadContent) as PatternBundleEntry;
      patternPayloads.set(parsed.slug, parsed);
    } catch (error) {
      console.error('Unable to parse pattern payload', error);
    }
  });

  let selectedFilter: string | null = null;
  let query = '';
  const selection = new Set<string>();

  const getFilterLabel = (filter: string) => filterLabels[filter] ?? filter;

  const setSelection = (slugs: string[]) => {
    selection.clear();
    slugs.forEach((slug) => selection.add(slug));
    selectionInputs.forEach((input) => {
      input.checked = selection.has(input.value);
    });
  };

  const loadSelection = () => {
    const saved = localStorage.getItem(BUNDLE_STORAGE_KEY);

    if (!saved) {
      return [];
    }

    try {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        return parsed.filter((value) => typeof value === 'string');
      }
    } catch (error) {
      console.error('Unable to parse saved bundle selection', error);
    }

    return [];
  };

  const saveSelection = () => {
    localStorage.setItem(BUNDLE_STORAGE_KEY, JSON.stringify(Array.from(selection)));
  };

  const getBundleLink = () => {
    const url = new URL(window.location.href);

    if (selection.size) {
      url.searchParams.set('bundle', Array.from(selection).join(','));
    } else {
      url.searchParams.delete('bundle');
    }

    url.hash = 'patterns';

    return url.toString();
  };

  const updateBundleControls = () => {
    const count = selection.size;
    const hasSelection = count > 0;

    downloadButton?.toggleAttribute('disabled', !hasSelection);
    printButton?.toggleAttribute('disabled', !hasSelection);
    copyBundleButton?.toggleAttribute('disabled', !hasSelection);
    emailSubmit?.toggleAttribute('disabled', !hasSelection);

    if (bundleStatus) {
      const pluralized = count === 1 ? 'pattern' : 'patterns';
      bundleStatus.textContent = hasSelection
        ? `${count} ${pluralized} saved for your bundle.`
        : 'No patterns selected yet.';
    }

    if (bundleLink) {
      bundleLink.href = getBundleLink();
    }
  };

  const triggerDownload = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(downloadUrl);
  };

  const openPrintView = (content: string) => {
    const printWindow = window.open('', '_blank', 'noopener');

    if (!printWindow) {
      return;
    }

    printWindow.document.title = 'Pattern bundle';

    const pre = printWindow.document.createElement('pre');
    pre.textContent = content;
    pre.style.whiteSpace = 'pre-wrap';
    pre.style.fontFamily = "ui-monospace, Menlo, 'SFMono-Regular', Consolas, 'Liberation Mono', monospace";
    pre.style.padding = '1.4rem';

    printWindow.document.body.innerHTML = '';
    printWindow.document.body.append(pre);
    printWindow.focus();
    printWindow.print();
  };

  const getSelectedPayloads = () =>
    Array.from(selection)
      .map((slug) => patternPayloads.get(slug))
      .filter((entry): entry is PatternBundleEntry => Boolean(entry));

  const updateHash = () => {
    const targetHash = hashFromFilter(selectedFilter);
    const currentHash = window.location.hash;
    const normalizedCurrent = normalizeHash(currentHash);

    if (selectedFilter) {
      if (currentHash !== targetHash) {
        window.history.replaceState(null, '', targetHash);
      }

      return;
    }

    if (!normalizedCurrent || normalizedCurrent === 'patterns' || filters.includes(normalizedCurrent)) {
      if (currentHash !== targetHash) {
        window.history.replaceState(null, '', targetHash);
      }
    }
  };

  const updateFilterButtons = () => {
    filterButtons.forEach((button) => {
      const filter = button.getAttribute('data-filter');
      const isActive = (!selectedFilter && filter === 'all') || selectedFilter === filter;
      const parent = button.closest('.pill-list__item');

      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      parent?.classList.toggle('pill-list__item--active', isActive);
    });
  };

  const applyFilters = () => {
    const normalizedQuery = query.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const cardFilters = (card.getAttribute('data-filters') ?? '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
      const searchable = card.getAttribute('data-search') ?? '';
      const matchesFilter = !selectedFilter || cardFilters.includes(selectedFilter);
      const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery);
      const isVisible = matchesFilter && matchesQuery;

      card.toggleAttribute('hidden', !isVisible);

      if (isVisible) {
        visibleCount += 1;
      }
    });

    if (emptyState) {
      emptyState.toggleAttribute('hidden', visibleCount !== 0);
    }

    if (status) {
      const filterLabel = selectedFilter ? getFilterLabel(selectedFilter) : 'All themes';
      const queryLabel = normalizedQuery ? ` and search for "${normalizedQuery}"` : '';
      const pluralized = visibleCount === 1 ? 'pattern' : 'patterns';
      status.textContent = `${visibleCount} ${pluralized} visible with ${filterLabel}${queryLabel}.`;
    }
  };

  const applyHash = (hash: string) => {
    const normalized = normalizeHash(hash);

    if (filters.includes(normalized)) {
      selectedFilter = normalized;
      return;
    }

    if (!normalized || normalized === 'patterns') {
      selectedFilter = null;
    }
  };

  const handleFilterChange = (filter: string) => {
    if (filter === 'all') {
      selectedFilter = null;
    } else {
      selectedFilter = selectedFilter === filter ? null : filter;
    }

    updateHash();
    updateFilterButtons();
    applyFilters();
  };

  const handleHashChange = () => {
    applyHash(window.location.hash);
    updateFilterButtons();
    applyFilters();
  };

  const initialize = () => {
    applyHash(window.location.hash);
    updateFilterButtons();
    applyFilters();

    const savedSelection = loadSelection();
    const searchParams = new URLSearchParams(window.location.search);
    const bundleParam = searchParams.get('bundle');
    const paramSelection = bundleParam
      ? bundleParam
          .split(',')
          .map((slug) => slug.trim())
          .filter(Boolean)
      : [];

    const combinedSelection = Array.from(new Set([...savedSelection, ...paramSelection]));

    if (combinedSelection.length) {
      setSelection(combinedSelection);
    }

    updateBundleControls();

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');

        if (!filter) {
          return;
        }

        handleFilterChange(filter);
      });
    });

    searchInput?.addEventListener('input', (event) => {
      const target = event.target;

      if (!(target instanceof HTMLInputElement)) {
        return;
      }

      query = target.value;
      applyFilters();
    });

    selectionInputs.forEach((input) => {
      input.addEventListener('change', (event) => {
        const target = event.target;

        if (!(target instanceof HTMLInputElement)) {
          return;
        }

        if (target.checked) {
          selection.add(target.value);
        } else {
          selection.delete(target.value);
        }

        saveSelection();
        updateBundleControls();
      });
    });

    downloadButton?.addEventListener('click', () => {
      const payloads = getSelectedPayloads();
      const markdown = composePatternBundle(payloads);

      triggerDownload(markdown, 'pattern-bundle.md', 'text/markdown');
    });

    printButton?.addEventListener('click', () => {
      const payloads = getSelectedPayloads();
      const markdown = composePatternBundle(payloads);

      openPrintView(markdown);
    });

    copyBundleButton?.addEventListener('click', async () => {
      const link = getBundleLink();
      const defaultLabel = copyBundleButton.textContent?.trim() ?? 'Copy bundle link';

      try {
        await navigator.clipboard.writeText(link);
        copyBundleButton.textContent = 'Copied';
        window.setTimeout(() => {
          copyBundleButton.textContent = defaultLabel;
        }, 1400);
      } catch (error) {
        console.error('Unable to copy bundle link', error);
      }
    });

    emailForm?.addEventListener('submit', (event) => {
      event.preventDefault();

      const email = emailInput?.value.trim();

      if (!email) {
        emailStatus?.toggleAttribute('data-error', true);
        if (emailStatus) {
          emailStatus.textContent = 'Add an email to draft your bundle message.';
        }
        return;
      }

      emailStatus?.removeAttribute('data-error');

      const payloads = getSelectedPayloads();
      const markdown = composePatternBundle(payloads);
      const link = getBundleLink();
      const body = `${markdown}\n\nBundle link: ${link}`;

      const mailto = new URL('mailto:' + encodeURIComponent(email));
      mailto.searchParams.set('subject', 'Pattern bundle links');
      mailto.searchParams.set('body', body);

      window.location.href = mailto.toString();

      if (emailStatus) {
        emailStatus.textContent = 'Opening your email client with the bundle link.';
      }
    });

    window.addEventListener('hashchange', handleHashChange);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        initialize();
        observer.disconnect();
      }
    });

    observer.observe(root);
  } else {
    initialize();
  }
};

const initPatternFilters = () => {
  const roots = Array.from(document.querySelectorAll<HTMLElement>('[data-pattern-filter]'));

  roots.forEach(initializePatternFilter);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPatternFilters);
} else {
  initPatternFilters();
}
