/**
 * TODO: PURPOSE
 * TODO: Render the pre-game entry overlay with a deterministic start action.
 *
 * TODO: RESPONSIBILITY
 * TODO: Own start CTA presentation only.
 *
 * TODO: INPUTS
 * TODO: `onStart` callback.
 *
 * TODO: OUTPUTS
 * TODO: Overlay UI for initial game launch.
 *
 * TODO: DEPENDENCIES
 * TODO: React only.
 *
 * TODO: EDGE CASES
 * TODO: Button remains keyboard accessible.
 *
 * TODO: PERFORMANCE NOTES
 * TODO: Static overlay with no local state.
 */
interface StartScreenProps {
  onStart: () => void
}

export const StartScreen = ({ onStart }: StartScreenProps) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center',
      pointerEvents: 'none',
    }}
  >
    <button
      onClick={onStart}
      style={{
        pointerEvents: 'auto',
        minWidth: 180,
        minHeight: 52,
        fontSize: '1rem',
        fontWeight: 700,
      }}
      type="button"
    >
      Start Game
    </button>
  </div>
)
