const common = {
  viewBox: '0 0 64 64',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function HotSwapIcon() {
  return (
    <svg {...common} aria-hidden="true">
      <rect x="10" y="10" width="44" height="44" rx="4" />
      <circle cx="24" cy="24" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="40" cy="24" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="32" cy="32" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="24" cy="40" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="40" cy="40" r="2.5" fill="currentColor" stroke="none" />
      <path d="M32 10V4M32 60v-6M10 32H4M60 32h-6" />
    </svg>
  );
}

export function GasketIcon() {
  return (
    <svg {...common} aria-hidden="true">
      <path d="M8 20h48" />
      <path d="M8 44h48" />
      <path d="M12 28c3-4 6 4 9 0s6 4 9 0 6 4 9 0 6 4 9 0 6 4 9 0" />
      <path d="M12 36c3-4 6 4 9 0s6 4 9 0 6 4 9 0 6 4 9 0 6 4 9 0" />
    </svg>
  );
}

export function FoamIcon() {
  return (
    <svg {...common} aria-hidden="true">
      <rect x="10" y="12" width="44" height="40" rx="3" />
      <path d="M14 20l8 8-8 8M26 20l8 8-8 8M38 20l8 8-8 8" />
    </svg>
  );
}

export function StabilizerIcon() {
  return (
    <svg {...common} aria-hidden="true">
      <path d="M14 32c8-10 28-10 36 0" />
      <circle cx="14" cy="32" r="5" />
      <circle cx="50" cy="32" r="5" />
      <path d="M10 32h8M46 32h8M14 28v8M50 28v8" />
    </svg>
  );
}

export function PcbIcon() {
  return (
    <svg {...common} aria-hidden="true">
      <rect x="10" y="8" width="44" height="36" rx="3" />
      <rect x="24" y="16" width="16" height="16" rx="1.5" />
      <path d="M32 44v8" />
      <path d="M26 56l6-6 6 6" />
    </svg>
  );
}

export function WeightIcon() {
  return (
    <svg {...common} aria-hidden="true">
      <path d="M18 14h28l6 36H12z" />
      <path d="M16 26h32M14 38h36" />
    </svg>
  );
}
