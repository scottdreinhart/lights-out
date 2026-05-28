import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './HistoryPanel.module.css';
/**
 * HistoryPanel Component - Displays recent game history
 *
 * Shows the last several games with:
 * - Date/time of game
 * - Bet amount
 * - Outcome (win/loss/push)
 * - Payout amount
 */
export function HistoryPanel({ recentGames, className }) {
    if (recentGames.length === 0) {
        return (_jsxs("div", { className: `${styles.container} ${className || ''}`, children: [_jsx("h3", { className: styles.title, children: "Game History" }), _jsxs("div", { className: styles.empty, children: [_jsx("p", { children: "No games played yet." }), _jsx("p", { children: "Start playing to see your history!" })] })] }));
    }
    return (_jsxs("div", { className: `${styles.container} ${className || ''}`, children: [_jsx("h3", { className: styles.title, children: "Recent Games" }), _jsx("div", { className: styles.historyList, children: recentGames.slice(0, 10).map((game, index) => (_jsxs("div", { className: styles.gameItem, children: [_jsxs("div", { className: styles.gameHeader, children: [_jsxs("div", { className: styles.gameNumber, children: ["#", recentGames.length - index] }), _jsx("div", { className: styles.gameDate, children: new Date(game.timestamp).toLocaleDateString() })] }), _jsxs("div", { className: styles.gameDetails, children: [_jsxs("div", { className: styles.detail, children: [_jsx("span", { className: styles.label, children: "Bet:" }), _jsxs("span", { className: styles.value, children: ["$", game.amounts.bet] })] }), _jsxs("div", { className: styles.detail, children: [_jsx("span", { className: styles.label, children: "Outcome:" }), _jsx("span", { className: `${styles.value} ${styles.outcome} ${styles[game.outcomes[0]]}`, children: game.outcomes[0] })] }), _jsxs("div", { className: styles.detail, children: [_jsx("span", { className: styles.label, children: "Result:" }), _jsxs("span", { className: `${styles.value} ${game.amounts.payout >= 0 ? styles.positive : styles.negative}`, children: [game.amounts.payout >= 0 ? '+' : '', "$", game.amounts.payout] })] })] })] }, game.gameId))) }), recentGames.length > 10 && (_jsxs("div", { className: styles.moreIndicator, children: ["And ", recentGames.length - 10, " more games..."] }))] }));
}
