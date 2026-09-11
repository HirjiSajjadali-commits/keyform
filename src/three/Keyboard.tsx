import { useRef } from 'react';
import type { Group, MeshStandardMaterial } from 'three';
import { KEY_LAYOUT } from './layout';
import { CASE_CENTER_X, CASE_CENTER_Z, BOARD_TILT_DEG } from './dimensions';
import { Case } from './Case';
import { Keycap } from './Keycap';
import { ExplodedLabels } from './ExplodedLabels';
import { useExplodedView } from './useExplodedView';
import { useTypeTest } from './useTypeTest';
import { useMadeScrollStory } from './useMadeScrollStory';
import { useConfiguratorStore } from '../store/configurator';

export interface KeyboardRefs {
  keyGroups: Map<string, Group>;
  keyMaterials: Map<string, MeshStandardMaterial>;
  caseMaterial: MeshStandardMaterial | null;
  plateMaterial: MeshStandardMaterial | null;
  caseGroup: Group | null;
  plateGroup: Group | null;
}

interface KeyboardProps {
  caseColor: string;
  keycapColor: string;
  modColor: string;
  accentColor: string;
  plateColor: string;
  refsOut?: (refs: KeyboardRefs) => void;
}

const DEG_TO_RAD = Math.PI / 180;

function colorForKey(type: 'default' | 'accent' | 'mod', keycapColor: string, modColor: string, accentColor: string) {
  if (type === 'accent') return accentColor;
  if (type === 'mod') return modColor;
  return keycapColor;
}

export function Keyboard({ caseColor, keycapColor, modColor, accentColor, plateColor, refsOut }: KeyboardProps) {
  const refs = useRef<KeyboardRefs>({
    keyGroups: new Map(),
    keyMaterials: new Map(),
    caseMaterial: null,
    plateMaterial: null,
    caseGroup: null,
    plateGroup: null,
  });

  if (refsOut) refsOut(refs.current);

  const exploded = useConfiguratorStore((s) => s.exploded);
  useExplodedView(() => refs.current, exploded);
  useTypeTest(() => refs.current);
  useMadeScrollStory(() => refs.current);

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
          caseGroupRef={(el) => {
            refs.current.caseGroup = el;
          }}
          plateGroupRef={(el) => {
            refs.current.plateGroup = el;
          }}
        />
        {KEY_LAYOUT.map((keyDef) => (
          <Keycap
            key={keyDef.id}
            keyDef={keyDef}
            color={colorForKey(keyDef.type, keycapColor, modColor, accentColor)}
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
        <ExplodedLabels visible={exploded} />
      </group>
    </group>
  );
}
