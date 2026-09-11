import { create } from 'zustand';

interface AudioState {
  muted: boolean;
  toggleMuted: () => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  muted: false,
  toggleMuted: () => set((s) => ({ muted: !s.muted })),
}));
