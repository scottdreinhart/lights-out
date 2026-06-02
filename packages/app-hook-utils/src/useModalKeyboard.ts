import { useEffect } from 'react'

/**
 * Hook for handling modal/dialog keyboard interactions.
 * Centralizes the common pattern of dismissing modals on Escape key.
 *
 * Useful for modal dialogs, popovers, and overlay elements.
 *
 * @param ref - React ref to the dialog/modal element
 * @param onClose - Callback when modal should close (Escape key pressed)
 * @param isOpen - Whether the modal is currently open (optional, defaults to true)
 *
 * @example
 * const dialogRef = useRef<HTMLDialogElement>(null)
 * useModalKeyboard(dialogRef, () => setIsOpen(false))
 */
export function useModalKeyboard(
	ref: React.RefObject<HTMLDialogElement | HTMLDivElement>,
	onClose: () => void,
	isOpen: boolean = true,
): void {
	useEffect(() => {
		if (!isOpen || !ref.current) {
			return
		}

		const handleKeyDown = (event: Event) => {
			if (!(event instanceof KeyboardEvent)) {
				return
			}

			// Close on Escape key
			if (event.key === 'Escape') {
				event.preventDefault()
				onClose()
			}
		}

		ref.current.addEventListener('keydown', handleKeyDown as EventListener)
		return () => {
			ref.current?.removeEventListener('keydown', handleKeyDown as EventListener)
		}
	}, [ref, onClose, isOpen])
}
