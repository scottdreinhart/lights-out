import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useBankroll } from '@/app/hooks';
import React, { useState } from 'react';
import { TableSelection } from '../TableSelection';
import styles from './GameLayout.module.css';
export const GameLayout = React.memo(({ playerId, GameBoardComponent, ResultsComponent }) => {
    const gameId = 'blackjack';
    const [screen, setScreen] = useState('table-selection');
    // Initialize bankroll system
    const { bankroll, isLoadingBankroll, selectedTableVariant, tableConfig, selectedChipSet, handleSelectTable, gameSession, recordBet, recordGameResult, endCurrentSession, cancelSession, currentBalance, isTableSelected, } = useBankroll(playerId, gameId);
    // Handle table selection
    const handleSelectTableWithNavigation = (variant, chipSet) => {
        handleSelectTable(variant, chipSet);
        setScreen('playing');
    };
    // Handle hand completion
    const handleHandComplete = (result) => {
        // Update bankroll and session
        recordGameResult(result);
        // Show temporary results screen (optional)
        // For now, just stay in playing screen for next hand
        // setScreen('results')
    };
    // Handle change table (go back to table selection)
    const handleChangeTable = () => {
        cancelSession();
        setScreen('table-selection');
    };
    // Handle end session and show final results
    const handleShowResults = () => {
        const result = endCurrentSession();
        if (result) {
            // Could show detailed results screen here
            console.log('Session ended:', result.stats);
        }
        setScreen('table-selection');
    };
    // Show loading state while bankroll is loading
    if (isLoadingBankroll) {
        return (_jsxs("div", { className: styles.loadingContainer, children: [_jsx("div", { className: styles.spinner, children: "\u23F3" }), _jsx("p", { children: "Loading your bankroll..." })] }));
    }
    // Show error if no bankroll
    if (!bankroll) {
        return (_jsx("div", { className: styles.errorContainer, children: _jsx("p", { children: "\u26A0\uFE0F Error loading bankroll. Please refresh the page." }) }));
    }
    return (_jsxs("div", { className: styles.root, children: [screen === 'table-selection' && (_jsx("div", { className: styles.screenContainer, children: _jsx(TableSelection, { balance: currentBalance, onSelectTable: handleSelectTableWithNavigation }) })), screen === 'playing' && selectedTableVariant && tableConfig && (_jsxs("div", { className: styles.screenContainer, children: [_jsxs("div", { className: styles.gameHeader, children: [_jsx("h2", { className: styles.tableTitle, children: selectedTableVariant === 'casual'
                                    ? '🎲 Casual Table'
                                    : selectedTableVariant === 'mid'
                                        ? '💎 Mid-Stakes Table'
                                        : '👑 High Roller Table' }), _jsxs("div", { className: styles.balanceDisplay, children: [_jsx("span", { className: styles.label, children: "Balance:" }), _jsxs("span", { className: styles.amount, children: ["$", currentBalance] })] }), _jsx("button", { className: styles.changeTableButton, onClick: handleChangeTable, title: "Return to table selection", children: "Change Table" })] }), _jsx(GameBoardComponent, { tableVariant: selectedTableVariant, minBet: tableConfig.limits.minBet, maxBet: tableConfig.limits.maxBet, chipSet: selectedChipSet, balance: currentBalance, onHandComplete: handleHandComplete, onChangeTable: handleChangeTable }), _jsx("button", { className: styles.endSessionButton, onClick: handleShowResults, title: "End session and see final statistics", children: "End Session" })] })), !isTableSelected && screen === 'playing' && (_jsx("div", { className: styles.placeholder, children: _jsx("p", { children: "No table selected. Please select a table to begin." }) }))] }));
});
GameLayout.displayName = 'GameLayout';
