/**
 * Settings Modal Adapter for Checkers App.
 * Uses the shared settings shell contract for open/close lifecycle.
 */

import { SettingsModal as SharedSettingsModal } from '@games/bingo-ui-components/organisms'

export interface SettingsModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
}

const SETTINGS_THEMES = [
  { id: 'classic', label: 'Classic', color: '#2563eb' },
  { id: 'forest', label: 'Forest', color: '#16a34a' },
  { id: 'sunset', label: 'Sunset', color: '#f97316' },
  { id: 'high-contrast', label: 'High Contrast', color: '#ffcc00' },
]

/**
 * Settings modal entrypoint for Checkers.
 */
export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  return <SharedSettingsModal isOpen={isOpen} onClose={onClose} themes={SETTINGS_THEMES} />
}
