/**
 * SudokuBoard Organism Component
 * Main 4×4 game board with all controls
 */

import React, { useState } from 'react'
import type { MiniSudokuState } from '../../domain'
import type { UseMiniSudokuReturn } from '../../app'
import { SudokuCell } from '../atoms/SudokuCell'
import styles from './SudokuBoard.module.css'

interface SudokuBoardProps {
  game: UseMiniSudokuReturn
  onGameComplete?: (isSolved: boolean) => void
}

export const SudokuBoard: React.FC<SudokuBoardProps> = ({ game, onGameComplete }) => {
  const [selectedCellId, setSelectedCellId] = useState<string | null>(null)

  const handleCellSelect = (cellId: string) => {
    const cell = game.state.board.get(cellId)
    if (!cell?.isGiven) {
      setSelectedCellId(cellId)
    }
  }

  const handleValueClick = (value: string) => {
    if (selectedCellId) {
      game.assignValue(selectedCellId, value as any)
    }
  }

  const handleClearClick = () => {
    if (selectedCellId) {
      game.clearCell(selectedCellId)
    }
  }

  React.useEffect(() => {
    if (game.isComplete && onGameComplete) {
      onGameComplete(game.isSolved())
    }
  }, [game.state.isComplete, game, onGameComplete])

  return (
    <div className={styles.container}>
      {/* Board */}
      <div className={styles.board}>
        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 4 }).map((_, col) => {
            const cellId = `r${row}c${col}`
            const cell = game.state.board.get(cellId)!
            const conflictingCells = game.getConflictingCells(cellId, cell.value)

            return (
              <SudokuCell
                key={cellId}
                cellId={cellId}
                value={cell.value}
                isGiven={cell.isGiven}
                candidates={cell.candidates}
                isSelected={selectedCellId === cellId}
                hasConflict={conflictingCells.length > 0}
                onSelect={handleCellSelect}
                onValueChange={() => {}} // Will be handled by value buttons
              />
            )
          }),
        )}
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.valueButtons}>
          {['1', '2', '3', '4'].map(value => (
            <button
              key={value}
              className={styles.valueButton}
              onClick={() => handleValueClick(value)}
              disabled={!selectedCellId || !game.canAssignValue(selectedCellId, value as any)}
            >
              {value}
            </button>
          ))}
        </div>

        <div className={styles.actions}>
          <button className={styles.button} onClick={handleClearClick} disabled={!selectedCellId}>
            Clear
          </button>
          <button className={styles.button} onClick={() => game.undo()}>
            Undo
          </button>
          <button className={styles.button} onClick={() => game.redo()}>
            Redo
          </button>
          <button className={styles.button} onClick={() => game.requestHint()}>
            Hint
          </button>
          <button className={styles.button} onClick={() => game.restartPuzzle()}>
            Restart
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        {(() => {
          const stats = game.getGameStats()
          return (
            <>
              <div className={styles.stat}>
                <span className={styles.label}>Moves:</span>
                <span className={styles.value}>{stats.moveCount}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.label}>Hints:</span>
                <span className={styles.value}>{stats.hintCount}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.label}>Errors:</span>
                <span className={styles.value}>{stats.mistakes}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.label}>Time:</span>
                <span className={styles.value}>{stats.elapsedSeconds}s</span>
              </div>
            </>
          )
        })()}
      </div>

      {/* Completion Message */}
      {game.isSolved() && (
        <div className={styles.completionMessage}>
          <h2 className={styles.title}>🎉 Puzzle Solved!</h2>
          <p className={styles.subtitle}>Great job! Your puzzle is complete and valid.</p>
        </div>
      )}
    </div>
  )
}
