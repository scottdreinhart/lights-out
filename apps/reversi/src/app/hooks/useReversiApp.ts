import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useKeyboardControls, useGridNavigationInput } from '@games/app-hook-utils'
import { useResponsiveState } from '@games/ui-hooks'

import {
  BOARD_SIZE,
  buildReversiSignalProfile,
  countPieces,
  type Difficulty,
  type GameMode,
  type Position,
} from '@/domain'

import { vibrate } from '../haptics'
import { useSoundContext } from '../SoundContext'
import { useThemeContext } from '../ThemeContext'
import { useReversiGame } from './useReversiGame'
import { useSoundEffects } from './useSoundEffects'
import { useStats } from './useStats'

const DIFFICULTIES: readonly Difficulty[] = ['easy', 'medium', 'hard']

const modeLabel = (mode: GameMode): string =>
  mode === 'pvc' ? 'Player vs CPU' : 'Player vs Player'

const playerLabel = (player: 'black' | 'white'): string => (player === 'black' ? 'Black' : 'White')

export interface UseReversiAppReturn {
  board: ReturnType<typeof useReversiGame>['board']
  currentPlayer: ReturnType<typeof useReversiGame>['currentPlayer']
  validMoves: ReturnType<typeof useReversiGame>['validMoves']
  mode: ReturnType<typeof useReversiGame>['mode']
  difficulty: ReturnType<typeof useReversiGame>['difficulty']
  result: ReturnType<typeof useReversiGame>['result']
  moveCount: number
  passMessage: string | null
  cpuThinking: boolean
  isPlayerTurn: boolean
  counts: ReturnType<typeof countPieces>
  signalProfile: ReturnType<typeof buildReversiSignalProfile>
  stats: ReturnType<typeof useStats>
  responsive: ReturnType<typeof useResponsiveState>
  settings: ReturnType<typeof useThemeContext>['settings']
  soundEnabled: boolean
  showSplash: boolean
  boardVisible: boolean
  showRulesModal: boolean
  showSettingsModal: boolean
  showAboutModal: boolean
  focusedPosition: Position
  statusText: string
  canUndo: boolean
  canReset: boolean
  boardVisibleStyle: { opacity: number; pointerEvents: 'auto' | 'none'; transition: string }
  validMoveLookup: Set<string>
  handleSquarePress: (row: number, col: number) => void
  handleSplashFadeStart: () => void
  handleSplashComplete: () => void
  handleNewGame: () => void
  handleModeChange: (nextMode: GameMode) => void
  handleDifficultyChange: (nextDifficulty: Difficulty) => void
  handleToggleSound: () => void
  handleColorThemeChange: (themeId: string) => void
  handleThemeModeChange: (themeMode: string) => void
  handleColorblindChange: (colorblindMode: string) => void
  undo: () => void
  setShowRulesModal: (open: boolean) => void
  setShowSettingsModal: (open: boolean) => void
  setShowAboutModal: (open: boolean) => void
}

