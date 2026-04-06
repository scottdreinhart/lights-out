import type { Grid, Cell, PatternType } from './types'

/**
 * Generate a random bingo card for Pattern Bingo
 * 5x5 grid with numbers 1-75, center cell is FREE
 */
export const generateCard = (): Grid => {
  const columns = {
    B: Array.from({ length: 15 }, (_, i) => i + 1),
    I: Array.from({ length: 15 }, (_, i) => i + 16),
    N: Array.from({ length: 15 }, (_, i) => i + 31),
    G: Array.from({ length: 15 }, (_, i) => i + 46),
    O: Array.from({ length: 15 }, (_, i) => i + 61),
  }

  // Shuffle each column
  const shuffle = (arr: number[]) => {
    const shuffled = [...arr]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const card: Grid = []
  for (let row = 0; row < 5; row++) {
    const gridRow: Cell[] = []
    const cols = Object.keys(columns) as Array<keyof typeof columns>
    for (let col = 0; col < 5; col++) {
      const colKey = cols[col]
      const number = shuffle(columns[colKey])[row]
      gridRow.push({
        number: row === 2 && col === 2 ? 0 : number, // Center is FREE (0)
        marked: row === 2 && col === 2, // Center is pre-marked
        hinted: false,
      })
    }
    card.push(gridRow)
  }

  return card
}

/**
 * Mark a number on the card
 */
export const markNumber = (card: Grid, number: number): Grid => {
  return card.map((row) =>
    row.map((cell) =>
      cell.number === number ? { ...cell, marked: true } : cell,
    ),
  )
}

/**
 * Get all marked cells
 */
export const getMarkedCells = (card: Grid): Array<[number, number]> => {
  const marked: Array<[number, number]> = []
  card.forEach((row, rowIdx) => {
    row.forEach((cell, colIdx) => {
      if (cell.marked) {
        marked.push([rowIdx, colIdx])
      }
    })
  })
  return marked
}

/**
 * Check if a specific pattern is complete
 */
export const checkPattern = (card: Grid, pattern: PatternType): boolean => {
  const marked = getMarkedCells(card)
  const markedSet = new Set(marked.map((m) => `${m[0]},${m[1]}`))

  const patterns: Record<PatternType, Array<[number, number]>> = {
    row: [],
    column: [],
    diagonalMain: [],
    diagonalAnti: [],
    corners: [
      [0, 0],
      [0, 4],
      [4, 0],
      [4, 4],
    ],
    x: [
      [0, 0],
      [0, 4],
      [1, 1],
      [1, 3],
      [2, 2],
      [3, 1],
      [3, 3],
      [4, 0],
      [4, 4],
    ],
    t: [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [1, 2],
      [2, 2],
      [3, 2],
      [4, 2],
    ],
    l: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [4, 1],
      [4, 2],
      [4, 3],
      [4, 4],
    ],
    u: [
      [0, 0],
      [0, 4],
      [1, 0],
      [1, 4],
      [2, 0],
      [2, 4],
      [3, 0],
      [3, 4],
      [4, 0],
      [4, 1],
      [4, 2],
      [4, 3],
      [4, 4],
    ],
    h: [
      [0, 0],
      [0, 4],
      [1, 0],
      [1, 4],
      [2, 0],
      [2, 1],
      [2, 2],
      [2, 3],
      [2, 4],
      [3, 0],
      [3, 4],
      [4, 0],
      [4, 4],
    ],
    outerFrame: [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [1, 0],
      [1, 4],
      [2, 0],
      [2, 4],
      [3, 0],
      [3, 4],
      [4, 0],
      [4, 1],
      [4, 2],
      [4, 3],
      [4, 4],
    ],
  }

  // Check row pattern
  if (pattern === 'row') {
    for (let row = 0; row < 5; row++) {
      const rowCells = Array.from({ length: 5 }, (_, col) => [row, col] as [number, number])
      if (rowCells.every((c) => markedSet.has(`${c[0]},${c[1]}`))) {
        return true
      }
    }
    return false
  }

  // Check column pattern
  if (pattern === 'column') {
    for (let col = 0; col < 5; col++) {
      const colCells = Array.from({ length: 5 }, (_, row) => [row, col] as [number, number])
      if (colCells.every((c) => markedSet.has(`${c[0]},${c[1]}`))) {
        return true
      }
    }
    return false
  }

  // Check main diagonal (top-left to bottom-right)
  if (pattern === 'diagonalMain') {
    const diagCells = [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4]]
    if (diagCells.every((c) => markedSet.has(`${c[0]},${c[1]}`))) {
      return true
    }
    return false
  }

  // Check anti-diagonal (top-right to bottom-left)
  if (pattern === 'diagonalAnti') {
    const diagCells = [[0, 4], [1, 3], [2, 2], [3, 1], [4, 0]]
    if (diagCells.every((c) => markedSet.has(`${c[0]},${c[1]}`))) {
      return true
    }
    return false
  }

  // Check predefined patterns
  const patternCells = patterns[pattern]
  return patternCells.every((c) => markedSet.has(`${c[0]},${c[1]}`))
}

/**
 * Get all potentially winning patterns
 */
export const getWinningPatterns = (card: Grid): PatternType[] => {
  const patterns: PatternType[] = [
    'row',
    'column',
    'diagonalMain',
    'diagonalAnti',
    'corners',
    'x',
    't',
    'l',
    'u',
    'h',
    'outerFrame',
  ]

  return patterns.filter((pattern) => checkPattern(card, pattern))
}

/**
 * Check if player has won
 */
export const hasWon = (card: Grid): boolean => {
  return getWinningPatterns(card).length > 0
}
