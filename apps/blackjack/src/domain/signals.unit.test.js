import { describe, expect, it } from 'vitest';
import { buildBlackjackSignalProfile, createGameState } from './index';
function makeCard(rank, suit = 'hearts') {
    return {
        id: `${rank}-${suit}`,
        rank,
        suit,
    };
}
function makeHand(cards, bet = 50) {
    return {
        id: 'hand-1',
        cards,
        bet,
        status: 'playing',
    };
}
function makeState(overrides = {}) {
    const state = createGameState(1000);
    return {
        ...state,
        phase: 'playing',
        players: [
            {
                ...state.players[0],
                currentHand: makeHand([makeCard('10'), makeCard('6')]),
            },
        ],
        ...overrides,
    };
}
describe('buildBlackjackSignalProfile', () => {
    it('starts with low focus before a hand is in play', () => {
        const signals = buildBlackjackSignalProfile(createGameState(1000), null, []);
        expect(signals.focus).toBe(0);
        expect(signals.progress).toBe(0);
    });
    it('raises pressure as the hand gets closer to bust', () => {
        const calm = buildBlackjackSignalProfile(makeState({
            players: [
                {
                    ...createGameState(1000).players[0],
                    currentHand: makeHand([makeCard('4'), makeCard('5')]),
                },
            ],
        }), null, ['hit', 'stand']);
        const tense = buildBlackjackSignalProfile(makeState({
            players: [
                {
                    ...createGameState(1000).players[0],
                    currentHand: makeHand([makeCard('10'), makeCard('9')]),
                },
            ],
        }), null, ['hit', 'stand']);
        expect(tense.pressure).toBeGreaterThan(calm.pressure);
    });
    it('raises focus when more strategic actions are available', () => {
        const lowOptions = buildBlackjackSignalProfile(makeState({
            players: [
                {
                    ...createGameState(1000).players[0],
                    currentHand: makeHand([makeCard('10'), makeCard('8')]),
                },
            ],
        }), null, ['stand']);
        const highOptions = buildBlackjackSignalProfile(makeState({
            players: [
                {
                    ...createGameState(1000).players[0],
                    currentHand: makeHand([makeCard('8'), makeCard('8')]),
                },
            ],
        }), null, ['hit', 'stand', 'double', 'split']);
        expect(highOptions.focus).toBeGreaterThan(lowOptions.focus);
    });
    it('tracks progress with shoe penetration', () => {
        const early = buildBlackjackSignalProfile(makeState(), null, ['hit', 'stand']);
        const late = buildBlackjackSignalProfile(makeState({
            discardPile: Array.from({ length: 120 }, (_, index) => makeCard('2', index % 2 ? 'clubs' : 'spades')),
        }), null, ['hit', 'stand']);
        expect(late.progress).toBeGreaterThan(early.progress);
    });
});
