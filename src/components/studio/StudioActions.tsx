// ─────────────────────────────────────────────────────────────
// Drape Studio — Studio Actions Component
// ─────────────────────────────────────────────────────────────

import { useStudioState } from '../../state/studioState';
import { Button } from '../ui/Button';
import './StudioActions.css';

export function StudioActions() {
  const { dispatch } = useStudioState();

  return (
    <div className="ds-studio-actions">
      <div className="ds-studio-actions__left">
        <Button
          variant="secondary"
          size="md"
          onClick={() => dispatch({ type: 'RESET_ALL' })}
          aria-label="Reset all selections to defaults"
        >
          Reset View
        </Button>
      </div>

      <div className="ds-studio-actions__right">
        <Button
          variant="ghost"
          size="md"
          disabled
          badge="Soon"
          aria-label="Try On Me — Coming Soon"
        >
          Try On Me
        </Button>

        <Button
          variant="primary"
          size="md"
          disabled
          badge="Soon"
          aria-label="Continue — Coming Soon"
        >
          Continue
          <span className="ds-studio-actions__arrow" aria-hidden="true">→</span>
        </Button>
      </div>
    </div>
  );
}
