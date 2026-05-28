import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef } from 'react';
import styles from './Modal.module.css';
export function RulesModal({ isOpen, onClose }) {
    const dialogRef = useRef(null);
    const prevFocus = useRef(null);
    useEffect(() => {
        if (isOpen) {
            prevFocus.current = document.activeElement;
            dialogRef.current?.showModal();
        }
        else {
            dialogRef.current?.close();
            prevFocus.current?.focus();
        }
    }, [isOpen]);
    const handleClose = useCallback(() => onClose(), [onClose]);
    const handleBackdropClick = useCallback((e) => {
        if (e.target === dialogRef.current)
            handleClose();
    }, [handleClose]);
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape')
            handleClose();
    }, [handleClose]);
    return (_jsx("dialog", { ref: dialogRef, className: styles.backdrop, onClick: handleBackdropClick, onKeyDown: handleKeyDown, "aria-label": "How to play", children: _jsxs("section", { className: styles.modal, role: "document", children: [_jsx("h2", { className: styles.title, children: "How to Play" }), _jsx("div", { className: styles.section, children: _jsxs("ol", { children: [_jsx("li", { children: "Read this game's specific objective." }), _jsx("li", { children: "Use keyboard, touch, or gamepad controls." }), _jsx("li", { children: "Complete the win condition before the opponent or timer." })] }) }), _jsx("div", { className: styles.actions, children: _jsx("button", { type: "button", className: styles.button, onClick: handleClose, children: "Close" }) })] }) }));
}
export function RulesModal({ isOpen, onClose }) {
    if (!isOpen) {
        return null;
    }
    return (_jsx("div", { className: styles.backdrop, children: _jsxs("section", { className: styles.modal, role: "dialog", "aria-modal": "true", "aria-label": "How to play", children: [_jsx("h2", { className: styles.title, children: "How to Play" }), _jsx("div", { className: styles.section, children: _jsxs("ol", { children: [_jsx("li", { children: "Read this game\u2019s specific objective." }), _jsx("li", { children: "Use keyboard, touch, or gamepad controls." }), _jsx("li", { children: "Complete the win condition before the opponent or timer." })] }) }), _jsx("div", { className: styles.actions, children: _jsx("button", { type: "button", className: styles.button, onClick: onClose, children: "Close" }) })] }) }));
}
