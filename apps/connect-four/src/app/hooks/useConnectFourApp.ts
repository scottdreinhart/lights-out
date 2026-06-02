import { useCallback, useEffect, useState } from 'react'

import { useKeyboardControls, vibrate } from '@/app'
import { useGridNavigationInput } from '@games/app-hook-utils'
import type { Difficulty, GameMode, GameState } from '@/domain'
import { COLS, isColumnPlayable } from '@/domain'

import { useSoundContext } from '@games/sound-context'
import { useGame } from './useGame'

const PLAYER_LABEL: Record<1 | 2, string> = { 1: 'Red', 2: 'Yellow' }
const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

export interface UseConnectFourAppReturn {
  game: GameState
  activeCol: number
  isThinking: boolean
  soundEnabled: boolean
  statusText: string
  isGameOver: boolean
  isCpuTurn: boolean
  selectedColumn: number | null
  disableInteraction: boolean
  modeLabel: string
  difficultyLabel: string
  onColumnClick: (col: number) => void
  onNewGame: () => void
  onUndo: () => void
  onExit: () => void
  onToggleSound: () => void
  onModeChange: (mode: GameMode) => void
  onDifficultyChange: (difficulty: Difficulty) => void
}

export const useConnectFourApp = (): UseConnectFourAppReturn => {
  const { state: game, isThinking, playColumn, newGame, setMode, setDifficulty, undo } = useGame()
  const { soundEnabled, toggleSound } = useSoundContext()
  const [activeCol, setActiveCol] = useState(0)

  const isGameOver = game.result.status !== 'playing'
  const isCpuTurn = game.mode === 'pvc' && game.currentPlayer === 2 && !isGameOver

  const handleColumnClick = useCallback(
    (col: number) => {
      if (isGameOver || isThinking || isCpuTurn) {
        return
      }

      if (!isColumnPlayable(game.board, col)) {
        return
      }

      vibrate(15)
      playColumn(col)
      setActiveCol(col)
    },
    [game, isCpuTurn, isGameOver, isThinking, playColumn],
  )

  const findNextPlayableColumn = useCallback(
    (startCol: number, direction: -1 | 1) => {
      let candidate = startCol
      while (true) {
        candidate += direction
        if (candidate < 0 || candidate >= COLS) {
          return startCol
        }
        if (isColumnPlayable(game.board, candidate)) {
          return candidate
        }
      }
    },
    [game.board],
  )

  const moveActiveColumn = useCallback(
    (direction: -1 | 1) => {
      const nextCol = findNextPlayableColumn(activeCol, direction)
      setActiveCol(nextCol)
    },
    [activeCol, findNextPlayableColumn],
  )

  const dropAtActiveColumn = useCallback(() => {
    if (isColumnPlayable(game.board, activeCol)) {
      handleColumnClick(activeCol)
    }
  }, [activeCol, game.board, handleColumnClick])

  const onNewGame = useCallback(() => {
    newGame(game.mode, game.difficulty)
    setActiveCol(0)
  }, [game.difficulty, game.mode, newGame])

  const onModeChange = useCallback(
    (mode: GameMode) => {
      setMode(mode)
      setActiveCol(0)
    },
    [setMode],
  )

  const onDifficultyChange = useCallback(
    (difficulty: Difficulty) => {
      setDifficulty(difficulty)
      setActiveCol(0)
    },
    [setDifficulty],
  )

  const onUndo = useCallback(() => {
    undo()
    setActiveCol(0)
  }, [undo])

  useEffect(() => {
    if (!isColumnPlayable(game.board, activeCol)) {
      setActiveCol(findNextPlayableColumn(activeCol, 1))
    }
  }, [activeCol, findNextPlayableColumn, game.board])

  useGridNavigationInput(
    {
      onMove: (direction) => {
        if (direction === 'left') {
          moveActiveColumn(-1)
        }
        if (direction === 'right') {
          moveActiveColumn(1)
        }
      },
      onSelect: dropAtActiveColumn,
    },
    {
      enabled: !isGameOver,
      selectKeys: ['ArrowDown', 'KeyS', 'Enter', 'Space'],
      includeWasd: false,
    },
  )

  useKeyboardControls(
    [
      { action: 'new-game', keys: ['KeyN'], onTrigger: onNewGame },
      {
        action: 'undo',
        keys: ['KeyU'],
        onTrigger: onUndo,
        enabled: game.moveHistory.length > 0 && !isThinking,
      },
    ],
    { enabled: true },
  )

  const statusText = (() => {
    if (game.result.status === 'win') {
      return `${PLAYER_LABEL[game.result.winner]} wins! 🎉`
    }
    if (game.result.status === 'draw') {
      return "It's a draw!"
    }
    if (isThinking) {
      return 'CPU is thinking…'
    }
    return `${PLAYER_LABEL[game.currentPlayer]}'s turn`
  })()

  return {
    game,
    activeCol,
    isThinking,
    soundEnabled,
    statusText,
    isGameOver,
    isCpuTurn,
    selectedColumn: !isGameOver && !isThinking && !isCpuTurn ? activeCol : null,
    disableInteraction: isGameOver || isThinking || isCpuTurn,
    modeLabel: game.mode === 'pvc' ? 'vs CPU' : '2 Player',
    difficultyLabel: DIFFICULTY_LABEL[game.difficulty],
    onColumnClick: handleColumnClick,
    onNewGame,
    onUndo,
    onExit: onNewGame,
    onToggleSound: toggleSound,
    onModeChange,
    onDifficultyChange,
  }
}
