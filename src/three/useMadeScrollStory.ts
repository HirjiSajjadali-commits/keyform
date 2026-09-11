import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { KeyboardRefs } from './Keyboard';
import { KEY_LAYOUT } from './layout';
import { CASE_CENTER_X, CASE_CENTER_Z, TRAY_FLOOR_Y, KEY_HEIGHT } from './dimensions';
import { useConfiguratorStore } from '../store/configurator';
import { useScrollStoryStore } from '../store/scrollStory';

const KEY_REST_Y = TRAY_FLOOR_Y + KEY_HEIGHT / 2;
// Plate-only separation needs more than the button-exploded-view's 8mm to read clearly
// here — that view also drops the case and lifts every key at the same time, so its 8mm
// plate gap reads fine amid a much bigger overall spread. This story moves the plate
// alone for an entire beat (the case deliberately stays put), so it needs more of its own
// visual weight to not look identical to "assembled".
const PLATE_RISE = 30;
const KEY_RISE = 22;

// Each transitioning beat reaches its FULL amount by 60% through its own quarter of the
// scroll range, then holds there for the rest of that beat — so whichever moment the
// caption happens to be read at, the beat's state is already fully, obviously realised
// rather than still lagging in from a near-zero start (which is what made "One billet"
// and "Every key" read as visually identical before this).
const BEAT_COMPLETE_FRACTION = 0.6;
// Stagger only eats into the FIRST 30% of a beat's already-compressed rise, not half of
// it — so the farthest keys still finish rising with room to spare before the next beat
// starts reversing them.
const KEY_STAGGER_MAX_DELAY = 0.3;

const maxDist = Math.max(...KEY_LAYOUT.map((k) => Math.hypot(k.x - CASE_CENTER_X, k.z - CASE_CENTER_Z)));
const keyDistFrac = new Map(
  KEY_LAYOUT.map((k) => [k.id, Math.hypot(k.x - CASE_CENTER_X, k.z - CASE_CENTER_Z) / maxDist]),
);

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function beatProgress(overall: number, beatIndex: number) {
  const start = beatIndex * 0.25;
  return clamp01((overall - start) / (0.25 * BEAT_COMPLETE_FRACTION));
}

/** Drives the "Made" scroll story: as the section's own scroll range is scrubbed, the
 * plate and keycaps separate and reassemble across four beats (case stays put — this
 * story is about the stack, not the case dropping). Reuses the same refs the button-driven
 * exploded view uses, but writes positions directly each frame instead of tweening,
 * since ScrollTrigger's scrub already supplies the easing. */
export function useMadeScrollStory(getRefs: () => KeyboardRefs) {
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const sectionEl = document.getElementById('made');
    if (!sectionEl) return;

    function applyProgress(progress: number) {
      const refs = getRefs();
      const p2 = beatProgress(progress, 1);
      const p3 = beatProgress(progress, 2);
      const p4 = beatProgress(progress, 3);

      const plateAmount = p2 * (1 - p4);
      if (refs.plateGroup) refs.plateGroup.position.y = plateAmount * PLATE_RISE;

      refs.keyGroups.forEach((group, id) => {
        const distFrac = keyDistFrac.get(id) ?? 0;
        const delay = distFrac * KEY_STAGGER_MAX_DELAY;
        const localP3 = clamp01((p3 - delay) / (1 - delay));
        const keyAmount = localP3 * (1 - p4);
        group.position.y = KEY_REST_Y + keyAmount * KEY_RISE;
      });

      const beat = Math.min(3, Math.floor(progress * 4));
      useScrollStoryStore.getState().setBeat(beat);

      // These are raw mutations on refs, outside r3f's own reconciler — in
      // frameloop="demand" mode nothing else would tell the canvas a new frame is needed.
      invalidate();
    }

    const trigger = ScrollTrigger.create({
      trigger: sectionEl,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => applyProgress(self.progress),
      onToggle: (self) => {
        useScrollStoryStore.getState().setActive(self.isActive);
        if (self.isActive) useConfiguratorStore.getState().setExploded(false);
      },
    });

    return () => {
      trigger.kill();
      useScrollStoryStore.getState().setActive(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
