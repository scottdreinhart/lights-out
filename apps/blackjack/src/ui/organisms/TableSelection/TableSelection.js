import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BETTING_LIMITS_CASUAL, BETTING_LIMITS_HIGH_ROLLER, BETTING_LIMITS_MID, CHIP_SET_CASUAL, CHIP_SET_HIGH_ROLLER, CHIP_SET_MID, RECOMMENDED_BANKROLLS, } from '@games/banking';
import React, { useCallback } from 'react';
import styles from './TableSelection.module.css';
const TABLE_OPTIONS = [
    {
        variant: 'casual',
        title: 'Casual Table',
        description: 'Perfect for learning and relaxed play',
        minBet: BETTING_LIMITS_CASUAL.minBet,
        maxBet: BETTING_LIMITS_CASUAL.maxBet,
        recommended: RECOMMENDED_BANKROLLS.casual.recommended,
        comfortable: RECOMMENDED_BANKROLLS.casual.comfortable,
        chipSet: CHIP_SET_CASUAL,
        emoji: '🎲',
        color: '#2e7d32',
    },
    {
        variant: 'mid',
        title: 'Mid-Stakes Table',
        description: 'Standard casino play with moderate risk',
        minBet: BETTING_LIMITS_MID.minBet,
        maxBet: BETTING_LIMITS_MID.maxBet,
        recommended: RECOMMENDED_BANKROLLS.mid.recommended,
        comfortable: RECOMMENDED_BANKROLLS.mid.comfortable,
        chipSet: CHIP_SET_MID,
        emoji: '💎',
        color: '#0d47a1',
    },
    {
        variant: 'high-roller',
        title: 'High Roller Table',
        description: 'Premium stakes for experienced players',
        minBet: BETTING_LIMITS_HIGH_ROLLER.minBet,
        maxBet: BETTING_LIMITS_HIGH_ROLLER.maxBet,
        recommended: RECOMMENDED_BANKROLLS.highRoller.recommended,
        comfortable: RECOMMENDED_BANKROLLS.highRoller.comfortable,
        chipSet: CHIP_SET_HIGH_ROLLER,
        emoji: '👑',
        color: '#6a1b9a',
    },
];
/**
 * TableSelection — Allows player to choose which casino table to play at.
 *
 * Each table has different betting limits, chip denominations, and house rules.
 * Player's balance determines availability/recommendations.
 */
export const TableSelection = React.memo(({ balance, onSelectTable, disabled = false }) => {
    const handleSelectTable = useCallback((variant, chipSet) => {
        onSelectTable(variant, chipSet);
    }, [onSelectTable]);
    return (_jsxs("div", { className: styles.root, children: [_jsxs("div", { className: styles.header, children: [_jsx("h2", { className: styles.title, children: "Select Your Table" }), _jsx("p", { className: styles.subtitle, children: "Choose your preferred betting level" }), _jsxs("div", { className: styles.balanceDisplay, children: [_jsx("span", { className: styles.balanceLabel, children: "Your Balance" }), _jsxs("span", { className: styles.balanceAmount, children: ["$", balance] })] })] }), _jsx("div", { className: styles.tablesGrid, children: TABLE_OPTIONS.map((table) => {
                    const canAfford = balance >= table.minBet;
                    const isRecommended = balance >= table.recommended;
                    const isComfortable = balance >= table.comfortable;
                    return (_jsxs("div", { className: `${styles.tableCard} ${isComfortable ? styles.comfortable : isRecommended ? styles.recommended : ''}`, children: [_jsxs("div", { className: styles.tableHeader, style: { borderColor: table.color }, children: [_jsx("span", { className: styles.emoji, children: table.emoji }), _jsx("h3", { className: styles.tableName, children: table.title })] }), _jsx("p", { className: styles.tableDescription, children: table.description }), _jsxs("div", { className: styles.limitsBox, children: [_jsxs("div", { className: styles.limitRow, children: [_jsx("span", { className: styles.limitLabel, children: "Min Bet:" }), _jsxs("span", { className: styles.limitValue, children: ["$", table.minBet] })] }), _jsxs("div", { className: styles.limitRow, children: [_jsx("span", { className: styles.limitLabel, children: "Max Bet:" }), _jsxs("span", { className: styles.limitValue, children: ["$", table.maxBet] })] })] }), _jsxs("div", { className: styles.chipSetBox, children: [_jsx("span", { className: styles.chipSetLabel, children: "Available Chips" }), _jsx("div", { className: styles.chipSet, children: table.chipSet.map((chip) => (_jsxs("div", { className: styles.chipDenom, title: `$${chip} chip`, children: ["$", chip] }, chip))) })] }), _jsx("div", { className: styles.recommendationBox, children: isComfortable ? (_jsx("div", { className: `${styles.recommendation} ${styles.comfortable}`, children: "\u2713 Great for your bankroll" })) : isRecommended ? (_jsx("div", { className: `${styles.recommendation} ${styles.recommended}`, children: "\u2713 Good fit" })) : canAfford ? (_jsxs("div", { className: `${styles.recommendation} ${styles.tight}`, children: ["\u26A0 Tight bankroll (min recommended: $", table.recommended, ")"] })) : (_jsxs("div", { className: `${styles.recommendation} ${styles.unavailable}`, children: ["\u2717 Unavailable (need $$", table.minBet, ")"] })) }), _jsx("button", { className: styles.selectButton, style: { backgroundColor: table.color }, onClick: () => handleSelectTable(table.variant, table.chipSet), disabled: disabled || !canAfford, title: !canAfford ? `Requires minimum $${table.minBet}` : undefined, children: canAfford ? 'Select Table' : 'Unavailable' })] }, table.variant));
                }) }), _jsxs("div", { className: styles.tips, children: [_jsx("h4", { className: styles.tipsTitle, children: "\uD83D\uDCA1 Bankroll Tips" }), _jsxs("ul", { className: styles.tipsList, children: [_jsxs("li", { children: [_jsx("strong", { children: "20x rule:" }), " Have at least 20 times the minimum bet"] }), _jsxs("li", { children: [_jsx("strong", { children: "100x ideal:" }), " Comfortable play requires 100x the minimum"] }), _jsxs("li", { children: [_jsx("strong", { children: "House edge:" }), " Blackjack favors disciplined players (~0.5%)"] }), _jsxs("li", { children: [_jsx("strong", { children: "Session limit:" }), " Set a loss limit before playing"] })] })] })] }));
});
TableSelection.displayName = 'TableSelection';
