import { create } from 'zustand';
import type { AccentId, CaseFinishId, KeycapSetId, PlateId, SwitchId } from './options';
import { BASE_PRICE, CASE_FINISHES, KEYCAP_SETS, PLATES, SWITCHES, findOption } from './options';

interface ConfiguratorState {
  caseFinish: CaseFinishId;
  keycaps: KeycapSetId;
  accent: AccentId;
  switches: SwitchId;
  plate: PlateId;
  exploded: boolean;
  setCaseFinish: (v: CaseFinishId) => void;
  setKeycaps: (v: KeycapSetId) => void;
  setAccent: (v: AccentId) => void;
  setSwitches: (v: SwitchId) => void;
  setPlate: (v: PlateId) => void;
  toggleExploded: () => void;
  setExploded: (v: boolean) => void;
}

export const useConfiguratorStore = create<ConfiguratorState>((set) => ({
  caseFinish: 'raw',
  keycaps: 'white',
  accent: 'orange',
  switches: 'linear',
  plate: 'aluminium',
  exploded: false,
  setCaseFinish: (v) => set({ caseFinish: v }),
  setKeycaps: (v) => set({ keycaps: v }),
  setAccent: (v) => set({ accent: v }),
  setSwitches: (v) => set({ switches: v }),
  setPlate: (v) => set({ plate: v }),
  toggleExploded: () => set((s) => ({ exploded: !s.exploded })),
  setExploded: (v) => set({ exploded: v }),
}));

export function computePrice(state: Pick<ConfiguratorState, 'keycaps' | 'switches' | 'plate'>): number {
  const keycapDelta = findOption(KEYCAP_SETS, state.keycaps).priceDelta;
  const switchDelta = findOption(SWITCHES, state.switches).priceDelta;
  const plateDelta = findOption(PLATES, state.plate).priceDelta;
  return BASE_PRICE + keycapDelta + switchDelta + plateDelta;
}

export function getCaseFinishColor(id: CaseFinishId): string {
  return findOption(CASE_FINISHES, id).color;
}
