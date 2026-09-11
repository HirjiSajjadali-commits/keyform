import { useEffect, useRef } from 'react';
import styles from './AddToCartDrawer.module.css';

interface SpecLine {
  key: string;
  value: string;
}

interface AddToCartDrawerProps {
  open: boolean;
  onClose: () => void;
  specLines: SpecLine[];
  price: number;
}

export function AddToCartDrawer({ open, onClose, specLines, price }: AddToCartDrawerProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-heading"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="cart-drawer-heading" className={styles.heading}>
          Added to concept cart
        </h2>
        <p className={styles.note}>
          This is a concept build by Sajj Studio. There's no real checkout — but this is exactly how a
          production configurator would hand off to one.
        </p>
        <div className={styles.specList}>
          {specLines.map((line) => (
            <div key={line.key} className={`mono ${styles.specRow}`}>
              <span className={styles.specKey}>{line.key}</span>
              <span>{line.value}</span>
            </div>
          ))}
        </div>
        <div className={`mono ${styles.total}`}>
          <span>Total</span>
          <span>£{price}</span>
        </div>
        <p className={`mono ${styles.fine}`}>Concept project. Not a real product.</p>
        <button ref={closeRef} type="button" className={`mono ${styles.close}`} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
