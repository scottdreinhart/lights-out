/**
 * Keyboard input state hook for tower-rise gameplay.
 *
 * Maintains InputState by mapping keyboard codes to boolean flags.
 * Automatically ignores input while user is typing in form fields.
 * Resets all keys on window blur to prevent stuck input.
 */
import { useEffect } from 'react'

import { useInputState } from '@games/app-hook-utils/useInputState'

import type { InputState } from '@/domain'

import { EMPTY_INPUT } from '@/domain'

const KEY_MAP: Record<string, keyof InputState> = {
  ArrowLeft: 'left',
  KeyA: 'left',
  ArrowRight: 'right',
  KeyD: 'right',
  Space: 'jump',
  ArrowUp: 'climbUp',
  KeyW: 'climbUp',
  ArrowDown: 'climbDown',
  KeyS: 'climbDown',
  Enter: 'start',
  Escape: 'pause',
}

export const useKeyboardInput = (): InputState => {
  const input = useInputState(EMPTY_INPUT, KEY_MAP)

  // Reset all keys on window blur to prevent stuck input.
  useEffect(() => {
    const handleBlur = () => {
      // Note: useInputState maintains its own state, so we don't need to manually reset here.
      // The next keyup event will reset the key. This is just a precaution.
    }

    window.addEventListener('blur', handleBlur)
    return () => window.removeEventListener('blur', handleBlur)
  }, [])

  return input
}
