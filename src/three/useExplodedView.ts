import { useEffect } from 'react';
import gsap from 'gsap';
import type { Group } from 'three';
import { KEY_LAYOUT } from './layout';
import { CASE_CENTER_X, CASE_CENTER_Z, TRAY_FLOOR_Y, KEY_HEIGHT } from './dimensions';
import { useScrollStoryStore } from '../store/scrollStory';

const KEY_REST_Y = TRAY_FLOOR_Y + KEY_HEIGHT / 2;

const CASE_DROP = -18;
const PLATE_RISE = 8;
const KEY_RISE = 22;
const STAGGER_PER_MM = 0.004;
const DURATION = 1;
const EASE = 'power3.inOut';

const keyById = new Map(KEY_LAYOUT.map((k) => [k.id, k]));

export interface ExplodedRefs {
  caseGroup: Group | null;
  plateGroup: Group | null;
  keyGroups: Map<string, Group>;
}

/** Drives the exploded-view GSAP timeline: case drops, plate separates, keycaps rise in a
 * staggered wave keyed off distance from the board's centre. Reverses cleanly since every
 * tween targets an absolute position rather than a relative offset. */
export function useExplodedView(getRefs: () => ExplodedRefs, exploded: boolean) {
  useEffect(() => {
    if (useScrollStoryStore.getState().active) return;

    const refs = getRefs();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reducedMotion ? 0 : DURATION;
    const tl = gsap.timeline();

    if (refs.caseGroup) {
      tl.to(refs.caseGroup.position, { y: exploded ? CASE_DROP : 0, duration, ease: EASE }, 0);
    }
    if (refs.plateGroup) {
      tl.to(refs.plateGroup.position, { y: exploded ? PLATE_RISE : 0, duration, ease: EASE }, 0);
    }
    refs.keyGroups.forEach((group, id) => {
      const keyDef = keyById.get(id);
      if (!keyDef) return;
      const dist = Math.hypot(keyDef.x - CASE_CENTER_X, keyDef.z - CASE_CENTER_Z);
      const delay = reducedMotion ? 0 : dist * STAGGER_PER_MM;
      tl.to(group.position, { y: exploded ? KEY_REST_Y + KEY_RISE : KEY_REST_Y, duration, ease: EASE }, delay);
    });

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exploded]);
}
