import styles from './Voices.module.css';

const QUOTES = [
  {
    text: "It's the first board I haven't wanted to modify.",
    attribution: 'R. Okafor, firmware engineer',
  },
  {
    text: 'The gasket mount is subtle. Most people would say too subtle. I like that.',
    attribution: 'M. Lindqvist, mechanical designer',
  },
  {
    text: "Loud on purpose, and it means it. I use it in a shared office and I'm not sorry.",
    attribution: 'D. Osei, backend developer',
  },
];

export function Voices() {
  return (
    <section id="voices" className={styles.section}>
      <p className={`mono ${styles.kicker}`}>VOICES</p>
      <h2 className={styles.title}>From people who type for a living.</h2>
      <div className={styles.grid}>
        {QUOTES.map((q) => (
          <blockquote key={q.attribution} className={styles.quote}>
            <p className={styles.quoteText}>&ldquo;{q.text}&rdquo;</p>
            <footer className={`mono ${styles.attribution}`}>— {q.attribution}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
