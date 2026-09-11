import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useThree } from '@react-three/fiber';
import type { KeyboardRefs } from './Keyboard';
import { useConfiguratorStore } from '../store/configurator';
import { useAudioStore } from '../store/audio';
import { playSwitchSound } from '../lib/switchSound';

const PRESS_OFFSET = 1.6; // mm
const PRESS_DURATION = 0.06;
const RELEASE_DURATION = 0.12;
const BRAND_ACCENT = '#ff5a1f'; // mirrors the CSS --accent token — a fixed UI feedback
// colour, independent of whatever Accent Key colour is currently configured.

function isTextInputFocused(): boolean {
  const el = document.activeElement as HTMLElement | null;
  if (!el) return false;
  return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable;
}

/** Wires window keydown/keyup to press-animate + glow the matching key mesh (event.code
 * doubles as our layout's key id) and play a switch-appropriate click.
 *
 * Deliberately keyed on event.code, not event.key: code identifies the physical key
 * position and is stable across language/layout, while key produces the actual character
 * (which would break for non-QWERTY layouts or non-Latin input). This also means the
 * Windows/Cmd key needs no special-casing for Mac — per the UI Events code spec, that
 * physical position reports code "MetaLeft"/"MetaRight" on every platform including
 * macOS, which is exactly the id our layout already uses for it.
 *
 * Any code with no matching mesh (missing nav cluster on a laptop, ISO vs ANSI layout,
 * etc.) is silently ignored below — that's an expected, not exceptional, outcome. */
export function useTypeTest(getRefs: () => KeyboardRefs) {
  const pressedCodes = useRef<Set<string>>(new Set());
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (isTextInputFocused()) return;
      if (pressedCodes.current.has(e.code)) return; // ignore OS key-repeat
      pressedCodes.current.add(e.code);

      const refs = getRefs();
      const group = refs.keyGroups.get(e.code);
      const material = refs.keyMaterials.get(e.code);
      if (!group || !material) return;

      gsap.to(group.position, { y: `-=${PRESS_OFFSET}`, duration: PRESS_DURATION, ease: 'power2.out', onUpdate: invalidate });
      material.emissive.set(BRAND_ACCENT);
      gsap.to(material, { emissiveIntensity: 0.8, duration: PRESS_DURATION, ease: 'power2.out', onUpdate: invalidate });

      if (!useAudioStore.getState().muted) {
        playSwitchSound(useConfiguratorStore.getState().switches, 'down');
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      if (!pressedCodes.current.has(e.code)) return;
      pressedCodes.current.delete(e.code);

      const refs = getRefs();
      const group = refs.keyGroups.get(e.code);
      const material = refs.keyMaterials.get(e.code);
      if (!group || !material) return;

      gsap.to(group.position, { y: `+=${PRESS_OFFSET}`, duration: RELEASE_DURATION, ease: 'power2.out', onUpdate: invalidate });
      gsap.to(material, { emissiveIntensity: 0, duration: RELEASE_DURATION, ease: 'power2.out', onUpdate: invalidate });

      if (!useAudioStore.getState().muted) {
        playSwitchSound(useConfiguratorStore.getState().switches, 'up');
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
