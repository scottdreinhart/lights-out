import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { AboutModal } from './AboutModal';
import { AppHeader } from './AppHeader';
import styles from './FeatureShell.module.css';
import { RulesModal } from './RulesModal';
import { SettingsModal } from './SettingsModal';
export function FeatureShell({ title, children }) {
    const [showRules, setShowRules] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showAbout, setShowAbout] = useState(false);
    return (_jsxs("div", { className: styles.shell, "data-theme": "platform-default", children: [_jsx(AppHeader, { title: title, onOpenRules: () => setShowRules(true), onOpenSettings: () => setShowSettings(true), onOpenAbout: () => setShowAbout(true) }), _jsx("main", { className: styles.content, children: children }), _jsx(RulesModal, { isOpen: showRules, onClose: () => setShowRules(false) }), _jsx(SettingsModal, { isOpen: showSettings, onClose: () => setShowSettings(false) }), _jsx(AboutModal, { isOpen: showAbout, onClose: () => setShowAbout(false), gameName: title })] }));
}
