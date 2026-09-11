import { RoundedBox } from '@react-three/drei';
import type { MeshStandardMaterial } from 'three';
import { CASE_WIDTH, CASE_DEPTH, CASE_HEIGHT, CASE_CORNER_RADIUS, CASE_CENTER_X, CASE_CENTER_Z, CASE_BOTTOM_Y } from './dimensions';

interface CaseProps {
  color: string;
  materialRef?: (el: MeshStandardMaterial | null) => void;
}

export function Case({ color, materialRef }: CaseProps) {
  const centerY = CASE_BOTTOM_Y + CASE_HEIGHT / 2;

  return (
    <RoundedBox
      args={[CASE_WIDTH, CASE_HEIGHT, CASE_DEPTH]}
      radius={CASE_CORNER_RADIUS}
      smoothness={4}
      position={[CASE_CENTER_X, centerY, CASE_CENTER_Z]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial ref={materialRef} color={color} metalness={0.85} roughness={0.32} />
    </RoundedBox>
  );
}
