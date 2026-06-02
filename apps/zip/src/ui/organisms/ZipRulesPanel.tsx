import styles from './ZipGame.module.css'

type ZipRulesPanelProps = {
  isOpen: boolean
  onClose: () => void
}

export const ZipRulesPanel = ({ isOpen, onClose }: ZipRulesPanelProps) => {
  if (!isOpen) {
    return null
  }

  return (
    <div
      id="zip-rules-panel"
      className={styles.instructions}
      onClick={onClose}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClose()
        }
      }}
      aria-label="How to play rules panel. Click anywhere to close"
    >
      <h3>How to Play:</h3>
      <ul>
        <li>Use arrow keys or WASD to move through the maze</li>
        <li>Navigate to collect all golden items (★)</li>
        <li>Reach the red goal (G) after collecting all items</li>
        <li>Avoid hitting walls - you can only move through open paths</li>
        <li>Use hints to see the next optimal move</li>
        <li>Solve All will complete the maze automatically</li>
      </ul>
    </div>
  )
}
