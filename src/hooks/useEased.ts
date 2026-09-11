import { useEffect, useRef, useState } from 'react';

/** Eases a numeric value toward `target` over `duration` ms — used for scene-level
 * properties (contact-shadow opacity, etc.) that need to crossfade on theme toggle
 * instead of snapping. */
export function useEased(target: number, duration = 350) {
  const [value, setValue] = useState(target);
  const raf = useRef<number | undefined>(undefined);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setValue(target);
      return;
    }

    const from = value;
    const to = target;
    const t0 = performance.now();

    function tick(now: number) {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(from + (to - from) * eased);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return value;
}
