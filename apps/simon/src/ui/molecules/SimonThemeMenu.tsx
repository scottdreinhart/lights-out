import { useSoundContext } from '@/app'
import { COLORBLIND_MODES, COLOR_THEMES, MODES } from '@games/theme-contract'
import { HamburgerMenu } from './HamburgerMenu'

import { useThemeContext } from '@/app'

import styles from './SimonThemeMenu.module.css'

export const SimonThemeMenu = () => {
  const { settings, setColorTheme, setMode, setColorblind } = useThemeContext()
  const { soundEnabled, toggleSound } = useSoundContext()

  return (
    <HamburgerMenu ariaLabel="Simon theme settings" panelId="simon-theme-menu-panel">
      <div className={styles.sections}>
        <section className={styles.section} aria-label="Theme colors">
          <h2 className={styles.sectionTitle}>Theme</h2>
          <div className={styles.swatchRow}>
            {COLOR_THEMES.map((theme) => {
              const isActive = settings.colorTheme === theme.id

              return (
                <button
                  key={theme.id}
                  type="button"
                  className={`${styles.themeButton} ${isActive ? styles.themeButtonActive : ''}`}
                  onClick={() => setColorTheme(theme.id)}
                  aria-pressed={isActive}
                  title={theme.label}
                >
                  <span className={styles.themeSwatch} style={{ backgroundColor: theme.accent }} />
                  {theme.label}
                </button>
              )
            })}
          </div>
        </section>

        <section className={styles.section} aria-label="Sound settings">
          <h2 className={styles.sectionTitle}>Sound</h2>
          <button
            type="button"
            className={`${styles.modeButton} ${soundEnabled ? styles.modeButtonActive : ''}`}
            onClick={toggleSound}
            aria-pressed={soundEnabled}
          >
            {soundEnabled ? 'Sound On' : 'Sound Off'}
          </button>
        </section>

        <section className={styles.section} aria-label="Color mode">
          <h2 className={styles.sectionTitle}>Mode</h2>
          <div className={styles.modeRow}>
            {MODES.map((mode) => {
              const isActive = settings.mode === mode

              return (
                <button
                  key={mode}
                  type="button"
                  className={`${styles.modeButton} ${isActive ? styles.modeButtonActive : ''}`}
                  onClick={() => setMode(mode)}
                  aria-pressed={isActive}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              )
            })}
          </div>
        </section>

        <section className={styles.section} aria-label="Colorblind support">
          <h2 className={styles.sectionTitle}>Colorblind</h2>
          <div className={styles.colorblindRow}>
            {COLORBLIND_MODES.map((mode) => {
              const isActive = settings.colorblind === mode.id

              return (
                <button
                  key={mode.id}
                  type="button"
                  className={`${styles.colorblindButton} ${isActive ? styles.colorblindButtonActive : ''}`}
                  onClick={() => setColorblind(mode.id)}
                  aria-pressed={isActive}
                  title={mode.description ?? mode.label}
                >
                  {mode.label}
                </button>
              )
            })}
          </div>
        </section>
      </div>
    </HamburgerMenu>
  )
}
