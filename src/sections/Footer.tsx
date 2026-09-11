import styles from './Footer.module.css';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p className={`mono ${styles.mark}`}>KEYFORM · {year}</p>
      <p className={`mono ${styles.mark}`}>
        A concept by{' '}
        <a href="https://sajjstudio.co.uk" target="_blank" rel="noreferrer">
          Sajj Studio
        </a>
      </p>
    </footer>
  );
}
