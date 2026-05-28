import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import styles from './HamburgerMenu.module.css';
export function HamburgerMenu({ actions, ariaLabel = 'Open menu' }) {
    const [open, setOpen] = useState(false);
    const validActions = useMemo(() => actions.filter((a) => a.label.trim().length > 0), [actions]);
    return (_jsxs("div", { className: styles.root, children: [_jsxs("button", { type: "button", className: styles.button, "aria-haspopup": "menu", "aria-expanded": open, "aria-label": open ? 'Close menu' : ariaLabel, onClick: () => setOpen((prev) => !prev), children: [_jsx("span", { className: styles.line }), _jsx("span", { className: styles.line }), _jsx("span", { className: styles.line })] }), open ? (_jsx("div", { className: styles.panel, role: "menu", "aria-label": "Game menu", children: validActions.map((action) => (_jsx("button", { type: "button", role: "menuitem", className: styles.item, onClick: () => {
                        action.onSelect();
                        setOpen(false);
                    }, children: action.label }, action.label))) })) : null] }));
}
