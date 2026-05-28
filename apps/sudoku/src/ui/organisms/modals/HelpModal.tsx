import { useGameInput } from '@games/app-hook-utils'

export interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  useGameInput((action) => {
    if (isOpen && action === 'MENU') {
      onClose()
    }
  })

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="modal-overlay"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="sudoku-help-title">
        <button type="button" className="modal-close" aria-label="Close help" onClick={onClose}>
          ✕
        </button>
        <h2 id="sudoku-help-title">Sudoku Help</h2>
        <h3>What is a Sudoku?</h3>
        <p>
          Sudoku is a logic puzzle where you fill a 9×9 grid with digits 1-9. The challenge is that
          each row, column, and 3×3 box must contain all digits 1-9 exactly once.
        </p>
        <h3>How do I start solving a puzzle?</h3>
        <p>
          Look for rows, columns, or boxes that already have many numbers. Find cells where only one
          number fits by eliminating other possibilities. This is called logical deduction or
          constraint propagation.
        </p>
        <h3>What are the difficulty levels?</h3>
        <p>
          Easy: Puzzles with many clues, simple logic required. Medium: Moderate clues, some
          advanced techniques needed. Hard: Fewer clues, requires systematic analysis. Expert:
          Minimal clues, very challenging.
        </p>
        <h3>How do I move the cursor on the board?</h3>
        <p>
          Use arrow keys (↑, ↓, ←, →) or WASD keys to navigate the grid. Press Enter or Space to
          place your number. Press Backspace or Delete to clear a cell.
        </p>
        <h3>Can I enter a number using the number keys?</h3>
        <p>
          Yes! Press 1-9 to directly place that number in the selected cell. The Number Pad below
          also lets you click numbers. Press 0 or Backspace to clear.
        </p>
        <h3>What if I get stuck?</h3>
        <p>
          Step back and analyze the board systematically. Look for rows, columns, or boxes with many
          numbers filled in. Try a different difficulty level if this one feels too challenging.
        </p>
        <h3>Can I undo my moves?</h3>
        <p>
          Currently, the puzzle does not support undo. You can start over by creating a new puzzle
          with the New Game button.
        </p>
        <h3>How long should a puzzle take?</h3>
        <p>
          Easy puzzles usually take 5-15 minutes. Medium: 15-45 minutes. Hard: 45+ minutes. Expert:
          1+ hours. The timer helps you track your solving speed.
        </p>
      </div>
    </div>
  )
}
