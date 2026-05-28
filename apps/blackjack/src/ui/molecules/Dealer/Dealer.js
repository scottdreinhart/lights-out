import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from '@/ui/atoms';
import React from 'react';
import styles from './Dealer.module.css';
/**
 * Dealer Molecule — Displays dealer's cards
 *
 * Shows upcard always visible, hole card with hidden/revealed state.
 * Composes two Card atoms with state visibility control.
 */
export const Dealer = React.memo(({ upcard, holeCard, revealed = false, size = 'md', ariaLabel = 'Dealer hand', className = '', }) => {
    return (_jsxs("div", { className: `${styles.root} ${className}`, role: "group", "aria-label": ariaLabel, children: [_jsx("div", { className: styles.cardSlot, children: _jsx(Card, { card: upcard, size: size, "aria-label": `Dealer upcard: ${upcard.rank} of ${upcard.suit}` }) }), holeCard && (_jsx("div", { className: styles.cardSlot, children: _jsx(Card, { card: holeCard, size: size, hidden: !revealed, "aria-label": revealed
                        ? `Dealer hole card: ${holeCard.rank} of ${holeCard.suit}`
                        : 'Dealer hole card (hidden)' }) }))] }));
});
Dealer.displayName = 'Dealer';
