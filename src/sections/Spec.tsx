import styles from './Spec.module.css';

const SPEC_LEFT = [
  { key: 'Weight', value: '1,180 g' },
  { key: 'Keys', value: '87 (ANSI TKL)' },
  { key: 'Typing angle', value: '6°' },
  { key: 'Actuation', value: '1.2 mm' },
  { key: 'Rollover', value: 'NKRO' },
];

const SPEC_RIGHT = [
  { key: 'Mount', value: 'Gasket' },
  { key: 'Connection', value: 'USB-C' },
  { key: 'Case', value: '6063-T5 aluminium, bead-blasted, anodised' },
  { key: 'Keycaps', value: 'PBT, 1.4 mm, dye-sub-ready' },
  { key: 'Polling', value: '1000 Hz' },
];

export function Spec() {
  return (
    <section id="spec" className={styles.section}>
      <p className={`mono ${styles.kicker}`}>SPEC</p>
      <h2 className={styles.title}>Specified, not styled.</h2>
      <div className={styles.columns}>
        <dl className={`mono ${styles.list}`}>
          {SPEC_LEFT.map((row) => (
            <div key={row.key} className={styles.row}>
              <dt className={styles.key}>{row.key}</dt>
              <dd className={styles.value}>{row.value}</dd>
            </div>
          ))}
        </dl>
        <dl className={`mono ${styles.list}`}>
          {SPEC_RIGHT.map((row) => (
            <div key={row.key} className={styles.row}>
              <dt className={styles.key}>{row.key}</dt>
              <dd className={styles.value}>{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
