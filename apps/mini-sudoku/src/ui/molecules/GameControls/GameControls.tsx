import React from 'react'
import { Button } from '@/ui/atoms'

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