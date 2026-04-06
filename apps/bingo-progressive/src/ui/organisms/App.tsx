import { useGame } from '@/app'
import React, { useState } from 'react'
import styles from './App.module.css'
import { BingoCard } from './BingoCard'
import { DrawPanel } from './DrawPanel'

export const App: React.FC = () => {
  const [cardCount, setCardCount] = useState(1)
  const { cards, currentNumber, drawNumber, resetGame, winners, drawnCount } = useGame(cardCount)

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <div className={styles.cardsSection}>
          {cards.map((card, idx) => (
            <div key={idx} className={styles.cardWrapper}>
              <BingoCard card={card} />
            </div>
          ))}
        </div>

        <div className={styles.controlsSection}>
          <DrawPanel
            currentNumber={currentNumber}
            onDraw={drawNumber}
            onReset={resetGame}
            cardCount={cardCount}
            onCardCountChange={setCardCount}
            winners={winners}
            drawnCount={drawnCount}
          />
        </div>
      </div>
    </div>
  )
}
