// ─────────────────────────────────────────────────────────────
// Drape Studio — Customization Panel Component
// ─────────────────────────────────────────────────────────────

import { useState, useCallback } from 'react';
import { ColorSwatches } from './ColorSwatches';
import { FabricSelector } from './FabricSelector';
import { BorderSelector } from './BorderSelector';
import { PalluSelector } from './PalluSelector';
import { BlouseSelector } from './BlouseSelector';
import './CustomizationPanel.css';

interface AccordionSectionProps {
  title: string;
  children: React.ReactNode;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={`ds-customization__accordion-icon ${open ? 'ds-customization__accordion-icon--open' : ''}`}
      aria-hidden="true"
    >
      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * On mobile, each section is an accordion.
 * On desktop, all sections are visible.
 */
function AccordionSection({ title, children }: AccordionSectionProps) {
  const [open, setOpen] = useState(true);

  const toggle = useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  return (
    <div>
      {/* Mobile accordion toggle — hidden on desktop via CSS */}
      <button
        type="button"
        className="ds-customization__accordion-toggle"
        onClick={toggle}
        aria-expanded={open}
      >
        {title}
        <ChevronIcon open={open} />
      </button>
      {/* Content — always visible on desktop, accordion on mobile */}
      <div className={`ds-customization__accordion-content ${open ? 'ds-customization__accordion-content--open' : ''}`}>
        {children}
      </div>
    </div>
  );
}

export function CustomizationPanel() {
  return (
    <section className="ds-customization ds-animate-slide-up" aria-label="Saree customization">
      {/* Panel Header */}
      <div className="ds-customization__header">
        <h2 className="ds-customization__heading">Customize Your Saree</h2>
        <p className="ds-customization__subheading">
          Select your preferences to create a unique design
        </p>
        <hr className="ds-customization__divider" />
      </div>

      {/* Sections */}
      <div className="ds-customization__sections">
        <AccordionSection title="Color">
          <ColorSwatches />
        </AccordionSection>

        <AccordionSection title="Fabric">
          <FabricSelector />
        </AccordionSection>

        <AccordionSection title="Border">
          <BorderSelector />
        </AccordionSection>

        <AccordionSection title="Pallu">
          <PalluSelector />
        </AccordionSection>

        <AccordionSection title="Blouse">
          <BlouseSelector />
        </AccordionSection>
      </div>
    </section>
  );
}
