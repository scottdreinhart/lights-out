import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  clearKeyboardSelection,
  commitGameMove,
  computeAiMoveAsync,
  describeGameInstructions,
  describeGameStatus,
  handleBoardPress,
  handleGameCompletion,
  handleKeyboardActionPress,
  handleKeyboardFocusMove,
  runCpuTurn,
  syncSelectedPiece,
  useGameDebug,
  load,
  save,
  startNewGame,
  useKeyboardControls,
  useResponsiveState,
  useSoundContext,
  useSoundEffects,
  useStats,
  useTheme,
  vibrate,
} from '@/app'
import { useGridNavigationInput } from '@games/app-hook-utils'
import {
  CPU_PLAYER,
  createInitialBoard,
  countPieces,
  getLegalMoves,
  HUMAN_PLAYER,
  isMoveForPosition,
  type Move,
  type OpponentMode,
  type Player,
  type Position,
} from '@/domain'

const OPPONENT_MODE_STORAGE_KEY = 'checkers:opponent-mode'
const createFreshBoard = () => createInitialBoard()

export type UseCheckersGameResult = UseCheckersGameResultShape

export interface UseCheckersGameResultShape {
  showSplash: boolean
  handleSplashComplete: () => void
  board: ReturnType<typeof createInitialBoard>
  selected: Position | null
  winner: Player | null
  lastMove: Move | null
  history: string[]
  keyboardFocus: Position | null
  showRulesModal: boolean
  showHelpModal: boolean
  showSettingsModal: boolean
  stats: ReturnType<typeof useStats>['stats']
  soundEnabled: boolean
  toggleSound: () => void
  responsive: ReturnType<typeof useResponsiveState>
  colorTheme: ReturnType<typeof useTheme>['colorTheme']
  mode: ReturnType<typeof useTheme>['mode']
  colorblind: ReturnType<typeof useTheme>['colorblind']
  colorThemes: ReturnType<typeof useTheme>['colorThemes']
  modes: ReturnType<typeof useTheme>['modes']
  colorblindModes: ReturnType<typeof useTheme>['colorblindModes']
  legalMoves: ReturnType<typeof getLegalMoves>
  redPieces: number
  blackPieces: number
  opponentMode: OpponentMode
  status: string
  instructions: string | null
  currentPlayerLabel: string
  winnerLabel: string
  thinking: boolean
  mandatoryJump: boolean
  handleSquarePress: (position: Position) => void
  handleNewGame: () => void
  handleOpponentModeChange: (nextMode: OpponentMode) => void
  moveKeyboardFocus: (deltaRow: number, deltaCol: number) => void
  handleKeyboardAction: () => void
  handleKeyboardCancel: () => void
  keyboardBindings: Array<{ action: string; keys: string[]; onTrigger: () => void }>
  setShowRulesModal: (value: boolean) => void
  setShowHelpModal: (value: boolean) => void
  setShowSettingsModal: (value: boolean) => void
  resetStats: () => void
  onToggleSound: () => void
  onThemeChange: (theme: string) => void
  onModeChange: (modeValue: string) => void
  onColorblindChange: (colorblindValue: string) => void
}

