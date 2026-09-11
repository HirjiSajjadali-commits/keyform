import { Html, Line } from '@react-three/drei';
import { BOARD_WIDTH_MM, BOARD_DEPTH_MM } from './layout';
import styles from './ExplodedLabels.module.css';

interface LabelDef {
  id: string;
  text: string;
  anchor: [number, number, number];
  leaderEnd: [number, number, number];
}

const LABELS: LabelDef[] = [
  {
    id: 'case',
    text: '6063 CASE',
    anchor: [BOARD_WIDTH_MM * 0.32, -29, BOARD_DEPTH_MM * 0.82],
    leaderEnd: [BOARD_WIDTH_MM * 0.32 + 34, -29, BOARD_DEPTH_MM * 0.82],
  },
  {
    id: 'gasket',
    text: 'GASKET',
    anchor: [BOARD_WIDTH_MM * 0.14, -12, BOARD_DEPTH_MM * 0.62],
    leaderEnd: [BOARD_WIDTH_MM * 0.14 - 30, -12, BOARD_DEPTH_MM * 0.62],
  },
  {
    id: 'pcb',
    text: 'HOT-SWAP PCB',
    anchor: [BOARD_WIDTH_MM * 0.86, -4, BOARD_DEPTH_MM * 0.5],
    leaderEnd: [BOARD_WIDTH_MM * 0.86 + 34, -4, BOARD_DEPTH_MM * 0.5],
  },
  {
    id: 'plate',
    text: 'PLATE',
    anchor: [BOARD_WIDTH_MM * 0.12, 8.4, BOARD_DEPTH_MM * 0.3],
    leaderEnd: [BOARD_WIDTH_MM * 0.12 - 30, 8.4, BOARD_DEPTH_MM * 0.3],
  },
  {
    id: 'keycaps',
    text: 'PBT KEYCAPS',
    anchor: [BOARD_WIDTH_MM * 0.7, 26.5, BOARD_DEPTH_MM * 0.22],
    leaderEnd: [BOARD_WIDTH_MM * 0.7 + 34, 26.5, BOARD_DEPTH_MM * 0.22],
  },
];

interface ExplodedLabelsProps {
  visible: boolean;
}

export function ExplodedLabels({ visible }: ExplodedLabelsProps) {
  const style = {
    opacity: visible ? 1 : 0,
    transitionDelay: visible ? '0.6s' : '0s',
  };

  return (
    <group>
      {LABELS.map((label) => (
        <group key={label.id}>
          <Line
            points={[label.anchor, label.leaderEnd]}
            color="#9a9aa0"
            lineWidth={1}
            transparent
            opacity={visible ? 1 : 0}
          />
          <Html position={label.leaderEnd} occlude={false} zIndexRange={[10, 0]}>
            <span className={styles.label} style={style}>
              {label.text}
            </span>
          </Html>
        </group>
      ))}
    </group>
  );
}
