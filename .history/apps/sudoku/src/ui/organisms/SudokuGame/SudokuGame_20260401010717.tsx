import { useGame, useKeyboardControls, useResponsiveState } from '@/app'
import type { Difficulty } from '@/domain'
import { Button, Card } from '@/ui/atoms'
import { NumberPad, SudokuBoard } from '@/ui/molecules'
import React, { useCallback, useMemo, useState } from 'react'
import styles from './SudokuGame.module.css'

export const SudokuGame: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const { gameState, isComplete, elapsedTime, handleCellChange, resetGame } = useGame(difficulty)
  useResponsiveState()
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | undefined>({
    row: 0,
    col: 0,
  })
  const [selectedDigit, setSelectedDigit] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>(1)

  const moveSelection = (deltaRow: number, deltaCol: number) => {
    setSelectedCell((prev) => {
      const baseRow = prev?.row ?? 0
      const baseCol = prev?.col ?? 0

      return {
        row: (baseRow + deltaRow + 9) % 9,
        col: (baseCol + deltaCol + 9) % 9,
      }
    })
  }

  const applyValueToSelection = useCallback(
    (value: number) => {
      if (!selectedCell) {
        return
      }

      handleCellChange(
        selectedCell.row,
        selectedCell.col,
        value as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
      )
    },
    [handleCellChange, selectedCell],
  )

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty)
    setSelectedCell(undefined)
  }

  const handleReset = () => {
    resetGame()
    setSelectedCell({ row: 0, col: 0 })
  }

  const keyboardBindings = useMemo(
    () => [
      {
        action: 'move-up',
        keys: ['ArrowUp', 'KeyW'],
        onTrigger: () => moveSelection(-1, 0),
        allowInInputs: true,
      },
      {
        action: 'move-down',
        keys: ['ArrowDown', 'KeyS'],
        onTrigger: () => moveSelection(1, 0),
        allowInInputs: true,
      },
      {
        action: 'move-left',
        keys: ['ArrowLeft', 'KeyA'],
        onTrigger: () => moveSelection(0, -1),
        allowInInputs: true,
      },
      {
        action: 'move-right',
        keys: ['ArrowRight', 'KeyD'],
        onTrigger: () => moveSelection(0, 1),
        allowInInputs: true,
      },
      {
        action: 'confirm-entry',
        keys: ['Enter', 'NumpadEnter', 'Space'],
        onTrigger: () => applyValueToSelection(selectedDigit),
        allowInInputs: true,
      },
      {
        action: 'clear-entry',
        keys: ['Backspace', 'Delete', 'Digit0', 'Numpad0'],
        onTrigger: () => applyValueToSelection(0),
        allowInInputs: true,
      },
      {
        action: 'digit-1',
        keys: ['Digit1', 'Numpad1'],
        onTrigger: () => {
          setSelectedDigit(1)
          applyValueToSelection(1)
        },
        allowInInputs: true,
      },
      {
        action: 'digit-2',
        keys: ['Digit2', 'Numpad2'],
        onTrigger: () => {
          setSelectedDigit(2)
          applyValueToSelection(2)
        },
        allowInInputs: true,
      },
      {
        action: 'digit-3',
        keys: ['Digit3', 'Numpad3'],
        onTrigger: () => {
          setSelectedDigit(3)
          applyValueToSelection(3)
        },
        allowInInputs: true,
      },
      {
        action: 'digit-4',
        keys: ['Digit4', 'Numpad4'],
        onTrigger: () => {
          setSelectedDigit(4)
          applyValueToSelection(4)
        },
        allowInInputs: true,
      },
      {
        action: 'digit-5',
        keys: ['Digit5', 'Numpad5'],
        onTrigger: () => {
          setSelectedDigit(5)
          applyValueToSelection(5)
        },
        allowInInputs: true,
      },
      {
        action: 'digit-6',
        keys: ['Digit6', 'Numpad6'],
        onTrigger: () => {
          setSelectedDigit(6)
          applyValueToSelection(6)
        },
        allowInInputs: true,
      },
      {
        action: 'digit-7',
        keys: ['Digit7', 'Numpad7'],
        onTrigger: () => {
          setSelectedDigit(7)
          applyValueToSelection(7)
        },
        allowInInputs: true,
      },
      {
        action: 'digit-8',
        keys: ['Digit8', 'Numpad8'],
        onTrigger: () => {
          setSelectedDigit(8)
          applyValueToSelection(8)
        },
        allowInInputs: true,
      },
      {
        action: 'digit-9',
        keys: ['Digit9', 'Numpad9'],
        onTrigger: () => {
          setSelectedDigit(9)
          applyValueToSelection(9)
        },
        allowInInputs: true,
      },
    ],
    [applyValueToSelection, selectedDigit],
  )

  useKeyboardControls(keyboardBindings)

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <Card className={styles.gameCard} title="Sudoku">
      <div className={styles.gameContainer}>
        <div className={styles.topSection}>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <label htmlFor="sudoku-time">Time</label>
              <span className={styles.statValue}>{formatTime(elapsedTime)}</span>
              <span id="sudoku-time" hidden>
                {formatTime(elapsedTime)}
              </span>
            </div>
            <div className={styles.stat}>
              <label htmlFor="sudoku-difficulty">Difficulty</label>
              <span className={styles.statValue}>{difficulty.toUpperCase()}</span>
              <span id="sudoku-difficulty" hidden>
                {difficulty.toUpperCase()}
              </span>
            </div>
          </div>
          {isComplete && (
            <div className={styles.completion}>
              <div className={styles.completionMessage}>🎉 Puzzle Complete!</div>
              <span className={styles.completionTime}>{formatTime(elapsedTime)}</span>
            </div>
          )}
        </div>

        <div className={styles.boardSection}>
          <SudokuBoard
            board={gameState.board}
            editableBoard={gameState.solution}
            selectedCell={selectedCell}
            onCellSelect={(row, col) => setSelectedCell({ row, col })}
            onCellChange={handleCellChange}
          />
        </div>

        <div className={styles.bottomSection}>
          <div className={styles.difficultyButtons}>
            <Button
              size="sm"
              variant={difficulty === 'easy' ? 'primary' : 'secondary'}
              onClick={() => handleDifficultyChange('easy')}
            >
              Easy
            </Button>
            <Button
              size="sm"
              variant={difficulty === 'medium' ? 'primary' : 'secondary'}
              onClick={() => handleDifficultyChange('medium')}
            >
              Medium
            </Button>
            <Button
              size="sm"
              variant={difficulty === 'hard' ? 'primary' : 'secondary'}
              onClick={() => handleDifficultyChange('hard')}
            >
              Hard
            </Button>
            <Button
              size="sm"
              variant={difficulty === 'expert' ? 'primary' : 'secondary'}
              onClick={() => handleDifficultyChange('expert')}
            >
              Expert
            </Button>
          </div>

          <div className={styles.numberPanelSection}>
            <span className={styles.panelLabel}>Number Entry</span>
            <div className={styles.numberPanel}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                <Button
                  key={digit}
                  size="sm"
                  variant={selectedDigit === digit ? 'primary' : 'secondary'}
                  onClick={() => {
                    setSelectedDigit(digit as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9)
                    applyValueToSelection(digit)
                  }}
                >
                  {digit}
                </Button>
              ))}
              <Button size="sm" variant="secondary" onClick={() => applyValueToSelection(0)}>
                Clear
              </Button>
            </div>
            <p className={styles.controlsHint}>WASD / Arrows to move, Enter/Space to place.</p>
          </div>

          <Button onClick={handleReset} variant="danger" size="lg">
            New Game
          </Button>
        </div>
      </div>
    </Card>
  )
}
