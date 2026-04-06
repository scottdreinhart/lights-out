import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './HamburgerMenu.module.css'

export interface MenuItem {
  label: string
  icon?: string | React.ReactNode
  action: () => void
}

export interface HamburgerMenuProps {
  items?: MenuItem[]
  onOpen?: () => void
  onClose?: () => void
}

/**
 * Generic hamburger menu component for navigation and quick actions.
 * Accepts customizable menu items via props.
 * Defaults to Settings and About if no items provided.
 */
export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  items = [
    {
      label: 'Settings',
      icon: '⚙️',
      action: () => console.warn('Settings action not provided'),
    },
    {
      label: 'About',
      icon: 'ℹ️',
      action: () => console.warn('About action not provided'),
    },
  ],
  onOpen,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        onClose?.()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  // Handle Escape key
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
        onClose?.()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey)
      return () => document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isOpen, onClose])

  const handleOpenToggle = useCallback(() => {
    const newState = !isOpen
    setIsOpen(newState)
    if (newState) {
      onOpen?.()
    } else {
      onClose?.()
    }
  }, [isOpen, onOpen, onClose])

  const handleMenuItemClick = useCallback(
    (item: MenuItem) => {
      item.action()
      setIsOpen(false)
      onClose?.()
    },
    [onClose],
  )

  return (
    <div ref={menuRef} className={styles.menu}>
      <button
        type="button"
        className={`${styles.hamburger} ${isOpen ? styles.active : ''}`}
        onClick={handleOpenToggle}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls="hamburger-menu-dropdown"
      >
        <span className={styles.line} />
        <span className={styles.line} />
        <span className={styles.line} />
      </button>

      {isOpen && (
        <nav className={styles.dropdown} id="hamburger-menu-dropdown" role="menu">
          <ul className={styles.list}>
            {items.map((item, index) => (
              <li key={`${item.label}-${index}`} role="none">
                <button
                  type="button"
                  className={styles.item}
                  onClick={() => handleMenuItemClick(item)}
                  role="menuitem"
                >
                  {item.icon && (
                    <span className={styles.icon}>
                      {typeof item.icon === 'string' ? item.icon : item.icon}
                    </span>
                  )}
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}
