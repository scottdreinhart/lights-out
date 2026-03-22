import { useEffect, useRef } from 'react'

interface DropdownConfig {
  open: boolean
  onClose: () => void
  triggerRef: React.RefObject<HTMLElement | null>
  panelRef: React.RefObject<HTMLElement | null>
  onOutsideClick?: () => void
}

/**
 * Dropdown behavior hook: handles outside-click detection, Escape key, and focus management.
 * Attaches listeners to document when dropdown is open; removes on close.
 */
const useDropdownBehavior = ({
  open,
  onClose,
  triggerRef,
  panelRef,
  onOutsideClick,
}: DropdownConfig): void => {
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) {
      return
    }

    const handleOutside = (e: Event) => {
      const target = e.target as Node
      const isTrigger = triggerRef.current?.contains(target) ?? false
      const isPanel = panelRef.current?.contains(target) ?? false

      if (!isTrigger && !isPanel) {
        onOutsideClick?.()
        onCloseRef.current()
      }
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current()
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    document.addEventListener('keydown', handleKey)

    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, triggerRef, panelRef, onOutsideClick])
}

export default useDropdownBehavior
