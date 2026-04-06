/**
 * Swedish Bingo (Bingo-80) - DrawPanel component
 */

import './DrawPanel.module.css'

interface DrawPanelProps {
  currentNumber: number | null
  numbersDrawn: number
  totalNumbers: number
  onDraw: () => void
  onReset: () => void
  disabled?: boolean
  winners?: string[]
}

export function DrawPanel({
  currentNumber,
  numbersDrawn,
  totalNumbers,
  onDraw,
  onReset,
  disabled = false,
  winners = [],
}: DrawPanelProps) {
  return (
    <div className="draw-panel">
      <div className="draw-display">
        <div className="current-number">{currentNumber !== null ? currentNumber : '—'}</div>
        <div className="progress-info">
          <div className="progress-label">Numbers Drawn</div>
          <div className="progress-count">
            {numbersDrawn} / {totalNumbers}
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(numbersDrawn / totalNumbers) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="draw-actions">
        <button
          onClick={onDraw}
          disabled={disabled || numbersDrawn >= totalNumbers}
          className="draw-button"
          aria-label="Draw next number"
        >
          Draw
        </button>
      </div>

      {winners.length > 0 && (
        <div className="winners-notice">
          <div className="winners-label">Winners: {winners.length}</div>
        </div>
      )}
    </div>
  )
}
