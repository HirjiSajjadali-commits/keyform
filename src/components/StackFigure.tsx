interface StackFigureProps {
  beat: number;
}

// A small mono "exploded stack" diagram: three bars (case / plate / keycaps) whose gaps
// widen with the beat, mirroring what the live scroll story does to the 3D board.
export function StackFigure({ beat }: StackFigureProps) {
  const gap = beat === 0 || beat === 3 ? 0 : beat === 1 ? 6 : 14;
  const caseY = 46;
  const plateY = 34 - gap * 0.4;
  const capsY = 20 - gap;

  return (
    <svg viewBox="0 0 120 64" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <rect x="10" y={capsY} width="100" height="8" rx="2" />
      <rect x="16" y={plateY} width="88" height="6" rx="1.5" />
      <rect x="6" y={caseY} width="108" height="12" rx="3" />
    </svg>
  );
}
