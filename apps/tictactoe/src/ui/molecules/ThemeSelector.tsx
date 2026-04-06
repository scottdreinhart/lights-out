import React, { useCallback, useRef, useState } from 'react'

import type { ThemeSettings } from '@/domain'
import { COLOR_THEMES, COLORBLIND_MODES, MODES } from '@/domain'
import { useDropdownBehavior } from '@games/assets-shared'
import useSmartPosition from '../../app/useSmartPosition.ts'
import { THEME_PANEL_LABEL } from '../ui-constants.ts'
import { cx } from '../utils/cssModules.ts'
import styles from './ThemeSelector.module.css'

interface ThemeSelectorProps {
  settings: ThemeSettings
  onColorTheme: (theme: 'light' | 'dark' | 'system') => void
  onMode: (mode: 'light' | 'dark') => void
  onColorblind: (
    cb: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia',
  ) => void
}

const ThemeSelector: React.FC<ThemeSelectorProps> = React.memo(
  ({ settings, onColorTheme, onMode, onColorblind }) => {
    const [open, setOpen] = useState(false)
    const btnRef = useRef<HTMLButtonElement>(null)
    const panelRef = useRef<HTMLDivElement>(null)

    // Smart positioning: auto-detect left/right to prevent viewport overflow
    const alignment = useSmartPosition({
      trigger: btnRef,
      panel: panelRef,
      minPanelWidth: 280,
      viewportPadding: 16,
      preferredAlignment: 'right',
    })

    const toggle = useCallback(() => {
      setOpen((prev) => !prev)
    }, [])

    // Close on outside click / touch / Escape + focus restoration
    useDropdownBehavior({
      open,
      onClose: () => setOpen(false),
      triggerRef: btnRef,
      panelRef,
    })

    return (
      <div className={styles.root}>
        <button
          ref={btnRef}
          type="button"
          className={styles.toggle}
          onClick={toggle}
          aria-expanded={open}
          aria-label="Theme settings"
          title="Theme settings"
        >
          🎨
        </button>

        {open && (
          <div
            ref={panelRef}
            className={alignment === 'left' ? styles.panelLeft : styles.panel}
            role="dialog"
            aria-label={THEME_PANEL_LABEL}
          >
            {/* ── Color Themes ── */}
            <fieldset className={styles.section}>
              <legend className={styles.sectionLegend}>Theme</legend>
              <div className={styles.swatches}>
                {COLOR_THEMES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={cx(
                      styles.swatch,
                      settings.colorTheme === t.id && styles.swatchActive,
                    )}
                    style={{
                      background: t.accent,
                    }}
                    onClick={() => onColorTheme(t.id as 'light' | 'dark' | 'system')}
                    aria-label={t.label}
                    aria-pressed={settings.colorTheme === t.id}
                    title={t.label}
                  />
                ))}
              </div>
            </fieldset>

            {/* ── Light / Dark Mode ── */}
            <fieldset className={styles.section}>
              <legend className={styles.sectionLegend}>Mode</legend>
              <div className={styles.modeGroup}>
                {MODES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={cx(styles.modeBtn, settings.mode === m && styles.modeActive)}
                    onClick={() => {
                      if (m === 'system') {
                        onColorTheme('system')
                      } else {
                        onMode(m)
                      }
                    }}
                    aria-pressed={settings.mode === m}
                  >
                    {}
                    {m === 'system' ? '⚙️' : m === 'light' ? '☀️' : '🌙'}{' '}
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* ── Colorblind ── */}
            <fieldset className={styles.section}>
              <legend className={styles.sectionLegend}>Colorblind</legend>
              <div className={styles.colorblindGroup}>
                {COLORBLIND_MODES.map((cb) => (
                  <button
                    key={cb.id}
                    type="button"
                    className={cx(
                      styles.colorblindBtn,
                      settings.colorblind === cb.id && styles.colorblindActive,
                    )}
                    onClick={() =>
                      onColorblind(
                        cb.id as
                          | 'none'
                          | 'protanopia'
                          | 'deuteranopia'
                          | 'tritanopia'
                          | 'achromatopsia',
                      )
                    }
                    aria-pressed={settings.colorblind === cb.id}
                    title={cb.description || cb.label}
                  >
                    {cb.label}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        )}
      </div>
    )
  },
)

ThemeSelector.displayName = 'ThemeSelector'

export default ThemeSelector
