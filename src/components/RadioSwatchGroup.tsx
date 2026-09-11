import styles from './RadioSwatchGroup.module.css';

export interface SwatchOptionLike {
  id: string;
  label: string;
  swatch?: string;
  description?: string;
}

interface RadioSwatchGroupProps {
  legend: string;
  name: string;
  options: SwatchOptionLike[];
  value: string;
  onChange: (id: string) => void;
}

export function RadioSwatchGroup({ legend, name, options, value, onChange }: RadioSwatchGroupProps) {
  const current = options.find((o) => o.id === value);

  return (
    <fieldset className={styles.fieldset}>
      <legend className={`mono ${styles.legend}`}>{legend}</legend>
      <div className={styles.row}>
        {options.map((option) => {
          const selected = option.id === value;
          return (
            <label key={option.id} className={styles.pill} data-selected={selected}>
              <input
                type="radio"
                name={name}
                value={option.id}
                checked={selected}
                onChange={() => onChange(option.id)}
                className="visually-hidden"
              />
              {option.swatch && (
                <span className={styles.swatch} style={{ background: option.swatch }} aria-hidden="true" />
              )}
              <span className={styles.label}>{option.label}</span>
              {selected && (
                <span className={styles.check} aria-hidden="true">
                  ✓
                </span>
              )}
            </label>
          );
        })}
      </div>
      {current && (
        <p className={`mono ${styles.current}`}>
          {current.label}
          {current.description ? ` — ${current.description}` : ''}
        </p>
      )}
    </fieldset>
  );
}
