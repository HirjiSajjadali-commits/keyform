import { useRef } from 'react';
import { useAudioStore } from '../store/audio';
import { useScrollFadeOut } from '../hooks/useScrollFadeOut';
import styles from './Hero.module.css';

export function Hero() {
  const muted = useAudioStore((s) => s.muted);
  const toggleMuted = useAudioStore((s) => s.toggleMuted);
  const heroRef = useRef<HTMLElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);

  useScrollFadeOut(heroRef, copyRef);

  return (
    <section id="top" ref={heroRef} className={styles.hero}>
      <div className={styles.typeHint}>
        <p className={`mono ${styles.hintText}`}>TYPE ON YOUR KEYBOARD →</p>
        <button
          type="button"
          className={`mono ${styles.muteToggle}`}
          aria-pressed={muted}
          onClick={toggleMuted}
        >
          {muted ? 'SOUND OFF' : 'SOUND ON'}
        </button>
      </div>
      <div ref={copyRef} className={styles.copy}>
        <p className={`mono ${styles.kicker}`}>KF-TKL-01 · 6063-T5 ALUMINIUM · 87 KEYS</p>
        <h1 className={styles.title}>Built to a tolerance.</h1>
        <p className={`mono ${styles.scrollCue}`}>SCROLL ↓</p>
      </div>
    </section>
  );
}
