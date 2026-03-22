import { useI18nContext } from '@/app'
import type { ColorTheme } from '@/domain'
import styles from './QuickThemePicker.module.css'

interface QuickThemePickerProps {
  themes: readonly ColorTheme[]
  activeThemeId: string
  onSelectTheme: (themeId: string) => void
}

const THEME_LABEL_KEY = {
  'chiba-city': 'settings.theme.chiba-city',
  classic: 'settings.theme.classic',
  'neon-arcade': 'settings.theme.neon-arcade',
  'night-district': 'settings.theme.night-district',
  gridline: 'settings.theme.gridline',
  vaporwave: 'settings.theme.vaporwave',
  synthwave: 'settings.theme.synthwave',
  'high-contrast': 'settings.theme.high-contrast',
} as const

export function QuickThemePicker({ themes, activeThemeId, onSelectTheme }: QuickThemePickerProps) {
  const { t } = useI18nContext()

  return (
    <div className={styles.grid}>
      {themes.map((theme) => {
        const labelKey = THEME_LABEL_KEY[theme.id as keyof typeof THEME_LABEL_KEY]
        const localizedLabel = labelKey ? t(labelKey) : theme.label
        const isActive = activeThemeId === theme.id

        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => onSelectTheme(theme.id)}
            title={localizedLabel}
            aria-label={t('settings.themeAria', { theme: localizedLabel })}
            aria-pressed={isActive}
            className={`${styles.themeButton} ${isActive ? styles.themeButtonActive : ''}`}
            style={{
              backgroundColor: isActive ? theme.accent : 'transparent',
              border: `2px solid ${theme.accent}`,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--theme-bg)' : 'var(--theme-fg)',
              opacity: isActive ? 1 : 0.7,
              boxShadow: isActive ? `0 0 8px ${theme.accent}88` : 'none',
            }}
            onMouseEnter={(event) => {
              const element = event.currentTarget as HTMLElement
              if (!isActive) {
                element.style.opacity = '0.9'
                element.style.borderColor = theme.accent
              }
            }}
            onMouseLeave={(event) => {
              const element = event.currentTarget as HTMLElement
              if (!isActive) {
                element.style.opacity = '0.7'
              }
            }}
          >
            <span className={styles.swatch} style={{ backgroundColor: theme.accent }} />
            {localizedLabel}
          </button>
        )
      })}
    </div>
  )
}
