// ─────────────────────────────────────────────────────────────
// Drape Studio — Color Swatches Component
// ─────────────────────────────────────────────────────────────

import { useStudioState, COLOR_OPTIONS } from '../../state/studioState';
import { SectionTitle } from '../ui/SectionTitle';
import './ColorSwatches.css';

function CheckIcon() {
  return (
    <svg
      className="ds-color-swatch__check-icon"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2.5 6L5 8.5L9.5 3.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ColorSwatches() {
  const { state, dispatch } = useStudioState();

  return (
    <div className="ds-color-swatches">
      <SectionTitle title="Color" subtitle="Choose your saree color" />
      <div className="ds-color-swatches__grid" role="radiogroup" aria-label="Saree color">
        {COLOR_OPTIONS.map(color => {
          const isSelected = state.selectedColor === color.id;
          return (
            <button
              key={color.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={color.name}
              className={`ds-color-swatch ${isSelected ? 'ds-color-swatch--selected' : ''}`}
              onClick={() => dispatch({ type: 'SET_COLOR', payload: color.id })}
            >
              <div
                className="ds-color-swatch__color"
                style={{ backgroundColor: color.hex }}
              />
              <span className="ds-color-swatch__check">
                <CheckIcon />
              </span>
              <span className="ds-color-swatch__label">{color.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
