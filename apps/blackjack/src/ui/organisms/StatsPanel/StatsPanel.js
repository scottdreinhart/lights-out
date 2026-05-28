import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './StatsPanel.module.css';
/**
 * StatsPanel Component - Displays player statistics
 *
 * Shows comprehensive statistics including:
 * - Games played and win rate
 * - Blackjack frequency
 * - Current and best streaks
 * - Total winnings/losses
 */
export function StatsPanel({ stats, className }) {
    const winRate = stats.gamesPlayed > 0 ? (stats.wins / stats.gamesPlayed) * 100 : 0;
    const blackjackRate = stats.gamesPlayed > 0 ? (stats.blackjacks / stats.gamesPlayed) * 100 : 0;
    return (_jsxs("div", { className: `${styles.container} ${className || ''}`, children: [_jsx("h3", { className: styles.title, children: "Your Statistics" }), _jsxs("div", { className: styles.statsGrid, children: [_jsxs("div", { className: styles.stat, children: [_jsx("div", { className: styles.label, children: "Games Played" }), _jsx("div", { className: styles.value, children: stats.gamesPlayed })] }), _jsxs("div", { className: styles.stat, children: [_jsx("div", { className: styles.label, children: "Win Rate" }), _jsxs("div", { className: styles.value, children: [winRate.toFixed(1), "%"] })] }), _jsxs("div", { className: styles.stat, children: [_jsx("div", { className: styles.label, children: "Blackjacks" }), _jsxs("div", { className: styles.value, children: [stats.blackjacks, " (", blackjackRate.toFixed(1), "%)"] })] }), _jsxs("div", { className: styles.stat, children: [_jsx("div", { className: styles.label, children: "Current Streak" }), _jsx("div", { className: `${styles.value} ${stats.currentStreak > 0 ? styles.positive : stats.currentStreak < 0 ? styles.negative : ''}`, children: stats.currentStreak > 0 ? `+${stats.currentStreak}` : stats.currentStreak })] }), _jsxs("div", { className: styles.stat, children: [_jsx("div", { className: styles.label, children: "Best Streak" }), _jsxs("div", { className: `${styles.value} ${styles.positive}`, children: ["+", stats.bestStreak] })] }), _jsxs("div", { className: styles.stat, children: [_jsx("div", { className: styles.label, children: "Worst Streak" }), _jsx("div", { className: `${styles.value} ${styles.negative}`, children: stats.worstStreak })] }), _jsxs("div", { className: styles.stat, children: [_jsx("div", { className: styles.label, children: "Total Winnings" }), _jsxs("div", { className: `${styles.value} ${stats.totalWinnings >= 0 ? styles.positive : styles.negative}`, children: ["$", stats.totalWinnings >= 0 ? '+' : '', stats.totalWinnings] })] }), _jsxs("div", { className: styles.stat, children: [_jsx("div", { className: styles.label, children: "Average Bet" }), _jsxs("div", { className: styles.value, children: ["$", stats.averageBet.toFixed(0)] })] })] })] }));
}
