import { useEffect, useMemo, useState } from 'react';

import type { FieldNoteEntry, FieldNotesContent } from '../content/fieldNotes';

const formatTerm = (slug: string) =>
  slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const glossaryHref = (slug: string, base: string) => `${base}#${slug}`;

type FieldNotesTabsProps = {
  sections: FieldNotesContent['sections'];
  entries: FieldNoteEntry[];
  glossaryBase: string;
};

export default function FieldNotesTabs({ sections, entries, glossaryBase }: FieldNotesTabsProps) {
  const [activeFormat, setActiveFormat] = useState(sections[0]?.format ?? '');
  const [hashTarget, setHashTarget] = useState('');

  useEffect(() => {
    if (!sections.length) {
      return;
    }

    const syncFromHash = () => {
      const hash = window.location.hash.replace('#', '');

      if (hash) {
        setHashTarget(hash);
      }

      const sectionMatch = sections.find((section) => section.format === hash);

      if (sectionMatch) {
        setActiveFormat(sectionMatch.format);
        return;
      }

      const entryMatch = entries.find((entry) => entry.slug === hash);

      if (entryMatch) {
        setActiveFormat(entryMatch.format);
      }
    };

    syncFromHash();

    window.addEventListener('hashchange', syncFromHash);

    return () => {
      window.removeEventListener('hashchange', syncFromHash);
    };
  }, [sections, entries]);

  useEffect(() => {
    if (!hashTarget) {
      return;
    }

    const target = document.getElementById(hashTarget);

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [hashTarget, activeFormat]);

  const activeSection = useMemo(
    () => sections.find((section) => section.format === activeFormat) ?? sections[0],
    [sections, activeFormat],
  );

  const filteredEntries = useMemo(
    () => entries.filter((entry) => entry.format === activeSection?.format),
    [entries, activeSection?.format],
  );

  if (!activeSection) {
    return null;
  }

  return (
    <section className="section section--alt" id={activeSection.format}>
      <div className="section__header">
        <p className="eyebrow">{activeSection.title}</p>
        <h2>{activeSection.description}</h2>
        <ul className="pill-list pill-list--wrap" role="tablist" aria-label="Field note formats">
          {sections.map((section) => (
            <li
              key={section.format}
              className={section.format === activeSection.format ? 'pill-list__item--active' : ''}
            >
              <a
                href={`#${section.format}`}
                role="tab"
                aria-selected={section.format === activeSection.format}
                aria-controls={`${section.format}-panel`}
                tabIndex={section.format === activeSection.format ? 0 : -1}
                onClick={() => setActiveFormat(section.format)}
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="grid" id={`${activeSection.format}-panel`} role="tabpanel">
        {filteredEntries.map((entry) => (
          <article className="card" id={entry.slug} key={entry.slug}>
            <div className="card__glow" aria-hidden="true" />
            <h3>{entry.title}</h3>
            <p className="muted">{entry.summary}</p>
            <p className="muted">
              Glossary{' '}
              {entry.relatedTerms.map((slug, index) => {
                const separator = index < entry.relatedTerms.length - 1 ? ', ' : '';

                return (
                  <span key={slug}>
                    <a href={glossaryHref(slug, glossaryBase)}>{formatTerm(slug)}</a>
                    {separator}
                  </span>
                );
              })}
            </p>
            {entry.links ? (
              <p className="muted">
                Related links{' '}
                {entry.links.map((link, index) => {
                  const separator = index < (entry.links?.length ?? 0) - 1 ? ', ' : '';

                  return (
                    <span key={link}>
                      <a href={link}>{link}</a>
                      {separator}
                    </span>
                  );
                })}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
