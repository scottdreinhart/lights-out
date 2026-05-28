import { FAST_DRAW_SPEED, SLOW_DRAW_SPEED } from '@/domain/constants'

interface DrawPanelProps {
  currentNumber: number | null
  numbersDrawn: number
  totalNumbers: number
  drawSpeed: number
  isAutoDrawing: boolean
  disabled: boolean
  winners: string[]
  onDraw: () => void
  onReset: () => void
  onToggleAutoDraw: () => void
  onDrawSpeedChange: (speed: number) => void
}

export function DrawPanel({
  currentNumber,
  numbersDrawn,
  totalNumbers,
  drawSpeed,
  isAutoDrawing,
  disabled,
  winners,
  onDraw,
  onReset,
  onToggleAutoDraw,
  onDrawSpeedChange,
}: DrawPanelProps) {
  return (
    <section className="draw-panel" aria-label="Bingo blackout draw controls">
      <div className="draw-number" aria-live="polite">
        {currentNumber ?? '--'}
      </div>
      <div className="draw-meta">
        <span>
          Drawn: {numbersDrawn}/{totalNumbers}
        </span>
        <span>Speed: {(drawSpeed / 1000).toFixed(1)}s</span>
      </div>
      <button type="button" className="control-button" onClick={onDraw} disabled={disabled}>
        Draw Number
      </button>
      <button
        type="button"
        className="control-button"
        onClick={onToggleAutoDraw}
        disabled={disabled}
      >
        {isAutoDrawing ? 'Stop Auto' : 'Start Auto'}
      </button>
      <button type="button" className="control-button" onClick={onReset}>
        Reset Round
      </button>
      <label htmlFor="draw-speed-select">Auto-draw speed</label>
      <select
        id="draw-speed-select"
        value={drawSpeed}
        onChange={(event) => onDrawSpeedChange(Number(event.target.value))}
        disabled={isAutoDrawing}
      >
        <option value={FAST_DRAW_SPEED}>Fast (1.0s)</option>
        <option value={2000}>Standard (2.0s)</option>
        <option value={SLOW_DRAW_SPEED}>Slow (3.0s)</option>
      </select>
      {winners.length > 0 && (
        <div className="winner-banner" role="status">
          Winner{winners.length > 1 ? 's' : ''}: {winners.join(', ')}
        </div>
      )}
    </section>
  )
}
