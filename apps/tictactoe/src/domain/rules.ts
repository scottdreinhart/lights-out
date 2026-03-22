import { WIN_LINES } from './constants.ts'
import type { Board, GameState, Token, WinResult } from './types.ts'

export const getWinner = (board: Board): WinResult | null => {
  for (const line of WIN_LINES) {
    const a = line[0]
    const b = line[1]
    const c = line[2]
    if (a === undefined || b === undefined || c === undefined) {
      continue
    }
    if (board[a] !== null && board[a] === board[b] && board[b] === board[c]) {
      return { token: board[a] as Token, line }
    }
  }
  return null
}

export const getWinnerToken = (board: Board): Token | null => {
  const result = getWinner(board)
  return result ? result.token : null
}

export const isBoardFull = (board: Board): boolean => board.every((cell) => cell !== null)

export const isDraw = (board: Board): boolean => isBoardFull(board) && getWinner(board) === null

export const getGameState = (board: Board): GameState => {
  const winResult = getWinner(board)
  const winner = winResult ? winResult.token : null
  const winLine = winResult ? winResult.line : null
  const drawState = isDraw(board)
  return { winner, winLine, isDraw: drawState, isOver: winner !== null || drawState }
}
