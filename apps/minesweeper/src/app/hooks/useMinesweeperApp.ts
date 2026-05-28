import { useCallback, useMemo, useState } from 'react'
import { useKeyboardControls, useGridNavigationInput } from '@games/app-hook-utils'
import { useResponsiveState } from '@games/ui-hooks'
import { useGame } from './useGame'
import { useStats } from './useStats'

export type Position = { row: number; col: number }

export type UseMinesweeperAppReturn = ReturnType<typeof useMinesweeperApp>

export function useMinesweeperApp() {
  const responsive = useResponsiveState()
  const {
    game,
    reveal,
    chord,
    toggleCellFlag,
    submitBoard,
    resetGame,
    changeDifficulty,
    resetStats,
  } = useGame()
  const stats = useStats()

  const [screen, setScreen] = useState<'splash' | 'landing' | 'playing' | 'scores'>('splash')
  const [menuOpen, setMenuOpen] = useState(false)
  const [showRulesModal, setShowRulesModal] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [selectedCell, setSelectedCell] = useState<Position>({ row: 0, col: 0 })
  const [hint, setHint] = useState<{ row: number; col: number } | null>(null)
  const [hintPending, setHintPending] = useState(false)
  const [hintLabel, setHintLabel] = useState<string>('Use arrow keys to navigate')
  const [doneFeedback, setDoneFeedback] = useState<string | null>(null)

  const disabled = game.status === 'won' || game.status === 'lost'

  const handleSplashComplete = useCallback(() => {
    setScreen('landing')
  }, [])

  const startGame = useCallback(() => {
    resetGame()
    setScreen('playing')
    setMenuOpen(false)
    setHint(null)
    setDoneFeedback(null)
  }, [resetGame])

  const openScores = useCallback(() => setScreen('scores'), [])
  const goHome = useCallback(() => setScreen('landing'), [])

  const onReveal = useCallback(
    (row: number, col: number) => {
      reveal(row, col)
      setSelectedCell({ row, col })
    },
    [reveal],
  )

  const onToggleFlag = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, row: number, col: number) => {
      event.preventDefault()
      toggleCellFlag(row, col)
      setSelectedCell({ row, col })
    },
    [toggleCellFlag],
  )

  const onChord = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, row: number, col: number) => {
      event.preventDefault()
      chord(row, col)
      setSelectedCell({ row, col })
    },
    [chord],
  )

  const requestHint = useCallback(() => {
    if (hintPending || disabled) return
    setHintPending(true)
    for (let r = 0; r < game.rows; r++) {
      for (let c = 0; c < game.cols; c++) {
        const cell = game.board[r]?.[c]
        if (cell && cell.state === 'hidden') {
          setHint({ row: r, col: c })
          setHintLabel('Try this cell')
          setTimeout(() => setHintPending(false), 1500)
          return
        }
      }
    }
    setHintLabel('No hints available')
    setHintPending(false)
  }, [game, hintPending, disabled])

  const doneCheck = useCallback(() => {
    const solved = submitBoard()
    setDoneFeedback(solved ? 'Board solved!' : 'Not solved yet')
    return solved
  }, [submitBoard])

  useGridNavigationInput(
    {
      onMove: (direction) => {
        setSelectedCell((current) => {
          const next = { ...current }
          if (direction === 'up') next.row = Math.max(0, current.row - 1)
          if (direction === 'down') next.row = Math.min(game.rows - 1, current.row + 1)
          if (direction === 'left') next.col = Math.max(0, current.col - 1)
          if (direction === 'right') next.col = Math.min(game.cols - 1, current.col + 1)
          return next
        })
      },
      onSelect: () => onReveal(selectedCell.row, selectedCell.col),
      onCancel: () => setMenuOpen((v) => !v),
      onHint: () => requestHint(),
    },
    { enabled: true, includeWasd: true, allowRepeat: true },
  )

  useKeyboardControls(
    [
      { action: 'new-game', keys: ['KeyR'], onTrigger: () => startGame() },
      { action: 'flag', keys: ['KeyF'], onTrigger: () => toggleCellFlag(selectedCell.row, selectedCell.col) },
      { action: 'chord', keys: ['KeyC'], onTrigger: () => chord(selectedCell.row, selectedCell.col) },
    ],
    { enabled: true },
  )

  const minesRemaining = useMemo(() => Math.max(0, (game.mines ?? 0) - (game.flagsPlaced ?? 0)), [game.mines, game.flagsPlaced])

  return {
    screen,
    handleSplashComplete,
    startGame,
    openScores,
    goHome,

    menuOpen,
    setMenuOpen,
    showRulesModal,
    setShowRulesModal,
    showHelpModal,
    setShowHelpModal,

    game,
    difficulty: game.rows === 8 ? 'beginner' : game.rows === 16 ? 'intermediate' : 'expert',
    changeDifficulty,
    onReveal,
    onToggleFlag,
    onChord,
    selectedCell,
    hint,
    hintPending,
    hintLabel,
    requestHint,
    doneCheck,
    doneFeedback,
    mineCounter: minesRemaining,

    stats,
    elapsedSeconds: game.startTime ? Math.max(0, Math.floor(((game.endTime ?? Date.now()) - (game.startTime ?? Date.now())) / 1000)) : 0,
    responsive,
    disabled,
    resetStats,
  }
}
