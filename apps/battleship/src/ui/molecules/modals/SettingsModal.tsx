/**
 * Settings Modal Adapter for Battleship App
 * Wraps the shared SettingsModal component from @games/bingo-ui-components
 * with battleship-specific theme configuration and game rules.
 */

import { useThemeContext } from '@/app'
import { COLOR_THEMES } from '@/domain'
import { SettingsModal as SharedSettingsModal, type Theme } from '@games/bingo-ui-components/organisms'

export interface SettingsModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
}

/**
 * Settings modal for configuring Battleship game preferences.
 * Includes theme/color selection specific to the Battleship game.
 */
export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, setColorTheme } = useThemeContext()

  // Convert game COLOR_THEMES to shared Theme format
  const themes: Theme[] = COLOR_THEMES.map((theme) => ({
    id: theme.id,
    label: theme.label,
    color: theme.accent,
  }))

  const handleThemeChange = (themeId: string) => {
    setColorTheme(themeId)
  }

  return (
    <SharedSettingsModal
      isOpen={isOpen}
      onClose={onClose}
      themes={themes}
      selectedTheme={settings.colorTheme}
      onThemeChange={handleThemeChange}
    />
  )
}
