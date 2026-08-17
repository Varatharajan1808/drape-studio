// ─────────────────────────────────────────────────────────────
// Drape Studio — Header Component
// ─────────────────────────────────────────────────────────────

import { useState, useCallback } from 'react';
import type { NavItem } from '../../types/studio';
import './Header.css';

const NAV_ITEMS: readonly NavItem[] = [
  { id: 'explore', label: 'Explore', disabled: true },
  { id: 'studio', label: '3D Studio', active: true },
  { id: 'try-on', label: 'Try On', disabled: true },
  { id: 'consult', label: 'Consult Tailor', disabled: true },
] as const;

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3 16c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = useCallback(() => {
    setMobileOpen(prev => !prev);
  }, []);

  const getNavLinkClass = (item: NavItem) => {
    const classes = ['ds-header__nav-link'];
    if (item.active) classes.push('ds-header__nav-link--active');
    if (item.disabled) classes.push('ds-header__nav-link--disabled');
    return classes.join(' ');
  };

  const getMobileLinkClass = (item: NavItem) => {
    const classes = ['ds-header__mobile-nav-link'];
    if (item.active) classes.push('ds-header__mobile-nav-link--active');
    if (item.disabled) classes.push('ds-header__mobile-nav-link--disabled');
    return classes.join(' ');
  };

  return (
    <header className="ds-header">
      {/* Brand */}
      <div className="ds-header__brand">
        <span className="ds-header__brand-name">Drape Studio</span>
        <span className="ds-header__brand-tag">3D Saree Studio</span>
      </div>

      {/* Desktop Navigation */}
      <nav className="ds-header__nav" aria-label="Main navigation">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            type="button"
            className={getNavLinkClass(item)}
            disabled={item.disabled}
            aria-current={item.active ? 'page' : undefined}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Right Section */}
      <div className="ds-header__right">
        <button
          type="button"
          className="ds-header__account"
          aria-label="Account"
        >
          <UserIcon />
        </button>

        <button
          type="button"
          className="ds-header__menu-toggle"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={toggleMobile}
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <nav className="ds-header__mobile-nav" aria-label="Mobile navigation">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              type="button"
              className={getMobileLinkClass(item)}
              disabled={item.disabled}
              aria-current={item.active ? 'page' : undefined}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
