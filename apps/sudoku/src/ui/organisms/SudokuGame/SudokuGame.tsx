import { useGame, useResponsiveState, useSudokuInput } from '@/app'
import type { Difficulty } from '@/domain'
import { Button, Card } from '@/ui/atoms'
import { HamburgerMenu, NumberPad, SudokuBoard } from '@/ui/molecules'
import { ActionBar, StatPill, StatsBar } from '@games/assets-shared'
import React, { useCallback, useState } from 'react'
import { HelpModal, RulesModal, SettingsModal } from '../modals'
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
  const [showRulesModal, setShowRulesModal] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

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

  // Unified keyboard input handler (grid navigation + digit entry)
  useSudokuInput({
    selectedCell,
    selectedDigit,
    onCellSelect: setSelectedCell,
    onDigitSelect: setSelectedDigit,
    onApplyDigit: applyValueToSelection,
  })

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <>
      <Card className={styles.gameCard} title="Sudoku">
        <div className={styles.header}>
          <h2 className={styles.title}>Sudoku</h2>
          <HamburgerMenu
            onRules={() => setShowRulesModal(true)}
            onHelp={() => setShowHelpModal(true)}
            onSettings={() => setShowSettingsModal(true)}
            onToggleSound={() => {}}
            onExit={() => window.location.reload()}
            soundEnabled={true}
          />
        </div>
        <div className={styles.gameContainer}>
          <div className={styles.topSection}>
            <StatsBar className={styles.stats}>
              <StatPill label="Time" value={formatTime(elapsedTime)} />
              <StatPill label="Difficulty" value={difficulty.toUpperCase()} />
            </StatsBar>
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
            <ActionBar className={styles.difficultyButtons}>
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
            </ActionBar>

            <div className={styles.numberPanelSection}>
              <span className={styles.panelLabel}>Number Entry</span>
              <NumberPad
                digits={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
                selectedDigit={selectedDigit}
                onDigitSelect={(digit) => {
                  setSelectedDigit(digit as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9)
                  applyValueToSelection(digit)
                }}
                onClear={() => applyValueToSelection(0)}
                onUndo={undefined}
                onHint={undefined}
                canUndo={false}
                canHint={false}
              />
              <p className={styles.controlsHint}>WASD / Arrows to move, Enter/Space to place.</p>
            </div>

            <Button onClick={handleReset} variant="danger" size="lg">
              New Game
            </Button>
          </div>
        </div>

        {/* Modal Adapters */}
        <RulesModal isOpen={showRulesModal} onClose={() => setShowRulesModal(false)} />
        <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
        <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
      </Card>
    </>
  )
}
