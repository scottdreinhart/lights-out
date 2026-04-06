import { RulesModal as SharedRulesModal } from '@games/bingo-ui-components/organisms'

export interface RulesModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * RulesModal — Sudoku-Specific Rules
 *
 * Displays the rules of Sudoku gameplay to the player.
 * Adapted from the shared RulesModal component with Sudoku-specific content.
 */
export function RulesModal({ isOpen, onClose }: RulesModalProps) {
  const sections = [
    {
      title: 'Objective',
      content:
        'Fill a 9×9 grid with numbers 1-9 such that each row, column, and 3×3 box contains all digits 1-9 exactly once.',
    },
    {
      title: 'The Board',
      content:
        'The puzzle is divided into 9 rows, 9 columns, and 9 boxes (3×3 regions). Some cells already contain numbers (clues), and you must fill the empty cells.',
    },
    {
      title: 'Placement Rules',
      content:
        'Each row must contain all digits 1-9. Each column must contain all digits 1-9. Each 3×3 box must contain all digits 1-9. No digit can repeat in the same row, column, or box.',
    },
    {
      title: 'Solving Strategy',
      content:
        'Look for cells where only one number is possible. Analyze rows, columns, and boxes to eliminate candidates. Use logical deduction rather than guessing.',
    },
    {
      title: 'Tips',
      content:
        'Start with easier difficulty levels to learn the patterns. Look for "naked singles" (cells with only one possible value) and "hidden singles" (values that can only go in one place in a row/column/box). Complete each row, column, and box systematically.',
    },
  ]

  return <SharedRulesModal isOpen={isOpen} onClose={onClose} sections={sections} />
}
