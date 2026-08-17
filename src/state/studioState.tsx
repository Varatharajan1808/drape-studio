// ─────────────────────────────────────────────────────────────
// Drape Studio — Studio State (React Context + useReducer)
// ─────────────────────────────────────────────────────────────

import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { StudioState, StudioAction } from '../types/studio';
import type {
  ColorOption,
  FabricOption,
  BorderOption,
  PalluOption,
  BlouseOption,
} from '../types/studio';

// ── Option Catalogs ───────────────────────────────────────────

export const COLOR_OPTIONS: readonly ColorOption[] = [
  { id: 'emerald', name: 'Emerald', hex: '#2E7D5B' },
  { id: 'royal-blue', name: 'Royal Blue', hex: '#2B4C8C' },
  { id: 'ruby', name: 'Ruby', hex: '#9B2335' },
  { id: 'plum', name: 'Plum', hex: '#6B3A6E' },
  { id: 'mustard', name: 'Mustard', hex: '#C9972D' },
  { id: 'blush', name: 'Blush', hex: '#D4A0A0' },
] as const;

export const FABRIC_OPTIONS: readonly FabricOption[] = [
  { id: 'silk', name: 'Silk', description: 'Luxurious sheen' },
  { id: 'cotton', name: 'Cotton', description: 'Breathable comfort' },
  { id: 'organza', name: 'Organza', description: 'Sheer elegance' },
  { id: 'linen', name: 'Linen', description: 'Natural texture' },
] as const;

export const BORDER_OPTIONS: readonly BorderOption[] = [
  { id: 'gold-zari', name: 'Gold Zari', description: 'Traditional metallic' },
  { id: 'temple', name: 'Temple', description: 'Architectural motifs' },
  { id: 'plain', name: 'Plain', description: 'Minimal finish' },
  { id: 'floral', name: 'Floral', description: 'Botanical patterns' },
] as const;

export const PALLU_OPTIONS: readonly PalluOption[] = [
  { id: 'classic', name: 'Classic', description: 'Timeless drape' },
  { id: 'zari', name: 'Zari', description: 'Metallic weave' },
  { id: 'floral', name: 'Floral', description: 'Flower motifs' },
  { id: 'geometric', name: 'Geometric', description: 'Modern patterns' },
] as const;

export const BLOUSE_OPTIONS: readonly BlouseOption[] = [
  { id: 'classic', name: 'Classic', description: 'Standard cut' },
  { id: 'sleeveless', name: 'Sleeveless', description: 'No sleeves' },
  { id: 'elbow-sleeve', name: 'Elbow Sleeve', description: 'Mid-length' },
  { id: 'full-sleeve', name: 'Full Sleeve', description: 'Full coverage' },
] as const;

// ── Defaults ──────────────────────────────────────────────────

export const DEFAULT_STUDIO_STATE: StudioState = {
  selectedColor: COLOR_OPTIONS[0].id,
  selectedFabric: FABRIC_OPTIONS[0].id,
  selectedBorder: BORDER_OPTIONS[0].id,
  selectedPallu: PALLU_OPTIONS[0].id,
  selectedBlouse: BLOUSE_OPTIONS[0].id,
};

// ── Reducer ───────────────────────────────────────────────────

function studioReducer(state: StudioState, action: StudioAction): StudioState {
  switch (action.type) {
    case 'SET_COLOR':
      return { ...state, selectedColor: action.payload };
    case 'SET_FABRIC':
      return { ...state, selectedFabric: action.payload };
    case 'SET_BORDER':
      return { ...state, selectedBorder: action.payload };
    case 'SET_PALLU':
      return { ...state, selectedPallu: action.payload };
    case 'SET_BLOUSE':
      return { ...state, selectedBlouse: action.payload };
    case 'RESET_ALL':
      return { ...DEFAULT_STUDIO_STATE };
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────

interface StudioContextValue {
  state: StudioState;
  dispatch: React.Dispatch<StudioAction>;
}

const StudioContext = createContext<StudioContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────

interface StudioStateProviderProps {
  children: ReactNode;
}

export function StudioStateProvider({ children }: StudioStateProviderProps) {
  const [state, dispatch] = useReducer(studioReducer, DEFAULT_STUDIO_STATE);

  return (
    <StudioContext.Provider value={{ state, dispatch }}>
      {children}
    </StudioContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────

export function useStudioState(): StudioContextValue {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudioState must be used within a StudioStateProvider');
  }
  return context;
}
