// ─────────────────────────────────────────────────────────────
// Drape Studio — Border Selector Component
// ─────────────────────────────────────────────────────────────

import { useStudioState, BORDER_OPTIONS } from '../../state/studioState';
import { SectionTitle } from '../ui/SectionTitle';
import { SelectionCard } from '../ui/SelectionCard';

export function BorderSelector() {
  const { state, dispatch } = useStudioState();

  return (
    <div>
      <SectionTitle title="Border" subtitle="Choose border style" />
      <div role="radiogroup" aria-label="Saree border" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-space-3)' }}>
        {BORDER_OPTIONS.map(option => (
          <SelectionCard
            key={option.id}
            name={option.name}
            description={option.description}
            selected={state.selectedBorder === option.id}
            onSelect={() => dispatch({ type: 'SET_BORDER', payload: option.id })}
          />
        ))}
      </div>
    </div>
  );
}
