export type CaseFinishId = 'raw' | 'grey' | 'black' | 'blue';
export type KeycapSetId = 'white' | 'charcoal' | 'grey-orange' | 'mono';
export type AccentId = 'orange' | 'red' | 'blue' | 'lime' | 'white';
export type SwitchId = 'linear' | 'tactile' | 'clicky';
export type PlateId = 'aluminium' | 'brass';

export interface CaseFinishOption {
  id: CaseFinishId;
  label: string;
  color: string;
}

export interface KeycapSetOption {
  id: KeycapSetId;
  label: string;
  swatch: string;
  base: string;
  mod: string;
  priceDelta: number;
}

export interface AccentOption {
  id: AccentId;
  label: string;
  color: string;
}

export interface SwitchOption {
  id: SwitchId;
  label: string;
  description: string;
  priceDelta: number;
}

export interface PlateOption {
  id: PlateId;
  label: string;
  description: string;
  color: string;
  priceDelta: number;
}

export const BASE_PRICE = 149;

export const CASE_FINISHES: CaseFinishOption[] = [
  { id: 'raw', label: 'Raw Aluminium', color: '#c7c7c2' },
  { id: 'grey', label: 'Space Grey', color: '#6e6e71' },
  { id: 'black', label: 'Graphite Black', color: '#1c1c1e' },
  { id: 'blue', label: 'Anodised Blue', color: '#28457a' },
];

export const KEYCAP_SETS: KeycapSetOption[] = [
  { id: 'white', label: 'Blank White', swatch: '#f1f1ee', base: '#f1f1ee', mod: '#f1f1ee', priceDelta: 0 },
  { id: 'charcoal', label: 'Blank Charcoal', swatch: '#3a3a3d', base: '#3a3a3d', mod: '#3a3a3d', priceDelta: 0 },
  { id: 'grey-orange', label: 'Grey / Orange', swatch: '#9a9a95', base: '#9a9a95', mod: '#9a9a95', priceDelta: 12 },
  { id: 'mono', label: 'Monochrome', swatch: '#3a3a3d', base: '#3a3a3d', mod: '#b8b8b4', priceDelta: 12 },
];

export const ACCENTS: AccentOption[] = [
  { id: 'orange', label: 'Orange', color: '#ff5a1f' },
  { id: 'red', label: 'Red', color: '#e23b2e' },
  { id: 'blue', label: 'Blue', color: '#2f6df6' },
  { id: 'lime', label: 'Lime', color: '#b6e82f' },
  { id: 'white', label: 'White', color: '#f2f2f0' },
];

export const SWITCHES: SwitchOption[] = [
  { id: 'linear', label: 'Linear 45g', description: 'smooth, quiet', priceDelta: 0 },
  { id: 'tactile', label: 'Tactile 55g', description: 'a bump, no click', priceDelta: 8 },
  { id: 'clicky', label: 'Clicky 50g', description: 'loud on purpose', priceDelta: 8 },
];

export const PLATES: PlateOption[] = [
  { id: 'aluminium', label: 'Aluminium', description: 'crisp, bright', color: '#d9d9d6', priceDelta: 0 },
  { id: 'brass', label: 'Brass', description: 'deeper, softer', color: '#b08d57', priceDelta: 15 },
];

export function findOption<T extends { id: string }>(options: T[], id: string): T {
  const found = options.find((o) => o.id === id);
  if (!found) throw new Error(`Unknown option id: ${id}`);
  return found;
}
