/**
 * Blackjack Basic Strategy
 *
 * Pure functions for basic strategy lookups and recommendations.
 * Based on standard Vegas Strip rules (S17, DOA, DAS).
 */
// Hard Hand Strategy
const HARD_STRATEGY = {
    '5': {
        '2': 'hit',
        '3': 'hit',
        '4': 'hit',
        '5': 'hit',
        '6': 'hit',
        '7': 'hit',
        '8': 'hit',
        '9': 'hit',
        '10': 'hit',
        A: 'hit',
    },
    '6': {
        '2': 'hit',
        '3': 'hit',
        '4': 'hit',
        '5': 'hit',
        '6': 'hit',
        '7': 'hit',
        '8': 'hit',
        '9': 'hit',
        '10': 'hit',
        A: 'hit',
    },
    '7': {
        '2': 'hit',
        '3': 'hit',
        '4': 'hit',
        '5': 'hit',
        '6': 'hit',
        '7': 'hit',
        '8': 'hit',
        '9': 'hit',
        '10': 'hit',
        A: 'hit',
    },
    '8': {
        '2': 'hit',
        '3': 'hit',
        '4': 'hit',
        '5': 'hit',
        '6': 'hit',
        '7': 'hit',
        '8': 'hit',
        '9': 'hit',
        '10': 'hit',
        A: 'hit',
    },
    '9': {
        '2': 'hit',
        '3': 'double',
        '4': 'double',
        '5': 'double',
        '6': 'double',
        '7': 'hit',
        '8': 'hit',
        '9': 'hit',
        '10': 'hit',
        A: 'hit',
    },
    '10': {
        '2': 'double',
        '3': 'double',
        '4': 'double',
        '5': 'double',
        '6': 'double',
        '7': 'double',
        '8': 'double',
        '9': 'double',
        '10': 'hit',
        A: 'hit',
    },
    '11': {
        '2': 'double',
        '3': 'double',
        '4': 'double',
        '5': 'double',
        '6': 'double',
        '7': 'double',
        '8': 'double',
        '9': 'double',
        '10': 'double',
        A: 'hit',
    },
    '12': {
        '2': 'hit',
        '3': 'stand',
        '4': 'stand',
        '5': 'stand',
        '6': 'stand',
        '7': 'hit',
        '8': 'hit',
        '9': 'hit',
        '10': 'hit',
        A: 'hit',
    },
    '13': {
        '2': 'stand',
        '3': 'stand',
        '4': 'stand',
        '5': 'stand',
        '6': 'stand',
        '7': 'hit',
        '8': 'hit',
        '9': 'hit',
        '10': 'hit',
        A: 'hit',
    },
    '14': {
        '2': 'stand',
        '3': 'stand',
        '4': 'stand',
        '5': 'stand',
        '6': 'stand',
        '7': 'hit',
        '8': 'hit',
        '9': 'hit',
        '10': 'hit',
        A: 'hit',
    },
    '15': {
        '2': 'stand',
        '3': 'stand',
        '4': 'stand',
        '5': 'stand',
        '6': 'stand',
        '7': 'hit',
        '8': 'hit',
        '9': 'hit',
        '10': 'hit',
        A: 'hit',
    },
    '16': {
        '2': 'stand',
        '3': 'stand',
        '4': 'stand',
        '5': 'stand',
        '6': 'stand',
        '7': 'hit',
        '8': 'hit',
        '9': 'hit',
        '10': 'hit',
        A: 'hit',
    },
    '17': {
        '2': 'stand',
        '3': 'stand',
        '4': 'stand',
        '5': 'stand',
        '6': 'stand',
        '7': 'stand',
        '8': 'stand',
        '9': 'stand',
        '10': 'stand',
        A: 'stand',
    },
    '18': {
        '2': 'stand',
        '3': 'stand',
        '4': 'stand',
        '5': 'stand',
        '6': 'stand',
        '7': 'stand',
        '8': 'stand',
        '9': 'stand',
        '10': 'stand',
        A: 'stand',
    },
    '19': {
        '2': 'stand',
        '3': 'stand',
        '4': 'stand',
        '5': 'stand',
        '6': 'stand',
        '7': 'stand',
        '8': 'stand',
        '9': 'stand',
        '10': 'stand',
        A: 'stand',
    },
    '20': {
        '2': 'stand',
        '3': 'stand',
        '4': 'stand',
        '5': 'stand',
        '6': 'stand',
        '7': 'stand',
        '8': 'stand',
        '9': 'stand',
        '10': 'stand',
        A: 'stand',
    },
    '21': {
        '2': 'stand',
        '3': 'stand',
        '4': 'stand',
        '5': 'stand',
        '6': 'stand',
        '7': 'stand',
        '8': 'stand',
        '9': 'stand',
        '10': 'stand',
        A: 'stand',
    },
};
// Soft Hand Strategy (with ace counting as 11)
const SOFT_STRATEGY = {
    A2: {
        '2': 'hit',
        '3': 'hit',
        '4': 'double',
        '5': 'double',
        '6': 'double',
        '7': 'hit',
        '8': 'hit',
        '9': 'hit',
        '10': 'hit',
        A: 'hit',
    },
    A3: {
        '2': 'hit',
        '3': 'hit',
        '4': 'double',
        '5': 'double',
        '6': 'double',
        '7': 'hit',
        '8': 'hit',
        '9': 'hit',
        '10': 'hit',
        A: 'hit',
    },
    A4: {
        '2': 'hit',
        '3': 'double',
        '4': 'double',
        '5': 'double',
        '6': 'double',
        '7': 'hit',
        '8': 'hit',
        '9': 'hit',
        '10': 'hit',
        A: 'hit',
    },
    A5: {
        '2': 'hit',
        '3': 'double',
        '4': 'double',
        '5': 'double',
        '6': 'double',
        '7': 'hit',
        '8': 'hit',
        '9': 'hit',
        '10': 'hit',
        A: 'hit',
    },
    A6: {
        '2': 'double',
        '3': 'double',
        '4': 'double',
        '5': 'double',
        '6': 'double',
        '7': 'hit',
        '8': 'hit',
        '9': 'hit',
        '10': 'hit',
        A: 'hit',
    },
    A7: {
        '2': 'stand',
        '3': 'double',
        '4': 'double',
        '5': 'double',
        '6': 'double',
        '7': 'stand',
        '8': 'stand',
        '9': 'hit',
        '10': 'hit',
        A: 'stand',
    },
    A8: {
        '2': 'stand',
        '3': 'stand',
        '4': 'stand',
        '5': 'stand',
        '6': 'stand',
        '7': 'stand',
        '8': 'stand',
        '9': 'stand',
        '10': 'stand',
        A: 'stand',
    },
    A9: {
        '2': 'stand',
        '3': 'stand',
        '4': 'stand',
        '5': 'stand',
        '6': 'stand',
        '7': 'stand',
        '8': 'stand',
        '9': 'stand',
        '10': 'stand',
        A: 'stand',
    },
};
// Split Strategy
const SPLIT_STRATEGY = {
    '2': {
        '2': 'split',
        '3': 'split',
        '4': 'split',
        '5': 'split',
        '6': 'split',
        '7': 'split',
        '8': 'hit',
        '9': 'hit',
        '10': 'hit',
        A: 'hit',
    },
    '3': {
        '2': 'split',
        '3': 'split',
        '4': 'split',
        '5': 'split',
        '6': 'split',
        '7': 'split',
        '8': 'hit',
        '9': 'hit',
        '10': 'hit',
        A: 'hit',
    },
    '4': {
        '2': 'hit',
        '3': 'hit',
        '4': 'hit',
        '5': 'split',
        '6': 'split',
        '7': 'hit',
        '8': 'hit',
        '9': 'hit',
        '10': 'hit',
        A: 'hit',
    },
    '5': {
        '2': 'double',
        '3': 'double',
        '4': 'double',
        '5': 'double',
        '6': 'double',
        '7': 'double',
        '8': 'double',
        '9': 'double',
        '10': 'hit',
        A: 'hit',
    },
    '6': {
        '2': 'split',
        '3': 'split',
        '4': 'split',
        '5': 'split',
        '6': 'split',
        '7': 'hit',
        '8': 'hit',
        '9': 'hit',
        '10': 'hit',
        A: 'hit',
    },
    '7': {
        '2': 'split',
        '3': 'split',
        '4': 'split',
        '5': 'split',
        '6': 'split',
        '7': 'split',
        '8': 'hit',
        '9': 'hit',
        '10': 'hit',
        A: 'hit',
    },
    '8': {
        '2': 'split',
        '3': 'split',
        '4': 'split',
        '5': 'split',
        '6': 'split',
        '7': 'split',
        '8': 'split',
        '9': 'split',
        '10': 'split',
        A: 'split',
    },
    '9': {
        '2': 'split',
        '3': 'split',
        '4': 'split',
        '5': 'split',
        '6': 'split',
        '7': 'stand',
        '8': 'split',
        '9': 'split',
        '10': 'stand',
        A: 'stand',
    },
    '10': {
        '2': 'stand',
        '3': 'stand',
        '4': 'stand',
        '5': 'stand',
        '6': 'stand',
        '7': 'stand',
        '8': 'stand',
        '9': 'stand',
        '10': 'stand',
        A: 'stand',
    },
    A: {
        '2': 'split',
        '3': 'split',
        '4': 'split',
        '5': 'split',
        '6': 'split',
        '7': 'split',
        '8': 'split',
        '9': 'split',
        '10': 'split',
        A: 'split',
    },
};
// ┌─────────────────────────────────────────────────────────┐
// │ STRATEGY LOOKUP FUNCTIONS                               │
// └─────────────────────────────────────────────────────────┘
/**
 * Get the basic strategy recommendation for a given player hand and dealer up card
 */
