import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './FeatureShell.module.css';
import { HamburgerMenu } from './HamburgerMenu';

const createHeaderActions = (onOpenRules, onOpenSettings, onOpenAbout) => [
    { label: 'How to Play', onSelect: onOpenRules },
    { label: 'Settings', onSelect: onOpenSettings },
    { label: 'About', onSelect: onOpenAbout },
];

export function AppHeader({ title, onOpenRules, onOpenSettings, onOpenAbout }) {
    const actions = createHeaderActions(onOpenRules, onOpenSettings, onOpenAbout);
    return (_jsxs("header", { className: styles.header, children: [_jsx("h1", { className: styles.title, children: title }), _jsx(HamburgerMenu, { actions: actions })] }));
}
