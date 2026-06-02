import type { Board, Move, OpponentMode, Player, Position } from '@/domain'
import {
  applyMove,
  CPU_DELAY_MS,
  CPU_PLAYER,
  formatMove,
  getOpponent,
  getPieceAt,
  getWinner,
  isMoveForPosition,
  isMoveTarget,
} from '@/domain'

interface CheckersWindow extends Window {
  __checksGameDebugLog?: string
  __checksVerboseLogging?: boolean
}

const getCheckersWindow = (): CheckersWindow | null => {
  if (typeof window === 'undefined') {
    return null
  }

  return window as CheckersWindow
}

export interface GameDebugInfo {
  board: Board
  currentPlayer: Player
  legalMoves: readonly Move[]
  thinking: boolean
  selectedRow?: number
  selectedCol?: number
}

export const useGameDebug = (info: GameDebugInfo): void => {
  if (!import.meta.env.DEV) {
    return
  }

  if (!info.board || !info.currentPlayer) {
    return
  }

  const checkersWindow = getCheckersWindow()

  const log = {
    timestamp: new Date().toISOString(),
    player: info.currentPlayer,
    thinking: info.thinking,
    legalMoves: info.legalMoves.length,
    selected:
      info.selectedRow !== undefined ? `[${info.selectedRow}, ${info.selectedCol}]` : 'none',
  }

  if (checkersWindow && checkersWindow.__checksGameDebugLog !== JSON.stringify(log)) {
    console.warn('[Checkers Game State]', log)
    checkersWindow.__checksGameDebugLog = JSON.stringify(log)
  }
}

export interface GameStatusInfo {
  winner: Player | null
  opponentMode: 'cpu' | 'local'
  thinking: boolean
  mandatoryJump: boolean
  selected: boolean
  currentPlayerLabel: string
  winnerLabel: string
}

export const describeGameStatus = ({
  winner,
  opponentMode,
  thinking,
  mandatoryJump,
  selected,
  currentPlayerLabel,
  winnerLabel,
}: GameStatusInfo): string => {
  if (winner) {
    if (opponentMode === 'cpu') {
      return winner === 'red'
        ? 'You cleared the board. Victory.'
        : 'The CPU locked you out. Defeat.'
    }

    return `${winnerLabel} wins the local match.`
  }

  if (thinking) {
    return 'CPU is planning the next jump.'
  }

  if (mandatoryJump) {
    return `${currentPlayerLabel} must take the available capture.`
  }

  if (selected) {
    return 'Choose a destination square.'
  }

  return `${currentPlayerLabel} to move.`
}

export interface GameInstructionsInfo {
  winner: Player | null
  thinking: boolean
  selected: boolean
  mandatoryJump: boolean
}

export const describeGameInstructions = ({
  winner,
  thinking,
  selected,
  mandatoryJump,
}: GameInstructionsInfo): string | null => {
  if (winner || thinking || selected) {
    return null
  }

  return mandatoryJump
    ? 'If a jump exists, you must take it.'
    : 'Select a red piece, then choose its destination.'
}

export interface MoveExecutionInfo {
  board: Board
  move: Move
  player: Player
  opponentMode: OpponentMode
}

export interface MoveExecutionResult {
  nextBoard: Board
  nextWinner: Player | null
  nextPlayer: Player | null
  historyEntry: string
  cpuTurn: boolean
}

export const resolveMoveExecution = ({
  board,
  move,
  player,
  opponentMode,
}: MoveExecutionInfo): MoveExecutionResult => {
  const { board: nextBoard } = applyMove(board, move)
  const nextWinner = getWinner(nextBoard)

  return {
    nextBoard,
    nextWinner,
    nextPlayer: nextWinner ? null : getOpponent(player),
    historyEntry: `${player === 'red' ? 'Red' : 'Black'} ${formatMove(move)}`,
    cpuTurn: opponentMode === 'cpu' && player === 'black',
  }
}

export interface BoardSelectionInfo {
  board: Board
  position: Position
  currentPlayer: Player
  selected: Position | null
  legalMoves: readonly Move[]
  selectedMoves: readonly Move[]
  winner: Player | null
  thinking: boolean
}

export type BoardSelectionAction =
  | { type: 'ignore' }
  | { type: 'clear-selection' }
  | { type: 'select-piece'; position: Position }
  | { type: 'commit-move'; move: Move }

export const resolveBoardSelectionAction = ({
  board,
  position,
  currentPlayer,
  selected,
  legalMoves,
  selectedMoves,
  winner,
  thinking,
}: BoardSelectionInfo): BoardSelectionAction => {
  if (winner || thinking) {
    return { type: 'ignore' }
  }

  const piece = getPieceAt(board, position)
  if (piece?.player === currentPlayer) {
    return resolveCurrentPlayerPieceAction({ position, selected, legalMoves })
  }

  if (!selected) {
    return { type: 'ignore' }
  }

  return resolveTargetSelectionAction({ position, selectedMoves })
}

