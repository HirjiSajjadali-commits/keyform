import { useMemo, useState } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import type { Group, MeshStandardMaterial, MeshBasicMaterial } from 'three';
import type { PlacedKey } from './layout';
import { U } from './layout';
import { KEY_HEIGHT, KEY_DEPTH, KEY_RADIUS, KEY_SMOOTHNESS, KEY_FOOTPRINT_SHRINK, TRAY_FLOOR_Y } from './dimensions';
import { useMaterialColorTween } from '../hooks/useMaterialColorTween';
import { getLegendAtlas, LEGEND_CELL_ASPECT } from './legends';

interface KeycapProps {
  keyDef: PlacedKey;
  color: string;
  legendColor: string | null;
  groupRef?: (el: Group | null) => void;
  materialRef?: (el: MeshStandardMaterial | null) => void;
}

const LEGEND_MAX_HEIGHT = KEY_DEPTH * 0.6;

export function Keycap({ keyDef, color, legendColor, groupRef, materialRef }: KeycapProps) {
  const width = keyDef.w * U - KEY_FOOTPRINT_SHRINK;
  const [material, setMaterial] = useState<MeshStandardMaterial | null>(null);
  const [legendMaterial, setLegendMaterial] = useState<MeshBasicMaterial | null>(null);
  useMaterialColorTween(material, color);
  useMaterialColorTween(legendMaterial, legendColor ?? color);

  const atlas = useMemo(() => getLegendAtlas(), []);
  const legendRect = useMemo(() => atlas.getRect(keyDef.id), [atlas, keyDef.id]);

  const legendGeometry = useMemo(() => {
    if (!legendRect) return null;
    let legendHeight = LEGEND_MAX_HEIGHT;
    let legendWidth = legendHeight * LEGEND_CELL_ASPECT;
    const maxWidthFromKey = width * 0.55;
    if (legendWidth > maxWidthFromKey) {
      legendWidth = maxWidthFromKey;
      legendHeight = legendWidth / LEGEND_CELL_ASPECT;
    }
    const geometry = new THREE.PlaneGeometry(legendWidth, legendHeight);
    const { u0, v0, u1, v1 } = legendRect;
    // Default PlaneGeometry UVs run (0,0) bottom-left to (1,1) top-right — remap the four
    // corners onto this key's own cell in the shared atlas.
    geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([u0, v1, u1, v1, u0, v0, u1, v0]), 2));
    return geometry;
  }, [legendRect, width]);

  const showLegend = legendColor !== null && legendGeometry !== null;

  return (
    <group ref={groupRef} position={[keyDef.x, TRAY_FLOOR_Y + KEY_HEIGHT / 2, keyDef.z]}>
      <RoundedBox
        args={[width, KEY_HEIGHT, KEY_DEPTH]}
        radius={KEY_RADIUS}
        smoothness={KEY_SMOOTHNESS}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          ref={(el) => {
            setMaterial(el);
            materialRef?.(el);
          }}
          metalness={0}
          roughness={0.55}
        />
      </RoundedBox>
      {keyDef.home && (
        <mesh position={[0, KEY_HEIGHT / 2 - 0.15, KEY_DEPTH / 2 - 3]} castShadow material={material ?? undefined}>
          <boxGeometry args={[4, 0.4, 1]} />
        </mesh>
      )}
      {showLegend && legendGeometry && (
        <mesh geometry={legendGeometry} position={[0, KEY_HEIGHT / 2 + 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshBasicMaterial ref={(el) => setLegendMaterial(el)} map={atlas.texture} transparent alphaTest={0.5} />
        </mesh>
      )}
    </group>
  );
}
