import type { Card as CardType, Suit } from '@/domain'
import React from 'react'
import styles from './Card.module.css'

export interface CardProps {
  /**
   * Card to display. If undefined, shows card back (hidden).
   */
  card?: CardType
  /**
   * Is this card hidden (show back)?
   */
  hidden?: boolean
  /**
   * Custom size variant: 'sm' (small), 'md' (medium, default), 'lg' (large)
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Custom class override
   */
  className?: string
  /**
   * Optional click handler for interactive cards.
   */
  onClick?: () => void
  /**
   * Is card selectable/interactive?
   */
  selectable?: boolean
  /**
   * Is card currently selected?
   */
  selected?: boolean
  /**
   * Is card disabled/unclickable?
   */
  disabled?: boolean
  /**
   * Animation state for dealing effects
   */
  animationState?: 'dealing' | 'dealt' | 'flipping' | 'flipped'
  /**
   * Dealing delay for staggered animations (ms)
   */
  dealDelay?: number
}

/**
 * Card Atom — Renders a single playing card using SVG assets.
 *
 * Displays high-quality card graphics from public/cards/ directory.
 * Shows card front (rank + suit as SVG) or card back if hidden.
 * Supports multiple sizes, interactive states, and accessibility.
 *
 * SVG filenames follow pattern: {Rank}{Suit}.svg
 * - Ranks: A, 2-9, T (ten), J, Q, K
 * - Suits: C (clubs), D (diamonds), H (hearts), S (spades)
 * - Hidden: 1B.svg (card back)
 *
 * @example
 * // Face-up Ace of Spades
 * <Card card={{ suit: 'spades', rank: 'ace', id: '1' }} />
 *
 * @example
 * // Face-down/hidden card
 * <Card hidden={true} />
 *
 * @example
 * // Selectable card with click handler
 * <Card
 *   card={{ suit: 'hearts', rank: 'king', id: '42' }}
 *   selectable={true}
 *   selected={true}
 *   onClick={handleCardClick}
 * />
 */
export const Card = React.memo<CardProps>(
  ({
    card,
    hidden = false,
    size = 'md',
    className,
    onClick,
    selectable = false,
    selected = false,
    disabled = false,
    animationState,
    dealDelay = 0,
  }) => {
    const isHidden = hidden || !card

    // Map rank to SVG filename character
    const getRankChar = (rank: string | undefined): string => {
      const rankMap: Record<string, string> = {
        ace: 'A',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '8': '8',
        '9': '9',
        '10': 'T',
        jack: 'J',
        queen: 'Q',
        king: 'K',
      }
      return rankMap[rank || '?'] || '?'
    }

    // Map suit to SVG filename character
    const getSuitChar = (suit: string | undefined): string => {
      const suitMap: Record<string, string> = {
        hearts: 'H',
        diamonds: 'D',
        clubs: 'C',
        spades: 'S',
      }
      return suitMap[suit || '?'] || '?'
    }

    // Build SVG filename
    const getSvgFilename = (): string => {
      if (isHidden) {
        return '/cards/1B.svg' // Card back design
      }
      const rankChar = getRankChar(card!.rank)
      const suitChar = getSuitChar(card!.suit as string)
      return `/cards/${rankChar}${suitChar}.svg`
    }

    // Build accessibility label
    const getAriaLabel = (): string => {
      if (isHidden) {
        return 'Card back (hidden)'
      }

      const rankNames: Record<string, string> = {
        ace: 'Ace',
        '2': 'Two',
        '3': 'Three',
        '4': 'Four',
        '5': 'Five',
        '6': 'Six',
        '7': 'Seven',
        '8': 'Eight',
        '9': 'Nine',
        '10': 'Ten',
        jack: 'Jack',
        queen: 'Queen',
        king: 'King',
      }

      const suitNames: Record<string, string> = {
        hearts: 'Hearts',
        diamonds: 'Diamonds',
        clubs: 'Clubs',
        spades: 'Spades',
      }

      return `${rankNames[card!.rank]} of ${suitNames[card!.suit as Suit]}`
    }

    // Build class name
    const classNames = [
      styles.card,
      styles[size],
      isHidden && styles.hidden,
      selectable && styles.selectable,
      selected && styles.selected,
      disabled && styles.disabled,
      animationState && styles[animationState],
      className,
    ]
      .filter(Boolean)
      .join(' ')

    // Handle keyboard activation for interactive cards
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if ((e.key === ' ' || e.key === 'Enter') && onClick && !disabled) {
        e.preventDefault()
        onClick()
      }
    }

    // Interactive attributes
    const interactiveProps = selectable
      ? {
          role: 'button' as const,
          tabIndex: disabled ? -1 : 0,
          'aria-pressed': selected,
          'aria-disabled': disabled,
          'aria-label': getAriaLabel(),
          onClick: !disabled ? onClick : undefined,
          onKeyDown: handleKeyDown,
        }
      : {
          'aria-label': getAriaLabel(),
        }

    return (
      <div
        className={classNames}
        {...interactiveProps}
        style={dealDelay > 0 ? { animationDelay: `${dealDelay}ms` } : undefined}
      >
        <img
          src={getSvgFilename()}
          alt={getAriaLabel()}
          className={styles.cardImage}
          draggable={false}
        />
      </div>
    )
  },
)

Card.displayName = 'Card'
