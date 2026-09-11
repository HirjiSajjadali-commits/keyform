import { create } from 'zustand';

interface ScrollStoryState {
  active: boolean;
  beat: number;
  setActive: (active: boolean) => void;
  setBeat: (beat: number) => void;
}

/** Whether the "Made" scroll story currently owns the 3D board's explode state — while
 * true, the Configurator's manual exploded-view toggle stands down to avoid fighting it.
 * `beat` (0-3) drives which caption is shown. */
export const useScrollStoryStore = create<ScrollStoryState>((set) => ({
  active: false,
  beat: 0,
  setActive: (active) => set({ active }),
  setBeat: (beat) => set({ beat }),
}));
