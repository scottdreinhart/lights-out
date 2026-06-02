import type { Hand as HandType } from '@/domain'
import { Card } from '@/ui/atoms'
import React from 'react'
import styles from './Hand.module.css'

export interface HandProps {
  /**
   * Hand data from domain (can be Hand object with .cards, or Card[] array)
   */
  hand?: HandType | HandType['cards']
  /**
   * Whether to hide cards (e.g., dealer's first card)
   */
  hideFirst?: boolean
  /**
   * Whether to hide all cards (hand back showing)
   */
  hideAll?: boolean
  /**
   * Hand value to display (e.g., "17" or "Bust")
   */
  value?: string | number
  /**
   * Label for this hand (e.g., "Dealer" or "Split 1")
   */
  label?: string
  /**
   * Hand status to show visual indicator
   */
  status?: 'initial' | 'playing' | 'stand' | 'bust' | 'blackjack' | 'settled'
  /**
   * Custom class override
   */
  className?: string
  /**
   * Whether cards are currently being dealt (triggers dealing animation)
   */
  isDealing?: boolean
  /**
   * Whether to show flip animation for dealer's hidden card
   */
  shouldFlipDealerCard?: boolean
}

/**
 * Hand — Displays a hand of cards with value and status.
 *
 * Supports hiding first card (dealer), hiding all, and visual status indicators.
 * Used for both player hands and dealer hand.
 */
export const Hand = React.memo<HandProps>(
  ({
    hand,
    hideFirst = false,
    hideAll = false,
    value,
    label,
    status,
    className,
    isDealing = false,
    shouldFlipDealerCard = false,
  }) => {
    // Handle both Hand object (with .cards property) and Card[] array
    const cards = Array.isArray(hand) ? hand : (hand?.cards ?? [])

    return (
      <div className={`${styles.root} ${className || ''}`}>
        {label && <div className={styles.label}>{label}</div>}

        <div className={styles.cards}>
          {cards.length === 0 ? (
            <div className={styles.placeholder}>No cards</div>
          ) : (
            cards.map((card, index) => {
              // Determine animation state for this card
              let animationState: 'dealing' | 'dealt' | 'flipping' | 'flipped' | undefined
              let dealDelay = 0

              if (isDealing) {
                // Stagger dealing animation by 200ms per card
                dealDelay = index * 200
                animationState = 'dealing'
              } else if (shouldFlipDealerCard && index === 0) {
                // Dealer's first card flip animation
                animationState = 'flipping'
              }

              return (
                <div key={card.id || index} className={styles.cardWrapper}>
                  <Card
                    card={card}
                    hidden={hideAll || (hideFirst && index === 0)}
                    size="md"
                    animationState={animationState}
                    dealDelay={dealDelay}
                  />
                </div>
              )
            })
          )}
        </div>

        <div className={styles.footer}>
          {value !== undefined && (
            <div className={`${styles.value} ${styles[status ?? 'initial']}`}>{value}</div>
          )}
          {!Array.isArray(hand) && hand?.bet !== undefined && (
            <div className={styles.bet}>Bet: ${hand.bet}</div>
          )}
        </div>
      </div>
    )
  },
)

Hand.displayName = 'Hand'
