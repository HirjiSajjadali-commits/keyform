import styles from './Placeholder.module.css';

export function Details() {
  return (
    <section id="details" className={styles.section}>
      <p className={`mono ${styles.kicker}`}>DETAILS</p>
      <h2 className={styles.title}>Every tolerance, accounted for.</h2>
    </section>
  );
}
