import { type InputAction, useGameInput } from '@games/app-hook-utils'

export interface ControlButton {
  action: InputAction
  label: string
  variant?: 'primary' | 'secondary' | 'outline'
}

export interface GameControlsProps {
  onAction: (action: InputAction) => void
  showTouchControls?: boolean
  buttons?: ControlButton[]
}

export function GameControls({
  onAction,
  showTouchControls = true,
  buttons = [
    { action: 'ROLL', label: 'ROLL', variant: 'primary' },
    { action: 'HOLD', label: 'HOLD', variant: 'secondary' },
  ],
}: GameControlsProps) {
  // Bind keyboard/gamepad inputs
  useGameInput(onAction)

  if (!showTouchControls) {
    return null
  }

  return (
    <div className="game-controls touch-only">
      <div className="action-buttons">
        {buttons.map((btn) => (
          <button
            key={btn.action}
            onClick={() => onAction(btn.action)}
            className={`btn-${btn.variant || 'primary'}`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  )
}
