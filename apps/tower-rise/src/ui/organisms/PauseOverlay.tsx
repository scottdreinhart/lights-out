/**
 * TODO: PURPOSE
 * TODO: Render pause-state overlay while retaining stage visibility.
 *
 * TODO: RESPONSIBILITY
 * TODO: Presentation-only pause messaging.
 *
 * TODO: INPUTS
 * TODO: None.
 *
 * TODO: OUTPUTS
 * TODO: Overlay message block.
 *
 * TODO: DEPENDENCIES
 * TODO: React only.
 *
 * TODO: EDGE CASES
 * TODO: Overlay should not trap focus from global keyboard controls.
 *
 * TODO: PERFORMANCE NOTES
 * TODO: Stateless overlay.
 */
export const PauseOverlay = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center',
      background: 'rgba(0, 0, 0, 0.35)',
      color: '#fff',
      fontSize: '1.6rem',
      fontWeight: 700,
      pointerEvents: 'none',
    }}
  >
    Paused
  </div>
)
