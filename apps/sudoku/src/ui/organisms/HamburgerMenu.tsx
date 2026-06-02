import { HamburgerMenu as SharedHamburgerMenu, type MenuItem } from '@games/common'

export interface HamburgerMenuProps {
  onRules: () => void
  onSettings: () => void
}

/**
 * Sudoku HamburgerMenu adapter.
 *
 * Provides consistent menu access for How to Play (Rules) and Settings.
 * Uses shared HamburgerMenu from @games/common for portal rendering and positioning.
 */
export function HamburgerMenu({ onRules, onSettings }: HamburgerMenuProps) {
  const items: MenuItem[] = [
    {
      label: 'How to Play',
      icon: '🎮',
      action: onRules,
    },
    {
      label: 'Settings',
      icon: '⚙️',
      action: onSettings,
    },
  ]

  return <SharedHamburgerMenu items={items} />
}
