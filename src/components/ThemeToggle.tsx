import { useThemeStore } from '../store/theme';
import styles from './ThemeToggle.module.css';

export function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={`mono ${styles.toggle}`}
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span className={isDark ? styles.dim : undefined}>LT</span>
      <span className={styles.slash}>/</span>
      <span className={isDark ? undefined : styles.dim}>DK</span>
    </button>
  );
}
