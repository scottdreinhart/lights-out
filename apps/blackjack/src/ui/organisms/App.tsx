import { useCallback, useState } from 'react'
import styles from './App.module.css'
import { GameBoardAdapter } from './GameBoardAdapter'
import { GameLayout } from './GameLayout'
import { SplashScreen } from './SplashScreen'

type AppPhase = 'splash' | 'game' | 'help'

/**
 * App Component - Main Blackjack Application
 *
 * Manages high-level app phases:
 * 1. splash - Welcome screen
 * 2. game - GameLayout (table selection and gameplay)
 * 3. help - Rules/how to play
 *
 * GameLayout handles:
 * - Table selection (Casual, Mid, High Roller)
 * - Banking and session management
 * - Game screens (table selection → playing → results)
 */
export function App() {
  const [appPhase, setAppPhase] = useState<AppPhase>('splash')
  const playerId = 'player-' + Math.random().toString(36).substring(2, 9)

  // ─────────────────────────────────────────────────────────
  // Phase Handlers
  // ─────────────────────────────────────────────────────────

  const handleSplashComplete = useCallback(() => {
    setAppPhase('game')
  }, [])

  const handleHowToPlay = useCallback(() => {
    setAppPhase('help')
  }, [])

  const handleLetsPlay = useCallback(() => {
    setAppPhase('game')
  }, [])

  // ─────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────

  // Splash screen with welcome and rules
  if (appPhase === 'splash') {
    return <SplashScreen onPlayClick={handleSplashComplete} onHowToPlayClick={handleHowToPlay} />
  }

  // Help/rules screen
  if (appPhase === 'help') {
    return (
      <div className={styles.helpScreen}>
        <div className={styles.helpContent}>
          <h1>How to Play Blackjack</h1>

          <section className={styles.rule}>
            <h2>Objective</h2>
            <p>Get your hand value as close to 21 as possible without going over (busting).</p>
          </section>

          <section className={styles.rule}>
            <h2>Card Values</h2>
            <ul>
              <li>Number cards (2-10): Face value</li>
              <li>Face cards (J, Q, K): 10 points</li>
              <li>Ace (A): 1 or 11 points (whichever is better)</li>
            </ul>
          </section>

          <section className={styles.rule}>
            <h2>Game Flow</h2>
            <ol>
              <li>Select your table (Casual, Mid-Stakes, or High Roller)</li>
              <li>Place your bet using casino chips</li>
              <li>You and dealer each get 2 cards</li>
              <li>You decide to Hit, Stand, Double Down, Split, or Surrender</li>
              <li>Dealer plays automatically (hits until 17 or higher)</li>
              <li>Highest hand under 21 wins!</li>
            </ol>
          </section>

          <section className={styles.rule}>
            <h2>Special Hands</h2>
            <ul>
              <li>
                <strong>Blackjack</strong> (21 with 2 cards): Wins 1.5× your bet
              </li>
              <li>
                <strong>Bust</strong> (over 21): You lose immediately
              </li>
              <li>
                <strong>Push</strong> (same as dealer): Bet is returned
              </li>
            </ul>
          </section>

          <section className={styles.rule}>
            <h2>Casino Tables</h2>
            <ul>
              <li>
                <strong>Casual Table</strong> ($5-$1000): Perfect for learning
              </li>
              <li>
                <strong>Mid-Stakes Table</strong> ($25-$5000): Intermediate play
              </li>
              <li>
                <strong>High Roller Table</strong> ($100-$50000): Advanced players
              </li>
            </ul>
          </section>

          <button className={styles.backButton} onClick={handleLetsPlay}>
            Back to Game
          </button>
        </div>
      </div>
    )
  }

  // Game layout with table selection and bankroll management
  return <GameLayout playerId={playerId} GameBoardComponent={GameBoardAdapter} />
}
