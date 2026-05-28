import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from '@/ui/atoms';
import React from 'react';
import styles from './Hand.module.css';
/**
 * Hand — Displays a hand of cards with value and status.
 *
 * Supports hiding first card (dealer), hiding all, and visual status indicators.
 * Used for both player hands and dealer hand.
 */
export const Hand = React.memo(({ hand, hideFirst = false, hideAll = false, value, label, status, className, isDealing = false, shouldFlipDealerCard = false, }) => {
    // Handle both Hand object (with .cards property) and Card[] array
    const cards = Array.isArray(hand) ? hand : (hand?.cards ?? []);
    return (_jsxs("div", { className: `${styles.root} ${className || ''}`, children: [label && _jsx("div", { className: styles.label, children: label }), _jsx("div", { className: styles.cards, children: cards.length === 0 ? (_jsx("div", { className: styles.placeholder, children: "No cards" })) : (cards.map((card, index) => {
                    // Determine animation state for this card
                    let animationState;
                    let dealDelay = 0;
                    if (isDealing) {
                        // Stagger dealing animation by 200ms per card
                        dealDelay = index * 200;
                        animationState = 'dealing';
                    }
                    else if (shouldFlipDealerCard && index === 0) {
                        // Dealer's first card flip animation
                        animationState = 'flipping';
                    }
                    return (_jsx("div", { className: styles.cardWrapper, children: _jsx(Card, { card: card, hidden: hideAll || (hideFirst && index === 0), size: "md", animationState: animationState, dealDelay: dealDelay }) }, card.id || index));
                })) }), _jsxs("div", { className: styles.footer, children: [value !== undefined && (_jsx("div", { className: `${styles.value} ${styles[status ?? 'initial']}`, children: value })), !Array.isArray(hand) && hand?.bet !== undefined && (_jsxs("div", { className: styles.bet, children: ["Bet: $", hand.bet] }))] })] }));
});
Hand.displayName = 'Hand';
