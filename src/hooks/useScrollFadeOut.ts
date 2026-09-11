import { useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Fades `fadeEl` from opaque to fully invisible as `triggerEl` scrolls out, completing
 * well before the trigger section's own bottom edge — so whatever comes after it never
 * has this content still faintly visible ("ghosting") behind it. Once opacity hits 0 the
 * element is also switched to `visibility: hidden` so it's out of the paint/hit-test tree
 * entirely, not just transparent. Respects prefers-reduced-motion (instant, no scrub). */
export function useScrollFadeOut(triggerRef: React.RefObject<HTMLElement | null>, fadeRef: React.RefObject<HTMLElement | null>) {
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const triggerEl = triggerRef.current;
    const fadeEl = fadeRef.current;
    if (!triggerEl || !fadeEl) return;

    if (reducedMotionRef.current) {
      fadeEl.style.opacity = '1';
      fadeEl.style.visibility = 'visible';
      return;
    }

    const st = ScrollTrigger.create({
      trigger: triggerEl,
      start: 'top top',
      end: '65% top',
      scrub: true,
      onUpdate: (self) => {
        const opacity = 1 - self.progress;
        fadeEl.style.opacity = String(opacity);
        fadeEl.style.visibility = opacity <= 0.01 ? 'hidden' : 'visible';
      },
    });

    return () => st.kill();
  }, [triggerRef, fadeRef]);
}
