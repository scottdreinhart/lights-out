import { useEffect, useRef } from 'react'

import type { MouseEventHandler, RefObject } from 'react'

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) =>
      !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true',
  )
}

function handleTabLoop(event: KeyboardEvent, dialog: HTMLElement) {
  const modalFocusable = getFocusableElements(dialog)
  if (modalFocusable.length === 0) {
    event.preventDefault()
    dialog.focus()
    return
  }

  const first = modalFocusable[0]
  const last = modalFocusable[modalFocusable.length - 1]
  const active = document.activeElement

  if (event.shiftKey && active === first) {
    event.preventDefault()
    last.focus()
    return
  }

  if (!event.shiftKey && active === last) {
    event.preventDefault()
    first.focus()
  }
}

export interface UseDialogA11yResult {
  dialogRef: RefObject<HTMLElement | null>
  onBackdropMouseDown: MouseEventHandler<HTMLDivElement>
}

export function useDialogA11y(isOpen: boolean, onClose: () => void): UseDialogA11yResult {
  const dialogRef = useRef<HTMLElement | null>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null

    const dialog = dialogRef.current
    if (!dialog) {
      return undefined
    }

    const focusables = getFocusableElements(dialog)
    const initialFocus = focusables[0] ?? dialog
    initialFocus.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      const currentDialog = dialogRef.current
      if (!currentDialog) {
        return
      }

      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key === 'Tab') {
        handleTabLoop(event, currentDialog)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)

      if (previousFocusRef.current && previousFocusRef.current.isConnected) {
        previousFocusRef.current.focus()
        return
      }

      const fallbackTrigger = document.querySelector('[aria-haspopup="menu"]')
      if (fallbackTrigger instanceof HTMLElement) {
        fallbackTrigger.focus()
      }
    }
  }, [isOpen, onClose])

  const onBackdropMouseDown: MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return { dialogRef, onBackdropMouseDown }
}
