/**
 * useToggle — Simple boolean state toggle.
 *
 * Usage:
 *   const [isOpen, toggle, setIsOpen] = useToggle(false)
 *
 *   <button onClick={toggle}>Toggle</button>
 *   <button onClick={() => setIsOpen(true)}>Open</button>
 */

import { useCallback, useState } from 'react'

export function useToggle(
  initialValue: boolean = false,
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    setValue((prev) => !prev)
  }, [])

  return [value, toggle, setValue]
}
