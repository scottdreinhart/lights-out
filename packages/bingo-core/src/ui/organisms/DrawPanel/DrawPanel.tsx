import type { BingoCard } from '@bingo-core/domain'
import React, { useCallback, useEffect, useState } from 'react'
import styles from './DrawPanel.module.css'

interface DrawPanelProps {
  card: BingoCard
  drawnNumbers: number[]
  gameState: 'playing' | 'won' | 'idle'
  onDraw: () => void
  onReset: () => void
  onNewGame: () => void
  canDraw: boolean
  remainingCount: number
  totalCount: number
  onPlay?: () => void // Optional sound callback
}

export const DrawPanel: React.FC<DrawPanelProps> = ({
  card,
  drawnNumbers,
  gameState,
  onDraw,
  onReset,
  onNewGame,
  canDraw,
  remainingCount,
  totalCount,
}) => {
  const [lastNumber, setLastNumber] = useState<number | null>(null)

  const handleDraw = useCallback(() => {
    if (!canDraw) return
    onDraw()
    // Play sound if callback provided
    onPlay?.()
  }, [canDraw, onDraw, onPlay])

  const handleReset = useCallback(() => {
    onReset()
    setLastNumber(null)
  }, [onReset])

  const handleNewGame = useCallback(() => {
    onNewGame()
    setLastNumber(null)
  }, [onNewGame])

  // Update last drawn number
  useEffect(() => {
    if (drawnNumbers.length > 0) {
      setLastNumber(drawnNumbers[drawnNumbers.length - 1])
    }
  }, [drawnNumbers])

  // Extract number components (B-1, I-16, etc.)
  const getNumberComponents = (num: number) => {
    const columns = ['B', 'I', 'N', 'G', 'O']
    const columnIndex = Math.floor((num - 1) / 15)
    const column = columns[columnIndex]
    return { column, value: num }
  }

  const { column, value } = lastNumber
    ? getNumberComponents(lastNumber)
    : { column: '', value: null }

  // Simple responsive classes based on window width
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 900
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 600

  return (
    <div
      className={styles.root}
      style={{
        padding: isMobile ? '16px' : isDesktop ? '32px' : '24px',
      }}
    >
      <div className={styles.content}>
        {/* Number Display */}
        <div className={styles.numberDisplay}>
          {lastNumber ? (
            <>
              <div className={styles.column}>{column}</div>
              <div className={styles.value}>{value}</div>
            </>
          ) : (
            <div className={styles.empty}>-</div>
          )}
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Drawn</span>
            <span className={styles.statValue}>{drawnNumbers.length}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Remaining</span>
            <span className={styles.statValue}>{remainingCount}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Total</span>
            <span className={styles.statValue}>{totalCount}</span>
          </div>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <button
            className={styles.drawButton}
            onClick={handleDraw}
            disabled={!canDraw || gameState !== 'playing'}
            aria-label={`Draw number (${remainingCount} remaining)`}
          >
            Draw Number
          </button>
          <button
            className={styles.resetButton}
            onClick={handleReset}
            disabled={drawnNumbers.length === 0}
            aria-label="Reset drawn numbers"
          >
            Reset
          </button>
        </div>

        {/* Game Over Message */}
        {gameState === 'won' && (
          <div className={styles.gameOverMessage}>
            <p>🎉 Bingo! You won!</p>
            <button className={styles.newGameButton} onClick={handleNewGame}>
              New Game
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
