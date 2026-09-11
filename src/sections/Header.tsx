import { ThemeToggle } from '../components/ThemeToggle';
import styles from './Header.module.css';

const NAV_LINKS = [
  { href: '#configure', label: 'Configure' },
  { href: '#spec', label: 'Spec' },
  { href: '#made', label: 'Made' },
  { href: '#pre-order', label: 'Pre-order' },
];

export function Header() {
  return (
    <header className={styles.header}>
      <a href="#top" className={`mono ${styles.wordmark}`}>
        KEYFORM
      </a>
      <nav className={styles.navLinks} aria-label="Primary">
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} className={styles.navLink}>
            {link.label}
          </a>
        ))}
      </nav>
      <div className={styles.controls}>
        <ThemeToggle />
        <a href="#pre-order" className={`mono ${styles.preorder}`}>
          Pre-order
        </a>
      </div>
    </header>
  );
}
