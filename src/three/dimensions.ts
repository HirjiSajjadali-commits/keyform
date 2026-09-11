import { BOARD_WIDTH_MM, BOARD_DEPTH_MM } from './layout';

export const SCENE_SCALE = 0.01; // 1 Three.js unit = 100mm — keeps the scene in a sane
// range for default camera/shadow/light parameters instead of working in raw millimetres.

export const KEY_HEIGHT = 9;
export const KEY_DEPTH = 18;
export const KEY_RADIUS = 1.2;
export const KEY_SMOOTHNESS = 4;
export const KEY_FOOTPRINT_SHRINK = 1; // mm shaved off each key's u-width footprint

export const CASE_HEIGHT = 22;
export const CASE_CORNER_RADIUS = 3;
export const RECESS_DEPTH = 7; // added in Phase 2 — keys sit this far below the case rim

export const MARGIN_BACK = 10; // function-row side
export const MARGIN_SIDE = 9;
export const MARGIN_FRONT = 14; // spacebar side

export const TRAY_FLOOR_Y = 0;
export const CASE_TOP_Y = TRAY_FLOOR_Y + RECESS_DEPTH;
export const CASE_BOTTOM_Y = CASE_TOP_Y - CASE_HEIGHT;
export const BASE_SLAB_HEIGHT = CASE_HEIGHT - RECESS_DEPTH;

export const PLATE_TRIM_WIDTH = 2;
export const PLATE_TRIM_HEIGHT = 0.8;

export const CASE_WIDTH = BOARD_WIDTH_MM + MARGIN_SIDE * 2;
export const CASE_DEPTH = BOARD_DEPTH_MM + MARGIN_BACK + MARGIN_FRONT;

// Case footprint in board-local (un-centered) space runs x: -MARGIN_SIDE..BOARD_WIDTH_MM+MARGIN_SIDE,
// z: -MARGIN_BACK..BOARD_DEPTH_MM+MARGIN_FRONT. These are that footprint's center.
export const CASE_CENTER_X = BOARD_WIDTH_MM / 2;
export const CASE_CENTER_Z = (BOARD_DEPTH_MM + MARGIN_FRONT - MARGIN_BACK) / 2;

export const BOARD_TILT_DEG = 6;

// Bounding sphere (in mm, board-local) sized to comfortably contain the board in every
// state the camera needs to frame — assembled AND fully exploded (case drops 18mm,
// keycaps rise 22mm — see useExplodedView.ts). A sphere is a deliberately conservative
// (not tightest-possible) fit: it's rotation-invariant, so "does the whole board fit"
// stays true regardless of the camera's orbit angle, which a tight box fit wouldn't
// guarantee without also tracking orientation.
const EXPLODED_CASE_DROP = 18;
const EXPLODED_KEY_RISE = 22;
const BOUNDING_MIN_Y = CASE_BOTTOM_Y - EXPLODED_CASE_DROP;
const BOUNDING_MAX_Y = TRAY_FLOOR_Y + KEY_HEIGHT + EXPLODED_KEY_RISE;

export const BOARD_BOUNDING_RADIUS_MM = Math.hypot(CASE_WIDTH / 2, CASE_DEPTH / 2, (BOUNDING_MAX_Y - BOUNDING_MIN_Y) / 2);
