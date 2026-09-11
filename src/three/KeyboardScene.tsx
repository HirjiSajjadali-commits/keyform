import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Keyboard } from './Keyboard';
import { CASE_WIDTH, CASE_DEPTH, CASE_BOTTOM_Y } from './dimensions';
import { SceneEffects } from './SceneEffects';
import { useEased } from '../hooks/useEased';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useIsMobile } from '../hooks/useIsMobile';
import { useCanvasVisibility } from '../hooks/useCanvasVisibility';

export const SCENE_SCALE = 0.01; // 1 Three.js unit = 100mm — keeps the scene in a sane
// range for default camera/shadow/light parameters instead of working in raw millimetres.

const BOARD_SCALE = CASE_WIDTH * SCENE_SCALE;
const CAMERA_POSITION: [number, number, number] = [0.35 * BOARD_SCALE, 0.28 * BOARD_SCALE, 0.55 * BOARD_SCALE];
const CAMERA_DISTANCE = Math.hypot(...CAMERA_POSITION);

const CONTACT_SHADOW_Y = CASE_BOTTOM_Y * SCENE_SCALE - 0.002;
const CONTACT_SHADOW_SCALE: [number, number] = [CASE_WIDTH * SCENE_SCALE * 1.6, CASE_DEPTH * SCENE_SCALE * 2];

interface KeyboardSceneProps {
  theme: 'light' | 'dark';
  caseColor: string;
  keycapColor: string;
  modColor: string;
  accentColor: string;
  plateColor: string;
}

const THEME_BG: Record<'light' | 'dark', string> = { light: '#f4f4f2', dark: '#0a0a0b' };
const THEME_ENV_INTENSITY: Record<'light' | 'dark', number> = { light: 0.9, dark: 0.5 };
const THEME_SHADOW_OPACITY: Record<'light' | 'dark', number> = { light: 0.35, dark: 0.5 };

export function KeyboardScene({ theme, caseColor, keycapColor, modColor, accentColor, plateColor }: KeyboardSceneProps) {
  const [autoRotate, setAutoRotate] = useState(true);
  const shadowOpacity = useEased(THEME_SHADOW_OPACITY[theme]);
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const canvasVisible = useCanvasVisibility();

  return (
    <Canvas
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      frameloop={canvasVisible ? 'always' : 'demand'}
      shadows={{ type: THREE.VSMShadowMap }}
      gl={{
        powerPreference: 'high-performance',
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
      }}
    >
      <SceneEffects backgroundColor={THEME_BG[theme]} environmentIntensity={THEME_ENV_INTENSITY[theme]} />
      <PerspectiveCamera makeDefault fov={35} position={CAMERA_POSITION} />
      <OrbitControls
        enablePan={false}
        enableZoom={!isMobile}
        minDistance={CAMERA_DISTANCE * 0.7}
        maxDistance={CAMERA_DISTANCE * 1.3}
        minPolarAngle={0.6}
        maxPolarAngle={1.45}
        enableDamping
        dampingFactor={0.08}
        autoRotate={!reducedMotion && autoRotate}
        autoRotateSpeed={0.6}
        onStart={() => setAutoRotate(false)}
      />
      <ambientLight intensity={0.3} />
      <directionalLight position={[2, 3, 2]} intensity={1.4} castShadow shadow-mapSize={[2048, 2048]} shadow-radius={12} />
      <Suspense fallback={null}>
        <Environment preset="studio" />
      </Suspense>
      <group scale={SCENE_SCALE}>
        <Keyboard
          caseColor={caseColor}
          keycapColor={keycapColor}
          modColor={modColor}
          accentColor={accentColor}
          plateColor={plateColor}
        />
      </group>
      <ContactShadows
        position={[0, CONTACT_SHADOW_Y, 0]}
        scale={CONTACT_SHADOW_SCALE}
        blur={2.5}
        far={0.4}
        resolution={isMobile ? 512 : 1024}
        opacity={shadowOpacity}
      />
    </Canvas>
  );
}
