import { useState } from 'react'

export interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [showConflicts, setShowConflicts] = useState(true)
  const [showCandidates, setShowCandidates] = useState(false)
  const [theme, setTheme] = useState('dark')
  const [reduceAnimations, setReduceAnimations] = useState(false)

  if (!isOpen) {
    return null
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sudoku-settings-title"
        tabIndex={0}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            onClose()
          }
        }}
      >
        <button type="button" className="modal-close" aria-label="Close settings" onClick={onClose}>
          ✕
        </button>
        <h2 id="sudoku-settings-title">Settings</h2>

        <div className="modal-section">
          <h3>Gameplay</h3>
          <label className="modal-label">
            <input
              type="checkbox"
              checked={showConflicts}
              onChange={(event) => setShowConflicts(event.target.checked)}
            />
            Show conflicts
          </label>
          <label className="modal-label">
            <input
              type="checkbox"
              checked={showCandidates}
              onChange={(event) => setShowCandidates(event.target.checked)}
            />
            Show candidates
          </label>
        </div>

        <div className="modal-section">
          <h3>Display</h3>
          <label className="modal-label">
            Theme
            <select value={theme} onChange={(event) => setTheme(event.target.value)}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="high-contrast">High Contrast</option>
            </select>
          </label>
          <label className="modal-label">
            <input
              type="checkbox"
              checked={reduceAnimations}
              onChange={(event) => setReduceAnimations(event.target.checked)}
            />
            Reduce animations
          </label>
        </div>
      </div>
    </div>
  )
}
