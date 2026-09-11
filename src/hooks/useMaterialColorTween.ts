import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import type { MeshStandardMaterial } from 'three';

/** Sets a material's colour instantly on first mount, then gsap-tweens every colour
 * change after that — per the brand spec, colour changes must never snap. */
export function useMaterialColorTween(material: MeshStandardMaterial | null, color: string, duration = 0.35) {
  const isFirst = useRef(true);

  useEffect(() => {
    if (!material) return;

    if (isFirst.current) {
      material.color.set(color);
      isFirst.current = false;
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      material.color.set(color);
      return;
    }

    const target = new THREE.Color(color);
    gsap.to(material.color, { r: target.r, g: target.g, b: target.b, duration, ease: 'power2.out' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [material, color]);
}