export const getBasicStrategyRecommendation = (playerHardValue, playerSoftValue, dealerUpCard, playerAction) => {
    const dealerRank = getNormalizedDealerUpCard(dealerUpCard.rank);
    let recommendedAction;
    // If player has a soft hand (ace counts as 11), use soft strategy
    if (playerSoftValue !== undefined && playerSoftValue <= 21) {
        const softKey = getSoftHandKey(playerSoftValue);
        if (softKey && SOFT_STRATEGY[softKey]) {
            recommendedAction = SOFT_STRATEGY[softKey][dealerRank];
        }
        else {
            // Fallback to hard strategy
            recommendedAction = getHardStrategyAction(playerHardValue, dealerRank);
        }
    }
    else {
        recommendedAction = getHardStrategyAction(playerHardValue, dealerRank);
    }
    const isCorrect = playerAction === recommendedAction;
    const explanation = getStrategyExplanation(playerHardValue, playerSoftValue, dealerRank, recommendedAction);
    return {
        recommendedAction,
        isCorrect,
        explanation,
        expectedValue: calculateExpectedValue(playerHardValue, dealerRank, recommendedAction),
    };
};
/**
 * Get the basic strategy recommendation for a split decision
 */
export const getSplitStrategyRecommendation = (cardRank, dealerUpCard, playerAction) => {
    const dealerRank = getNormalizedDealerUpCard(dealerUpCard.rank);
    const normalizedRank = getNormalizedRank(cardRank);
    let recommendedAction;
    if (SPLIT_STRATEGY[normalizedRank]) {
        recommendedAction = SPLIT_STRATEGY[normalizedRank][dealerRank];
    }
    else {
        recommendedAction = 'hit'; // Default fallback
    }
    const isCorrect = playerAction === recommendedAction;
    const explanation = `Basic strategy recommends ${recommendedAction} ${cardRank}s against dealer ${dealerUpCard.rank}`;
    return {
        recommendedAction,
        isCorrect,
        explanation,
    };
};
// ┌─────────────────────────────────────────────────────────┐
// │ HELPER FUNCTIONS                                        │
// └─────────────────────────────────────────────────────────┘
/**
 * Normalize dealer up card to strategy table key
 */
