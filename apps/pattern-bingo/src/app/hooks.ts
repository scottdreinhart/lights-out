/**
 * React hooks for Pattern Bingo
 * Pattern detection and multiplier scoring
 */

import { useState, useCallback, useMemo } from 'react'
import { PATTERN_POINTS, PATTERN_MULTIPLIERS } from '../domain'

/**
 * Defines the card grid coordinates for pattern detection
 * Standard 5x5 bingo card (0-indexed)
 */
export type GridCoordinate = [row: number, col: number]

/**
 * Pattern types available in Pattern Bingo
 */
export type PatternType = 'LINE' | 'CORNERS' | 'FRAME' | 'PLUS' | 'FULL_HOUSE'

/**
 * Represents a single detected pattern
 */
export interface DetectedPattern {
  type: PatternType
  coordinates: GridCoordinate[]
  score: number
  timestamp: number
  multiplier: number
}

/**
 * Hook for pattern detection and multiplier scoring
 * Detects multiple pattern objectives on 5x5 bingo card
 *
 * Patterns:
 * - LINE: Any horizontal or vertical line (5 squares) = 100 points
 * - CORNERS: Four corner squares = 150 points
 * - FRAME: Border squares (16 total) = 200 points
 * - PLUS: Center + adjacent cardinal = 175 points
 * - FULL_HOUSE: All 25 squares = 500 points
 *
 * Multipliers:
 * - 1st pattern: 1.0x
 * - 2nd pattern: 1.5x
 * - 3rd pattern: 2.0x
 * - 4th+ patterns: 2.5x
 */
