import styles from './Placeholder.module.css';

export function PreOrder() {
  return (
    <section id="pre-order" className={styles.section}>
      <p className={`mono ${styles.kicker}`}>PRE-ORDER</p>
      <h2 className={styles.title}>Reserve your build slot.</h2>
    </section>
  );
}