interface CurrentPlayerPieceActionInfo {
  position: Position
  selected: Position | null
  legalMoves: readonly Move[]
}

const resolveCurrentPlayerPieceAction = ({
  position,
  selected,
  legalMoves,
}: CurrentPlayerPieceActionInfo): BoardSelectionAction => {
  if (selected && selected.row === position.row && selected.col === position.col) {
    return { type: 'clear-selection' }
  }

  if (legalMoves.some((move) => isMoveForPosition(move, position))) {
    return { type: 'select-piece', position }
  }

  return { type: 'ignore' }
}

interface TargetSelectionActionInfo {
  position: Position
  selectedMoves: readonly Move[]
}

const resolveTargetSelectionAction = ({
  position,
  selectedMoves,
}: TargetSelectionActionInfo): BoardSelectionAction => {
  const chosenMove = selectedMoves.find((move) => isMoveTarget(move, position))
  return chosenMove ? { type: 'commit-move', move: chosenMove } : { type: 'ignore' }
}

export const resolveNextKeyboardFocus = (
  focus: Position | null,
  deltaRow: number,
  deltaCol: number,
  maxRow = 7,
  maxCol = 7,
): Position | null =>
  createKeyboardFocusPosition(
    (focus?.row ?? 0) + deltaRow,
    (focus?.col ?? 0) + deltaCol,
    maxRow,
    maxCol,
  )

const createKeyboardFocusPosition = (
  row: number,
  col: number,
  maxRow: number,
  maxCol: number,
): Position | null => {
  if (!isWithinKeyboardBounds(row, col, maxRow, maxCol)) {
    return null
  }

  return { row, col }
}

const isWithinKeyboardBounds = (
  row: number,
  col: number,
  maxRow: number,
  maxCol: number,
): boolean => row >= 0 && row <= maxRow && col >= 0 && col <= maxCol

export interface SyncSelectedPieceInfo {
  selected: Position | null
  legalMoves: readonly Move[]
  setSelected: (position: Position | null) => void
}

export const syncSelectedPiece = ({
  selected,
  legalMoves,
  setSelected,
}: SyncSelectedPieceInfo): void => {
  if (!selected) {
    return
  }

  const pieceStillMovable = legalMoves.some((move) => isMoveForPosition(move, selected))
  if (!pieceStillMovable) {
    setSelected(null)
  }
}

export interface RunCpuTurnInfo {
  board: Board
  thinking: boolean
  finishGame: (nextWinner: Player) => void
  commitMove: (move: Move, player: Player) => void
  computeAiMove: (board: Board, player: Player) => Promise<Move | null>
}

export const runCpuTurn = ({
  board,
  thinking,
  finishGame,
  commitMove,
  computeAiMove,
}: RunCpuTurnInfo): (() => void) | void => {
  if (!thinking) {
    return
  }

  let cancelled = false

  const timeoutId = window.setTimeout(() => {
    void (async () => {
      const move = await computeAiMove(board, CPU_PLAYER)

      if (cancelled) {
        return
      }

      if (!move) {
        finishGame('red')
        return
      }

      commitMove(move, CPU_PLAYER)
    })()
  }, CPU_DELAY_MS)

  return () => {
    cancelled = true
    window.clearTimeout(timeoutId)
  }
}

export const clearKeyboardSelection = (
  selected: Position | null,
  setSelected: (position: Position | null) => void,
  setKeyboardFocus: (position: Position | null) => void,
): void => {
  if (selected) {
    setSelected(null)
    return
  }

  setKeyboardFocus(null)
}

export interface GameCompletionInfo {
  nextWinner: Player
  opponentMode: OpponentMode
  recordWin: () => void
  recordLoss: () => void
  onWin: () => void
  onLose: () => void
}

export const handleGameCompletion = ({
  nextWinner,
  opponentMode,
  recordWin,
  recordLoss,
  onWin,
  onLose,
}: GameCompletionInfo): void => {
  if (opponentMode === 'cpu') {
    if (nextWinner === 'red') {
      recordWin()
      onWin()
      return
    }

    recordLoss()
    onLose()
    return
  }

  if (nextWinner === 'red') {
    onWin()
    return
  }

  onLose()
}

export interface CommitGameMoveInfo {
  board: Board
  move: Move
  player: Player
  opponentMode: OpponentMode
  finishGame: (nextWinner: Player) => void
  setBoard: (board: Board) => void
  setSelected: (position: Position | null) => void
  setLastMove: (move: Move) => void
  setHistory: (updater: (previous: string[]) => string[]) => void
  setCurrentPlayer: (player: Player) => void
  onConfirm: () => void
  onCpuMove: () => void
  vibrate: (pattern: number | number[]) => void
}

