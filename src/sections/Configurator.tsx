import { useState } from 'react';
import { useConfiguratorStore, computePrice } from '../store/configurator';
import { useScrollStoryStore } from '../store/scrollStory';
import { ACCENTS, CASE_FINISHES, KEYCAP_SETS, PLATES, SWITCHES, findOption } from '../store/options';
import { RadioSwatchGroup } from '../components/RadioSwatchGroup';
import { AddToCartDrawer } from '../components/AddToCartDrawer';
import styles from './Configurator.module.css';

export function Configurator() {
  const state = useConfiguratorStore();
  const scrollStoryActive = useScrollStoryStore((s) => s.active);
  const [announcement, setAnnouncement] = useState('');
  const [cartOpen, setCartOpen] = useState(false);

  const price = computePrice(state);

  function announce(change: string, nextState: typeof state) {
    setAnnouncement(`${change}. Total: £${computePrice(nextState)}.`);
  }

  const caseLabel = findOption(CASE_FINISHES, state.caseFinish).label;
  const keycapLabel = findOption(KEYCAP_SETS, state.keycaps).label;
  const accentLabel = findOption(ACCENTS, state.accent).label;
  const switchLabel = findOption(SWITCHES, state.switches).label;
  const plateLabel = findOption(PLATES, state.plate).label;

  return (
    <section id="configure" className={styles.section}>
      <div className={styles.spacer} aria-hidden="true" />
      <div className={styles.panelWrap}>
        <div className={styles.panel}>
          <div className={styles.headRow}>
            <div>
              <p className={`mono ${styles.kicker}`}>CONFIGURE</p>
              <h2 className={styles.title}>Build your KF-TKL-01.</h2>
            </div>
            <button
              type="button"
              className={`mono ${styles.explodeToggle}`}
              aria-pressed={state.exploded}
              disabled={scrollStoryActive}
              title={scrollStoryActive ? 'Driven by the scroll story below' : undefined}
              onClick={state.toggleExploded}
            >
              <span className={state.exploded ? styles.dim : undefined}>ASSEMBLED</span>
              <span className={styles.slash}>/</span>
              <span className={state.exploded ? undefined : styles.dim}>EXPLODED</span>
            </button>
          </div>

          <RadioSwatchGroup
            legend="Case finish"
            name="case-finish"
            value={state.caseFinish}
            options={CASE_FINISHES.map((o) => ({ id: o.id, label: o.label, swatch: o.color }))}
            onChange={(id) => {
              const v = id as typeof state.caseFinish;
              state.setCaseFinish(v);
              announce(`Case finish: ${findOption(CASE_FINISHES, v).label}`, { ...state, caseFinish: v });
            }}
          />

          <RadioSwatchGroup
            legend="Keycap set"
            name="keycap-set"
            value={state.keycaps}
            options={KEYCAP_SETS.map((o) => ({ id: o.id, label: o.label, swatch: o.swatch }))}
            onChange={(id) => {
              const v = id as typeof state.keycaps;
              state.setKeycaps(v);
              announce(`Keycap set: ${findOption(KEYCAP_SETS, v).label}`, { ...state, keycaps: v });
            }}
          />

          <RadioSwatchGroup
            legend="Accent key"
            name="accent"
            value={state.accent}
            options={ACCENTS.map((o) => ({ id: o.id, label: o.label, swatch: o.color }))}
            onChange={(id) => {
              const v = id as typeof state.accent;
              state.setAccent(v);
              announce(`Accent key: ${findOption(ACCENTS, v).label}`, { ...state, accent: v });
            }}
          />

          <RadioSwatchGroup
            legend="Switch"
            name="switch"
            value={state.switches}
            options={SWITCHES.map((o) => ({ id: o.id, label: o.label, description: o.description }))}
            onChange={(id) => {
              const v = id as typeof state.switches;
              state.setSwitches(v);
              announce(`Switch: ${findOption(SWITCHES, v).label}`, { ...state, switches: v });
            }}
          />

          <RadioSwatchGroup
            legend="Deck plate"
            name="plate"
            value={state.plate}
            options={PLATES.map((o) => ({ id: o.id, label: o.label, swatch: o.color, description: o.description }))}
            onChange={(id) => {
              const v = id as typeof state.plate;
              state.setPlate(v);
              announce(`Deck plate: ${findOption(PLATES, v).label}`, { ...state, plate: v });
            }}
          />

          <div className={styles.priceRow}>
            <span className={`mono ${styles.priceLabel}`}>Total</span>
            <span className={`mono ${styles.price}`}>£{price}</span>
          </div>

          <button type="button" className={`mono ${styles.addToCart}`} onClick={() => setCartOpen(true)}>
            Add to cart
          </button>
        </div>
      </div>

      <p aria-live="polite" className="visually-hidden">
        {announcement}
      </p>

      <AddToCartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        price={price}
        specLines={[
          { key: 'Model', value: 'KF-TKL-01' },
          { key: 'Case finish', value: caseLabel },
          { key: 'Keycap set', value: keycapLabel },
          { key: 'Accent key', value: accentLabel },
          { key: 'Switch', value: switchLabel },
          { key: 'Deck plate', value: plateLabel },
        ]}
      />
    </section>
  );
}
