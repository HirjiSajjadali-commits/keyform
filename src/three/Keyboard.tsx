import { useRef } from 'react';
import type { Group, MeshStandardMaterial } from 'three';
import { KEY_LAYOUT } from './layout';
import { CASE_CENTER_X, CASE_CENTER_Z, BOARD_TILT_DEG } from './dimensions';
import { Case } from './Case';
import { Keycap } from './Keycap';

export interface KeyboardRefs {
  keyGroups: Map<string, Group>;
  keyMaterials: Map<string, MeshStandardMaterial>;
  caseMaterial: MeshStandardMaterial | null;
  plateMaterial: MeshStandardMaterial | null;
}

interface KeyboardProps {
  caseColor: string;
  keycapColor: string;
  accentColor: string;
  plateColor: string;
  refsOut?: (refs: KeyboardRefs) => void;
}

const DEG_TO_RAD = Math.PI / 180;

export function Keyboard({ caseColor, keycapColor, accentColor, plateColor, refsOut }: KeyboardProps) {
  const refs = useRef<KeyboardRefs>({
    keyGroups: new Map(),
    keyMaterials: new Map(),
    caseMaterial: null,
    plateMaterial: null,
  });

  if (refsOut) refsOut(refs.current);

  return (
    <group rotation={[BOARD_TILT_DEG * DEG_TO_RAD, 0, 0]}>
      <group position={[-CASE_CENTER_X, 0, -CASE_CENTER_Z]}>
        <Case
          color={caseColor}
          plateColor={plateColor}
          caseMaterialRef={(el) => {
            refs.current.caseMaterial = el;
          }}
          plateMaterialRef={(el) => {
            refs.current.plateMaterial = el;
          }}
        />
        {KEY_LAYOUT.map((keyDef) => (
          <Keycap
            key={keyDef.id}
            keyDef={keyDef}
            color={keyDef.type === 'accent' ? accentColor : keycapColor}
            groupRef={(el) => {
              if (el) refs.current.keyGroups.set(keyDef.id, el);
              else refs.current.keyGroups.delete(keyDef.id);
            }}
            materialRef={(el) => {
              if (el) refs.current.keyMaterials.set(keyDef.id, el);
              else refs.current.keyMaterials.delete(keyDef.id);
            }}
          />
        ))}
      </group>
    </group>
  );
}
