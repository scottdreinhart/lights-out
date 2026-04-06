import { HamburgerMenu as SharedHamburgerMenu, type MenuItem } from '@games/common'

export interface HamburgerMenuProps {
  onSettings: () => void
  onNewGame: () => void
  onAbout: () => void
}

/**
 * Battleship HamburgerMenu — Adapter for local callbacks
 *
 * Converts Battleship-specific callbacks to the shared menu items format.
 * Uses the shared HamburgerMenu from @games/common for consistent behavior.
 */
export function HamburgerMenu({ onSettings, onNewGame, onAbout }: HamburgerMenuProps) {
  // Convert callbacks to items format for shared component
  const menuItems: MenuItem[] = [
    {
      label: 'New Game',
      icon: '🎮',
      action: onNewGame,
    },
    {
      label: 'Settings',
      icon: '⚙️',
      action: onSettings,
    },
    {
      label: 'About',
      icon: 'ℹ️',
      action: onAbout,
    },
  ]

  return <SharedHamburgerMenu items={menuItems} ariaLabel="Battleship menu" />
}
