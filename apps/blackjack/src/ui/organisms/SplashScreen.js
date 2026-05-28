import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SplashScreen as SharedSplashScreen } from '@games/common';
import styles from './SplashScreen.module.css';
/**
 * Shared splash wrapper with blackjack-specific visual/rules content.
 */
export function SplashScreen({ onPlayClick, onHowToPlayClick }) {
    return (_jsx(SharedSplashScreen, { onComplete: onPlayClick, onHowToPlay: onHowToPlayClick, onLetsPlay: onPlayClick, title: "BLACKJACK", className: styles.blackjackSplash, children: _jsxs("div", { className: styles.container, children: [_jsxs("div", { className: styles.logoSection, children: [_jsx("div", { className: styles.logo, children: "\u2660\uFE0F \u2665\uFE0F" }), _jsx("p", { className: styles.tagline, children: "Beat the Dealer" })] }), _jsxs("div", { className: styles.rulesSection, children: [_jsx("h2", { children: "Quick Rules" }), _jsxs("ul", { className: styles.rulesList, children: [_jsx("li", { children: "Get closer to 21 than the dealer" }), _jsx("li", { children: "Face cards are worth 10" }), _jsx("li", { children: "Ace counts as 1 or 11" }), _jsx("li", { children: "Dealer hits on 16, stands on 17+" })] })] }), _jsx("div", { className: styles.footer, children: _jsx("p", { children: "Good luck! \uD83C\uDF40" }) })] }) }));
}
