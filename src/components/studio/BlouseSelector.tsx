// ─────────────────────────────────────────────────────────────
// Drape Studio — Blouse Selector Component
// ─────────────────────────────────────────────────────────────

import { useStudioState, BLOUSE_OPTIONS } from '../../state/studioState';
import { SectionTitle } from '../ui/SectionTitle';
import { SelectionCard } from '../ui/SelectionCard';

export function BlouseSelector() {
  const { state, dispatch } = useStudioState();

  return (
    <div>
      <SectionTitle title="Blouse" subtitle="Choose blouse style" />
      <div role="radiogroup" aria-label="Blouse style" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-space-3)' }}>
        {BLOUSE_OPTIONS.map(option => (
          <SelectionCard
            key={option.id}
            name={option.name}
            description={option.description}
            selected={state.selectedBlouse === option.id}
            onSelect={() => dispatch({ type: 'SET_BLOUSE', payload: option.id })}
          />
        ))}
      </div>
    </div>
  );
}
