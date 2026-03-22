import type { Move } from '@/domain'
import './MoveButton.css'

interface MoveButtonProps {
  move: Move
  onClick: () => void
  disabled?: boolean
  isSelected?: boolean
}

const MOVE_EMOJI: Record<Move, string> = {
  rock: '✊',
  paper: '✋',
  scissors: '✌️',
}

const MOVE_LABELS: Record<Move, string> = {
  rock: '✊',
  paper: '✋',
  scissors: '✌️',
}

export function MoveButton({
  move,
  onClick,
  disabled = false,
  isSelected = false,
}: MoveButtonProps) {
  return (
    <button
      className={`move-button ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      disabled={disabled}
      title={MOVE_LABELS[move]}
    >
      <span className="move-emoji">{MOVE_EMOJI[move]}</span>
    </button>
  )
}
