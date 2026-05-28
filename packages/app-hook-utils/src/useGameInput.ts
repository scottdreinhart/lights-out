import { useEffect } from 'react'
import {
  DIRECTIONAL_KEYS,
  ACTION_KEYS,
  GAME_ACTION_KEYS,
} from './keyBindingsRegistry'

export type InputAction = 'ROLL' | 'HOLD' | 'MENU' | 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'SELECT' | 'BACK' | 'PASS' | 'CONTINUE'

export const useGameInput = (onAction: (action: InputAction) => void) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check game action keys
      if (GAME_ACTION_KEYS.ROLL.keyboard.includes(e.code)) {
        onAction('ROLL')
        return
      }
      if (GAME_ACTION_KEYS.HOLD.keyboard.includes(e.code)) {
        onAction('HOLD')
        return
      }
      if (ACTION_KEYS.MENU.keyboard.includes(e.code)) {
        onAction('MENU')
        return
      }

      // Check directional keys
      if (DIRECTIONAL_KEYS.UP.keyboard.includes(e.code)) {
        onAction('UP')
        return
      }
      if (DIRECTIONAL_KEYS.DOWN.keyboard.includes(e.code)) {
        onAction('DOWN')
        return
      }
      if (DIRECTIONAL_KEYS.LEFT.keyboard.includes(e.code)) {
        onAction('LEFT')
        return
      }
      if (DIRECTIONAL_KEYS.RIGHT.keyboard.includes(e.code)) {
        onAction('RIGHT')
        return
      }

      // Check other game actions
      if (GAME_ACTION_KEYS.PASS.keyboard.includes(e.code)) {
        onAction('PASS')
        return
      }
      if (GAME_ACTION_KEYS.CONTINUE.keyboard.includes(e.code)) {
        onAction('CONTINUE')
        return
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onAction])
}
