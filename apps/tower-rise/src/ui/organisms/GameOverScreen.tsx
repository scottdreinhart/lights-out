/**
 * TODO: PURPOSE
 * TODO: Render game-over overlay with restart call-to-action.
 *
 * TODO: RESPONSIBILITY
 * TODO: Present terminal run state and restart trigger only.
 *
 * TODO: INPUTS
 * TODO: `onRestart` callback.
 *
 * TODO: OUTPUTS
 * TODO: Overlay UI with restart button.
 *
 * TODO: DEPENDENCIES
 * TODO: React only.
 *
 * TODO: EDGE CASES
 * TODO: Restart remains keyboard and pointer accessible.
 *
 * TODO: PERFORMANCE NOTES
 * TODO: Static render with callback prop.
 */
interface GameOverScreenProps {
  onRestart: () => void
}

export const GameOverScreen = ({ onRestart }: GameOverScreenProps) => (
  <div
    style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: '#fff' }}
  >
    <div style={{ textAlign: 'center' }}>
      <h2>Game Over</h2>
      <button type="button" onClick={onRestart} style={{ minWidth: 180, minHeight: 52 }}>
        Restart
      </button>
    </div>
  </div>
)