export const usePatternDetection = () => {
  const [detectedPatterns, setDetectedPatterns] = useState<DetectedPattern[]>([])
  const [markedSquares, setMarkedSquares] = useState<Set<number>>(new Set())

  /**
   * Marks a square as stamped (0-24 for 5x5 card)
   */
  const markSquare = useCallback((index: number) => {
    setMarkedSquares((prev) => {
      const updated = new Set(prev)
      updated.add(index)
      return updated
    })
  }, [])

  /**
   * Unmarks a square
   */
  const unmarkSquare = useCallback((index: number) => {
    setMarkedSquares((prev) => {
      const updated = new Set(prev)
      updated.delete(index)
      return updated
    })
  }, [])

  /**
   * Converts 2D coordinates to 1D index
   */
  const coordToIndex = useCallback((row: number, col: number): number => {
    return row * 5 + col
  }, [])

  /**
   * Checks if a horizontal line is complete (5 in a row)
   */
  const checkHorizontalLine = useCallback(
    (row: number): boolean => {
      for (let col = 0; col < 5; col++) {
        if (!markedSquares.has(coordToIndex(row, col))) {
          return false
        }
      }
      return true
    },
    [markedSquares, coordToIndex],
  )

  /**
   * Checks if a vertical line is complete (5 in column)
   */
  const checkVerticalLine = useCallback(
    (col: number): boolean => {
      for (let row = 0; row < 5; row++) {
        if (!markedSquares.has(coordToIndex(row, col))) {
          return false
        }
      }
      return true
    },
    [markedSquares, coordToIndex],
  )

  /**
   * Detects all LINE patterns (horizontal + vertical)
   */
  const detectLines = useCallback((): GridCoordinate[] => {
    const coordinates: GridCoordinate[] = []

    // Check horizontal lines
    for (let row = 0; row < 5; row++) {
      if (checkHorizontalLine(row)) {
        for (let col = 0; col < 5; col++) {
          coordinates.push([row, col])
        }
        break // Only count first detected line to avoid double-scoring
      }
    }

    // Check vertical lines (only if no horizontal found)
    if (coordinates.length === 0) {
      for (let col = 0; col < 5; col++) {
        if (checkVerticalLine(col)) {
          for (let row = 0; row < 5; row++) {
            coordinates.push([row, col])
          }
          break // Only count first detected line
        }
      }
    }

    return coordinates
  }, [checkHorizontalLine, checkVerticalLine])

  /**
   * Detects CORNERS pattern (4 corner squares)
   */
  const detectCorners = useCallback((): GridCoordinate[] => {
    const corners: GridCoordinate[] = [
      [0, 0],
      [0, 4],
      [4, 0],
      [4, 4],
    ]

    if (corners.every(([row, col]) => markedSquares.has(coordToIndex(row, col)))) {
      return corners
    }
    return []
  }, [markedSquares, coordToIndex])

  /**
   * Detects FRAME pattern (outer border = 16 squares)
   */
  const detectFrame = useCallback((): GridCoordinate[] => {
    const frameCoords: GridCoordinate[] = []

    // Top and bottom rows
    for (let col = 0; col < 5; col++) {
      frameCoords.push([0, col])
      frameCoords.push([4, col])
    }

    // Left and right columns (excluding corners already added)
    for (let row = 1; row < 4; row++) {
      frameCoords.push([row, 0])
      frameCoords.push([row, 4])
    }

    if (frameCoords.every(([row, col]) => markedSquares.has(coordToIndex(row, col)))) {
      return frameCoords
    }
    return []
  }, [markedSquares, coordToIndex])

  /**
   * Detects PLUS pattern (center + cardinal directions)
   */
  const detectPlus = useCallback((): GridCoordinate[] => {
    const plusCoords: GridCoordinate[] = [
      [2, 2], // Center
      [1, 2], // Top
      [3, 2], // Bottom
      [2, 1], // Left
      [2, 3], // Right
    ]

    if (plusCoords.every(([row, col]) => markedSquares.has(coordToIndex(row, col)))) {
      return plusCoords
    }
    return []
  }, [markedSquares, coordToIndex])

  /**
   * Detects FULL_HOUSE pattern (all 25 squares)
   */
  const detectFullHouse = useCallback((): GridCoordinate[] => {
    if (markedSquares.size === 25) {
      const allSquares: GridCoordinate[] = []
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
          allSquares.push([row, col])
        }
      }
      return allSquares
    }
    return []
  }, [markedSquares])

  /**
   * Checks all patterns and returns newly detected ones
   */
  const detectAllPatterns = useCallback(() => {
    const patterns: { type: PatternType; coords: GridCoordinate[] }[] = []

    // Check all pattern types
    const lineCoords = detectLines()
    if (lineCoords.length > 0) patterns.push({ type: 'LINE', coords: lineCoords })

    const cornersCoords = detectCorners()
    if (cornersCoords.length > 0) patterns.push({ type: 'CORNERS', coords: cornersCoords })

    const frameCoords = detectFrame()
    if (frameCoords.length > 0) patterns.push({ type: 'FRAME', coords: frameCoords })

    const plusCoords = detectPlus()
    if (plusCoords.length > 0) patterns.push({ type: 'PLUS', coords: plusCoords })

    const fullHouseCoords = detectFullHouse()
    if (fullHouseCoords.length > 0) patterns.push({ type: 'FULL_HOUSE', coords: fullHouseCoords })

    // Only add newly detected patterns (not already in detectedPatterns)
    const newPatterns: DetectedPattern[] = patterns
      .filter(
        (p) =>
          !detectedPatterns.some(
            (dp) =>
              dp.type === p.type &&
              dp.coordinates.every(([r, c]) =>
                p.coords.some(([pr, pc]) => pr === r && pc === c),
              ),
          ),
      )
      .map((p) => {
        const multiplierIndex = Math.min(detectedPatterns.length, PATTERN_MULTIPLIERS.length - 1)
        const multiplier = PATTERN_MULTIPLIERS[multiplierIndex]
        const baseScore = PATTERN_POINTS[p.type]

        return {
          type: p.type,
          coordinates: p.coords,
          score: baseScore,
          timestamp: Date.now(),
          multiplier,
        }
      })

    return newPatterns
  }, [detectLines, detectCorners, detectFrame, detectPlus, detectFullHouse, detectedPatterns])

  /**
   * Records a new pattern and updates state
   */
  const recordPattern = useCallback(() => {
    const newPatterns = detectAllPatterns()
    if (newPatterns.length > 0) {
      setDetectedPatterns((prev) => [...prev, ...newPatterns])
      return newPatterns[0] // Return first newly detected pattern
    }
    return null
  }, [detectAllPatterns])

  /**
   * Calculates total score from all detected patterns with multipliers
   */
  const getTotalScore = useCallback(() => {
    return detectedPatterns.reduce((sum, pattern) => {
      return sum + pattern.score * pattern.multiplier
    }, 0)
  }, [detectedPatterns])

  /**
   * Gets current multiplier for next pattern
   */
  const getNextMultiplier = useCallback(() => {
    const multIndex = Math.min(detectedPatterns.length, PATTERN_MULTIPLIERS.length - 1)
    return PATTERN_MULTIPLIERS[multIndex]
  }, [detectedPatterns.length])

  /**
   * Resets all patterns and marked squares
   */
  const reset = useCallback(() => {
    setDetectedPatterns([])
    setMarkedSquares(new Set())
  }, [])

  // Computed properties for component compatibility
  const availablePatterns = useMemo(() => {
    return ['LINE', 'CORNERS', 'FRAME', 'PLUS', 'FULL_HOUSE'] as PatternType[]
  }, [])

  const currentMultiplier = useMemo(() => {
    return getNextMultiplier()
  }, [getNextMultiplier])

  const patternScores = useMemo(() => {
    const scores: Record<PatternType, number> = {
      LINE: PATTERN_POINTS.LINE,
      CORNERS: PATTERN_POINTS.CORNERS,
      FRAME: PATTERN_POINTS.FRAME,
      PLUS: PATTERN_POINTS.PLUS,
      FULL_HOUSE: PATTERN_POINTS.FULL_HOUSE,
    }
    return scores
  }, [])

  const totalScore = useMemo(() => {
    return getTotalScore()
  }, [getTotalScore])

  const multiplier = useMemo(() => {
    return getNextMultiplier()
  }, [getNextMultiplier])

  const nextMultiplierProgress = useMemo(() => {
    // Calculate progress to next multiplier level
    // This is a simplified calculation - in a real implementation,
    // this might track progress toward the next pattern
    const currentPatterns = detectedPatterns.length
    const progressInCurrentLevel = (currentPatterns % 1) * 100 // Simplified
    return Math.min(100, progressInCurrentLevel)
  }, [detectedPatterns.length])

  return {
    markedSquares,
    markSquare,
    unmarkSquare,
    detectedPatterns,
    recordPattern,
    getTotalScore,
    getNextMultiplier,
    reset,
    // Computed properties for components
    availablePatterns,
    currentMultiplier,
    patternScores,
    totalScore,
    multiplier,
    nextMultiplierProgress,
  }
}
