import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Keyboard } from './Keyboard';
import { CASE_WIDTH } from './dimensions';

export const SCENE_SCALE = 0.01; // 1 Three.js unit = 100mm — keeps the scene in a sane
// range for default camera/shadow/light parameters instead of working in raw millimetres.

const BOARD_SCALE = CASE_WIDTH * SCENE_SCALE;
const CAMERA_POSITION: [number, number, number] = [0.35 * BOARD_SCALE, 0.28 * BOARD_SCALE, 0.55 * BOARD_SCALE];
const CAMERA_DISTANCE = Math.hypot(...CAMERA_POSITION);

interface KeyboardSceneProps {
  backgroundColor: string;
}

export function KeyboardScene({ backgroundColor }: KeyboardSceneProps) {
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <Canvas dpr={[1, 2]} gl={{ powerPreference: 'high-performance', antialias: true }} shadows>
      <color attach="background" args={[backgroundColor]} />
      <PerspectiveCamera makeDefault fov={35} position={CAMERA_POSITION} />
      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={CAMERA_DISTANCE * 0.7}
        maxDistance={CAMERA_DISTANCE * 1.3}
        minPolarAngle={0.6}
        maxPolarAngle={1.45}
        enableDamping
        dampingFactor={0.08}
        autoRotate={autoRotate}
        autoRotateSpeed={0.6}
        onStart={() => setAutoRotate(false)}
      />
      <ambientLight intensity={0.4} />
      <directionalLight position={[2, 3, 2]} intensity={1} castShadow />
      <Suspense fallback={null}>
        <Environment preset="studio" />
      </Suspense>
      <group scale={SCENE_SCALE}>
        <Keyboard caseColor="#C7C7C2" keycapColor="#F2F2F0" />
      </group>
    </Canvas>
  );
}