export const useCheckersGame = (): UseCheckersGameResultShape => {
  const [showSplash, setShowSplash] = useState(true)
  const [board, setBoard] = useState(createFreshBoard)
  const [currentPlayer, setCurrentPlayer] = useState<Player>(HUMAN_PLAYER)
  const [opponentMode, setOpponentMode] = useState<OpponentMode>(() =>
    load<OpponentMode>(OPPONENT_MODE_STORAGE_KEY, 'cpu'),
  )
  const [selected, setSelected] = useState<Position | null>(null)
  const [winner, setWinner] = useState<Player | null>(null)
  const [lastMove, setLastMove] = useState<Move | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const [keyboardFocus, setKeyboardFocus] = useState<Position | null>(null)
  const [showRulesModal, setShowRulesModal] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  const { stats, recordLoss, recordWin, resetStats } = useStats()
  const { soundEnabled, toggleSound } = useSoundContext()
  const { onClick, onConfirm, onCpuMove, onLose, onSelect, onWin } = useSoundEffects()
  const responsive = useResponsiveState()
  const {
    colorTheme,
    mode,
    colorblind,
    colorThemes,
    modes,
    colorblindModes,
    setColorTheme,
    setMode,
    setColorblind,
  } = useTheme()

  const legalMoves = useMemo(
    () => (winner ? [] : getLegalMoves(board, currentPlayer)),
    [board, currentPlayer, winner],
  )
  const selectedMoves = useMemo(
    () => (selected ? legalMoves.filter((move) => isMoveForPosition(move, selected)) : []),
    [legalMoves, selected],
  )
  const thinking = opponentMode === 'cpu' && currentPlayer === CPU_PLAYER && !winner
  const redPieces = countPieces(board, 'red')
  const blackPieces = countPieces(board, 'black')
  const mandatoryJump = legalMoves.some((move) => move.captures.length > 0)
  const currentPlayerLabel = currentPlayer === 'red' ? 'Red' : 'Black'
  const winnerLabel = winner === 'red' ? 'Red' : 'Black'

  useGameDebug({
    board,
    currentPlayer,
    legalMoves,
    thinking,
    selectedRow: selected?.row,
    selectedCol: selected?.col,
  })

  const finishGame = useCallback(
    (nextWinner: Player) => {
      setWinner(nextWinner)
      setSelected(null)
      handleGameCompletion({
        nextWinner,
        opponentMode,
        recordWin,
        recordLoss,
        onWin,
        onLose,
      })
    },
    [onLose, onWin, opponentMode, recordLoss, recordWin],
  )

  const commitMove = useCallback(
    (move: Move, player: Player) => {
      commitGameMove({
        board,
        move,
        player,
        opponentMode,
        finishGame,
        setBoard,
        setSelected,
        setLastMove,
        setHistory,
        setCurrentPlayer,
        onConfirm,
        onCpuMove,
        vibrate,
      })
    },
    [board, finishGame, onConfirm, onCpuMove, opponentMode],
  )

  useEffect(() => {
    syncSelectedPiece({ selected, legalMoves, setSelected })
  }, [legalMoves, selected])

  useEffect(() => {
    return runCpuTurn({
      board,
      thinking,
      finishGame,
      commitMove,
      computeAiMove: computeAiMoveAsync,
    })
  }, [board, commitMove, finishGame, thinking])

  useEffect(() => {
    save(OPPONENT_MODE_STORAGE_KEY, opponentMode)
  }, [opponentMode])

  const handleSquarePress = useCallback(
    (position: Position) => {
      handleBoardPress({
        board,
        position,
        currentPlayer,
        selected,
        legalMoves,
        selectedMoves,
        winner,
        thinking,
        setSelected,
        onSelect,
        commitMove,
      })
    },
    [
      board,
      commitMove,
      currentPlayer,
      legalMoves,
      onSelect,
      selected,
      selectedMoves,
      thinking,
      winner,
    ],
  )

  const resetGame = useCallback((nextMode: OpponentMode) => {
    setBoard(createFreshBoard())
    setCurrentPlayer(HUMAN_PLAYER)
    setOpponentMode(nextMode)
    setSelected(null)
    setWinner(null)
    setLastMove(null)
    setHistory([])
  }, [])

  const handleNewGame = useCallback(() => {
    startNewGame({ opponentMode, resetGame, onClick })
  }, [onClick, opponentMode, resetGame])

  const handleOpponentModeChange = useCallback(
    (nextMode: OpponentMode) => {
      resetGame(nextMode)
      onClick()
    },
    [onClick, resetGame],
  )

  const moveKeyboardFocus = useCallback(
    (deltaRow: number, deltaCol: number) => {
      handleKeyboardFocusMove({
        keyboardFocus,
        deltaRow,
        deltaCol,
        thinking,
        winner,
        setKeyboardFocus,
        onClick,
      })
    },
    [keyboardFocus, thinking, winner, onClick],
  )

  const handleKeyboardAction = useCallback(() => {
    handleKeyboardActionPress({
      keyboardFocus,
      board,
      currentPlayer,
      selected,
      legalMoves,
      selectedMoves,
      winner,
      thinking,
      setSelected,
      onSelect,
      commitMove,
    })
  }, [
    keyboardFocus,
    thinking,
    winner,
    board,
    selected,
    currentPlayer,
    legalMoves,
    selectedMoves,
    onSelect,
    commitMove,
  ])

  const handleKeyboardCancel = useCallback(() => {
    clearKeyboardSelection(selected, setSelected, setKeyboardFocus)
  }, [selected])

  useGridNavigationInput(
    {
      onMove: (direction) => {
        if (direction === 'up') moveKeyboardFocus(-1, 0)
        if (direction === 'down') moveKeyboardFocus(1, 0)
        if (direction === 'left') moveKeyboardFocus(0, -1)
        if (direction === 'right') moveKeyboardFocus(0, 1)
      },
      onSelect: handleKeyboardAction,
      onCancel: handleKeyboardCancel,
    },
    { enabled: true, includeWasd: true, allowRepeat: true },
  )

  useKeyboardControls([{ action: 'new-game', keys: ['KeyN'], onTrigger: handleNewGame }])

  const status = useMemo(
    () =>
      describeGameStatus({
        winner,
        opponentMode,
        thinking,
        mandatoryJump,
        selected: selected !== null,
        currentPlayerLabel,
        winnerLabel,
      }),
    [currentPlayerLabel, mandatoryJump, opponentMode, selected, thinking, winner, winnerLabel],
  )

  const instructions = describeGameInstructions({
    winner,
    thinking,
    selected: selected !== null,
    mandatoryJump,
  })

  return {
    showSplash,
    handleSplashComplete: () => setShowSplash(false),
    board,
    selected,
    winner,
    lastMove,
    history,
    keyboardFocus,
    showRulesModal,
    showHelpModal,
    showSettingsModal,
    stats,
    soundEnabled,
    toggleSound,
    responsive,
    colorTheme,
    mode,
    colorblind,
    colorThemes,
    modes,
    colorblindModes,
    legalMoves,
    redPieces,
    blackPieces,
    opponentMode,
    status,
    instructions,
    currentPlayerLabel,
    winnerLabel,
    thinking,
    mandatoryJump,
    handleSquarePress,
    handleNewGame,
    handleOpponentModeChange,
    moveKeyboardFocus,
    handleKeyboardAction,
    handleKeyboardCancel,
    keyboardBindings,
    setShowRulesModal,
    setShowHelpModal,
    setShowSettingsModal,
    resetStats,
    onToggleSound: toggleSound,
    onThemeChange: setColorTheme,
    onModeChange: setMode,
    onColorblindChange: setColorblind,
  }
}
