import { getHandValues } from './rules';
export function buildBlackjackSignalProfile(gameState, currentHand, availableActions) {
    const player = gameState.players[0];
    const hand = currentHand ?? player?.currentHand ?? null;
    const bet = hand?.bet ?? 0;
    const maxBet = Math.max(1, gameState.rules.maxBet);
    const shoeCards = gameState.deck.length + gameState.discardPile.length;
    const penetration = shoeCards > 0 ? gameState.discardPile.length / shoeCards : 0;
    if (!hand || gameState.phase === 'betting') {
        return {
            pressure: clampToPercent((bet / maxBet) * 35),
            intensity: clampToPercent(gameState.rules.houseEdgePercent * 35 + penetration * 65),
            focus: 0,
            progress: clampToPercent(penetration),
        };
    }
    const handValues = getHandValues(hand.cards);
    const handValue = handValues.soft || handValues.hard;
    const riskLoad = clamp01(handValue / 21);
    const wagerLoad = clamp01(bet / maxBet);
    const phaseLoad = gameState.phase === 'playing'
        ? 1
        : gameState.phase === 'dealing'
            ? 0.45
            : gameState.phase === 'settling'
                ? 0.55
                : 0.2;
    const pressure = clamp01(riskLoad * 0.5 + wagerLoad * 0.3 + phaseLoad * 0.2);
    const actionLoad = clamp01(availableActions.length / 4);
    const handComplexity = clamp01(hand.cards.length / 5);
    const softnessLoad = handValues.soft ? 1 : 0;
    const focus = clamp01(actionLoad * 0.45 + handComplexity * 0.35 + softnessLoad * 0.2);
    const houseLoad = clamp01(gameState.rules.houseEdgePercent / 1);
    const settleLoad = gameState.phase === 'settling' || gameState.phase === 'completed' ? 1 : 0.25;
    const intensity = clamp01(penetration * 0.45 + houseLoad * 0.3 + settleLoad * 0.25);
    return {
        pressure: clampToPercent(pressure),
        intensity: clampToPercent(intensity),
        focus: clampToPercent(focus),
        progress: clampToPercent(penetration),
    };
}
function clamp01(value) {
    return Math.min(1, Math.max(0, value));
}
function clampToPercent(value) {
    return Math.round(clamp01(value) * 100);
}
