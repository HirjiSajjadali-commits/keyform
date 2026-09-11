import { useEffect, useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import {
  CASE_WIDTH,
  CASE_DEPTH,
  CASE_CORNER_RADIUS,
  CASE_CENTER_X,
  CASE_CENTER_Z,
  CASE_BOTTOM_Y,
  BASE_SLAB_HEIGHT,
  TRAY_FLOOR_Y,
  RECESS_DEPTH,
  MARGIN_BACK,
  MARGIN_FRONT,
  MARGIN_SIDE,
  PLATE_TRIM_WIDTH,
  PLATE_TRIM_HEIGHT,
} from './dimensions';
import { BOARD_WIDTH_MM, BOARD_DEPTH_MM } from './layout';

interface CaseProps {
  color: string;
  plateColor: string;
  caseMaterialRef?: (el: THREE.MeshStandardMaterial | null) => void;
  plateMaterialRef?: (el: THREE.MeshStandardMaterial | null) => void;
}

const RIM_BOTTOM_Y = TRAY_FLOOR_Y;
const RIM_HEIGHT = RECESS_DEPTH;
const RIM_CENTER_Y = RIM_BOTTOM_Y + RIM_HEIGHT / 2;
const BASE_CENTER_Y = CASE_BOTTOM_Y + BASE_SLAB_HEIGHT / 2;
const PLATE_CENTER_Y = TRAY_FLOOR_Y + PLATE_TRIM_HEIGHT / 2;

export function Case({ color, plateColor, caseMaterialRef, plateMaterialRef }: CaseProps) {
  const caseMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color, metalness: 0.85, roughness: 0.32 }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const plateMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: plateColor, metalness: 0.9, roughness: 0.25 }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const notchMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#050505', metalness: 0.2, roughness: 0.8 }),
    [],
  );

  useEffect(() => {
    caseMaterial.color.set(color);
  }, [caseMaterial, color]);
  useEffect(() => {
    plateMaterial.color.set(plateColor);
  }, [plateMaterial, plateColor]);

  useEffect(() => {
    caseMaterialRef?.(caseMaterial);
    return () => caseMaterialRef?.(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseMaterial]);
  useEffect(() => {
    plateMaterialRef?.(plateMaterial);
    return () => plateMaterialRef?.(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plateMaterial]);

  return (
    <group>
      {/* Base slab spans the full footprint at the recessed tray-floor height — this is
          what shows through as the tray floor under the keys. */}
      <RoundedBox
        args={[CASE_WIDTH, BASE_SLAB_HEIGHT, CASE_DEPTH]}
        radius={CASE_CORNER_RADIUS}
        smoothness={4}
        position={[CASE_CENTER_X, BASE_CENTER_Y, CASE_CENTER_Z]}
        material={caseMaterial}
        castShadow
        receiveShadow
      />

      {/* Rim bars: raised only over the margins, so the key area is a genuine recess —
          no CSG needed. */}
      <mesh position={[CASE_CENTER_X, RIM_CENTER_Y, -MARGIN_BACK / 2]} material={caseMaterial} castShadow receiveShadow>
        <boxGeometry args={[CASE_WIDTH, RIM_HEIGHT, MARGIN_BACK]} />
      </mesh>
      <mesh
        position={[CASE_CENTER_X, RIM_CENTER_Y, BOARD_DEPTH_MM + MARGIN_FRONT / 2]}
        material={caseMaterial}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[CASE_WIDTH, RIM_HEIGHT, MARGIN_FRONT]} />
      </mesh>
      <mesh position={[-MARGIN_SIDE / 2, RIM_CENTER_Y, BOARD_DEPTH_MM / 2]} material={caseMaterial} castShadow receiveShadow>
        <boxGeometry args={[MARGIN_SIDE, RIM_HEIGHT, BOARD_DEPTH_MM]} />
      </mesh>
      <mesh
        position={[BOARD_WIDTH_MM + MARGIN_SIDE / 2, RIM_CENTER_Y, BOARD_DEPTH_MM / 2]}
        material={caseMaterial}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[MARGIN_SIDE, RIM_HEIGHT, BOARD_DEPTH_MM]} />
      </mesh>

      {/* Plate trim: a thin metallic line straddling the key-area/rim boundary. */}
      <mesh position={[BOARD_WIDTH_MM / 2, PLATE_CENTER_Y, -PLATE_TRIM_WIDTH / 2]} material={plateMaterial}>
        <boxGeometry args={[BOARD_WIDTH_MM, PLATE_TRIM_HEIGHT, PLATE_TRIM_WIDTH]} />
      </mesh>
      <mesh
        position={[BOARD_WIDTH_MM / 2, PLATE_CENTER_Y, BOARD_DEPTH_MM + PLATE_TRIM_WIDTH / 2]}
        material={plateMaterial}
      >
        <boxGeometry args={[BOARD_WIDTH_MM, PLATE_TRIM_HEIGHT, PLATE_TRIM_WIDTH]} />
      </mesh>
      <mesh position={[-PLATE_TRIM_WIDTH / 2, PLATE_CENTER_Y, BOARD_DEPTH_MM / 2]} material={plateMaterial}>
        <boxGeometry args={[PLATE_TRIM_WIDTH, PLATE_TRIM_HEIGHT, BOARD_DEPTH_MM]} />
      </mesh>
      <mesh
        position={[BOARD_WIDTH_MM + PLATE_TRIM_WIDTH / 2, PLATE_CENTER_Y, BOARD_DEPTH_MM / 2]}
        material={plateMaterial}
      >
        <boxGeometry args={[PLATE_TRIM_WIDTH, PLATE_TRIM_HEIGHT, BOARD_DEPTH_MM]} />
      </mesh>

      {/* USB-C port notch, back-left face */}
      <mesh position={[MARGIN_SIDE + 26, CASE_BOTTOM_Y + 9, -MARGIN_BACK + 1]} material={notchMaterial}>
        <boxGeometry args={[9, 3.5, 4]} />
      </mesh>
    </group>
  );
}
