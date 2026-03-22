import React from 'react'

import styles from './SoundToggle.module.css'

interface SoundToggleProps {
  soundEnabled: boolean
  onToggle: () => void
}

const SoundToggle = React.memo<SoundToggleProps>(({ soundEnabled, onToggle }) => (
  <button
    type="button"
    className={styles.root}
    onClick={onToggle}
    aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
    title={soundEnabled ? 'Sound on' : 'Sound off'}
  >
    {soundEnabled ? '🔊' : '🔇'}
  </button>
))

SoundToggle.displayName = 'SoundToggle'

export default SoundToggle
