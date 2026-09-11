import * as THREE from 'three';

const ATLAS_SIZE = 1024;
const COLS = 10;
const ROWS = 9;
const CELL_W = ATLAS_SIZE / COLS;
const CELL_H = ATLAS_SIZE / ROWS;
// Destination legend planes should share this aspect so mapping a cell onto one never
// stretches the glyph.
export const LEGEND_CELL_ASPECT = CELL_W / CELL_H;

function buildLabelMap(): Record<string, string> {
  const map: Record<string, string> = {
    Escape: 'Esc',
    PrintScreen: 'PrtSc',
    ScrollLock: 'ScrLk',
    Pause: 'Pause',
    Backquote: '`',
    Minus: '-',
    Equal: '=',
    Backspace: 'Backspace',
    Tab: 'Tab',
    BracketLeft: '[',
    BracketRight: ']',
    Backslash: '\\',
    CapsLock: 'Caps',
    Semicolon: ';',
    Quote: "'",
    Enter: 'Enter',
    ShiftLeft: 'Shift',
    ShiftRight: 'Shift',
    Comma: ',',
    Period: '.',
    Slash: '/',
    ControlLeft: 'Ctrl',
    ControlRight: 'Ctrl',
    MetaLeft: 'Win',
    MetaRight: 'Win',
    AltLeft: 'Alt',
    AltRight: 'Alt',
    ContextMenu: 'Menu',
    Insert: 'Ins',
    Home: 'Home',
    PageUp: 'PgUp',
    Delete: 'Del',
    End: 'End',
    PageDown: 'PgDn',
    ArrowUp: '↑',
    ArrowLeft: '←',
    ArrowDown: '↓',
    ArrowRight: '→',
    // Space is deliberately absent — spacebar carries no legend.
  };
  for (let i = 1; i <= 12; i++) map[`F${i}`] = `F${i}`;
  for (let c = 65; c <= 90; c++) {
    const letter = String.fromCharCode(c);
    map[`Key${letter}`] = letter;
  }
  for (let d = 0; d <= 9; d++) map[`Digit${d}`] = String(d);
  return map;
}

export const KEY_LABELS: Record<string, string> = buildLabelMap();

export interface UVRect {
  u0: number;
  v0: number;
  u1: number;
  v1: number;
}

export interface LegendAtlas {
  texture: THREE.CanvasTexture;
  getRect(keyId: string): UVRect | null;
}

let cached: LegendAtlas | null = null;

function drawAtlas(ctx: CanvasRenderingContext2D, cellIndex: Map<string, number>) {
  ctx.clearRect(0, 0, ATLAS_SIZE, ATLAS_SIZE);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  cellIndex.forEach((index, text) => {
    const col = index % COLS;
    const row = Math.floor(index / COLS);
    const cx = col * CELL_W + CELL_W / 2;
    const cy = row * CELL_H + CELL_H / 2 + 2; // small optical baseline nudge

    let fontSize = text.length <= 1 ? 60 : text.length <= 4 ? 34 : 22;
    const maxWidth = CELL_W * 0.8;
    ctx.font = `600 ${fontSize}px "IBM Plex Mono", monospace`;
    while (ctx.measureText(text).width > maxWidth && fontSize > 10) {
      fontSize -= 2;
      ctx.font = `600 ${fontSize}px "IBM Plex Mono", monospace`;
    }
    ctx.fillText(text, cx, cy);
  });
}

/** One shared canvas texture atlas holding every keycap legend glyph, drawn in white on
 * transparent so any key's material colour tints it — this is what lets 87 keys reuse a
 * single texture instead of needing one each. Built once (module-level singleton). */
export function getLegendAtlas(): LegendAtlas {
  if (cached) return cached;

  const uniqueTexts = Array.from(new Set(Object.values(KEY_LABELS)));
  const cellIndex = new Map<string, number>();
  uniqueTexts.forEach((t, i) => cellIndex.set(t, i));

  const canvas = document.createElement('canvas');
  canvas.width = ATLAS_SIZE;
  canvas.height = ATLAS_SIZE;
  const ctx = canvas.getContext('2d')!;
  drawAtlas(ctx, cellIndex);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  texture.colorSpace = THREE.SRGBColorSpace;

  // The atlas is drawn immediately with whatever font is available so there's never a
  // blank frame; if IBM Plex Mono is still downloading, redraw once it's ready.
  if ('fonts' in document) {
    document.fonts.load('600 32px "IBM Plex Mono"').then(() => {
      drawAtlas(ctx, cellIndex);
      texture.needsUpdate = true;
    });
  }

  function getRect(keyId: string): UVRect | null {
    const text = KEY_LABELS[keyId];
    if (!text) return null;
    const index = cellIndex.get(text);
    if (index === undefined) return null;
    const col = index % COLS;
    const row = Math.floor(index / COLS);
    const u0 = col / COLS;
    const u1 = (col + 1) / COLS;
    // CanvasTexture defaults to flipY=true: canvas row 0 (top) maps to v=1.
    const v0 = 1 - (row + 1) / ROWS;
    const v1 = 1 - row / ROWS;
    return { u0, v0, u1, v1 };
  }

  cached = { texture, getRect };
  return cached;
}
