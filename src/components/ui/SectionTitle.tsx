// ─────────────────────────────────────────────────────────────
// Drape Studio — Section Title Component
// ─────────────────────────────────────────────────────────────

import './SectionTitle.css';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionTitle({ title, subtitle, className = '' }: SectionTitleProps) {
  return (
    <div className={`ds-section-title ${className}`.trim()}>
      <h3 className="ds-section-title__heading">{title}</h3>
      {subtitle && <p className="ds-section-title__subtitle">{subtitle}</p>}
    </div>
  );
}
