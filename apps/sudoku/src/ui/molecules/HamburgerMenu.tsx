import { HamburgerMenu as SharedHamburgerMenu, type MenuItem } from '@games/common'

export interface HamburgerMenuProps {
  onRules: () => void
  onHelp: () => void
  onSettings: () => void
  onToggleSound: () => void
  onExit: () => void
  soundEnabled: boolean
}

/**
 * HamburgerMenu — Adapter for local callbacks
 *
 * Converts game-specific callbacks to the shared menu items format.
 * Uses the shared HamburgerMenu from @games/common for consistent behavior.
 */
export function HamburgerMenu({
  onRules,
  onHelp,
  onSettings,
  onToggleSound,
  onExit,
  soundEnabled,
}: HamburgerMenuProps) {
  // Convert callbacks to items format for shared component
  const menuItems: MenuItem[] = [
    {
      label: 'Rules',
      icon: '📖',
      action: onRules,
    },
    {
      label: 'Help',
      icon: '❓',
      action: onHelp,
    },
    {
      label: 'Settings',
      icon: '⚙️',
      action: onSettings,
    },
    {
      label: soundEnabled ? 'Mute Sounds' : 'Enable Sounds',
      icon: soundEnabled ? '🔊' : '🔇',
      action: onToggleSound,
    },
    {
      label: 'Back to Menu',
      icon: '🏠',
      action: onExit,
    },
  ]

  return <SharedHamburgerMenu items={menuItems} ariaLabel="Game menu" />
}
