import { RoundedBox } from '@react-three/drei';
import type { Group, MeshStandardMaterial } from 'three';
import type { PlacedKey } from './layout';
import { U } from './layout';
import { KEY_HEIGHT, KEY_DEPTH, KEY_RADIUS, KEY_SMOOTHNESS, KEY_FOOTPRINT_SHRINK, TRAY_FLOOR_Y } from './dimensions';

interface KeycapProps {
  keyDef: PlacedKey;
  color: string;
  groupRef?: (el: Group | null) => void;
  materialRef?: (el: MeshStandardMaterial | null) => void;
}

export function Keycap({ keyDef, color, groupRef, materialRef }: KeycapProps) {
  const width = keyDef.w * U - KEY_FOOTPRINT_SHRINK;

  return (
    <group ref={groupRef} position={[keyDef.x, TRAY_FLOOR_Y + KEY_HEIGHT / 2, keyDef.z]}>
      <RoundedBox
        args={[width, KEY_HEIGHT, KEY_DEPTH]}
        radius={KEY_RADIUS}
        smoothness={KEY_SMOOTHNESS}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial ref={materialRef} color={color} metalness={0} roughness={0.55} />
      </RoundedBox>
      {keyDef.home && (
        <mesh position={[0, KEY_HEIGHT / 2 - 0.15, KEY_DEPTH / 2 - 3]} castShadow>
          <boxGeometry args={[4, 0.4, 1]} />
          <meshStandardMaterial color={color} metalness={0} roughness={0.55} />
        </mesh>
      )}
    </group>
  );
}
