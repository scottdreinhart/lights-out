import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useResponsiveState } from '@games/app-hook-utils';
import styles from './CountingPanel.module.css';
/**
 * CountingPanel Component
 *
 * Displays Hi-Lo card counting information including:
 * - Running count and true count
 * - Deck penetration (cards dealt vs remaining)
 * - Player advantage estimate
 * - Betting strategy recommendations
 * - Counting accuracy (in learning mode)
 */
export function CountingPanel({ countingState, countAccuracy, difficulty, penetrationPercent, countingEnabled, className, }) {
    const _responsive = useResponsiveState();
    if (!countingEnabled || !countingState) {
        return null;
    }
    // Determine advantage level for color coding
    const advantageLevel = getAdvantageLevel(countingState.advantage);
    return (_jsxs("div", { className: `${styles.container} ${className || ''}`, children: [_jsxs("div", { className: styles.header, children: [_jsx("h3", { className: styles.title, children: "Card Counting" }), _jsx("span", { className: `${styles.difficulty} ${styles[`difficulty-${difficulty}`]}`, children: formatDifficulty(difficulty) })] }), _jsxs("div", { className: styles.countsSection, children: [_jsxs("div", { className: styles.countBox, children: [_jsx("div", { className: styles.countLabel, children: "Running Count" }), _jsx("div", { className: `${styles.countValue} ${countingState.runningCount >= 0 ? styles.positive : styles.negative}`, children: formatCount(countingState.runningCount) })] }), _jsxs("div", { className: styles.countBox, children: [_jsx("div", { className: styles.countLabel, children: "True Count" }), _jsx("div", { className: `${styles.countValue} ${countingState.trueCount >= 1 ? styles.positive : styles.negative}`, children: formatCount(countingState.trueCount) })] })] }), _jsxs("div", { className: `${styles.advantage} ${styles[`advantage-${advantageLevel}`]}`, children: [_jsx("div", { className: styles.advantageLabel, children: "Player Advantage" }), _jsxs("div", { className: styles.advantageValue, children: [(countingState.advantage * 100).toFixed(2), "%"] }), _jsx("div", { className: styles.advantageBar, children: _jsx("div", { className: styles.advantageFill, style: { width: `${Math.min(Math.max(countingState.advantage * 100 + 3, 0), 100)}%` } }) })] }), _jsxs("div", { className: styles.penetration, children: [_jsx("div", { className: styles.penetrationLabel, children: "Deck Penetration" }), _jsx("div", { className: styles.penetrationBar, children: _jsx("div", { className: styles.penetrationFill, style: { width: `${penetrationPercent}%` } }) }), _jsxs("div", { className: styles.penetrationText, children: [penetrationPercent.toFixed(0), "%"] })] }), countingState.advantage > 0 && (_jsxs("div", { className: styles.advice, children: [_jsx("div", { className: styles.adviceLabel, children: "Suggested Bet: " }), _jsxs("div", { className: styles.adviceValue, children: [formatBetMultiplier(countingState.betMultiplier), "\u00D7 base"] })] })), countAccuracy !== undefined && (_jsxs("div", { className: styles.accuracy, children: [_jsx("div", { className: styles.accuracyLabel, children: "Accuracy" }), _jsxs("div", { className: `${styles.accuracyValue} ${countAccuracy >= 80 ? styles.excellent : countAccuracy >= 60 ? styles.good : styles.needsWork}`, children: [Math.round(countAccuracy), "%"] })] })), _jsxs("div", { className: styles.remaining, children: [_jsx("div", { className: styles.remainingLabel, children: "Approx. Decks Remaining" }), _jsx("div", { className: styles.remainingValue, children: countingState.decksRemaining.toFixed(1) })] })] }));
}
/**
 * Format count value
 */
function formatCount(count) {
    return count >= 0 ? `+${count}` : `${count}`;
}
/**
 * Format difficulty level
 */
function formatDifficulty(difficulty) {
    switch (difficulty) {
        case 'beginner':
            return 'Beginner';
        case 'intermediate':
            return 'Intermediate';
        case 'advanced':
            return 'Advanced';
        default:
            return difficulty;
    }
}
/**
 * Format bet multiplier
 */
function formatBetMultiplier(multiplier) {
    return multiplier.toFixed(1);
}
/**
 * Determine advantage level for styling
 */
function getAdvantageLevel(advantage) {
    if (advantage > 0.02) {
        return 'strong';
    }
    if (advantage > 0.01) {
        return 'good';
    }
    if (advantage > -0.01) {
        return 'neutral';
    }
    if (advantage > -0.02) {
        return 'slight';
    }
    return 'disadvantage';
}
