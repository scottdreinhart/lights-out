import { useBankroll } from '@/app/hooks'
import type { TableVariant } from '@games/banking'
import React, { useState } from 'react'
import { TableSelection } from '../TableSelection'
import styles from './GameLayout.module.css'

/**
 * GameLayout — Orchestrates the multi-screen blackjack experience.
 *
 * Screen Flow:
 * 1. TableSelection screen → Player picks table variant (Casual/Mid/High Roller)
 * 2. GameBoard screen → Player plays blackjack with dynamic betting limits per table
 * 3. Results screen → Session statistics and option to play another hand or switch tables
 *
 * This component manages the state machine and routing between screens.
 */
export interface GameLayoutProps {
  playerId: string
  GameBoardComponent: React.ComponentType<GameBoardProps>
  ResultsComponent?: React.ComponentType<ResultsProps>
}

export interface GameBoardProps {
  tableVariant: TableVariant
  minBet: number
  maxBet: number
  chipSet: readonly number[]
  balance: number
  onHandComplete: (result: {
    betAmount: number
    result: 'win' | 'loss' | 'push' | 'cancelled'
    payout: number
  }) => void
  onChangeTable: () => void
}

export interface ResultsProps {
  sessionStats: Record<string, any>
  onPlayAgain: () => void
  onChangeTable: () => void
  balance: number
}

type GameScreen = 'table-selection' | 'playing' | 'results'

export const GameLayout = React.memo<GameLayoutProps>(
  ({ playerId, GameBoardComponent, ResultsComponent }) => {
    const gameId = 'blackjack'
    const [screen, setScreen] = useState<GameScreen>('table-selection')

    // Initialize bankroll system
    const {
      bankroll,
      isLoadingBankroll,
      selectedTableVariant,
      tableConfig,
      selectedChipSet,
      handleSelectTable,
      gameSession,
      recordBet,
      recordGameResult,
      endCurrentSession,
      cancelSession,
      currentBalance,
      isTableSelected,
    } = useBankroll(playerId, gameId)

    // Handle table selection
    const handleSelectTableWithNavigation = (variant: TableVariant, chipSet: readonly number[]) => {
      handleSelectTable(variant, chipSet as number[])
      setScreen('playing')
    }

    // Handle hand completion
    const handleHandComplete = (result: {
      betAmount: number
      result: 'win' | 'loss' | 'push' | 'cancelled'
      payout: number
    }) => {
      // Update bankroll and session
      recordGameResult(result)

      // Show temporary results screen (optional)
      // For now, just stay in playing screen for next hand
      // setScreen('results')
    }

    // Handle change table (go back to table selection)
    const handleChangeTable = () => {
      cancelSession()
      setScreen('table-selection')
    }

    // Handle end session and show final results
    const handleShowResults = () => {
      const result = endCurrentSession()
      if (result) {
        // Could show detailed results screen here
        console.log('Session ended:', result.stats)
      }
      setScreen('table-selection')
    }

    // Show loading state while bankroll is loading
    if (isLoadingBankroll) {
      return (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}>⏳</div>
          <p>Loading your bankroll...</p>
        </div>
      )
    }

    // Show error if no bankroll
    if (!bankroll) {
      return (
        <div className={styles.errorContainer}>
          <p>⚠️ Error loading bankroll. Please refresh the page.</p>
        </div>
      )
    }

    return (
      <div className={styles.root}>
        {/* Table Selection Screen */}
        {screen === 'table-selection' && (
          <div className={styles.screenContainer}>
            <TableSelection
              balance={currentBalance}
              onSelectTable={handleSelectTableWithNavigation}
            />
          </div>
        )}

        {/* Game Playing Screen */}
        {screen === 'playing' && selectedTableVariant && tableConfig && (
          <div className={styles.screenContainer}>
            <div className={styles.gameHeader}>
              <h2 className={styles.tableTitle}>
                {selectedTableVariant === 'casual'
                  ? '🎲 Casual Table'
                  : selectedTableVariant === 'mid'
                    ? '💎 Mid-Stakes Table'
                    : '👑 High Roller Table'}
              </h2>
              <div className={styles.balanceDisplay}>
                <span className={styles.label}>Balance:</span>
                <span className={styles.amount}>${currentBalance}</span>
              </div>
              <button
                className={styles.changeTableButton}
                onClick={handleChangeTable}
                title="Return to table selection"
              >
                Change Table
              </button>
            </div>

            <GameBoardComponent
              tableVariant={selectedTableVariant}
              minBet={tableConfig.limits.minBet}
              maxBet={tableConfig.limits.maxBet}
              chipSet={selectedChipSet}
              balance={currentBalance}
              onHandComplete={handleHandComplete}
              onChangeTable={handleChangeTable}
            />

            <button
              className={styles.endSessionButton}
              onClick={handleShowResults}
              title="End session and see final statistics"
            >
              End Session
            </button>
          </div>
        )}

        {/* Show placeholder if no table selected but not in table-selection screen */}
        {!isTableSelected && screen === 'playing' && (
          <div className={styles.placeholder}>
            <p>No table selected. Please select a table to begin.</p>
          </div>
        )}
      </div>
    )
  },
)

GameLayout.displayName = 'GameLayout'

/**
 * Integration Example
 *
 * In your main App.tsx:
 *
 * ```tsx
 * import { GameLayout } from '@/ui/organisms'
 * import { GameBoard } from '@/ui/organisms'  // your existing game board
 *
 * export const App = () => {
 *   const playerId = 'user-123'  // from auth system
 *
 *   return (
 *     <GameLayout
 *       playerId={playerId}
 *       GameBoardComponent={GameBoard}
 *     />
 *   )
 * }
 * ```
 *
 * This handles:
 * - Loading bankroll from storage
 * - Managing table selection
 * - Routing between screens
 * - Recording bets and results
 * - Persisting session state
 * - Displaying balance and limits
 *
 * The GameBoard component receives:
 * - tableVariant: Current selected table
 * - minBet/maxBet: Betting limits for the table
 * - chipSet: Available chip denominations
 * - balance: Player's current balance
 * - onHandComplete: Callback when hand resolves with result
 * - onChangeTable: Callback to return to table selection
 */
