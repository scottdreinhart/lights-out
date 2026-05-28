import { BoardGrid } from '@/ui/molecules'

import type { UseConnectFourAppReturn } from '@/app'
import { COLS, ROWS, getCell } from '@/domain'

interface ConnectFourSurfaceProps {
  game: UseConnectFourAppReturn
}

const PLAYER_LABEL: Record<1 | 2, string> = { 1: 'Red', 2: 'Yellow' }

export function ConnectFourSurface({ game }: ConnectFourSurfaceProps) {
  const cells = Array.from({ length: COLS }, (_, col) =>
    Array.from({ length: ROWS }, (_, row) => {
      const value = getCell(game.game.board, col, row)
      return value === 1 ? 'R' : value === 2 ? 'Y' : null
    }),
  )

  const statusText = (() => {
    if (game.game.result.status === 'win') {
      return `${PLAYER_LABEL[game.game.result.winner]} wins! 🎉`
    }

    if (game.game.result.status === 'draw') {
      return "It's a draw!"
    }

    if (game.isThinking) {
      return 'CPU is thinking…'
    }

    return `${PLAYER_LABEL[game.game.currentPlayer]}'s turn`
  })()

  return (
    <>
      <div
        className={`status ${game.isGameOver ? 'game-over' : ''}`}
        aria-live="polite"
        aria-atomic="true"
        role="status"
      >
        <span className={`status-indicator player-${game.game.currentPlayer}`} />
        {statusText}
      </div>

      <div className="board-container">
        <BoardGrid
          rows={ROWS}
          cols={COLS}
          cells={cells}
          onCellClick={game.onColumnClick}
          selectedColumn={game.selectedColumn}
          disableInteraction={game.disableInteraction}
        />
      </div>

      <div className="controls">
        <div className="control-group">
          <span className="control-label">Mode:</span>
          <button
            className={game.game.mode === 'pvc' ? 'active' : ''}
            onClick={() => game.onModeChange('pvc')}
          >
            vs CPU
          </button>
          <button
            className={game.game.mode === 'pvp' ? 'active' : ''}
            onClick={() => game.onModeChange('pvp')}
          >
            2 Player
          </button>
        </div>

        {game.game.mode === 'pvc' && (
          <div className="control-group">
            <span className="control-label">Difficulty:</span>
            {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
              <button
                key={difficulty}
                className={game.game.difficulty === difficulty ? 'active' : ''}
                onClick={() => game.onDifficultyChange(difficulty)}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="actions">
        <button className="btn-primary" onClick={game.onNewGame}>
          New Game
        </button>
        <button
          className="btn-secondary"
          onClick={game.onUndo}
          disabled={game.game.moveHistory.length === 0 || game.isThinking}
        >
          Undo
        </button>
      </div>

      <div className="move-counter">Move {game.game.moveHistory.length}</div>
    </>
  )
}
