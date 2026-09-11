import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface SceneEffectsProps {
  backgroundColor: string;
  environmentIntensity: number;
}

/** Mutates scene.background and scene.environmentIntensity toward their targets every
 * frame instead of snapping — this is what makes the theme toggle "re-light smoothly"
 * without round-tripping through React state on every frame. */
export function SceneEffects({ backgroundColor, environmentIntensity }: SceneEffectsProps) {
  const { scene } = useThree();
  const bgColor = useRef<THREE.Color>(new THREE.Color(backgroundColor));
  const bgTarget = useRef(new THREE.Color(backgroundColor));
  const envCurrent = useRef(environmentIntensity);
  const envTarget = useRef(environmentIntensity);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    bgTarget.current.set(backgroundColor);
    if (reducedMotion.current) bgColor.current.set(backgroundColor);
  }, [backgroundColor]);

  useEffect(() => {
    envTarget.current = environmentIntensity;
    if (reducedMotion.current) envCurrent.current = environmentIntensity;
  }, [environmentIntensity]);

  useFrame((_, delta) => {
    const lerpFactor = Math.min(1, delta * 6);
    bgColor.current.lerp(bgTarget.current, lerpFactor);
    scene.background = bgColor.current;

    envCurrent.current += (envTarget.current - envCurrent.current) * lerpFactor;
    scene.environmentIntensity = envCurrent.current;
  });

  return null;
}
