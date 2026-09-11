import { useEffect, useState } from 'react';

export type CameraPose = 'wide' | 'close';

/** 'close' while the Configurator section is substantially in view (it pairs the board
 * with a side panel, so a tighter, more "inspectable" framing reads better there);
 * 'wide' everywhere else the canvas is visible (Hero, Made) — full board, generous margin. */
export function useCameraPose(): CameraPose {
  const [pose, setPose] = useState<CameraPose>('wide');

  useEffect(() => {
    const el = document.getElementById('configure');
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => setPose(entry.intersectionRatio > 0.4 ? 'close' : 'wide'), {
      threshold: [0, 0.4, 1],
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return pose;
}
