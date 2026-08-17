// ─────────────────────────────────────────────────────────────
// Drape Studio — Pallu Selector Component
// ─────────────────────────────────────────────────────────────

import { useStudioState, PALLU_OPTIONS } from '../../state/studioState';
import { SectionTitle } from '../ui/SectionTitle';
import { SelectionCard } from '../ui/SelectionCard';

export function PalluSelector() {
  const { state, dispatch } = useStudioState();

  return (
    <div>
      <SectionTitle title="Pallu" subtitle="Select pallu design" />
      <div role="radiogroup" aria-label="Saree pallu" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-space-3)' }}>
        {PALLU_OPTIONS.map(option => (
          <SelectionCard
            key={option.id}
            name={option.name}
            description={option.description}
            selected={state.selectedPallu === option.id}
            onSelect={() => dispatch({ type: 'SET_PALLU', payload: option.id })}
          />
        ))}
      </div>
    </div>
  );
}
