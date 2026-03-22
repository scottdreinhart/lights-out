/**
 * SettingsOverlay — unified settings panel for tictactoe.
 * Combines difficulty, series length, theme, sound, and colorblind options.
 */

import { useThemeContext } from '@/app'
import type { Difficulty } from '@/domain'
import styles from './Overlay.module.css'

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']

interface SettingsOverlayProps {
  difficulty: Difficulty
  seriesLength: number
  soundEnabled: boolean
  onSetDifficulty: (d: Difficulty) => void
  onSetSeriesLength: (n: number) => void
  onToggleSound: () => void
  onBack: () => void
}

export function SettingsOverlay({
  difficulty,
  seriesLength,
  soundEnabled,
  onSetDifficulty,
  onSetSeriesLength,
  onToggleSound,
  onBack,
}: SettingsOverlayProps) {
  const { settings, setColorTheme, setMode, setColorblind } = useThemeContext()

  const themes = ['forest', 'ocean', 'sunset', 'rose', 'midnight', 'highcontrast']
  const modes = ['light', 'dark', 'system']
  const colorblindModes = ['none', 'protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia']

  return (
    <div className={styles.overlay}>
      <h1 className={styles.title}>Settings</h1>
      <div className={styles.settingsScroll} style={{ width: '100%', maxWidth: '400px' }}>
        {/* Difficulty */}
        <div className={styles.settingsSection}>
          <div className={styles.label}>Difficulty</div>
          <div className={styles.selectorRow}>
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                className={d === difficulty ? styles.selectorBtnActive : styles.selectorBtn}
                onClick={() => onSetDifficulty(d)}
                style={{ textTransform: 'capitalize' }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Series Length */}
        <div className={styles.settingsSection}>
          <div className={styles.label}>Series</div>
          <div className={styles.selectorRow}>
            {[1, 3, 5].map((n) => (
              <button
                key={n}
                className={n === seriesLength ? styles.selectorBtnActive : styles.selectorBtn}
                onClick={() => onSetSeriesLength(n)}
              >
                Best of {n}
              </button>
            ))}
          </div>
        </div>

        {/* Sound */}
        <div className={styles.settingsSection}>
          <div className={styles.label}>Sound</div>
          <div className={styles.row}>
            <button
              className={soundEnabled ? styles.toggleBtnOn : styles.toggleBtn}
              onClick={onToggleSound}
            >
              {soundEnabled ? 'On' : 'Off'}
            </button>
          </div>
        </div>

        {/* Color Theme */}
        <div className={styles.settingsSection}>
          <div className={styles.label}>Color Theme</div>
          <div className={styles.selectorRow}>
            {themes.map((t) => (
              <button
                key={t}
                className={
                  t === settings.colorTheme ? styles.selectorBtnActive : styles.selectorBtn
                }
                onClick={() => setColorTheme(t as any)}
                style={{ textTransform: 'capitalize', fontSize: '0.75rem' }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Display Mode */}
        <div className={styles.settingsSection}>
          <div className={styles.label}>Display Mode</div>
          <div className={styles.selectorRow}>
            {modes.map((m) => (
              <button
                key={m}
                className={m === settings.mode ? styles.selectorBtnActive : styles.selectorBtn}
                onClick={() => setMode(m as any)}
                style={{ textTransform: 'capitalize' }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Colorblind Mode */}
        <div className={styles.settingsSection}>
          <div className={styles.label}>Colorblind Mode</div>
          <div className={styles.selectorRow}>
            {colorblindModes.map((cb) => (
              <button
                key={cb}
                className={
                  cb === settings.colorblind ? styles.selectorBtnActive : styles.selectorBtn
                }
                onClick={() => setColorblind(cb as any)}
                style={{ textTransform: 'capitalize', fontSize: '0.7rem' }}
              >
                {cb}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.menu} style={{ marginTop: '1.5rem' }}>
        <button className={styles.menuBtnPrimary} onClick={onBack} autoFocus>
          Back
        </button>
      </div>
    </div>
  )
}
