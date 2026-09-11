import { useThemeStore } from '../store/theme';
import { useConfiguratorStore } from '../store/configurator';
import { CASE_FINISHES, ACCENTS, KEYCAP_SETS, PLATES, findOption } from '../store/options';
import { KeyboardScene } from './KeyboardScene';
import styles from './KeyboardStage.module.css';

// White text reads against every accent swatch except the White accent itself, where it
// has to flip to dark ink instead.
const ACCENT_LEGEND_LIGHT = '#ffffff';
const ACCENT_LEGEND_DARK = '#16161a';

/**
 * The single <Canvas> for the whole page, mounted once here and kept fixed behind
 * everything. Sections reveal it by staying transparent (Hero, Configurator, and later
 * the Made scroll story); every other section paints its own opaque background over it.
 */
export function KeyboardStage() {
  const theme = useThemeStore((s) => s.theme);
  const caseFinish = useConfiguratorStore((s) => s.caseFinish);
  const keycaps = useConfiguratorStore((s) => s.keycaps);
  const accent = useConfiguratorStore((s) => s.accent);
  const plate = useConfiguratorStore((s) => s.plate);

  const caseColor = findOption(CASE_FINISHES, caseFinish).color;
  const keycapSet = findOption(KEYCAP_SETS, keycaps);
  const accentColor = findOption(ACCENTS, accent).color;
  const plateColor = findOption(PLATES, plate).color;
  const accentLegendColor = accent === 'white' ? ACCENT_LEGEND_DARK : ACCENT_LEGEND_LIGHT;

  return (
    <div className={styles.stage} aria-hidden="true">
      <KeyboardScene
        theme={theme}
        caseColor={caseColor}
        keycapColor={keycapSet.base}
        modColor={keycapSet.mod}
        accentColor={accentColor}
        plateColor={plateColor}
        legendColor={keycapSet.legendColor}
        modLegendColor={keycapSet.modLegendColor}
        accentLegendColor={accentLegendColor}
      />
    </div>
  );
}
