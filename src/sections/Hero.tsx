import styles from './Placeholder.module.css';

export function Hero() {
  return (
    <section id="top" className={styles.section}>
      <p className={`mono ${styles.kicker}`}>KF-TKL-01 · 6063-T5 ALUMINIUM · 87 KEYS</p>
      <h1 className={styles.title}>Built to a tolerance.</h1>
    </section>
  );
}
