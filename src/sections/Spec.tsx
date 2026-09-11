import styles from './Placeholder.module.css';

export function Spec() {
  return (
    <section id="spec" className={styles.section}>
      <p className={`mono ${styles.kicker}`}>SPEC</p>
      <h2 className={styles.title}>Specified, not styled.</h2>
    </section>
  );
}
