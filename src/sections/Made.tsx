import styles from './Placeholder.module.css';

export function Made() {
  return (
    <section id="made" className={styles.section}>
      <p className={`mono ${styles.kicker}`}>MADE</p>
      <h2 className={styles.title}>One billet. Six degrees.</h2>
    </section>
  );
}
