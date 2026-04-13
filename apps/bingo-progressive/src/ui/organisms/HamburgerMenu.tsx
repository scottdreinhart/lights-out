import { HamburgerMenu as SharedHamburgerMenu, type MenuItem } from '@games/common'

export interface HamburgerMenuProps {
  onRules: () => void
  onSettings: () => void
  onAbout?: () => void
}

export function HamburgerMenu({ onRules, onSettings, onAbout }: HamburgerMenuProps) {
  const items: MenuItem[] = [
    { label: 'How to Play', icon: '🎮', action: onRules },
    { label: 'Settings', icon: '⚙️', action: onSettings },
    ...(onAbout ? [{ label: 'About', icon: 'ℹ️', action: onAbout }] : []),
  ]

  return <SharedHamburgerMenu items={items} />
}
