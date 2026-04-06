import {
  HamburgerMenu as SharedHamburgerMenu,
  type MenuItem,
} from '@games/common'

export interface HamburgerMenuProps {
  onRules: () => void
  onSettings: () => void
  onAbout: () => void
}

/**
 * Rock-Paper-Scissors HamburgerMenu adapter.
 *
 * Provides consistent menu access for How to Play (Rules), Settings, and About.
 * Uses shared HamburgerMenu from @games/common for portal rendering and positioning.
 */
export function HamburgerMenu({ onRules, onSettings, onAbout }: HamburgerMenuProps) {
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
    {
      label: 'About',
      icon: 'ℹ️',
      action: onAbout,
    },
  ]

  return <SharedHamburgerMenu items={items} />
}
