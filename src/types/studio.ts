// ─────────────────────────────────────────────────────────────
// Drape Studio — Type Definitions
// ─────────────────────────────────────────────────────────────

/** Props for the 3D viewport integration boundary */
export interface DrapeStudioViewportProps {
  /** Called when the viewport container is mounted and ready for engine integration */
  onReady?: () => void;
  /** Additional CSS class name */
  className?: string;
}

// ── Color ────────────────────────────────────────────────────

export interface ColorOption {
  readonly id: string;
  readonly name: string;
  readonly hex: string;
}

// ── Fabric ───────────────────────────────────────────────────

export interface FabricOption {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
}

// ── Border ───────────────────────────────────────────────────

export interface BorderOption {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
}

// ── Pallu ────────────────────────────────────────────────────

export interface PalluOption {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
}

// ── Blouse ───────────────────────────────────────────────────

export interface BlouseOption {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
}

// ── Studio State ─────────────────────────────────────────────

export interface StudioState {
  selectedColor: string;
  selectedFabric: string;
  selectedBorder: string;
  selectedPallu: string;
  selectedBlouse: string;
}

// ── Studio Actions ───────────────────────────────────────────

export type StudioAction =
  | { type: 'SET_COLOR'; payload: string }
  | { type: 'SET_FABRIC'; payload: string }
  | { type: 'SET_BORDER'; payload: string }
  | { type: 'SET_PALLU'; payload: string }
  | { type: 'SET_BLOUSE'; payload: string }
  | { type: 'RESET_ALL' };

// ── Navigation ───────────────────────────────────────────────

export interface NavItem {
  readonly id: string;
  readonly label: string;
  readonly active?: boolean;
  readonly disabled?: boolean;
}
