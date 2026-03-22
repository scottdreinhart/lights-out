/**
 * MainMenu — title screen with hamburger menu for direct access to menus.
 */

import { useState } from 'react'
import styles from './Overlay.module.css'

interface MainMenuProps {
  onPlay: () => void
  onSettings: () => void
  onHelp: () => void
  onStats: () => void
}

export function MainMenu({ onPlay, onSettings, onHelp, onStats }: MainMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className={styles.overlay}>
      <button
        className={styles.hamburger}
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Menu"
        aria-expanded={menuOpen}
      >
        <span />
        <span />
        <span />
      </button>

      {menuOpen && (
        <div
          className={styles.dropdownMenu}
          style={{
            position: 'absolute',
            top: '5rem',
            right: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            minWidth: '160px',
            background: 'rgba(30, 30, 50, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            zIndex: 110,
          }}
        >
          <button
            style={{
              padding: '0.7rem 1rem',
              background: 'transparent',
              border: 'none',
              color: 'var(--fg, #e0e0e0)',
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            }}
            onClick={() => {
              setMenuOpen(false)
              onSettings()
            }}
          >
            Settings
          </button>
          <button
            style={{
              padding: '0.7rem 1rem',
              background: 'transparent',
              border: 'none',
              color: 'var(--fg, #e0e0e0)',
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            }}
            onClick={() => {
              setMenuOpen(false)
              onHelp()
            }}
          >
            How to Play
          </button>
          <button
            style={{
              padding: '0.7rem 1rem',
              background: 'transparent',
              border: 'none',
              color: 'var(--fg, #e0e0e0)',
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left',
            }}
            onClick={() => {
              setMenuOpen(false)
              onStats()
            }}
          >
            Stats
          </button>
        </div>
      )}

      <h1 className={styles.title}>Tic Tac Toe</h1>
      <p className={styles.subtitle}>AI-Powered Strategy Game</p>
      <div className={styles.menu}>
        <button className={styles.menuBtnPrimary} onClick={onPlay} autoFocus>
          Play
        </button>
      </div>
      <div className={styles.controls}>
        Click squares or use arrow keys &middot; Space/Enter to select &middot; Ctrl+Z to undo
      </div>
    </div>
  )
}