function getNormalizedDealerUpCard(rank) {
    if (rank === 'K' || rank === 'Q' || rank === 'J') {
        return '10';
    }
    if (rank === 'A') {
        return 'A';
    }
    return rank;
}
/**
 * Normalize player rank to split strategy table key
 */
function getNormalizedRank(rank) {
    if (rank === 'K' || rank === 'Q' || rank === 'J') {
        return '10';
    }
    return rank;
}
/**
 * Convert soft hand total to strategy table key
 */
function getSoftHandKey(softValue) {
    const keys = {
        13: 'A2',
        14: 'A3',
        15: 'A4',
        16: 'A5',
        17: 'A6',
        18: 'A7',
        19: 'A8',
        20: 'A9',
    };
    return keys[softValue] || null;
}
/**
 * Get hard strategy action
 */
function getHardStrategyAction(playerValue, dealerUpCard) {
    // Cap player value at 21
    const cappedValue = Math.min(playerValue, 21);
    if (HARD_STRATEGY[cappedValue]?.[dealerUpCard]) {
        return HARD_STRATEGY[cappedValue][dealerUpCard];
    }
    // Default fallback
    return playerValue > 17 ? 'stand' : 'hit';
}
/**
 * Generate strategy explanation
 */
function getStrategyExplanation(playerHard, playerSoft, dealerUpCard, action) {
    const playerTotal = playerSoft ?? playerHard;
    const handType = playerSoft !== undefined ? 'soft' : 'hard';
    const explanations = {
        hit: `Hit soft ${playerTotal} against dealer ${dealerUpCard} to improve hand`,
        stand: `Stand on ${handType} ${playerTotal} against dealer ${dealerUpCard}`,
        double: `Double down on ${handType} ${playerTotal} against dealer ${dealerUpCard} (favorable odds)`,
        split: `Split against dealer ${dealerUpCard} for better positioning`,
        surrender: `Surrender against dealer ${dealerUpCard} (minimize losses)`,
        insurance: 'Insurance is not recommended (poor odds)',
    };
    return explanations[action] || 'Follow basic strategy recommendations';
}
/**
 * Calculate expected value of an action
 * Approximate values based on basic strategy advantage
 */
function calculateExpectedValue(playerValue, _dealerUpCard, action) {
    // Simplified EV calculation (not exact, but directional)
    const baseEV = 0.01; // Basic strategy has ~0.5% player advantage
    if (action === 'double') {
        return baseEV * 2; // Double pays 2x
    }
    if (action === 'stand' && playerValue >= 17) {
        return baseEV; // Safe
    }
    if (action === 'hit' && playerValue < 12) {
        return baseEV * 1.5; // Good hit situation
    }
    if (action === 'split') {
        return baseEV * 1.8; // Favorable split
    }
    return baseEV;
}
/**
 * Get accuracy feedback for player decisions
 */
export const getStrategyAccuracyFeedback = (isCorrect, streak) => {
    if (isCorrect) {
        if (streak >= 10) {
            return "🔥 Perfect! You've mastered basic strategy!";
        }
        if (streak >= 5) {
            return "✅ Excellent! You're playing optimal strategy";
        }
        return '👍 Correct basic strategy play';
    }
    else {
        return '❌ Not optimal. Review basic strategy for this situation';
    }
};
