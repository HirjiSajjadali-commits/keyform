/**
 * Data-driven ANSI TKL layout. Nothing here is hand-placed: each row is a list of key
 * widths (in u) and gaps, laid out left-to-right by `layoutRow`, then the main block,
 * nav cluster and arrow cluster are positioned relative to one another in mm.
 */

export const U = 19.05; // mm per key unit (1u)

export type KeyType = 'default' | 'accent' | 'mod';

export interface KeyDef {
  id: string;
  code: string;
  w?: number;
  type?: KeyType;
  home?: boolean; // F/J nub
}

type RowEntry = KeyDef | { gap: number };

export interface PlacedKey {
  id: string;
  code: string;
  w: number;
  type: KeyType;
  home: boolean;
  x: number; // mm, center, board-local (before centering offset)
  z: number; // mm, center, board-local. 0 = back edge (function row), increases toward front (spacebar)
}

function isGap(entry: RowEntry): entry is { gap: number } {
  return 'gap' in entry;
}

function key(id: string, code: string, opts: Partial<Omit<KeyDef, 'id' | 'code'>> = {}): KeyDef {
  return { id, code, ...opts };
}

const FUNCTION_ROW: RowEntry[] = [
  key('Escape', 'Escape', { type: 'accent' }),
  { gap: 0.5 },
  key('F1', 'F1'),
  key('F2', 'F2'),
  key('F3', 'F3'),
  key('F4', 'F4'),
  { gap: 0.5 },
  key('F5', 'F5'),
  key('F6', 'F6'),
  key('F7', 'F7'),
  key('F8', 'F8'),
  { gap: 0.5 },
  key('F9', 'F9'),
  key('F10', 'F10'),
  key('F11', 'F11'),
  key('F12', 'F12'),
  { gap: 0.5 },
  key('PrintScreen', 'PrintScreen'),
  key('ScrollLock', 'ScrollLock'),
  key('Pause', 'Pause'),
];

const NUMBER_ROW: RowEntry[] = [
  key('Backquote', 'Backquote'),
  key('Digit1', 'Digit1'),
  key('Digit2', 'Digit2'),
  key('Digit3', 'Digit3'),
  key('Digit4', 'Digit4'),
  key('Digit5', 'Digit5'),
  key('Digit6', 'Digit6'),
  key('Digit7', 'Digit7'),
  key('Digit8', 'Digit8'),
  key('Digit9', 'Digit9'),
  key('Digit0', 'Digit0'),
  key('Minus', 'Minus'),
  key('Equal', 'Equal'),
  key('Backspace', 'Backspace', { w: 2, type: 'mod' }),
];

const TOP_ROW: RowEntry[] = [
  key('Tab', 'Tab', { w: 1.5, type: 'mod' }),
  key('KeyQ', 'KeyQ'),
  key('KeyW', 'KeyW'),
  key('KeyE', 'KeyE'),
  key('KeyR', 'KeyR'),
  key('KeyT', 'KeyT'),
  key('KeyY', 'KeyY'),
  key('KeyU', 'KeyU'),
  key('KeyI', 'KeyI'),
  key('KeyO', 'KeyO'),
  key('KeyP', 'KeyP'),
  key('BracketLeft', 'BracketLeft'),
  key('BracketRight', 'BracketRight'),
  key('Backslash', 'Backslash', { w: 1.5, type: 'mod' }),
];

const HOME_ROW: RowEntry[] = [
  key('CapsLock', 'CapsLock', { w: 1.75, type: 'mod' }),
  key('KeyA', 'KeyA'),
  key('KeyS', 'KeyS'),
  key('KeyD', 'KeyD'),
  key('KeyF', 'KeyF', { home: true }),
  key('KeyG', 'KeyG'),
  key('KeyH', 'KeyH'),
  key('KeyJ', 'KeyJ', { home: true }),
  key('KeyK', 'KeyK'),
  key('KeyL', 'KeyL'),
  key('Semicolon', 'Semicolon'),
  key('Quote', 'Quote'),
  key('Enter', 'Enter', { w: 2.25, type: 'mod' }),
];

const BOTTOM_ROW: RowEntry[] = [
  key('ShiftLeft', 'ShiftLeft', { w: 2.25, type: 'mod' }),
  key('KeyZ', 'KeyZ'),
  key('KeyX', 'KeyX'),
  key('KeyC', 'KeyC'),
  key('KeyV', 'KeyV'),
  key('KeyB', 'KeyB'),
  key('KeyN', 'KeyN'),
  key('KeyM', 'KeyM'),
  key('Comma', 'Comma'),
  key('Period', 'Period'),
  key('Slash', 'Slash'),
  key('ShiftRight', 'ShiftRight', { w: 2.75, type: 'mod' }),
];

