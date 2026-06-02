import { useCallback, useEffect, useMemo, useState } from 'react'

import { useGridNavigationInput, useKeyboardControls } from '@games/app-hook-utils'
import { useResponsiveState } from '@games/ui-hooks'

import type { Board, Difficulty, GameState, Orientation } from '@/domain'
import type { Position } from '@games/ui-board-core'

import { useGame, useSoundEffects } from '@/app'

type AppScreen = 'splash' | 'landing' | 'game'

const BOARD_SIZE = 10

function createBoardView(board: Board, phase: GameState['phase']): Board {
  if (phase === 'gameOver') {
    return board
  }

  const visibleShips = board.ships.filter((ship) => ship.owner === 'player')
  const cpuShipCells = new Set<string>()

  for (const ship of board.ships) {
    if (ship.owner !== 'cpu') {
      continue
    }

    for (const cell of ship.cells) {
      cpuShipCells.add(`${cell.row},${cell.col}`)
    }
  }

  return {
    ...board,
    grid: board.grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (cell === 'ship' && cpuShipCells.has(`${rowIndex},${colIndex}`)) {
          return 'empty'
        }
        return cell
      }),
    ),
    ships: visibleShips,
  }
}

function createBlinkingCells(board: Board, phase: GameState['phase'], revealing: boolean): Set<string> {
  if (phase !== 'gameOver' || !revealing) {
    return new Set()
  }

  const cells = new Set<string>()
  for (const ship of board.ships) {
    if (ship.owner !== 'cpu') {
      continue
    }

    for (const cell of ship.cells) {
      cells.add(`${cell.row},${cell.col}`)
    }
  }

  return cells
}

function clampIndex(value: number): number {
  if (value < 0) {
    return 0
  }

  if (value >= BOARD_SIZE) {
    return BOARD_SIZE - 1
  }

  return value
}

function useBattleshipKeyboardFocus(boardDisabled: boolean, screen: AppScreen) {
  const [keyboardFocus, setKeyboardFocus] = useState<Position | null>(null)

  useEffect(() => {
    if (screen !== 'game') {
      setKeyboardFocus(null)
      return
    }

    if (!keyboardFocus) {
      setKeyboardFocus({ row: 0, col: 0 })
    }
  }, [keyboardFocus, screen])

  const moveFocus = useCallback(
    (deltaRow: number, deltaCol: number) => {
      if (boardDisabled) {
        return
      }

      setKeyboardFocus((current) => {
        const next = current ?? { row: 0, col: 0 }
        return {
          row: clampIndex(next.row + deltaRow),
          col: clampIndex(next.col + deltaCol),
        }
      })
    },
    [boardDisabled],
  )

  return { keyboardFocus, setKeyboardFocus, moveFocus }
}

function useBattleshipScreenControls({
  game,
  sfx,
}: {
  game: ReturnType<typeof useGame>
  sfx: ReturnType<typeof useSoundEffects>
}) {
  const [screen, setScreen] = useState<AppScreen>('splash')
  const [showAbout, setShowAbout] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isRevealing, setIsRevealing] = useState(false)

  const handleSplashComplete = useCallback(() => {
    sfx.onClick()
    setScreen('landing')
  }, [sfx])

  const handleDifficultySelect = useCallback(
    (difficulty: Difficulty) => {
      sfx.onConfirm()
      game.newGame(difficulty)
      setShowAbout(false)
      setShowRules(false)
      setShowSettings(false)
      setIsRevealing(false)
      setScreen('game')
    },
    [game, sfx],
  )

  const handleNewGame = useCallback(() => {
    sfx.onClick()
    game.newGame(game.state.difficulty)
    setShowAbout(false)
    setShowRules(false)
    setShowSettings(false)
    setIsRevealing(false)
    setScreen('landing')
  }, [game, sfx])

  const onOpenSettings = useCallback(() => {
    sfx.onClick()
    setShowSettings(true)
  }, [sfx])

  const onCloseSettings = useCallback(() => {
    sfx.onClick()
    setShowSettings(false)
  }, [sfx])

  const onOpenAbout = useCallback(() => {
    sfx.onClick()
    setShowAbout(true)
  }, [sfx])

  const onCloseAbout = useCallback(() => {
    sfx.onClick()
    setShowAbout(false)
  }, [sfx])

  const onOpenRules = useCallback(() => {
    sfx.onClick()
    setShowRules(true)
  }, [sfx])

  const onCloseRules = useCallback(() => {
    sfx.onClick()
    setShowRules(false)
  }, [sfx])

  return {
    screen,
    showAbout,
    showRules,
    showSettings,
    isRevealing,
    setIsRevealing,
    setScreen,
    handleSplashComplete,
    handleDifficultySelect,
    handleNewGame,
    onOpenSettings,
    onCloseSettings,
    onOpenAbout,
    onCloseAbout,
    onOpenRules,
    onCloseRules,
  }
}

