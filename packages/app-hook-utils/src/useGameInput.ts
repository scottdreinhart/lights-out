import { useEffect } from 'react'
import {
  DIRECTIONAL_KEYS,
  ACTION_KEYS,
  GAME_ACTION_KEYS,
} from './keyBindingsRegistry'

export type InputAction = 'ROLL' | 'HOLD' | 'MENU' | 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'SELECT' | 'BACK' | 'PASS' | 'CONTINUE'

const matchesKeyboardCode = (codes: readonly string[], code: string): boolean => codes.includes(code)

export const useGameInput = (onAction: (action: InputAction) => void) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check game action keys
      if (matchesKeyboardCode(GAME_ACTION_KEYS.ROLL.keyboard, e.code)) {
        onAction('ROLL')
        return
      }
      if (matchesKeyboardCode(GAME_ACTION_KEYS.HOLD.keyboard, e.code)) {
        onAction('HOLD')
        return
      }
      if (matchesKeyboardCode(ACTION_KEYS.MENU.keyboard, e.code)) {
        onAction('MENU')
        return
      }

      // Check directional keys
      if (matchesKeyboardCode(DIRECTIONAL_KEYS.UP.keyboard, e.code)) {
        onAction('UP')
        return
      }
      if (matchesKeyboardCode(DIRECTIONAL_KEYS.DOWN.keyboard, e.code)) {
        onAction('DOWN')
        return
      }
      if (matchesKeyboardCode(DIRECTIONAL_KEYS.LEFT.keyboard, e.code)) {
        onAction('LEFT')
        return
      }
      if (matchesKeyboardCode(DIRECTIONAL_KEYS.RIGHT.keyboard, e.code)) {
        onAction('RIGHT')
        return
      }

      // Check other game actions
      if (matchesKeyboardCode(GAME_ACTION_KEYS.PASS.keyboard, e.code)) {
        onAction('PASS')
        return
      }
      if (matchesKeyboardCode(GAME_ACTION_KEYS.CONTINUE.keyboard, e.code)) {
        onAction('CONTINUE')
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onAction])
}
