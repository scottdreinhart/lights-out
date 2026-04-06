import { HelpModal as SharedHelpModal } from '@games/bingo-ui-components/organisms'

export interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * HelpModal — Sudoku FAQ
 *
 * Displays frequently asked questions and tips for Sudoku gameplay.
 * Adapted from the shared HelpModal component with Sudoku-specific content.
 */
export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const faqs = [
    {
      question: 'What is a Sudoku?',
      answer:
        'Sudoku is a logic puzzle where you fill a 9×9 grid with digits 1-9. The challenge is that each row, column, and 3×3 box must contain all digits 1-9 exactly once.',
    },
    {
      question: 'How do I start solving a puzzle?',
      answer:
        'Look for rows, columns, or boxes that already have many numbers. Find cells where only one number fits by eliminating other possibilities. This is called "logical deduction" or "constraint propagation."',
    },
    {
      question: 'What are the difficulty levels?',
      answer:
        'Easy: Puzzles with many clues, simple logic required. Medium: Moderate clues, some advanced techniques needed. Hard: Fewer clues, requires systematic analysis. Expert: Minimal clues, very challenging.',
    },
    {
      question: 'How do I move the cursor on the board?',
      answer:
        'Use arrow keys (↑, ↓, ←, →) or WASD keys to navigate the grid. Press Enter or Space to place your number. Press Backspace or Delete to clear a cell.',
    },
    {
      question: 'Can I enter a number using the number keys?',
      answer:
        'Yes! Press 1-9 to directly place that number in the selected cell. The Number Pad below also lets you click numbers. Press 0 or Backspace to clear.',
    },
    {
      question: 'What if I get stuck?',
      answer:
        'Step back and analyze the board systematically. Look for rows, columns, or boxes with many numbers filled in. Try a different difficulty level if this one feels too challenging.',
    },
    {
      question: 'Can I undo my moves?',
      answer:
        'Currently, the puzzle does not support undo. You can start over by creating a new puzzle with the "New Game" button.',
    },
    {
      question: 'How long should a puzzle take?',
      answer:
        'Easy puzzles usually take 5-15 minutes. Medium: 15-45 minutes. Hard: 45+ minutes. Expert: 1+ hours. The timer helps you track your solving speed.',
    },
  ]

  return <SharedHelpModal isOpen={isOpen} onClose={onClose} title="Sudoku Help" items={faqs} />
}
