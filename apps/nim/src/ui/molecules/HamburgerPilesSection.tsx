import { useI18nContext } from '@/app'
import { cx } from '@/ui'
import styles from './HamburgerSettingsSections.module.css'

interface Preset {
  name: string
  counts: number[]
}

interface HamburgerPilesSectionProps {
  setup: number[]
  presets: readonly Preset[]
  onPileChange: (index: number, value: string) => void
  onApplyPreset: (counts: number[]) => void
  isPresetActive: (counts: readonly number[]) => boolean
}

const PRESET_LABEL_KEY = {
  Classic: 'settings.preset.classic',
  Simple: 'settings.preset.simple',
  Challenge: 'settings.preset.challenge',
  Quick: 'settings.preset.quick',
  Grand: 'settings.preset.grand',
} as const

export function HamburgerPilesSection({
  setup,
  presets,
  onPileChange,
  onApplyPreset,
  isPresetActive,
}: HamburgerPilesSectionProps) {
  const { t } = useI18nContext()

  return (
    <section className={styles.hamburgerSection}>
      <h3 className={styles.hamburgerSectionTitle}>{t('settings.initialPiles')}</h3>
      <div className={styles.hamburgerPilesRow}>
        {setup.map((count, index) => (
          <input
            key={index}
            type="number"
            min={1}
            max={15}
            value={count}
            onChange={(event) => onPileChange(index, event.target.value)}
            className={styles.hamburgerPileInput}
            aria-label={t('settings.pileAria', { index: index + 1 })}
          />
        ))}
      </div>
      <div className={styles.hamburgerPresetRow}>
        {presets.map((preset) => {
          const key = PRESET_LABEL_KEY[preset.name as keyof typeof PRESET_LABEL_KEY]
          const presetLabel = key ? t(key) : preset.name

          return (
            <button
              key={preset.name}
              type="button"
              onClick={() => onApplyPreset([...preset.counts])}
              className={cx(
                styles.hamburgerPresetBtn,
                isPresetActive(preset.counts) && styles.hamburgerPresetBtnActive,
              )}
            >
              {presetLabel}
            </button>
          )
        })}
      </div>
    </section>
  )
}
