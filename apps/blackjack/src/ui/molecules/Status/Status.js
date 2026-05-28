import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import styles from './Status.module.css';
/**
 * Status Molecule — Game state and phase indicator
 *
 * Displays current phase, player status, and result messages.
 */
export const Status = React.memo(({ phase, playerStatus, dealerStatus, result, className = '' }) => {
    const getStatusMessage = () => {
        if (result === 'blackjack') {
            return '🎉 Blackjack! You win!';
        }
        if (result === 'bust') {
            return '💥 Bust! You lose.';
        }
        if (result === 'win') {
            return '✓ You win!';
        }
        if (result === 'loss') {
            return '✗ Dealer wins.';
        }
        if (result === 'push') {
            return '= Push!';
        }
        if (phase === 'dealing') {
            return 'Dealing...';
        }
        if (phase === 'playing') {
            return 'Your turn';
        }
        if (phase === 'settling') {
            return 'Dealer playing...';
        }
        if (phase === 'completed') {
            return 'Round complete';
        }
        return '';
    };
    const getMessageClass = () => {
        if (result === 'blackjack' || result === 'win') {
            return styles.win;
        }
        if (result === 'bust' || result === 'loss') {
            return styles.loss;
        }
        if (result === 'push') {
            return styles.push;
        }
        return styles.neutral;
    };
    return (_jsxs("div", { className: `${styles.root} ${className}`, role: "status", "aria-live": "polite", children: [_jsx("div", { className: `${styles.message} ${getMessageClass()}`, children: getStatusMessage() }), playerStatus && (_jsxs("div", { className: styles.detail, children: [_jsx("span", { className: styles.label, children: "Status:" }), _jsx("span", { className: styles.value, children: playerStatus })] }))] }));
});
Status.displayName = 'Status';
