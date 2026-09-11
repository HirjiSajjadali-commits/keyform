import { useScrollStoryStore } from '../store/scrollStory';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { StackFigure } from '../components/StackFigure';
import styles from './Made.module.css';

const BEATS = [
  {
    title: 'One billet',
    text: 'Every KF-TKL-01 starts as a single block of 6063 aluminium. Nothing is cast, nothing is stamped.',
  },
  {
    title: 'The stack',
    text: 'Plate, PCB and foam separate from the case — each layer doing exactly one job.',
  },
  {
    title: 'Every key',
    text: '87 keycaps, each seated on its own hot-swap socket, each easy to pull.',
  },
  {
    title: 'Together',
    text: 'It goes back together the way it came apart.',
    cta: true,
  },
];

export function Made() {
  const reducedMotion = usePrefersReducedMotion();
  const beat = useScrollStoryStore((s) => s.beat);

  if (reducedMotion) {
    return (
      <section id="made" className={`${styles.section} ${styles.staticSection}`}>
        <p className={`mono ${styles.kicker}`}>MADE</p>
        <h2 className={styles.beatTitle}>One billet. Six degrees.</h2>
        <div className={styles.staticGrid}>
          {BEATS.map((b, i) => (
            <div key={b.title} className={styles.staticBeat}>
              <div className={styles.staticFigure}>
                <StackFigure beat={i} />
              </div>
              <div>
                <p className={`mono ${styles.kicker}`}>{b.title.toUpperCase()}</p>
                <p className={styles.beatText}>{b.text}</p>
                {b.cta && (
                  <a href="#configure" className={styles.ctaLink}>
                    Configure yours →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="made" className={`${styles.section} ${styles.tall}`}>
      <div className={styles.sticky}>
        <div className={styles.captionStack}>
          {BEATS.map((b, i) => (
            <div key={b.title} className={styles.caption} data-active={beat === i}>
              <p className={`mono ${styles.kicker}`}>{b.title.toUpperCase()}</p>
              <h2 className={styles.beatTitle}>{b.title === 'One billet' ? 'One billet. Six degrees.' : b.title}</h2>
              <p className={styles.beatText}>{b.text}</p>
              {b.cta && (
                <a href="#configure" className={styles.ctaLink}>
                  Configure yours →
                </a>
              )}
            </div>
          ))}
        </div>
        <div className={styles.progress} aria-hidden="true">
          {BEATS.map((b, i) => (
            <span key={b.title} className={styles.progressDot} data-active={beat === i} />
          ))}
        </div>
      </div>
    </section>
  );
}
