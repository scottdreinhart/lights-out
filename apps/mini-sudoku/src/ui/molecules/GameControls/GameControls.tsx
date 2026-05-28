import { Button } from '@/ui/atoms'
import React from 'react'

interface GameControlsProps {
  onReset: () => void
}

export const GameControls: React.FC<GameControlsProps> = ({ onReset }) => {
  return (
    <Button onClick={onReset} variant="danger" size="lg">
      New Game
    </Button>
  )
}
