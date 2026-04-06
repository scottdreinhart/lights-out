/**
 * Web Worker message types for Battleship CPU operations
 */

export type Row = number
export type Col = number
export type Coord = { row: Row; col: Col }

export type CellOwner = 'player' | 'cpu' | 'empty'
export type CellStatus = 'water' | 'hit' | 'miss' | 'sunk'

export interface Cell {
  owner: CellOwner
  status: CellStatus
}

export type Board = {
  cells: Cell[][]
  ships: Array<{
    owner: CellOwner
    cells: Coord[]
  }>
}

export type Difficulty = 'easy' | 'medium' | 'hard'

/**
 * Message sent from main thread to worker
 */
export type BattleshipWorkerMessage =
  | {
      type: 'getMove'
      board: Board
      difficulty: Difficulty
      requestId: string
    }
  | {
      type: 'init'
    }
  | {
      type: 'terminate'
    }

/**
 * Message sent from worker back to main thread
 */
export type BattleshipWorkerResponse =
  | {
      type: 'moveReady'
      requestId: string
      move: Coord
      timeTaken: number
      difficulty: Difficulty
    }
  | {
      type: 'error'
      requestId: string
      message: string
    }
  | {
      type: 'ready'
    }

/**
 * Pending move request tracker
 */
export interface PendingMoveRequest {
  requestId: string
  resolve: (move: Coord) => void
  reject: (error: Error) => void
  startTime: number
  timeout: ReturnType<typeof setTimeout>
}
