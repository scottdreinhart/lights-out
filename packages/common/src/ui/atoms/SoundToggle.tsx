import React from 'react'

import styles from './SoundToggle.module.css'

/**
 * Generic SoundToggle — Button to toggle sound effects on/off
 * 
 * Usage:
 * ```
 * const [soundEnabled, setSoundEnabled] = useState(true)
 * <SoundToggle soundEnabled={soundEnabled} onToggle={() => setSoundEnabled(!soundEnabled)} />
 * ```
 */
interface SoundToggleProps {
  /** Whether sound is currently enabled */
  soundEnabled: boolean
  /** Callback when user clicks toggle */
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
