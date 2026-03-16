/**
 * HelpOverlay — game rules and controls reference for tictactoe.
 */

import styles from './Overlay.module.css'

interface HelpOverlayProps {
  onBack: () => void
}

export function HelpOverlay({ onBack }: HelpOverlayProps) {
  return (
    <div className={styles.overlay}>
      <h1 className={styles.title}>How to Play</h1>
      <div className={styles.helpText}>
        <h3>Controls</h3>
        <ul>
          <li>
            <kbd>Arrow Keys</kbd> or <kbd>Tab</kbd> to navigate squares
          </li>
          <li>
            <kbd>Enter</kbd> or <kbd>Space</kbd> to select a square
          </li>
          <li>
            <kbd>Mouse</kbd> to click squares directly
          </li>
          <li>
            <kbd>Ctrl+Z</kbd> to undo a move
          </li>
          <li>
            <kbd>Ctrl+Y</kbd> or <kbd>Ctrl+Shift+Z</kbd> to redo a move
          </li>
        </ul>

        <h3>Rules</h3>
        <ul>
          <li>Place your mark (X or O) on the board first</li>
          <li>The AI will play after your move</li>
          <li>Get 3 in a row (horizontal, vertical, or diagonal) to win</li>
          <li>If all 9 squares are filled with no winner, it&apos;s a draw</li>
        </ul>

        <h3>Difficulty Levels</h3>
        <ul>
          <li>
            <strong>Easy:</strong> AI may miss winning chances
          </li>
          <li>
            <strong>Medium:</strong> AI plays optimally but can be beaten with good strategy
          </li>
          <li>
            <strong>Hard:</strong> AI plays perfectly; draws are the best possible outcome
          </li>
        </ul>

        <h3>Series Mode</h3>
        <ul>
          <li>Play a best-of-series (1, 3, or 5 games)</li>
          <li>Win streaks are tracked and displayed</li>
          <li>Your best time and scoring are recorded</li>
        </ul>

        <h3>Tips</h3>
        <ul>
          <li>The center square (5) is often the strongest opening</li>
          <li>Control the corners to maximize winning patterns</li>
          <li>Always block the AI if it has two in a row</li>
          <li>Create a &quot;fork&quot; (two winning chances) to force a win</li>
        </ul>
      </div>

      <div className={styles.menu} style={{ marginTop: '1.5rem' }}>
        <button className={styles.menuBtnPrimary} onClick={onBack} autoFocus>
          Back
        </button>
      </div>
    </div>
  )
}
