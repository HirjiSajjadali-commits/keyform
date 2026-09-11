import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Keyboard } from './Keyboard';
import { CameraRig } from './CameraRig';
import { CASE_WIDTH, CASE_DEPTH, CASE_BOTTOM_Y, SCENE_SCALE } from './dimensions';
import { SceneEffects } from './SceneEffects';
import { useEased } from '../hooks/useEased';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useIsMobile } from '../hooks/useIsMobile';
import { useCanvasVisibility } from '../hooks/useCanvasVisibility';
import { useCameraPose } from '../hooks/useCameraPose';

const CONTACT_SHADOW_Y = CASE_BOTTOM_Y * SCENE_SCALE - 0.002;
const CONTACT_SHADOW_SCALE: [number, number] = [CASE_WIDTH * SCENE_SCALE * 1.6, CASE_DEPTH * SCENE_SCALE * 2];

interface KeyboardSceneProps {
  theme: 'light' | 'dark';
  caseColor: string;
  keycapColor: string;
  modColor: string;
  accentColor: string;
  plateColor: string;
  legendColor: string | null;
  modLegendColor: string | null;
  accentLegendColor: string | null;
}

const THEME_BG: Record<'light' | 'dark', string> = { light: '#f4f4f2', dark: '#0a0a0b' };
const THEME_ENV_INTENSITY: Record<'light' | 'dark', number> = { light: 0.9, dark: 0.5 };
const THEME_SHADOW_OPACITY: Record<'light' | 'dark', number> = { light: 0.35, dark: 0.5 };

export function KeyboardScene({
  theme,
  caseColor,
  keycapColor,
  modColor,
  accentColor,
  plateColor,
  legendColor,
  modLegendColor,
  accentLegendColor,
}: KeyboardSceneProps) {
  const shadowOpacity = useEased(THEME_SHADOW_OPACITY[theme]);
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const canvasVisible = useCanvasVisibility();
  const pose = useCameraPose();

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
      <PerspectiveCamera makeDefault fov={35} />
      <CameraRig pose={pose} isMobile={isMobile} reducedMotion={reducedMotion} />
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
          legendColor={legendColor}
          modLegendColor={modLegendColor}
          accentLegendColor={accentLegendColor}
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
