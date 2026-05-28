import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import styles from './ActionPanel.module.css';
const ACTION_LABELS = {
    hit: 'Hit',
    stand: 'Stand',
    double: 'Double Down',
    split: 'Split',
    surrender: 'Surrender',
    insurance: 'Insurance',
};
const ACTION_DESCRIPTIONS = {
    hit: 'Request another card',
    stand: 'Keep current hand',
    double: 'Double bet and take one card',
    split: 'Split pair into two hands',
    surrender: 'Give up half the bet',
    insurance: 'Insurance against dealer blackjack',
};
const UNDO_REDO_LABELS = {
    undo: 'Undo',
    redo: 'Redo',
};
const UNDO_REDO_DESCRIPTIONS = {
    undo: 'Undo the last action',
    redo: 'Redo the undone action',
};
/**
 * ActionPanel Molecule — Game action buttons
 *
 * Displays available player actions (Hit, Stand, Double Down, Split, Surrender).
 * Automatically disables unavailable actions.
 */
export const ActionPanel = React.memo(({ availableActions, onAction, disabled = false, layout = 'row', className = '', canUndo = false, canRedo = false, onUndo, onRedo, }) => {
    const allActions = ['hit', 'stand', 'double', 'split', 'surrender', 'insurance'];
    const handleActionClick = (action) => {
        if (!disabled && availableActions.includes(action)) {
            onAction(action);
        }
    };
    const handleUndoClick = () => {
        if (!disabled && canUndo && onUndo) {
            onUndo();
        }
    };
    const handleRedoClick = () => {
        if (!disabled && canRedo && onRedo) {
            onRedo();
        }
    };
    const handleActionKeyDown = (e, action) => {
        if ((e.code === 'Space' || e.code === 'Enter') &&
            !disabled &&
            availableActions.includes(action)) {
            e.preventDefault();
            onAction(action);
        }
    };
    const handleUndoRedoKeyDown = (e, action) => {
        if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault();
            if (action === 'undo' && canUndo && onUndo) {
                onUndo();
            }
            else if (action === 'redo' && canRedo && onRedo) {
                onRedo();
            }
        }
    };
    return (_jsxs("div", { className: `${styles.root} ${styles[layout]} ${className}`, "aria-label": "Player actions", "aria-disabled": disabled, children: [allActions.map((action) => {
                const isAvailable = availableActions.includes(action);
                return (_jsx("button", { className: `${styles.button} ${isAvailable ? styles.available : styles.unavailable}`, onClick: () => handleActionClick(action), onKeyDown: (e) => handleActionKeyDown(e, action), disabled: !isAvailable || disabled, title: ACTION_DESCRIPTIONS[action], "aria-label": ACTION_LABELS[action], "aria-disabled": !isAvailable || disabled, children: ACTION_LABELS[action] }, action));
            }), canUndo && (_jsx("button", { className: `${styles.button} ${styles.undoRedo}`, onClick: handleUndoClick, onKeyDown: (e) => handleUndoRedoKeyDown(e, 'undo'), disabled: disabled, title: UNDO_REDO_DESCRIPTIONS.undo, "aria-label": UNDO_REDO_LABELS.undo, "aria-disabled": disabled, children: UNDO_REDO_LABELS.undo })), canRedo && (_jsx("button", { className: `${styles.button} ${styles.undoRedo}`, onClick: handleRedoClick, onKeyDown: (e) => handleUndoRedoKeyDown(e, 'redo'), disabled: disabled, title: UNDO_REDO_DESCRIPTIONS.redo, "aria-label": UNDO_REDO_LABELS.redo, "aria-disabled": disabled, children: UNDO_REDO_LABELS.redo }))] }));
});
ActionPanel.displayName = 'ActionPanel';
