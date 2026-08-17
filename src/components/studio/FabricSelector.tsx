// ─────────────────────────────────────────────────────────────
// Drape Studio — Fabric Selector Component
// ─────────────────────────────────────────────────────────────

import { useStudioState, FABRIC_OPTIONS } from '../../state/studioState';
import { SectionTitle } from '../ui/SectionTitle';
import { SelectionCard } from '../ui/SelectionCard';

export function FabricSelector() {
  const { state, dispatch } = useStudioState();

  return (
    <div>
      <SectionTitle title="Fabric" subtitle="Select fabric type" />
      <div role="radiogroup" aria-label="Saree fabric" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-space-3)' }}>
        {FABRIC_OPTIONS.map(option => (
          <SelectionCard
            key={option.id}
            name={option.name}
            description={option.description}
            selected={state.selectedFabric === option.id}
            onSelect={() => dispatch({ type: 'SET_FABRIC', payload: option.id })}
          />
        ))}
      </div>
    </div>
  );
}
