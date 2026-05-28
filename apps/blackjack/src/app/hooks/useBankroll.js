import { createBankroll, createGamingSession, createTableConfig, endSession, getSessionStats, updateSessionAfterRound, } from '@games/banking';
import { useEffect, useState } from 'react';
/**
 * useBankroll — Manages player bankroll, table selection, and gaming sessions.
 *
 * This hook:
 * - Creates/loads player bankroll from localStorage
 * - Manages table selection and chip set
 * - Creates and tracks gaming sessions
 * - Records bets and updates bankroll after each hand
 * - Provides session statistics
 *
 * Because gamer progression across tables needs cross-game consistency,
 * bankroll is stored with a player ID and persists across all games.
 */
export const useBankroll = (playerId, gameId) => {
    // Bankroll state
    const [bankroll, setBankroll] = useState(null);
    const [isLoadingBankroll, setIsLoadingBankroll] = useState(true);
    // Table selection state
    const [selectedTableVariant, setSelectedTableVariant] = useState(null);
    const [tableConfig, setTableConfig] = useState(null);
    const [selectedChipSet, setSelectedChipSet] = useState([]);
    // Gaming session state
    const [gameSession, setGameSession] = useState(null);
    const [betHistory, setBetHistory] = useState([]);
    // Storage keys
    const bankrollKey = `bankroll:${playerId}`;
    const sessionKey = `session:${playerId}:${gameId}`;
    /**
     * Load bankroll from localStorage on mount
     * If no bankroll exists, create a default one ($100 starting balance)
     */
    useEffect(() => {
        const loadBankroll = async () => {
            try {
                const stored = localStorage.getItem(bankrollKey);
                if (stored) {
                    setBankroll(JSON.parse(stored));
                }
                else {
                    // Create new bankroll with $100 starting amount
                    const newBankroll = createBankroll(playerId, 100, 'USD');
                    setBankroll(newBankroll);
                    localStorage.setItem(bankrollKey, JSON.stringify(newBankroll));
                }
            }
            finally {
                setIsLoadingBankroll(false);
            }
        };
        loadBankroll();
    }, [playerId, bankrollKey]);
    /**
     * Handle table selection
     * Creates gaming session and sets up table configuration
     */
    const handleSelectTable = (variant, chipSet) => {
        if (!bankroll) {
            return;
        }
        // Create table configuration with game-specific settings
        const config = createTableConfig(gameId, variant, {
        // Optional: Add blackjack-specific house rules here
        });
        // Create gaming session
        const session = createGamingSession(playerId, gameId, config.id || variant, bankroll.amount);
        setSelectedTableVariant(variant);
        setTableConfig(config);
        setSelectedChipSet(chipSet);
        setGameSession(session);
        // Persist session to localStorage
        localStorage.setItem(sessionKey, JSON.stringify(session));
    };
    /**
     * Record a bet in the current session
     * Updates bankroll immediately
     * Do NOT update session yet - that happens after the game result
     */
    const recordBet = (betAmount) => {
        if (!bankroll || !gameSession) {
            console.warn('Cannot record bet: no bankroll or game session');
            return false;
        }
        // Check if player can afford the bet
        if (betAmount > bankroll.amount) {
            console.warn(`Insufficient funds: bet $${betAmount}, balance $${bankroll.amount}`);
            return false;
        }
        // Deduct bet from bankroll (money is "in play")
        const updatedBalance = bankroll.amount - betAmount;
        const updatedBankroll = {
            ...bankroll,
            amount: updatedBalance,
            updatedAt: new Date(),
        };
        setBankroll(updatedBankroll);
        localStorage.setItem(bankrollKey, JSON.stringify(updatedBankroll));
        return true;
    };
    /**
     * Record game result and update session
     * Called after each hand resolves (win/loss/push)
     */
    const recordGameResult = (result) => {
        if (!bankroll || !gameSession) {
            console.warn('Cannot record result: no bankroll or game session');
            return;
        }
        // 1. Update session with game result
        const updatedSession = updateSessionAfterRound(gameSession, result.betAmount, result.payout);
        setGameSession(updatedSession);
        // 2. Update bankroll with winnings
        const newBalance = bankroll.amount + result.payout;
        const updatedBankroll = {
            ...bankroll,
            amount: newBalance,
            updatedAt: new Date(),
        };
        setBankroll(updatedBankroll);
        localStorage.setItem(bankrollKey, JSON.stringify(updatedBankroll));
        // 3. Record bet in history
        const betRecord = {
            id: `${gameSession.id}-${Date.now()}`,
            sessionId: gameSession.id,
            gameId: gameId,
            tableId: gameSession.tableId,
            amount: result.betAmount,
            result: result.result,
            payout: result.payout,
            timestamp: new Date(),
            metadata: {
                variant: selectedTableVariant,
            },
        };
        setBetHistory((prev) => [...prev, betRecord]);
        // Persist updated session
        localStorage.setItem(sessionKey, JSON.stringify(updatedSession));
    };
    /**
     * End current gaming session and get final statistics
     */
    const endCurrentSession = () => {
        if (!gameSession) {
            return null;
        }
        const completedSession = endSession(gameSession);
        const stats = getSessionStats(completedSession);
        // Clear session from localStorage
        localStorage.removeItem(sessionKey);
        setGameSession(null);
        setBetHistory([]);
        return {
            session: completedSession,
            stats,
        };
    };
    /**
     * Cancel current session without saving (for quit/abandon)
     */
    const cancelSession = () => {
        localStorage.removeItem(sessionKey);
        setGameSession(null);
        setSelectedTableVariant(null);
        setTableConfig(null);
        setSelectedChipSet([]);
        setBetHistory([]);
    };
    return {
        // Bankroll
        bankroll,
        isLoadingBankroll,
        // Table selection
        selectedTableVariant,
        tableConfig,
        selectedChipSet,
        handleSelectTable,
        // Gaming session
        gameSession,
        betHistory,
        recordBet,
        recordGameResult,
        endCurrentSession,
        cancelSession,
        // Computed properties
        currentBalance: bankroll?.amount ?? 0,
        isTableSelected: selectedTableVariant !== null,
        isGameSessionActive: gameSession !== null,
    };
};
