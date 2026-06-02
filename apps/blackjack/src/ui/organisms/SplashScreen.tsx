import styles from './SplashScreen.module.css'

export interface SplashScreenProps {
  onPlayClick: () => void
  onHowToPlayClick: () => void
}

/**
 * SplashScreen Organism
 *
 * Welcome screen displayed on app load.
 * Shows game title, quick rules, and action buttons.
 */
export function SplashScreen({ onPlayClick, onHowToPlayClick }: SplashScreenProps) {
  return (
    <div className={styles.splash}>
      <div className={styles.container}>
        {/* Logo/Title */}
        <div className={styles.logoSection}>
          <div className={styles.logo}>♠️ ♥️</div>
          <h1 className={styles.title}>Blackjack</h1>
          <p className={styles.tagline}>Beat the Dealer</p>
        </div>

        {/* Quick Rules */}
        <div className={styles.rulesSection}>
          <h2>Quick Rules</h2>
          <ul className={styles.rulesList}>
            <li>Get closer to 21 than the dealer</li>
            <li>Face cards are worth 10</li>
            <li>Ace counts as 1 or 11</li>
            <li>Dealer hits on 16, stands on 17+</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button className={styles.playButton} onClick={onPlayClick}>
            Let&apos;s Play
          </button>
          <button className={styles.helpButton} onClick={onHowToPlayClick}>
            How to Play
          </button>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <p>Good luck! 🍀</p>
        </div>
      </div>
    </div>
  )
}
