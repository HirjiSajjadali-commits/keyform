import type { ComponentType } from 'react';
import { FoamIcon, GasketIcon, HotSwapIcon, PcbIcon, StabilizerIcon, WeightIcon } from '../components/DetailIcons';
import styles from './Details.module.css';

const DETAILS: { title: string; description: string; Icon: ComponentType }[] = [
  {
    title: 'Hot-swap sockets',
    description: 'Change switches without a soldering iron. Every socket rated to 50 insertions.',
    Icon: HotSwapIcon,
  },
  {
    title: 'Gasket mount',
    description: 'The plate floats on silicone, not screws. Softer bottom-out, quieter frame.',
    Icon: GasketIcon,
  },
  {
    title: 'Sound-dampening foam',
    description: 'Two layers between plate and PCB, one more in the case, kill hollow ping.',
    Icon: FoamIcon,
  },
  {
    title: 'Screw-in stabilisers',
    description: 'No rattle, no clip-in play. Lubed from the factory, tuned by hand.',
    Icon: StabilizerIcon,
  },
  {
    title: 'South-facing PCB',
    description: 'Compatible with low-profile keycap sets and most aftermarket LEDs.',
    Icon: PcbIcon,
  },
  {
    title: 'Machined weight',
    description: 'A 6063 block bolted under the plate. Sets the board down like it means it.',
    Icon: WeightIcon,
  },
];

export function Details() {
  return (
    <section id="details" className={styles.section}>
      <p className={`mono ${styles.kicker}`}>DETAILS</p>
      <h2 className={styles.title}>Every tolerance, accounted for.</h2>
      <div className={styles.grid}>
        {DETAILS.map(({ title, description, Icon }) => (
          <div key={title} className={styles.card}>
            <div className={styles.icon}>
              <Icon />
            </div>
            <p className={`mono ${styles.cardTitle}`}>{title}</p>
            <p className={styles.cardDescription}>{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
