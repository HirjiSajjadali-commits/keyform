import { useEffect, useState } from 'react';

const WATCHED_IDS = ['top', 'configure', 'made'];

/** True while at least one of the sections that actually reveals the fixed 3D canvas
 * (Hero, Configurator, the Made scroll story) is on screen. Everywhere else on this long
 * page, an opaque section sits over the canvas, so there's nothing to render for the user
 * to see — that's the cue to stop paying for frames. */
export function useCanvasVisibility(): boolean {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const elements = WATCHED_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (elements.length === 0) return;

    const intersecting = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target);
          else intersecting.delete(entry.target);
        }
        setVisible(intersecting.size > 0);
      },
      { threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return visible;
}
