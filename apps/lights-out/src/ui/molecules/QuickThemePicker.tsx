import type { ColorTheme } from '@/domain'

import styles from './QuickThemePicker.module.css'

interface QuickThemePickerProps {
  themes: readonly ColorTheme[]
  activeThemeId: string
  onSelectTheme: (themeId: string) => void
}

export function QuickThemePicker({ themes, activeThemeId, onSelectTheme }: QuickThemePickerProps) {
  return (
    <div className={styles.grid}>
      {themes.map((theme) => {
        const isActive = activeThemeId === theme.id

        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => onSelectTheme(theme.id)}
            title={theme.label}
            aria-label={`Use ${theme.label} theme`}
            aria-pressed={isActive}
            className={`${styles.themeButton} ${isActive ? styles.themeButtonActive : ''}`}
            style={{
              backgroundColor: isActive ? theme.accent : 'transparent',
              border: `2px solid ${theme.accent}`,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? 'var(--theme-bg)' : 'var(--theme-fg)',
              opacity: isActive ? 1 : 0.75,
              boxShadow: isActive ? `0 0 8px ${theme.accent}88` : 'none',
            }}
          >
            <span className={styles.swatch} style={{ backgroundColor: theme.accent }} />
            {theme.label}
          </button>
        )
      })}
    </div>
  )
}
