import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ColoredMaterial {
  color: THREE.Color;
}

/** Sets a material's colour instantly on first mount, then gsap-tweens every colour
 * change after that — per the brand spec, colour changes must never snap. Works with any
 * material that has a `.color` (MeshStandardMaterial, MeshBasicMaterial, ...). */
export function useMaterialColorTween(material: ColoredMaterial | null, color: string, duration = 0.35) {
  const isFirst = useRef(true);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    if (!material) return;

    if (isFirst.current) {
      material.color.set(color);
      isFirst.current = false;
      invalidate();
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      material.color.set(color);
      invalidate();
      return;
    }

    const target = new THREE.Color(color);
    gsap.to(material.color, { r: target.r, g: target.g, b: target.b, duration, ease: 'power2.out', onUpdate: invalidate });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [material, color]);
}
