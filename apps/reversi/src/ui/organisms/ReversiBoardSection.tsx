import { BOARD_SIZE } from '@/domain'

import type { UseReversiAppReturn } from '@/app'
import { ProgressMeters } from '@games/common'

import styles from './App.module.css'

export interface ReversiBoardSectionProps {
  game: UseReversiAppReturn
}

export function ReversiBoardSection({ game }: ReversiBoardSectionProps) {
  return (
    <>
      <section className={styles.boardSection}>
        <div className={styles.status} role="status" aria-live="polite" aria-atomic="true">
          {game.statusText}
        </div>
        {game.passMessage && <div className={styles.passMessage}>{game.passMessage}</div>}
        <div className={styles.board} role="grid" aria-label="8 by 8 Reversi board">
          {Array.from({ length: BOARD_SIZE }, (_, row) =>
            Array.from({ length: BOARD_SIZE }, (_, col) => {
              const cell = game.board[row * BOARD_SIZE + col]
              const valid = game.validMoveLookup.has(`${row}:${col}`)
              const focused = game.focusedPosition.row === row && game.focusedPosition.col === col

              return (
                <button
                  key={`${row}:${col}`}
                  type="button"
                  role="gridcell"
                  aria-label={`Row ${row + 1} column ${col + 1}${cell ? ` ${cell} disc` : ''}`}
                  className={`${styles.cell} ${valid ? styles.valid : ''} ${focused ? styles.focused : ''}`}
                  onClick={() => game.handleSquarePress(row, col)}
                  disabled={
                    game.result.status !== 'playing' || !game.isPlayerTurn || game.cpuThinking
                  }
                >
                  {cell && (
                    <span
                      className={`${styles.disc} ${cell === 'black' ? styles.black : styles.white}`}
                    />
                  )}
                  {!cell && valid && <span className={styles.validDot} aria-hidden="true" />}
                </button>
              )
            }),
          )}
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.actionButton} onClick={game.handleNewGame}>
            New Game
          </button>
          <button type="button" className={styles.actionButtonSecondary} onClick={game.undo}>
            Undo
          </button>
        </div>
      </section>

      <aside className={styles.sidebar}>
        <div className={styles.signalPanel}>
          <div className={styles.signalHeader}>Signal Profile</div>
          <ProgressMeters
            intensity={game.signalProfile.intensity}
            focus={game.signalProfile.focus}
            progress={game.signalProfile.progress}
            styles={styles}
          />
          <div className={styles.pressureRow}>
            <span className={styles.pressureLabel}>Pressure</span>
            <span className={styles.pressureValue}>{game.signalProfile.pressure}%</span>
          </div>
        </div>
        <div className={styles.panel}>
          <h2>Score</h2>
          <p>
            <strong>Black:</strong> {game.counts.black}
          </p>
          <p>
            <strong>White:</strong> {game.counts.white}
          </p>
          <p>
            <strong>Move:</strong> {game.moveCount}
          </p>
        </div>
        <div className={styles.panel}>
          <h2>Stats</h2>
          <p>
            <strong>Wins:</strong> {game.stats.wins}
          </p>
          <p>
            <strong>Losses:</strong> {game.stats.losses}
          </p>
          <p>
            <strong>Draws:</strong> {game.stats.draws}
          </p>
          <p>
            <strong>Streak:</strong> {game.stats.streak}
          </p>
        </div>
        <div className={styles.panel}>
          <h2>Current Settings</h2>
          <p>{game.mode === 'pvc' ? 'Player vs CPU' : 'Player vs Player'}</p>
          <p>Difficulty: {game.difficulty}</p>
          <p>Theme: {game.settings.colorTheme}</p>
          <p>Sound: {game.soundEnabled ? 'On' : 'Off'}</p>
        </div>
      </aside>
    </>
  )
}
