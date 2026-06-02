import { useEffect, useMemo, useRef, useState } from 'react'

type Enabled = boolean | (() => boolean)

/**
 * Generic input state hook that maintains a mutable state object.
 * Useful for games that track input as discrete key states (e.g., tower-rise).
 *
 * Maps keyboard keys to state object properties via a key-to-property map.
 * Updates state on keydown/keyup, automatically detecting text input contexts.
 */
export interface UseInputStateOptions {
  enabled?: Enabled
  ignoreInputs?: boolean
  blockedKeys?: string[]
}

/**
 * useInputState maintains a stateful input object updated by keyboard bindings.
 *
 * @param initialState - Initial state object (used as template)
 * @param keyMap - Maps keyboard code (e.g., 'ArrowUp', 'KeyW') to state property name (e.g., 'moveUp')
 * @param options - Configuration
 * @returns Current input state
 *
 * @example
 * const inputState = useInputState(
 *   { left: false, right: false, jump: false },
 *   {
 *     'ArrowLeft': 'left',
 *     'KeyA': 'left',
 *     'ArrowRight': 'right',
 *     'KeyD': 'right',
 *     'Space': 'jump',
 *   }
 * )
 */
export function useInputState<T extends object>(
  initialState: T,
  keyMap: Record<string, keyof T>,
  options: UseInputStateOptions = {},
): T {
  const stateRef = useRef<T>({ ...initialState })
  const [state, setState] = useState<T>({ ...initialState })

  const keyEntries = useMemo(() => Object.entries(keyMap), [keyMap])

  useEffect(() => {
    const isEnabled =
      typeof options.enabled === 'function' ? options.enabled() : (options.enabled ?? true)
    if (!isEnabled) {
      return
    }

    const blockedKeys = new Set(options.blockedKeys ?? [])

    const handleKeyDown = (event: KeyboardEvent) => {
      if (options.ignoreInputs ?? true) {
        const target = event.target as HTMLElement | null
        const tagName = target?.tagName
        if (tagName === 'INPUT' || tagName === 'TEXTAREA' || target?.isContentEditable) {
          return
        }
      }

      if (blockedKeys.has(event.code)) {
        return
      }

      const mappedProperty = keyEntries.find(([code]) => code === event.code)?.[1]
      if (!mappedProperty) {
        return
      }

      stateRef.current = { ...stateRef.current, [mappedProperty]: true } as T
      setState({ ...stateRef.current })
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      const mappedProperty = keyEntries.find(([code]) => code === event.code)?.[1]
      if (!mappedProperty) {
        return
      }

      stateRef.current = { ...stateRef.current, [mappedProperty]: false } as T
      setState({ ...stateRef.current })
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [keyEntries, options.blockedKeys, options.enabled, options.ignoreInputs])

  return state
}
