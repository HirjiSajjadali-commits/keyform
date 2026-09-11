import { useState } from 'react';
import { useConfiguratorStore, computePrice } from '../store/configurator';
import { ACCENTS, CASE_FINISHES, KEYCAP_SETS, PLATES, SWITCHES, findOption } from '../store/options';
import styles from './PreOrder.module.css';

// Placeholder — this concept has no real backend. Swap in a real Formspree endpoint
// (https://formspree.io/f/<id>) to actually collect emails.
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

export function PreOrder() {
  const state = useConfiguratorStore();
  const [submitted, setSubmitted] = useState(false);
  const price = computePrice(state);

  const recap = [
    { key: 'Model', value: 'KF-TKL-01' },
    { key: 'Case finish', value: findOption(CASE_FINISHES, state.caseFinish).label },
    { key: 'Keycap set', value: findOption(KEYCAP_SETS, state.keycaps).label },
    { key: 'Accent key', value: findOption(ACCENTS, state.accent).label },
    { key: 'Switch', value: findOption(SWITCHES, state.switches).label },
    { key: 'Deck plate', value: findOption(PLATES, state.plate).label },
  ];

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section id="pre-order" className={styles.section}>
      <div>
        <p className={`mono ${styles.kicker}`}>PRE-ORDER</p>
        <h2 className={styles.title}>Reserve your build slot.</h2>
      </div>

      <div className={`mono ${styles.recap}`}>
        {recap.map((row) => (
          <div key={row.key} className={styles.recapRow}>
            <span className={styles.recapKey}>{row.key}</span>
            <span>{row.value}</span>
          </div>
        ))}
        <div className={styles.recapTotal}>
          <span>Total</span>
          <span>£{price}</span>
        </div>
      </div>

      {submitted ? (
        <p className={`mono ${styles.confirmation}`}>
          Noted — there's no real order behind this, but that's exactly the request a production
          form would have captured.
        </p>
      ) : (
        <form className={styles.form} action={FORMSPREE_ENDPOINT} method="POST" onSubmit={handleSubmit}>
          <label className="visually-hidden" htmlFor="preorder-email">
            Email address
          </label>
          <input
            id="preorder-email"
            className={styles.emailInput}
            type="email"
            name="email"
            placeholder="you@example.com"
            required
          />
          <button type="submit" className={`mono ${styles.submit}`}>
            Notify me
          </button>
        </form>
      )}

      <p className={`mono ${styles.fine}`}>Concept project. Not a real product.</p>
    </section>
  );
}
