import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useState } from 'react';
import styles from './App.module.css';
import { GameBoardAdapter } from './GameBoardAdapter';
import { GameLayout } from './GameLayout';
import { SplashScreen } from './SplashScreen';
/**
 * App Component - Main Blackjack Application
 *
 * Manages high-level app phases:
 * 1. splash - Welcome screen
 * 2. game - GameLayout (table selection and gameplay)
 * 3. help - Rules/how to play
 *
 * GameLayout handles:
 * - Table selection (Casual, Mid, High Roller)
 * - Banking and session management
 * - Game screens (table selection → playing → results)
 */
export function App() {
    const [appPhase, setAppPhase] = useState('splash');
    const playerId = 'player-' + Math.random().toString(36).substring(2, 9);
    // ─────────────────────────────────────────────────────────
    // Phase Handlers
    // ─────────────────────────────────────────────────────────
    const handleSplashComplete = useCallback(() => {
        setAppPhase('game');
    }, []);
    const handleHowToPlay = useCallback(() => {
        setAppPhase('help');
    }, []);
    const handleLetsPlay = useCallback(() => {
        setAppPhase('game');
    }, []);
    // ─────────────────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────────────────
    // Splash screen with welcome and rules
    if (appPhase === 'splash') {
        return _jsx(SplashScreen, { onPlayClick: handleSplashComplete, onHowToPlayClick: handleHowToPlay });
    }
    // Help/rules screen
    if (appPhase === 'help') {
        return (_jsx("div", { className: styles.helpScreen, children: _jsxs("div", { className: styles.helpContent, children: [_jsx("h1", { children: "How to Play Blackjack" }), _jsxs("section", { className: styles.rule, children: [_jsx("h2", { children: "Objective" }), _jsx("p", { children: "Get your hand value as close to 21 as possible without going over (busting)." })] }), _jsxs("section", { className: styles.rule, children: [_jsx("h2", { children: "Card Values" }), _jsxs("ul", { children: [_jsx("li", { children: "Number cards (2-10): Face value" }), _jsx("li", { children: "Face cards (J, Q, K): 10 points" }), _jsx("li", { children: "Ace (A): 1 or 11 points (whichever is better)" })] })] }), _jsxs("section", { className: styles.rule, children: [_jsx("h2", { children: "Game Flow" }), _jsxs("ol", { children: [_jsx("li", { children: "Select your table (Casual, Mid-Stakes, or High Roller)" }), _jsx("li", { children: "Place your bet using casino chips" }), _jsx("li", { children: "You and dealer each get 2 cards" }), _jsx("li", { children: "You decide to Hit, Stand, Double Down, Split, or Surrender" }), _jsx("li", { children: "Dealer plays automatically (hits until 17 or higher)" }), _jsx("li", { children: "Highest hand under 21 wins!" })] })] }), _jsxs("section", { className: styles.rule, children: [_jsx("h2", { children: "Special Hands" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("strong", { children: "Blackjack" }), " (21 with 2 cards): Wins 1.5\u00D7 your bet"] }), _jsxs("li", { children: [_jsx("strong", { children: "Bust" }), " (over 21): You lose immediately"] }), _jsxs("li", { children: [_jsx("strong", { children: "Push" }), " (same as dealer): Bet is returned"] })] })] }), _jsxs("section", { className: styles.rule, children: [_jsx("h2", { children: "Casino Tables" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("strong", { children: "Casual Table" }), " ($5-$1000): Perfect for learning"] }), _jsxs("li", { children: [_jsx("strong", { children: "Mid-Stakes Table" }), " ($25-$5000): Intermediate play"] }), _jsxs("li", { children: [_jsx("strong", { children: "High Roller Table" }), " ($100-$50000): Advanced players"] })] })] }), _jsx("button", { className: styles.backButton, onClick: handleLetsPlay, children: "Back to Game" })] }) }));
    }
    // Game layout with table selection and bankroll management
    return _jsx(GameLayout, { playerId: playerId, GameBoardComponent: GameBoardAdapter });
}
