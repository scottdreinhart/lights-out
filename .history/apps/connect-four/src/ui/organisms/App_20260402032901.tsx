import { vibrate } from '@/app'
import { useKeyboardControls } from '@games/app-hook-utils'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BoardGrid } from '@/ui/molecules'

import { applyMove, createInitialState, getCell, isColumnPlayable } from '@/domain'
import { COLS, CPU_DELAY_MS, ROWS } from '@/domain'
import { checkGameResult } from '@/domain'
import type { Column, Difficulty, GameMode, GameState, Player } from '@/domain'

/** Map player number to display label */
const PLAYER_LABEL: Record<Player, string> = { 1: 'Red', 2: 'Yellow' }

/** Map difficulty to display label */
const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

export default function App() {
  const [game, setGame] = useState<GameState>(() => createInitialState('pvc', 'medium'))
  const [hoveredCol, setHoveredCol] = useState<number | null>(null)
  const [activeCol, setActiveCol] = useState(0)
  const [isThinking, setIsThinking] = useState(false)
  const [animatingCell, setAnimatingCell] = useState<{ col: number; row: number } | null>(null)
  const thinkingRef = useRef(false)
  const workerRef = useRef<Worker | null>(null)

  // ── Web Worker lifecycle ─────────────────────────────
  useEffect(() => {
    const worker = new Worker(new URL('../../workers/ai.worker.ts', import.meta.url), {
      type: 'module',
    })
    workerRef.current = worker
    return () => {
      worker.terminate()
      workerRef.current = null
    }
  }, [])

  const isGameOver = game.result.status !== 'playing'
  const isCpuTurn = game.mode === 'pvc' && game.currentPlayer === 2 && !isGameOver

  // ── Handle human move ────────────────────────────────
  const handleColumnClick = useCallback(
    (col: number) => {
      if (isGameOver || isThinking || isCpuTurn) {
        return
      }
      if (!isColumnPlayable(game.board, col)) {
        return
      }

      const next = applyMove(game, col as Column, checkGameResult)
      if (!next) {
        return
      }

      vibrate(15)

      // Find the row where the disc landed
      for (let row = 0; row < ROWS; row++) {
        if (getCell(next.board, col, row) !== getCell(game.board, col, row)) {
          setAnimatingCell({ col, row })
          setTimeout(() => setAnimatingCell(null), 350)
          break
        }
      }

      setGame(next)
    },
    [game, isGameOver, isThinking, isCpuTurn],
  )

  const findNextPlayableColumn = useCallback(
    (startCol: number, direction: -1 | 1) => {
      for (let step = 1; step <= COLS; step++) {
        const candidate = (startCol + direction * step + COLS) % COLS
        if (isColumnPlayable(game.board, candidate)) {
          return candidate
        }
      }
      return startCol
    },
    [game.board],
  )

  const moveActiveColumn = useCallback(
    (direction: -1 | 1) => {
      const nextCol = findNextPlayableColumn(activeCol, direction)
      setActiveCol(nextCol)
      setHoveredCol(nextCol)
    },
    [activeCol, findNextPlayableColumn],
  )

  const dropAtActiveColumn = useCallback(() => {
    if (isColumnPlayable(game.board, activeCol)) {
      handleColumnClick(activeCol)
    }
  }, [game.board, activeCol, handleColumnClick])

  // ── CPU move (via Web Worker) ────────────────────────
  useEffect(() => {
    if (!isCpuTurn || thinkingRef.current) {
      return
    }
    const worker = workerRef.current
    if (!worker) {
      return
    }

    thinkingRef.current = true
    setIsThinking(true)

    // Add a small delay before starting computation for UX
    const timer = setTimeout(() => {
      const handler = (e: MessageEvent<{ move: number }>) => {
        const col = e.data.move
        if (col === -1) {
          setIsThinking(false)
          thinkingRef.current = false
          return
        }
        const next = applyMove(game, col as Column, checkGameResult)
        if (next) {
          for (let row = 0; row < ROWS; row++) {
            if (getCell(next.board, col, row) !== getCell(game.board, col, row)) {
              setAnimatingCell({ col, row })
              setTimeout(() => setAnimatingCell(null), 350)
              break
            }
          }
          setGame(next)
        }
        setIsThinking(false)
        thinkingRef.current = false
      }

      worker.addEventListener('message', handler, { once: true })
      worker.postMessage({
        board: game.board,
        player: 2,
        difficulty: game.difficulty,
      })
    }, CPU_DELAY_MS)

    return () => {
      clearTimeout(timer)
      thinkingRef.current = false
    }
  }, [isCpuTurn, game])

  // ── New Game ─────────────────────────────────────────
  const handleNewGame = useCallback(() => {
    setGame(createInitialState(game.mode, game.difficulty))
    setIsThinking(false)
    thinkingRef.current = false
    setAnimatingCell(null)
  }, [game.mode, game.difficulty])

  // ── Mode / Difficulty changes ────────────────────────
  const handleModeChange = useCallback((mode: GameMode) => {
    setGame(createInitialState(mode, 'medium'))
    setIsThinking(false)
    thinkingRef.current = false
  }, [])

  const handleDifficultyChange = useCallback(
    (diff: Difficulty) => {
      setGame(createInitialState(game.mode, diff))
      setIsThinking(false)
      thinkingRef.current = false
    },
    [game.mode],
  )

  // ── Undo last move ──────────────────────────────────
  const handleUndo = useCallback(() => {
    if (game.moveHistory.length === 0) {
      return
    }
    // In PvC, undo removes the last two moves (player + CPU)
    const stepsBack = game.mode === 'pvc' && game.moveHistory.length >= 2 ? 2 : 1
    let state = createInitialState(game.mode, game.difficulty)
    const moves = game.moveHistory.slice(0, -stepsBack)
    for (const col of moves) {
      const next = applyMove(state, col, checkGameResult)
      if (next) {
        state = next
      }
    }
    setGame(state)
    setIsThinking(false)
    thinkingRef.current = false
  }, [game])

  useEffect(() => {
    if (!isColumnPlayable(game.board, activeCol)) {
      setActiveCol(findNextPlayableColumn(activeCol, 1))
    }
  }, [game.board, activeCol, findNextPlayableColumn])

  const keyboardBindings = useMemo(
    () => [
      {
        action: 'move-left',
        keys: ['ArrowLeft', 'KeyA'],
        onTrigger: () => moveActiveColumn(-1),
        enabled: !isGameOver,
      },
      {
        action: 'move-right',
        keys: ['ArrowRight', 'KeyD'],
        onTrigger: () => moveActiveColumn(1),
        enabled: !isGameOver,
      },
      {
        action: 'drop',
        keys: ['ArrowDown', 'Enter', 'Space'],
        onTrigger: dropAtActiveColumn,
        enabled: !isGameOver,
      },
      {
        action: 'new-game',
        keys: ['KeyN'],
        onTrigger: handleNewGame,
      },
      {
        action: 'undo',
        keys: ['KeyU'],
        onTrigger: handleUndo,
        enabled: game.moveHistory.length > 0 && !isThinking,
      },
    ],
    [isGameOver, moveActiveColumn, dropAtActiveColumn, handleNewGame, handleUndo, game.moveHistory.length, isThinking],
  )

  useKeyboardControls(keyboardBindings)

  // ── Status text ──────────────────────────────────────
  const statusText = (() => {
    if (game.result.status === 'win') {
      const winner = PLAYER_LABEL[game.result.winner]
      return `${winner} wins! 🎉`
    }
    if (game.result.status === 'draw') {
      return "It's a draw!"
    }
    if (isThinking) {
      return 'CPU is thinking…'
    }
    const current = PLAYER_LABEL[game.currentPlayer]
    return `${current}'s turn`
  })()

  // ── Win line cells for highlighting ──────────────────
  const winCells = new Set<string>()
  if (game.result.status === 'win') {
    for (const pos of game.result.line) {
      winCells.add(`${pos.col},${pos.row}`)
    }
  }

  const previewCol = hoveredCol ?? activeCol

  // ── Render ───────────────────────────────────────────
  return (
    <div className="app">
      <h1>Connect Four</h1>

      {/* Controls */}
      <div className="controls">
        <div className="control-group">
          <span className="control-label">Mode:</span>
          <button
            className={game.mode === 'pvc' ? 'active' : ''}
            onClick={() => handleModeChange('pvc')}
          >
            vs CPU
          </button>
          <button
            className={game.mode === 'pvp' ? 'active' : ''}
            onClick={() => handleModeChange('pvp')}
          >
            2 Player
          </button>
        </div>

        {game.mode === 'pvc' && (
          <div className="control-group">
            <span className="control-label">Difficulty:</span>
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
              <button
                key={d}
                className={game.difficulty === d ? 'active' : ''}
                onClick={() => handleDifficultyChange(d)}
              >
                {DIFFICULTY_LABEL[d]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Status */}
      <div className={`status ${isGameOver ? 'game-over' : ''}`}>
        <span className={`status-indicator player-${game.currentPlayer}`} />
        {statusText}
      </div>

      {/* Board */}
      <div className="board-container">
        <BoardGrid
          rows={ROWS}
          cols={COLS}
          cells={Array.from({ length: COLS }, (_, col) =>
            Array.from({ length: ROWS }, (_, row) => {
              const value = getCell(game.board, col, row)
              return value === 1 ? 'R' : value === 2 ? 'Y' : null
            }),
          )}
          onCellClick={(row, col) => handleColumnClick(col)}
          selectedPosition={
            hoveredCol !== null && !isGameOver && !isThinking && !isCpuTurn
              ? { row: ROWS - 1, col: hoveredCol }
              : null
          }
          validMoves={
            !isGameOver && !isThinking && !isCpuTurn
              ? Array.from({ length: COLS }, (_, col) =>
                  isColumnPlayable(game.board, col) ? { row: ROWS - 1, col } : null,
                ).filter((m) => m !== null) as Array<{ row: number; col: number }>
              : []
          }
          disableInteraction={isGameOver || isThinking || isCpuTurn}
        />
      </div>

      {/* Action buttons */}
      <div className="actions">
        <button className="btn-primary" onClick={handleNewGame}>
          New Game
        </button>
        <button
          className="btn-secondary"
          onClick={handleUndo}
          disabled={game.moveHistory.length === 0 || isThinking}
        >
          Undo
        </button>
      </div>

      {/* Move counter */}
      <div className="move-counter">Move {game.moveHistory.length}</div>
    </div>
  )
}
