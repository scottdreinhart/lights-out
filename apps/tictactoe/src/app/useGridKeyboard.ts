import { useEffect, useRef } from 'react'

import { BOARD_SIZE } from '../domain/constants.ts'

const NAV_KEYS = new Set([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'w',
  'a',
  's',
  'd',
  'W',
  'A',
  'S',
  'D',
])

const getNextIndex = (current: number, key: string): number => {
  const row = Math.floor(current / BOARD_SIZE)
  const col = current % BOARD_SIZE
  const k = key.length === 1 ? key.toLowerCase() : key

  switch (k) {
    case 'ArrowUp':
    case 'w':
      return row > 0 ? current - BOARD_SIZE : current
    case 'ArrowDown':
    case 's':
      return row < BOARD_SIZE - 1 ? current + BOARD_SIZE : current
    case 'ArrowLeft':
    case 'a':
      return col > 0 ? current - 1 : current
    case 'ArrowRight':
    case 'd':
      return col < BOARD_SIZE - 1 ? current + 1 : current
    default:
      return current
  }
}

const useGridKeyboard = (
  focusedIndex: number,
  onFocusChange: (index: number) => void,
  onSelect: (index: number) => void,
  onNav?: () => void,
): void => {
  const focusedRef = useRef(focusedIndex)
  const selectRef = useRef(onSelect)
  const focusChangeRef = useRef(onFocusChange)
  const navRef = useRef(onNav)

  focusedRef.current = focusedIndex
  selectRef.current = onSelect
  focusChangeRef.current = onFocusChange
  navRef.current = onNav

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const { key } = e

      if (NAV_KEYS.has(key)) {
        e.preventDefault()
        const next = getNextIndex(focusedRef.current, key)
        if (next !== focusedRef.current) {
          focusChangeRef.current(next)
          if (navRef.current) {
            navRef.current()
          }
        }
        return
      }

      if (key === ' ' || key === 'Enter') {
        e.preventDefault()
        selectRef.current(focusedRef.current)
      }
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])
}

export default useGridKeyboard
