import { BOARD_WIDTH_MM, BOARD_DEPTH_MM } from './layout';

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

// Phase 1: keys sit directly on a flat-topped slab. Phase 2 recesses the rim above this
// same floor height, so nothing here needs to move when the recess is added.
export const TRAY_FLOOR_Y = 0;
export const CASE_TOP_Y = TRAY_FLOOR_Y; // Phase 2: TRAY_FLOOR_Y + RECESS_DEPTH
export const CASE_BOTTOM_Y = CASE_TOP_Y - CASE_HEIGHT;

export const CASE_WIDTH = BOARD_WIDTH_MM + MARGIN_SIDE * 2;
export const CASE_DEPTH = BOARD_DEPTH_MM + MARGIN_BACK + MARGIN_FRONT;

// Case footprint in board-local (un-centered) space runs x: -MARGIN_SIDE..BOARD_WIDTH_MM+MARGIN_SIDE,
// z: -MARGIN_BACK..BOARD_DEPTH_MM+MARGIN_FRONT. These are that footprint's center.
export const CASE_CENTER_X = BOARD_WIDTH_MM / 2;
export const CASE_CENTER_Z = (BOARD_DEPTH_MM + MARGIN_FRONT - MARGIN_BACK) / 2;

export const BOARD_TILT_DEG = 6;
