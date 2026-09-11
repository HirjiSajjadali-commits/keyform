import styles from './Hero.module.css';

export function Hero() {
  return (
    <section id="top" className={styles.hero}>
      <div className={styles.copy}>
        <p className={`mono ${styles.kicker}`}>KF-TKL-01 · 6063-T5 ALUMINIUM · 87 KEYS</p>
        <h1 className={styles.title}>Built to a tolerance.</h1>
        <p className={`mono ${styles.scrollCue}`}>SCROLL ↓</p>
      </div>
    </section>
  );
}
