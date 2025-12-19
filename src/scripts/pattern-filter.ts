const normalizeHash = (hash: string) => hash.replace('#', '');
const hashFromFilter = (filter: string | null) => `#${filter ?? 'patterns'}`;

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
  const emptyState = root.querySelector<HTMLElement>('[data-empty]');
  const status = root.querySelector<HTMLElement>('[data-filter-status]');

  let selectedFilter: string | null = null;
  let query = '';

  const getFilterLabel = (filter: string) => filterLabels[filter] ?? filter;

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
