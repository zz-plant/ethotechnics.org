import { useEffect, useState } from 'react';

const navLinks = [
  { href: '/library', label: 'Library' },
  { href: '/research', label: 'Research' },
  { href: '/diagnostics', label: 'Diagnostics' },
  { href: '/field-notes', label: 'Field Notes' },
  { href: '/institute', label: 'Institute' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <nav className="nav" aria-label="Primary">
      <div className="nav__inner container">
        <a href="#top" className="nav__brand" aria-label="Return to top">
          Ethotechnics
        </a>

        <button
          className="nav__toggle"
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span aria-hidden="true">{isOpen ? '✕' : '☰'}</span>
        </button>

        <div className={`nav__content ${isOpen ? 'is-open' : ''}`}>
          <ul className="nav__links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setIsOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="nav__actions">
            <a className="button ghost" href="/field-notes" onClick={() => setIsOpen(false)}>
              Field notes
            </a>
            <a className="button primary" href="/institute" onClick={() => setIsOpen(false)}>
              Join the institute
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
