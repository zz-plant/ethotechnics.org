import { useEffect, useMemo, useState } from 'react';
import type { Pattern } from '../content/library';

type PatternFilterProps = {
  filters: string[];
  entries: Pattern[];
  diagnosticTitles: Record<string, string>;
};

type SelectedFilter = string | null;

const normalizeHash = (hash: string) => hash.replace('#', '');

const textMatchesQuery = (pattern: Pattern, query: string) => {
  if (!query) {
    return true;
  }

  const normalizedQuery = query.toLowerCase();
  const searchable = [pattern.title, pattern.summary, ...pattern.cues].join(' ').toLowerCase();

  return searchable.includes(normalizedQuery);
};

const matchesFilter = (pattern: Pattern, filter: SelectedFilter) => {
  if (!filter) {
    return true;
  }

  return pattern.filters.includes(filter as Pattern['filters'][number]);
};

const hashFromFilter = (filter: SelectedFilter) => `#${filter ?? 'patterns'}`;

export default function PatternFilter({ filters, entries, diagnosticTitles }: PatternFilterProps) {
  const [selectedFilter, setSelectedFilter] = useState<SelectedFilter>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const applyHash = (hash: string) => {
      const normalized = normalizeHash(hash);

      if (filters.includes(normalized)) {
        setSelectedFilter(normalized);
        return;
      }

      if (!normalized || normalized === 'patterns') {
        setSelectedFilter(null);
      }
    };

    applyHash(window.location.hash);

    const handleHashChange = () => {
      applyHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [filters]);

  useEffect(() => {
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
  }, [filters, selectedFilter]);

  const filteredPatterns = useMemo(
    () =>
      entries.filter(
        (pattern) => matchesFilter(pattern, selectedFilter) && textMatchesQuery(pattern, query.trim())
      ),
    [entries, query, selectedFilter]
  );

  const filtersWithAll = useMemo(() => ['all', ...filters], [filters]);

  const handleFilterClick = (filter: string) => {
    if (filter === 'all') {
      setSelectedFilter(null);
      return;
    }

    setSelectedFilter((current) => (current === filter ? null : filter));
  };

  return (
    <div className="pattern-filter">
      <div className="pattern-filter__controls">
        <ul className="pill-list">
          {filtersWithAll.map((filter) => {
            const isActive = (!selectedFilter && filter === 'all') || selectedFilter === filter;

            const itemClassNames = [
              'pill-list__item',
              isActive ? 'pill-list__item--active' : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <li key={filter} className={itemClassNames}>
                <button
                  type="button"
                  className="pill-list__button"
                  aria-pressed={isActive}
                  onClick={() => handleFilterClick(filter)}
                >
                  {filter === 'all' ? 'All filters' : filter}
                </button>
              </li>
            );
          })}
        </ul>
        <label className="pattern-filter__search" htmlFor="pattern-search">
          <span className="muted">Search patterns</span>
          <input
            id="pattern-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="pattern-filter__search-input"
            placeholder="Search by title, summary, or cue"
          />
        </label>
      </div>
      <div className="grid">
        {filteredPatterns.length === 0 ? (
          <p className="muted">No patterns match your filters yet.</p>
        ) : (
          filteredPatterns.map((pattern) => (
            <article className="card" id={pattern.slug} key={pattern.slug}>
              <div className="card__glow" aria-hidden="true" />
              <p className="muted">Filters: {pattern.filters.join(', ')}</p>
              <h3>{pattern.title}</h3>
              <p>{pattern.summary}</p>
              <ul className="pill-list">
                {pattern.cues.map((cue) => (
                  <li key={cue}>{cue}</li>
                ))}
              </ul>
              <p className="muted">
                Diagnostics:{' '}
                {pattern.diagnostics.map((slug, index) => {
                  const label = diagnosticTitles[slug] ?? slug;
                  const separator = index < pattern.diagnostics.length - 1 ? ', ' : '';

                  return (
                    <span key={slug}>
                      <a href={`/diagnostics#${slug}`}>{label}</a>
                      {separator}
                    </span>
                  );
                })}
              </p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
