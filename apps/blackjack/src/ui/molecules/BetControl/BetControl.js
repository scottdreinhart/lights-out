import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CHIP_DENOMINATIONS } from '@/domain/constants';
import React, { useCallback, useMemo, useState } from 'react';
import styles from './BetControl.module.css';
/**
 * BetControl — Chip-based UI for placing bets.
 *
 * Shows current bet using casino chip denominations.
 * Default denominations: 1, 5, 10, 25, 50, 100, 500, 1000.
 * For multi-table support, accepts optional `chipSet` prop (e.g., Casual, Mid, High Roller).
 *
 * Players click chip buttons to add to their bet. Click again with less chips to reduce.
 * Phase 1: Click-based chip selection (COMPLETE).
 * Phase 2 (future): Drag-and-drop chip interface.
 */
export const BetControl = React.memo(({ currentBet, minBet, maxBet, balance, onBet, disabled = false, chipSet }) => {
    const [tempBet, setTempBet] = useState(currentBet);
    // Use provided chipSet or fall back to defaults
    const _chipSet = useMemo(() => chipSet || CHIP_DENOMINATIONS, [chipSet]);
    /**
     * Add a chip denomination to current bet
     */
    const addChip = useCallback((denomination) => {
        const newBet = tempBet + denomination;
        if (newBet <= maxBet && newBet <= balance) {
            setTempBet(newBet);
        }
    }, [tempBet, maxBet, balance]);
    /**
     * Remove a chip denomination from current bet
     */
    const _removeChip = useCallback((denomination) => {
        const newBet = Math.max(0, tempBet - denomination);
        setTempBet(newBet);
    }, [tempBet]);
    /**
     * Clear all chips (reset bet to 0)
     */
    const clearBet = useCallback(() => {
        setTempBet(0);
    }, []);
    /**
     * Place the current bet
     */
    const handlePlaceBet = useCallback(() => {
        if (tempBet >= minBet && tempBet <= maxBet && tempBet <= balance) {
            onBet(tempBet);
        }
    }, [tempBet, minBet, maxBet, balance, onBet]);
    /**
     * Quick double bet (multiply current tempBet by 2, respecting max)
     */
    const quickDouble = useCallback(() => {
        const newBet = Math.min(tempBet * 2, maxBet, balance);
        if (newBet >= minBet) {
            setTempBet(newBet);
        }
    }, [tempBet, maxBet, balance, minBet]);
    /**
     * Quick repeat last bet (if currentBet exists, set temp to it)
     */
    const quickRepeat = useCallback(() => {
        if (currentBet >= minBet) {
            setTempBet(currentBet);
        }
    }, [currentBet, minBet]);
    const isValidBet = tempBet >= minBet && tempBet <= maxBet && tempBet <= balance;
    const insufficientBalance = tempBet > balance;
    const belowMinimum = tempBet > 0 && tempBet < minBet;
    const exceedsMaximum = tempBet > maxBet;
    return (_jsxs("div", { className: styles.root, children: [_jsxs("div", { className: styles.header, children: [_jsxs("div", { className: styles.infoRow, children: [_jsx("span", { className: styles.label, children: "Balance:" }), _jsxs("span", { className: styles.value, children: ["$", balance] })] }), _jsxs("div", { className: styles.infoRow, children: [_jsx("span", { className: styles.label, children: "Min/Max:" }), _jsxs("span", { className: styles.value, children: ["$", minBet, " \u2014 $", maxBet] })] })] }), _jsxs("div", { className: styles.betDisplay, children: [_jsx("span", { className: styles.label, children: "Current Bet" }), _jsxs("div", { className: styles.betAmount, children: ["$", tempBet] }), insufficientBalance && _jsx("div", { className: styles.error, children: "Exceeds balance" }), belowMinimum && _jsx("div", { className: styles.error, children: "Below minimum bet" }), exceedsMaximum && _jsx("div", { className: styles.error, children: "Exceeds maximum bet" })] }), _jsx("div", { className: styles.chipGrid, children: _chipSet.map((denomination) => (_jsx("div", { className: styles.chipButtonGroup, children: _jsx("button", { className: `${styles.chipButton} ${styles[`chip${denomination}`]}`, onClick: () => addChip(denomination), disabled: disabled || tempBet + denomination > maxBet || tempBet + denomination > balance, title: `Add $${denomination} chip`, "aria-label": `Add ${denomination} dollar chip`, children: _jsxs("div", { className: styles.chipValue, children: ["$", denomination] }) }) }, denomination))) }), _jsxs("div", { className: styles.buttonRow, children: [_jsx("button", { className: styles.secondaryButton, onClick: quickRepeat, disabled: disabled || currentBet === 0, title: "Repeat last bet", children: "Repeat" }), _jsx("button", { className: styles.secondaryButton, onClick: quickDouble, disabled: disabled || tempBet === 0 || tempBet * 2 > maxBet || tempBet * 2 > balance, title: "Double the current bet", children: "\u00D72" }), _jsx("button", { className: styles.dangerButton, onClick: clearBet, disabled: disabled || tempBet === 0, title: "Clear all chips", children: "Clear" })] }), _jsxs("button", { className: styles.placeBetButton, onClick: handlePlaceBet, disabled: disabled || !isValidBet, title: isValidBet ? 'Place bet and start dealing' : 'Invalid bet amount', children: ["Place Bet $", tempBet] })] }));
});
BetControl.displayName = 'BetControl';
