import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import styles from './Card.module.css';
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
export const Card = React.memo(({ card, hidden = false, size = 'md', className, onClick, selectable = false, selected = false, disabled = false, animationState, dealDelay = 0, }) => {
    const isHidden = hidden || !card;
    // Map rank to SVG filename character
    const getRankChar = (rank) => {
        const rankMap = {
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
        };
        return rankMap[rank || '?'] || '?';
    };
    // Map suit to SVG filename character
    const getSuitChar = (suit) => {
        const suitMap = {
            hearts: 'H',
            diamonds: 'D',
            clubs: 'C',
            spades: 'S',
        };
        return suitMap[suit || '?'] || '?';
    };
    // Build SVG filename
    const getSvgFilename = () => {
        if (isHidden) {
            return '/cards/1B.svg'; // Card back design
        }
        const rankChar = getRankChar(card.rank);
        const suitChar = getSuitChar(card.suit);
        return `/cards/${rankChar}${suitChar}.svg`;
    };
    // Build accessibility label
    const getAriaLabel = () => {
        if (isHidden) {
            return 'Card back (hidden)';
        }
        const rankNames = {
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
        };
        const suitNames = {
            hearts: 'Hearts',
            diamonds: 'Diamonds',
            clubs: 'Clubs',
            spades: 'Spades',
        };
        return `${rankNames[card.rank]} of ${suitNames[card.suit]}`;
    };
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
        .join(' ');
    // Handle keyboard activation for interactive cards
    const handleKeyDown = (e) => {
        if ((e.key === ' ' || e.key === 'Enter') && onClick && !disabled) {
            e.preventDefault();
            onClick();
        }
    };
    // Interactive attributes
    const interactiveProps = selectable
        ? {
            role: 'button',
            tabIndex: disabled ? -1 : 0,
            'aria-pressed': selected,
            'aria-disabled': disabled,
            'aria-label': getAriaLabel(),
            onClick: !disabled ? onClick : undefined,
            onKeyDown: handleKeyDown,
        }
        : {
            'aria-label': getAriaLabel(),
        };
    return (_jsx("div", { className: classNames, ...interactiveProps, style: dealDelay > 0 ? { animationDelay: `${dealDelay}ms` } : undefined, children: _jsx("img", { src: getSvgFilename(), alt: getAriaLabel(), className: styles.cardImage, draggable: false }) }));
});
Card.displayName = 'Card';
