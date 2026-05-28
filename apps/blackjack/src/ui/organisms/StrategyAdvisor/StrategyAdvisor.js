import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useResponsiveState } from '@games/app-hook-utils';
import styles from './StrategyAdvisor.module.css';
/**
 * StrategyAdvisor Component
 *
 * Displays basic strategy recommendations and learning feedback
 *
 * Features:
 * - Current strategy recommendation (action + confidence)
 * - Expected value for recommended play
 * - Learning mode feedback (correct/incorrect decision)
 * - Session accuracy tracking
 * - Hint system with priority levels
 */
export function StrategyAdvisor({ strategyState, sessionAccuracy, className, }) {
    const _responsive = useResponsiveState();
    // Determine visibility based on mode
    const isVisible = strategyState.mode !== 'none';
    const isLearningMode = strategyState.learningModeEnabled && strategyState.mode === 'learning';
    if (!isVisible) {
        return null;
    }
    // Get the current hint
    const hint = strategyState.currentHint;
    // Format accuracy percentage
    const accuracyPercent = Math.round(sessionAccuracy * 100);
    return (_jsxs("div", { className: `${styles.container} ${className || ''}`, children: [_jsxs("div", { className: styles.header, children: [_jsx("h3", { className: styles.title, children: "Strategy Advisor" }), isLearningMode && _jsx("span", { className: styles.learningBadge, children: "Learning Mode" })] }), _jsxs("div", { className: styles.modeIndicator, children: [_jsx("div", { className: styles.modeLabel, children: "Mode:" }), _jsx("div", { className: `${styles.modeName} ${styles[`mode-${strategyState.mode}`]}`, children: formatMode(strategyState.mode) })] }), hint && (_jsxs("div", { className: `${styles.hint} ${styles[`hint-${hint.type}`]}`, children: [_jsx("div", { className: styles.hintIcon, children: getHintIcon(hint.type) }), _jsxs("div", { className: styles.hintContent, children: [_jsx("div", { className: styles.hintMessage, children: hint.message }), isLearningMode && _jsxs("div", { className: styles.hintPriority, children: ["Priority: ", hint.priority] })] })] })), isLearningMode && (_jsxs("div", { className: styles.stats, children: [_jsxs("div", { className: styles.stat, children: [_jsx("div", { className: styles.statLabel, children: "Accuracy" }), _jsxs("div", { className: `${styles.statValue} ${accuracyPercent >= 80 ? styles.excellent : accuracyPercent >= 60 ? styles.good : styles.needsWork}`, children: [accuracyPercent, "%"] })] }), _jsxs("div", { className: styles.stat, children: [_jsx("div", { className: styles.statLabel, children: "Decisions" }), _jsx("div", { className: styles.statValue, children: strategyState.sessionStats.totalDecisions })] }), _jsxs("div", { className: styles.stat, children: [_jsx("div", { className: styles.statLabel, children: "Correct" }), _jsx("div", { className: styles.statValue, children: strategyState.sessionStats.correctDecisions })] })] })), !hint && (_jsx("div", { className: styles.empty, children: _jsx("p", { className: styles.emptyText, children: "No recommendation available" }) }))] }));
}
/**
 * Format strategy mode for display
 */
function formatMode(mode) {
    switch (mode) {
        case 'basic':
            return 'Basic Strategy';
        case 'card-counting':
            return 'Card Counting';
        case 'learning':
            return 'Learning Mode';
        default:
            return 'Off';
    }
}
/**
 * Get icon for hint type
 */
function getHintIcon(type) {
    switch (type) {
        case 'recommendation':
            return '💡';
        case 'correction':
            return '✓';
        case 'tip':
            return '⭐';
        case 'warning':
            return '⚠️';
        default:
            return '•';
    }
}
