// ─────────────────────────────────────────────────────────────
// Drape Studio — Type Definitions & Customization Maps
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

/** Color RGB values for 3D PBR WebGL shader uniforms */
export const COLOR_RGB_MAP: Record<string, [number, number, number]> = {
  emerald: [0.18, 0.49, 0.36],
  'royal-blue': [0.15, 0.32, 0.65],
  ruby: [0.62, 0.12, 0.22],
  plum: [0.38, 0.18, 0.42],
  gold: [0.79, 0.66, 0.30],
  'dusty-rose': [0.78, 0.53, 0.55],
};

// ── Fabric ───────────────────────────────────────────────────

export interface FabricOption {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
}

/** PBR material parameter presets for garment fabrics */
export const FABRIC_PBR_MAP: Record<
  string,
  { metallic: number; roughness: number; specular: number; alpha: number }
> = {
  silk: { metallic: 0.2, roughness: 0.25, specular: 0.9, alpha: 1.0 },
  cotton: { metallic: 0.05, roughness: 0.75, specular: 0.2, alpha: 1.0 },
  organza: { metallic: 0.1, roughness: 0.15, specular: 0.95, alpha: 0.78 },
  linen: { metallic: 0.0, roughness: 0.85, specular: 0.1, alpha: 1.0 },
};

// ── Border ───────────────────────────────────────────────────

export interface BorderOption {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
}

/** Border color & metallic accents */
export const BORDER_COLOR_MAP: Record<string, [number, number, number]> = {
  'gold-zari': [0.82, 0.68, 0.32],
  temple: [0.65, 0.22, 0.25],
  plain: [0.92, 0.88, 0.82],
  floral: [0.75, 0.42, 0.55],
};

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