const MOD_ROW: RowEntry[] = [
  key('ControlLeft', 'ControlLeft', { w: 1.25, type: 'mod' }),
  key('MetaLeft', 'MetaLeft', { w: 1.25, type: 'mod' }),
  key('AltLeft', 'AltLeft', { w: 1.25, type: 'mod' }),
  key('Space', 'Space', { w: 6.25, type: 'accent' }),
  key('AltRight', 'AltRight', { w: 1.25, type: 'mod' }),
  key('MetaRight', 'MetaRight', { w: 1.25, type: 'mod' }),
  key('ContextMenu', 'ContextMenu', { w: 1.25, type: 'mod' }),
  key('ControlRight', 'ControlRight', { w: 1.25, type: 'mod' }),
];

const MAIN_ROWS = [FUNCTION_ROW, NUMBER_ROW, TOP_ROW, HOME_ROW, BOTTOM_ROW, MOD_ROW];

// Gaps (in u) between consecutive row centers-of-depth: function->number carries an extra
// 0.5u breathing gap, every other row-to-row pitch is a plain 1u.
const ROW_PITCH_U = [1.5, 1, 1, 1, 1];

function layoutRow(entries: RowEntry[], z: number): PlacedKey[] {
  const placed: PlacedKey[] = [];
  let cursor = 0;
  for (const entry of entries) {
    if (isGap(entry)) {
      cursor += entry.gap;
      continue;
    }
    const w = entry.w ?? 1;
    const x = (cursor + w / 2) * U;
    placed.push({
      id: entry.id,
      code: entry.code,
      w,
      type: entry.type ?? 'default',
      home: entry.home ?? false,
      x,
      z,
    });
    cursor += w;
  }
  return placed;
}

export const MAIN_BLOCK_WIDTH_U = 15; // number/top/home/bottom/mod rows all sum to 15u
export const NAV_GUTTER_U = 0.25;
export const NAV_BLOCK_WIDTH_U = 3;

const ROW_Z: number[] = (() => {
  const zs: number[] = [0];
  for (const gap of ROW_PITCH_U) zs.push(zs[zs.length - 1] + gap * U);
  return zs;
})();
const [, Z_NUMBER, Z_TOP, , Z_BOTTOM, Z_MOD] = ROW_Z;

function buildMainBlock(): PlacedKey[] {
  const keys: PlacedKey[] = [];
  MAIN_ROWS.forEach((row, i) => keys.push(...layoutRow(row, ROW_Z[i])));
  return keys;
}

function buildNavCluster(): PlacedKey[] {
  const navX0 = (MAIN_BLOCK_WIDTH_U + NAV_GUTTER_U) * U;
  const col = (i: number) => navX0 + (i + 0.5) * U;
  const row = (ids: [string, string][], z: number): PlacedKey[] =>
    ids.map(([id, code], i) => ({ id, code, w: 1, type: 'default', home: false, x: col(i), z }));

  return [
    ...row(
      [
        ['Insert', 'Insert'],
        ['Home', 'Home'],
        ['PageUp', 'PageUp'],
      ],
      Z_NUMBER,
    ),
    ...row(
      [
        ['Delete', 'Delete'],
        ['End', 'End'],
        ['PageDown', 'PageDown'],
      ],
      Z_TOP,
    ),
  ];
}

function buildArrowCluster(): PlacedKey[] {
  const navX0 = (MAIN_BLOCK_WIDTH_U + NAV_GUTTER_U) * U;
  const col = (i: number) => navX0 + (i + 0.5) * U;

  return [
    { id: 'ArrowUp', code: 'ArrowUp', w: 1, type: 'accent', home: false, x: col(1), z: Z_BOTTOM },
    { id: 'ArrowLeft', code: 'ArrowLeft', w: 1, type: 'accent', home: false, x: col(0), z: Z_MOD },
    { id: 'ArrowDown', code: 'ArrowDown', w: 1, type: 'accent', home: false, x: col(1), z: Z_MOD },
    { id: 'ArrowRight', code: 'ArrowRight', w: 1, type: 'accent', home: false, x: col(2), z: Z_MOD },
  ];
}

export const KEY_LAYOUT: PlacedKey[] = [...buildMainBlock(), ...buildNavCluster(), ...buildArrowCluster()];

export const BOARD_WIDTH_U = MAIN_BLOCK_WIDTH_U + NAV_GUTTER_U + NAV_BLOCK_WIDTH_U;
export const BOARD_DEPTH_U = ROW_Z[ROW_Z.length - 1] / U + 1; // last row center + its own 1u depth

export const BOARD_WIDTH_MM = BOARD_WIDTH_U * U;
export const BOARD_DEPTH_MM = BOARD_DEPTH_U * U;

// Centers of the full key layout in board-local space — used to re-center the board on
// the origin so camera framing and case margins are symmetric.
export const BOARD_CENTER_X = BOARD_WIDTH_MM / 2;
export const BOARD_CENTER_Z = BOARD_DEPTH_MM / 2;
