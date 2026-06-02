import { useCallback, useEffect, useRef, useState } from 'react'

import { useGame, useSoundContext, useStats, useThemeContext } from '@/app'
import { COLOR_THEMES, initBoardWasm } from '@/domain'
import { useGridNavigationInput } from '@games/app-hook-utils'

type SelectedCell = { row: number; col: number }

export interface UseLightsOutAppReturn {
  activeThemeId: string
  board: ReturnType<typeof useGame>['board']
  boardVisible: boolean
  handleCellClick: (row: number, col: number) => void
  handleNewGame: () => void
  handleSplashComplete: () => void
  moves: ReturnType<typeof useGame>['moves']
  onResetStats: () => void
  onSelectTheme: (themeId: string) => void
  onToggleSound: () => void
  selectedCell: SelectedCell
  setBoardVisible: (visible: boolean) => void
  showSplash: boolean
  soundEnabled: boolean
  statsWins: number
  title: string
  winMessage: string | null
}

export const useLightsOutApp = (): UseLightsOutAppReturn => {
  const { board, moves, isSolved, handleCellClick, resetGame } = useGame()
  const { stats, recordWin, resetStats } = useStats()
  const { settings, setColorTheme } = useThemeContext()
  const { soundEnabled, setSoundEnabled } = useSoundContext()
  const [showSplash, setShowSplash] = useState(true)
  const [boardVisible, setBoardVisible] = useState(false)
  const [selectedCell, setSelectedCell] = useState<SelectedCell>({ row: 0, col: 0 })
  const recordedWinRef = useRef(false)

  useEffect(() => {
    void initBoardWasm().catch((err) => console.warn('WASM init failed:', err))
  }, [])

  useEffect(() => {
    if (isSolved && !recordedWinRef.current) {
      recordWin()
      recordedWinRef.current = true
    }

    if (!isSolved) {
      recordedWinRef.current = false
    }
  }, [isSolved, recordWin])

  useEffect(() => {
    const rowCount = board.length
    const colCount = board[0]?.length ?? 0

    if (rowCount === 0 || colCount === 0) {
      return
    }

    setSelectedCell((current) => ({
      row: Math.min(current.row, rowCount - 1),
      col: Math.min(current.col, colCount - 1),
    }))
  }, [board])

  const activateSelectedCell = useCallback(() => {
    handleCellClick(selectedCell.row, selectedCell.col)
  }, [handleCellClick, selectedCell])

  useGridNavigationInput(
    {
      onMove: (direction) => {
        const rowCount = board.length
        const colCount = board[0]?.length ?? 0

        if (rowCount === 0 || colCount === 0) {
          return
        }

        setSelectedCell((current) => {
          let newRow = current.row
          let newCol = current.col

          if (direction === 'up') {
            newRow = (current.row - 1 + rowCount) % rowCount
          } else if (direction === 'down') {
            newRow = (current.row + 1) % rowCount
          } else if (direction === 'left') {
            newCol = (current.col - 1 + colCount) % colCount
          } else if (direction === 'right') {
            newCol = (current.col + 1) % colCount
          }

          return { row: newRow, col: newCol }
        })
      },
      onSelect: activateSelectedCell,
    },
    { enabled: !isSolved, includeWasd: true, allowRepeat: true },
  )

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false)
  }, [])

  const handleNewGame = useCallback(() => {
    resetGame()
  }, [resetGame])

  const onSelectTheme = useCallback(
    (themeId: string) => {
      if (!COLOR_THEMES.some((theme: { id: string }) => theme.id === themeId)) {
        return
      }

      setColorTheme(themeId)
    },
    [setColorTheme],
  )

  const onToggleSound = useCallback(() => {
    setSoundEnabled(!soundEnabled)
  }, [setSoundEnabled, soundEnabled])

  return {
    activeThemeId: settings.colorTheme,
    board,
    boardVisible,
    handleCellClick,
    handleNewGame,
    handleSplashComplete,
    moves,
    onResetStats: resetStats,
    onSelectTheme,
    onToggleSound,
    selectedCell,
    setBoardVisible,
    showSplash,
    soundEnabled,
    statsWins: stats.wins,
    title: 'Lights Out',
    winMessage: isSolved ? `Solved in ${moves} moves!` : null,
  }
}