export const commitGameMove = ({
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
}: CommitGameMoveInfo): void => {
  const execution = resolveMoveExecution({
    board,
    move,
    player,
    opponentMode,
  })

  setBoard(execution.nextBoard)
  setSelected(null)
  setLastMove(move)
  setHistory((previous) => [execution.historyEntry, ...previous].slice(0, 10))

  if (!execution.cpuTurn) {
    if (move.captures.length > 0) {
      vibrate([22, 28, 22])
    } else {
      vibrate(16)
    }
    onConfirm()
  } else {
    onCpuMove()
  }

  if (execution.nextWinner) {
    finishGame(execution.nextWinner)
    return
  }

  setCurrentPlayer(execution.nextPlayer ?? player)
}

export interface BoardPressInfo {
  board: Board
  position: Position
  currentPlayer: Player
  selected: Position | null
  legalMoves: readonly Move[]
  selectedMoves: readonly Move[]
  winner: Player | null
  thinking: boolean
  setSelected: (position: Position | null) => void
  onSelect: () => void
  commitMove: (move: Move, player: Player) => void
}

export const handleBoardPress = ({
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
}: BoardPressInfo): void => {
  const action = resolveBoardSelectionAction({
    board,
    position,
    currentPlayer,
    selected,
    legalMoves,
    selectedMoves,
    winner,
    thinking,
  })

  if (action.type === 'clear-selection') {
    setSelected(null)
    return
  }

  if (action.type === 'select-piece') {
    setSelected(action.position)
    onSelect()
    return
  }

  if (action.type === 'commit-move') {
    commitMove(action.move, currentPlayer)
  }
}

export interface KeyboardFocusMoveInfo {
  keyboardFocus: Position | null
  deltaRow: number
  deltaCol: number
  thinking: boolean
  winner: Player | null
  setKeyboardFocus: (position: Position) => void
  onClick: () => void
}

export const handleKeyboardFocusMove = ({
  keyboardFocus,
  deltaRow,
  deltaCol,
  thinking,
  winner,
  setKeyboardFocus,
  onClick,
}: KeyboardFocusMoveInfo): void => {
  if (thinking || winner) {
    return
  }

  const nextFocus = resolveNextKeyboardFocus(keyboardFocus, deltaRow, deltaCol)
  if (!nextFocus) {
    return
  }

  setKeyboardFocus(nextFocus)
  onClick()
}

export interface KeyboardActionInfo {
  keyboardFocus: Position | null
  board: Board
  currentPlayer: Player
  selected: Position | null
  legalMoves: readonly Move[]
  selectedMoves: readonly Move[]
  winner: Player | null
  thinking: boolean
  setSelected: (position: Position | null) => void
  onSelect: () => void
  commitMove: (move: Move, player: Player) => void
}

export const handleKeyboardActionPress = ({
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
}: KeyboardActionInfo): void => {
  if (!keyboardFocus) {
    return
  }

  const action = resolveBoardSelectionAction({
    board,
    position: keyboardFocus,
    currentPlayer,
    selected,
    legalMoves,
    selectedMoves,
    winner,
    thinking,
  })

  if (action.type === 'select-piece') {
    setSelected(action.position)
    onSelect()
    return
  }

  if (action.type === 'commit-move') {
    commitMove(action.move, currentPlayer)
  }
}

export interface NewGameInfo {
  opponentMode: OpponentMode
  resetGame: (nextMode: OpponentMode) => void
  onClick: () => void
}

export const startNewGame = ({ opponentMode, resetGame, onClick }: NewGameInfo): void => {
  resetGame(opponentMode)
  onClick()
}

export const debugBoardString = (board: Board): string => {
  return board
    .map((row) =>
      row
        .map((piece) => {
          if (!piece) {
            return '.'
          }
          const base = piece.player === 'red' ? 'r' : 'b'
          return piece.isKing ? base.toUpperCase() : base
        })
        .join(' '),
    )
    .join('\n')
}

export const enableGameVerboseLogging = (): void => {
  if (import.meta.env.DEV) {
    const checkersWindow = getCheckersWindow()
    if (checkersWindow) {
      checkersWindow.__checksVerboseLogging = true
    }

    console.warn('[Checkers] Verbose logging enabled. Game events will be logged to console.')
  }
}

export const logGameEvent = (event: string, data?: Record<string, unknown>): void => {
  if (!import.meta.env.DEV) {
    return
  }

  const checkersWindow = getCheckersWindow()
  if (!checkersWindow?.__checksVerboseLogging) {
    return
  }

  console.warn(`[Checkers Event: ${event}]`, data || '')
}
