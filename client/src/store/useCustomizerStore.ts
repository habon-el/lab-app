import { create } from 'zustand';

export const placements = ['front center', 'left side', 'right side', 'brim top', 'brim underside', 'back'] as const;

type Placement = (typeof placements)[number];

type State = {
  placement: Placement;
  imageUrl?: string;
  customText: string;
  decorationType: 'embroidery' | 'patch' | 'print';
  transform: { x: number; y: number; scale: number; rotation: number };
  autoRotate: boolean;
  setImageUrl: (url?: string) => void;
  setPlacement: (placement: Placement) => void;
  setCustomText: (text: string) => void;
  setDecorationType: (type: 'embroidery' | 'patch' | 'print') => void;
  updateTransform: (patch: Partial<State['transform']>) => void;
  setAutoRotate: (val: boolean) => void;
};

export const useCustomizerStore = create<State>((set) => ({
  placement: 'front center',
  customText: '',
  decorationType: 'embroidery',
  transform: { x: 0, y: 0, scale: 1, rotation: 0 },
  autoRotate: true,
  setImageUrl: (url) => set({ imageUrl: url }),
  setPlacement: (placement) => set({ placement }),
  setCustomText: (customText) => set({ customText }),
  setDecorationType: (decorationType) => set({ decorationType }),
  updateTransform: (patch) => set((s) => ({ transform: { ...s.transform, ...patch } })),
  setAutoRotate: (autoRotate) => set({ autoRotate })
}));
