import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { buildBlackjackSignalProfile, getHandValues } from '@/domain';
import { Hand as HandComponent } from '@/ui/molecules';
import { ActionPanel } from '@/ui/molecules/ActionPanel/ActionPanel';
import { BetControl } from '@/ui/molecules/BetControl/BetControl';
import { Status } from '@/ui/molecules/Status/Status';
import { ProgressMeters } from '@games/common';
import { useMemo } from 'react';
import styles from './GameBoard.module.css';
/**
 * GameBoard Organism
 *
 * Main game display component.
 * Renders the game table with dealer, player, betting, actions, and status.
 */
export function GameBoard({ gameState, phase, currentHand, currentPlayer, availableActions, onBet, onAction, onNewRound, onHelp, canUndo, canRedo, onUndo, onRedo, }) {
    const playerBalance = currentPlayer?.balance ?? 1000;
    const signalProfile = useMemo(() => buildBlackjackSignalProfile(gameState, currentHand, availableActions), [availableActions, currentHand, gameState]);
    return (_jsxs("div", { className: styles.board, children: [_jsxs("div", { className: styles.header, children: [_jsx("h1", { className: styles.title, children: "Blackjack" }), _jsxs("div", { className: styles.info, children: [_jsxs("div", { className: styles.balance, children: ["Balance: $", playerBalance] }), _jsx("button", { className: styles.helpButton, onClick: onHelp, children: "? Help" })] })] }), _jsxs("div", { className: styles.content, children: [phase === 'betting' && (_jsxs("div", { className: styles.bettingPhase, children: [_jsx("h2", { children: "Place Your Bet" }), _jsx(BetControl, { currentBet: currentHand?.bet ?? 10, minBet: 10, maxBet: Math.min(100, playerBalance), balance: playerBalance, onBet: onBet, disabled: false })] })), (phase === 'betting' ||
                        phase === 'dealing' ||
                        phase === 'playing' ||
                        phase === 'settling' ||
                        phase === 'completed') && (_jsxs("div", { className: `${styles.gameTable} ${styles[phase] || ''}`, children: [_jsxs("div", { className: styles.dealerSection, children: [_jsx("h3", { children: "Dealer" }), _jsx(HandComponent, { hand: gameState.dealer.hand, hideFirst: phase === 'playing', label: "Dealer", status: gameState.dealer.status, isDealing: phase === 'dealing', shouldFlipDealerCard: phase === 'settling' && gameState.dealer.hand.length > 1, value: phase !== 'playing'
                                            ? `Total: ${getHandValues(gameState.dealer.hand).soft || getHandValues(gameState.dealer.hand).hard}`
                                            : undefined })] }), _jsxs("div", { className: styles.playerSection, children: [_jsx("h3", { children: "Your Hand" }), currentHand ? (_jsxs(_Fragment, { children: [_jsx(HandComponent, { hand: currentHand, label: "Your Hand", status: currentHand.status, value: `Total: ${getHandValues(currentHand.cards).soft || getHandValues(currentHand.cards).hard}`, isDealing: phase === 'dealing' }), phase === 'playing' && (_jsx(ActionPanel, { availableActions: availableActions, onAction: onAction, disabled: false, layout: "row", className: `${styles.actionPanel} ${styles.actionPanelVisible}`, canUndo: canUndo, canRedo: canRedo, onUndo: onUndo, onRedo: onRedo })), _jsx(Status, { phase: phase, playerStatus: currentHand.status, dealerStatus: gameState.dealer.status, result: currentPlayer?.result, className: `${styles.status} ${styles.statusPulse}` }), phase === 'completed' && (_jsx("button", { className: `${styles.newRoundButton} ${styles.newRoundButtonBounce}`, onClick: onNewRound, children: "New Round" }))] })) : (_jsx("div", { className: styles.emptyHand, children: "Waiting for bet..." }))] })] })), (phase === 'betting' ||
                        phase === 'dealing' ||
                        phase === 'playing' ||
                        phase === 'settling' ||
                        phase === 'completed') && (_jsxs("div", { className: styles.signalPanel, children: [_jsx("div", { className: styles.signalHeader, children: "Signal Profile" }), _jsx(ProgressMeters, { intensity: signalProfile.intensity, focus: signalProfile.focus, progress: signalProfile.progress, styles: styles }), _jsxs("div", { className: styles.pressureRow, children: [_jsx("span", { className: styles.pressureLabel, children: "Pressure" }), _jsxs("span", { className: styles.pressureValue, children: [signalProfile.pressure, "%"] })] })] })), (phase === 'betting' ||
                        phase === 'dealing' ||
                        phase === 'playing' ||
                        phase === 'settling' ||
                        phase === 'completed') && (_jsxs("div", { className: styles.cardTracking, children: [_jsxs("div", { className: styles.shoeInfo, children: [_jsx("h4", { children: "Shoe" }), _jsxs("div", { className: styles.deckStats, children: [_jsxs("div", { className: styles.stat, children: [_jsx("span", { className: styles.label, children: "Cards:" }), _jsx("span", { className: styles.value, children: gameState.deck.length })] }), _jsxs("div", { className: styles.stat, children: [_jsx("span", { className: styles.label, children: "Decks:" }), _jsx("span", { className: styles.value, children: (gameState.deck.length / 52).toFixed(1) })] })] })] }), _jsxs("div", { className: styles.discardInfo, children: [_jsx("h4", { children: "Discard Pile" }), _jsxs("div", { className: styles.discardStats, children: [_jsxs("div", { className: styles.stat, children: [_jsx("span", { className: styles.label, children: "Cards:" }), _jsx("span", { className: styles.value, children: gameState.discardPile.length })] }), _jsxs("div", { className: styles.stat, children: [_jsx("span", { className: styles.label, children: "Burned:" }), _jsxs("span", { className: styles.value, children: [((gameState.discardPile.length /
                                                                (gameState.discardPile.length + gameState.deck.length)) *
                                                                100).toFixed(1), "%"] })] })] })] })] }))] })] }));
}