export const useReversiApp = (): UseReversiAppReturn => {
  const [showRulesModal, setShowRulesModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const [boardVisible, setBoardVisible] = useState(false)
  const [focusedPosition, setFocusedPosition] = useState<Position>({ row: 0, col: 0 })
  const responsive = useResponsiveState()
  const {
    board,
    currentPlayer,
    validMoves,
    mode,
    difficulty,
    result,
    moveCount,
    passMessage,
    cpuThinking,
    isPlayerTurn,
    playMove,
    undo,
    resetGame,
    setMode,
    setDifficulty,
  } = useReversiGame()
  const counts = countPieces(board)
  const signalProfile = useMemo(
    () =>
      buildReversiSignalProfile({
        board,
        currentPlayer,
        validMoves,
        mode,
        difficulty,
        cpuThinking,
        result,
        moveCount,
      }),
    [board, cpuThinking, currentPlayer, difficulty, mode, moveCount, result, validMoves],
  )
  const { settings, setColorTheme, setColorblind, setMode: setThemeMode } = useThemeContext()
  const { soundEnabled, toggleSound } = useSoundContext()
  const sfx = useSoundEffects()
  const stats = useStats()
  const lastRecordedResult = useRef<string>('')

  const validMoveLookup = useMemo(() => {
    const lookup = new Set<string>()
    for (const move of validMoves) {
      lookup.add(`${move.position.row}:${move.position.col}`)
    }
    return lookup
  }, [validMoves])

  useEffect(() => {
    if (result.status === 'playing' || mode !== 'pvc') {
      lastRecordedResult.current = ''
      return
    }

    const signature = `${moveCount}:${result.status}:${result.status === 'win' ? result.winner : 'draw'}`
    if (lastRecordedResult.current === signature) {
      return
    }

    lastRecordedResult.current = signature

    if (result.status === 'draw') {
      stats.recordDraw()
      sfx.onConfirm()
      return
    }

    if (result.winner === 'black') {
      stats.recordWin()
      sfx.onWin()
      return
    }

    stats.recordLoss()
    sfx.onLose()
  }, [mode, moveCount, result, sfx, stats])

  const handleSquarePress = useCallback(
    (row: number, col: number): void => {
      if (!isPlayerTurn || cpuThinking) {
        return
      }

      const didPlay = playMove({ row, col })
      if (didPlay) {
        setFocusedPosition({ row, col })
        vibrate(10)
        sfx.onConfirm()
        return
      }

      sfx.onClick()
    },
    [cpuThinking, isPlayerTurn, playMove, sfx],
  )

  const statusText = useMemo(() => {
    if (result.status === 'win') {
      return `${playerLabel(result.winner)} wins (${result.black}-${result.white})`
    }

    if (result.status === 'draw') {
      return `Draw (${result.black}-${result.white})`
    }

    if (cpuThinking) {
      return 'CPU is thinking...'
    }

    return `${playerLabel(currentPlayer)} to move`
  }, [cpuThinking, currentPlayer, result])

  useGridNavigationInput(
    {
      onMove: (direction) => {
        if (result.status !== 'playing') {return}

        setFocusedPosition((current) => ({
          row: Math.max(0, Math.min(BOARD_SIZE - 1, direction === 'up' ? current.row - 1 : direction === 'down' ? current.row + 1 : current.row)),
          col: Math.max(0, Math.min(BOARD_SIZE - 1, direction === 'left' ? current.col - 1 : direction === 'right' ? current.col + 1 : current.col)),
        }))
      },
      onSelect: () => handleSquarePress(focusedPosition.row, focusedPosition.col),
    },
    {
      enabled: result.status === 'playing' && isPlayerTurn && !cpuThinking,
      includeWasd: true,
      allowRepeat: true,
      selectKeys: ['Space', 'Enter'],
    },
  )

  useKeyboardControls(
    [
      { action: 'new-game', keys: ['KeyN'], onTrigger: resetGame },
      { action: 'undo', keys: ['KeyU'], onTrigger: undo },
    ],
    { enabled: true },
  )

  const handleSplashFadeStart = useCallback(() => {
    setBoardVisible(true)
  }, [])

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false)
  }, [])

  const handleNewGame = useCallback(() => {
    resetGame()
    setFocusedPosition({ row: 0, col: 0 })
  }, [resetGame])

  const handleModeChange = useCallback(
    (nextMode: GameMode) => {
      setMode(nextMode)
      handleNewGame()
    },
    [handleNewGame, setMode],
  )

  const handleDifficultyChange = useCallback(
    (nextDifficulty: Difficulty) => {
      setDifficulty(nextDifficulty)
      handleNewGame()
    },
    [handleNewGame, setDifficulty],
  )

  const handleColorThemeChange = useCallback(
    (themeId: string) => {
      setColorTheme(themeId)
    },
    [setColorTheme],
  )

  const handleThemeModeChange = useCallback(
    (themeMode: string) => {
      setThemeMode(themeMode)
    },
    [setThemeMode],
  )

  const handleColorblindChange = useCallback(
    (colorblindMode: string) => {
      setColorblind(colorblindMode)
    },
    [setColorblind],
  )

  return {
    board,
    currentPlayer,
    validMoves,
    mode,
    difficulty,
    result,
    moveCount,
    passMessage,
    cpuThinking,
    isPlayerTurn,
    counts,
    signalProfile,
    stats,
    responsive,
    settings,
    soundEnabled,
    showSplash,
    boardVisible,
    showRulesModal,
    showSettingsModal,
    showAboutModal,
    focusedPosition,
    statusText,
    canUndo: true,
    canReset: true,
    boardVisibleStyle: {
      opacity: boardVisible ? 1 : 0,
      pointerEvents: boardVisible ? 'auto' : 'none',
      transition: 'opacity 15s ease',
    },
    validMoveLookup,
    handleSquarePress,
    handleSplashFadeStart,
    handleSplashComplete,
    handleNewGame,
    handleModeChange,
    handleDifficultyChange,
    handleToggleSound: toggleSound,
    handleColorThemeChange,
    handleThemeModeChange,
    handleColorblindChange,
    undo,
    setShowRulesModal,
    setShowSettingsModal,
    setShowAboutModal,
  }
}
