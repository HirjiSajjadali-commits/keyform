import styles from './Placeholder.module.css';

export function Voices() {
  return (
    <section id="voices" className={styles.section}>
      <p className={`mono ${styles.kicker}`}>VOICES</p>
      <h2 className={styles.title}>From people who type for a living.</h2>
    </section>
  );
}
