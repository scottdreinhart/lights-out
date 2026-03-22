import { useEffect, useRef } from 'react'

interface DropdownConfig {
	open: boolean
	onClose: () => void
	triggerRef: React.RefObject<HTMLElement | null>
	panelRef: React.RefObject<HTMLElement | null>
	onOutsideClick?: () => void
}

export const useDropdownBehavior = ({
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

		const handleOutside = (event: Event) => {
			const target = event.target as Node
			const isTrigger = triggerRef.current?.contains(target) ?? false
			const isPanel = panelRef.current?.contains(target) ?? false

			if (!isTrigger && !isPanel) {
				onOutsideClick?.()
				onCloseRef.current()
			}
		}

		const handleKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
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