function useBattleshipBoardInput({
  boardDisabled,
  screen,
  keyboardFocus,
  moveFocus,
  onCellClick,
  onRotate,
  onNewGame,
}: {
  boardDisabled: boolean
  screen: AppScreen
  keyboardFocus: Position | null
  moveFocus: (deltaRow: number, deltaCol: number) => void
  onCellClick: (row: number, col: number) => void
  onRotate: () => void
  onNewGame: () => void
}) {
  useGridNavigationInput(
    {
      onMove: (direction) => {
        if (direction === 'up') {
          moveFocus(-1, 0)
        } else if (direction === 'down') {
          moveFocus(1, 0)
        } else if (direction === 'left') {
          moveFocus(0, -1)
        } else {
          moveFocus(0, 1)
        }
      },
      onSelect: () => {
        if (keyboardFocus) {
          onCellClick(keyboardFocus.row, keyboardFocus.col)
        }
      },
    },
    {
      enabled: screen === 'game' && !boardDisabled,
      allowRepeat: true,
      includeWasd: true,
    },
  )

  useKeyboardControls(
    [
      {
        action: 'rotate-ship',
        keys: ['KeyR'],
        onTrigger: () => onRotate(),
        enabled: screen === 'game' && !boardDisabled,
      },
      {
        action: 'new-game',
        keys: ['KeyN'],
        onTrigger: () => onNewGame(),
        enabled: screen === 'game' || screen === 'landing',
      },
    ],
    { enabled: true },
  )
}

export interface UseBattleshipAppReturn {
  state: GameState
  responsive: ReturnType<typeof useResponsiveState>
  screen: AppScreen
  showAbout: boolean
  showRules: boolean
  showSettings: boolean
  phase: GameState['phase']
  placementOrientation: Orientation
  placementShipIndex: number
  boardView: Board
  keyboardFocus: Position | null
  blinkingCells: Set<string>
  boardDisabled: boolean
  boardLabel: string
  handleSplashComplete: () => void
  handleDifficultySelect: (difficulty: Difficulty) => void
  handleRotate: () => void
  handleCellClick: (row: number, col: number) => void
  handleNewGame: () => void
  onOpenSettings: () => void
  onCloseSettings: () => void
  onOpenAbout: () => void
  onCloseAbout: () => void
  onOpenRules: () => void
  onCloseRules: () => void
}

export const useBattleshipApp = (): UseBattleshipAppReturn => {
  const game = useGame()
  const responsive = useResponsiveState()
  const sfx = useSoundEffects()

  const screenControls = useBattleshipScreenControls({ game, sfx })

  const phase = game.state.phase
  const boardDisabled =
    screenControls.screen !== 'game' ||
    screenControls.showAbout ||
    screenControls.showRules ||
    screenControls.showSettings ||
    phase === 'gameOver' ||
    (phase === 'battle' && game.state.turn !== 'player')

  const { keyboardFocus, setKeyboardFocus, moveFocus } = useBattleshipKeyboardFocus(
    boardDisabled,
    screenControls.screen,
  )

  useEffect(() => {
    if (phase === 'gameOver') {
      screenControls.setIsRevealing(true)
    }
  }, [phase, screenControls])

  useEffect(() => {
    if (game.state.winner === 'player') {
      sfx.onWin()
    } else if (game.state.winner === 'cpu') {
      sfx.onLose()
    }
  }, [game.state.winner, sfx])

  const boardView = useMemo(() => createBoardView(game.state.board, phase), [game.state.board, phase])
  const blinkingCells = useMemo(
    () => createBlinkingCells(game.state.board, phase, screenControls.isRevealing),
    [game.state.board, phase, screenControls.isRevealing],
  )

  const handleSplashComplete = useCallback(() => {
    screenControls.handleSplashComplete()
  }, [screenControls])

  const handleDifficultySelect = (difficulty: Difficulty) => {
    screenControls.handleDifficultySelect(difficulty)
    setKeyboardFocus({ row: 0, col: 0 })
  }

  const handleRotate = useCallback(() => {
    if (screenControls.screen !== 'game' || phase !== 'placement' || boardDisabled) {
      return
    }

    sfx.onClick()
    game.toggleOrientation()
  }, [boardDisabled, game, phase, screenControls.screen, sfx])

  const handleCellClick = (row: number, col: number) => {
    if (boardDisabled) {
      return
    }

    setKeyboardFocus({ row, col })

    if (phase === 'placement') {
      sfx.onSelect()
      game.placeCurrentShip(row, col)
      return
    }

    if (phase === 'battle' && game.state.turn === 'player') {
      sfx.onConfirm()
      game.fire(row, col)
    }
  }

  useBattleshipBoardInput({
    boardDisabled,
    screen: screenControls.screen,
    keyboardFocus,
    moveFocus,
    onCellClick: handleCellClick,
    onRotate: handleRotate,
    onNewGame: screenControls.handleNewGame,
  })

  const handleNewGame = () => {
    screenControls.handleNewGame()
  }

  const boardLabel = phase === 'placement' ? 'Place Your Ships' : 'Enemy Waters'

  return {
    state: game.state,
    responsive,
    screen: screenControls.screen,
    showAbout: screenControls.showAbout,
    showRules: screenControls.showRules,
    showSettings: screenControls.showSettings,
    phase,
    placementOrientation: game.state.placementOrientation,
    placementShipIndex: game.state.placementShipIndex,
    boardView,
    keyboardFocus,
    blinkingCells,
    boardDisabled,
    boardLabel,
    handleSplashComplete,
    handleDifficultySelect,
    handleRotate,
    handleCellClick,
    handleNewGame,
    onOpenSettings: screenControls.onOpenSettings,
    onCloseSettings: screenControls.onCloseSettings,
    onOpenAbout: screenControls.onOpenAbout,
    onCloseAbout: screenControls.onCloseAbout,
    onOpenRules: screenControls.onOpenRules,
    onCloseRules: screenControls.onCloseRules,
  }
}