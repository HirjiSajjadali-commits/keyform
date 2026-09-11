import styles from './Placeholder.module.css';

export function Configurator() {
  return (
    <section id="configure" className={styles.section}>
      <p className={`mono ${styles.kicker}`}>CONFIGURE</p>
      <h2 className={styles.title}>Build your KF-TKL-01.</h2>
    </section>
  );
}
