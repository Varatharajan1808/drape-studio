// ─────────────────────────────────────────────────────────────
// Drape Studio — Selection Card Component
// ─────────────────────────────────────────────────────────────

import './SelectionCard.css';

interface SelectionCardProps {
  name: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  className?: string;
}

function CheckIcon() {
  return (
    <svg
      className="ds-selection-card__check-icon"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2.5 6L5 8.5L9.5 3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SelectionCard({
  name,
  description,
  selected,
  onSelect,
  className = '',
}: SelectionCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={name}
      className={`ds-selection-card ${selected ? 'ds-selection-card--selected' : ''} ${className}`.trim()}
      onClick={onSelect}
    >
      <span className="ds-selection-card__check">
        <CheckIcon />
      </span>
      <span className="ds-selection-card__name">{name}</span>
      {description && (
        <span className="ds-selection-card__description">{description}</span>
      )}
    </button>
  );
}
