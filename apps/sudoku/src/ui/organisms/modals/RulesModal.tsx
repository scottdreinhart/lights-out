export interface RulesModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RulesModal({ isOpen, onClose }: RulesModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sudoku-rules-title"
        tabIndex={0}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            onClose()
          }
        }}
      >
        <button type="button" className="modal-close" aria-label="Close rules" onClick={onClose}>
          ✕
        </button>
        <h2 id="sudoku-rules-title">How to Play Sudoku</h2>
        <h3>Objective</h3>
        <p>
          Fill a 9×9 grid with numbers 1-9 such that each row, column, and 3×3 box contains all
          digits 1-9 exactly once.
        </p>
        <h3>The Board</h3>
        <p>
          The puzzle is divided into 9 rows, 9 columns, and 9 boxes (3×3 regions). Some cells
          already contain numbers (clues), and you must fill the empty cells.
        </p>
        <h3>Placement Rules</h3>
        <ul>
          <li>Each row must contain all digits 1-9.</li>
          <li>Each column must contain all digits 1-9.</li>
          <li>Each 3×3 box must contain all digits 1-9.</li>
          <li>No digit can repeat in the same row, column, or box.</li>
        </ul>
      </div>
    </div>
  )
}
