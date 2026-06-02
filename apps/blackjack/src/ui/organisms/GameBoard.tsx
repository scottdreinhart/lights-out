import type { GameAction, GamePhase, GameState, Hand } from '@/domain'
import { getHandValues } from '@/domain'
import { Hand as HandComponent } from '@/ui/molecules'
import { ActionPanel } from '@/ui/molecules/ActionPanel/ActionPanel'
import { BetControl } from '@/ui/molecules/BetControl/BetControl'
import { Status } from '@/ui/molecules/Status/Status'
import styles from './GameBoard.module.css'

export interface GameBoardProps {
  gameState: GameState
  phase: GamePhase
  currentHand: Hand | null
  currentPlayer: any
  availableActions: GameAction[]
  onBet: (amount: number) => void
  onAction: (action: GameAction) => void
  onNewRound: () => void
  onHelp: () => void
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
}

/**
 * GameBoard Organism
 *
 * Main game display component.
 * Renders the game table with dealer, player, betting, actions, and status.
 */
export function GameBoard({
  gameState,
  phase,
  currentHand,
  currentPlayer,
  availableActions,
  onBet,
  onAction,
  onNewRound,
  onHelp,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: GameBoardProps) {
  const playerBalance = currentPlayer?.balance ?? 1000

  return (
    <div className={styles.board}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Blackjack</h1>
        <div className={styles.info}>
          <div className={styles.balance}>Balance: ${playerBalance}</div>
          <button className={styles.helpButton} onClick={onHelp}>
            ? Help
          </button>
        </div>
      </div>

      {/* Game content */}
      <div className={styles.content}>
        {/* Betting phase */}
        {phase === 'betting' && (
          <div className={styles.bettingPhase}>
            <h2>Place Your Bet</h2>
            <BetControl
              currentBet={currentHand?.bet ?? 10}
              minBet={10}
              maxBet={Math.min(100, playerBalance)}
              balance={playerBalance}
              onBet={onBet}
              disabled={false}
            />
          </div>
        )}

        {/* Playing phase - show game table when betting, dealing, playing, or settling */}
        {(phase === 'betting' ||
          phase === 'dealing' ||
          phase === 'playing' ||
          phase === 'settling' ||
          phase === 'completed') && (
          <div className={`${styles.gameTable} ${styles[phase] || ''}`}>
            {/* Dealer section */}
            <div className={styles.dealerSection}>
              <h3>Dealer</h3>
              <HandComponent
                hand={gameState.dealer.hand}
                hideFirst={phase === 'playing'}
                label="Dealer"
                status={gameState.dealer.status}
                isDealing={phase === 'dealing'}
                shouldFlipDealerCard={phase === 'settling' && gameState.dealer.hand.length > 1}
                value={
                  phase !== 'playing'
                    ? `Total: ${getHandValues(gameState.dealer.hand).soft || getHandValues(gameState.dealer.hand).hard}`
                    : undefined
                }
              />
            </div>

            {/* Player section */}
            <div className={styles.playerSection}>
              <h3>Your Hand</h3>
              {currentHand ? (
                <>
                  <HandComponent
                    hand={currentHand}
                    label="Your Hand"
                    status={currentHand.status}
                    value={`Total: ${getHandValues(currentHand.cards).soft || getHandValues(currentHand.cards).hard}`}
                    isDealing={phase === 'dealing'}
                  />

                  {/* Action panel */}
                  {phase === 'playing' && (
                    <ActionPanel
                      availableActions={availableActions}
                      onAction={onAction}
                      disabled={false}
                      layout="row"
                      className={`${styles.actionPanel} ${styles.actionPanelVisible}`}
                      canUndo={canUndo}
                      canRedo={canRedo}
                      onUndo={onUndo}
                      onRedo={onRedo}
                    />
                  )}

                  {/* Status messages */}
                  <Status
                    phase={phase}
                    playerStatus={currentHand.status}
                    dealerStatus={gameState.dealer.status}
                    result={currentPlayer?.result}
                    className={`${styles.status} ${styles.statusPulse}`}
                  />

                  {/* New round button */}
                  {phase === 'completed' && (
                    <button
                      className={`${styles.newRoundButton} ${styles.newRoundButtonBounce}`}
                      onClick={onNewRound}
                    >
                      New Round
                    </button>
                  )}
                </>
              ) : (
                <div className={styles.emptyHand}>Waiting for bet...</div>
              )}
            </div>
          </div>
        )}

        {/* Card tracking section */}
        {(phase === 'betting' ||
          phase === 'dealing' ||
          phase === 'playing' ||
          phase === 'settling' ||
          phase === 'completed') && (
          <div className={styles.cardTracking}>
            <div className={styles.shoeInfo}>
              <h4>Shoe</h4>
              <div className={styles.deckStats}>
                <div className={styles.stat}>
                  <span className={styles.label}>Cards:</span>
                  <span className={styles.value}>{gameState.deck.length}</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.label}>Decks:</span>
                  <span className={styles.value}>{(gameState.deck.length / 52).toFixed(1)}</span>
                </div>
              </div>
            </div>

            <div className={styles.discardInfo}>
              <h4>Discard Pile</h4>
              <div className={styles.discardStats}>
                <div className={styles.stat}>
                  <span className={styles.label}>Cards:</span>
                  <span className={styles.value}>{gameState.discardPile.length}</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.label}>Burned:</span>
                  <span className={styles.value}>
                    {(
                      (gameState.discardPile.length /
                        (gameState.discardPile.length + gameState.deck.length)) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
