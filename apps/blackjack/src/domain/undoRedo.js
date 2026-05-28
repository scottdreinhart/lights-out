/**
 * Undo/Redo System - Domain Logic
 *
 * Pure functions for managing game state history and undo/redo operations.
 * Framework-agnostic; operates on domain types only.
 */
/**
 * Creates an initial undo/redo state with the given game state
 */
export function createUndoRedoState(initialState) {
    return {
        past: [],
        present: initialState,
        future: [],
        canUndo: false,
        canRedo: false,
    };
}
/**
 * Creates a snapshot of the current game state
 */
export function createSnapshot(gameState, action) {
    return {
        gameState: { ...gameState }, // Shallow copy for immutability
        timestamp: new Date(),
        action,
    };
}
/**
 * Records a new state in the undo/redo history
 * Called after each game action to enable undo functionality
 */
export function recordState(undoRedoState, newGameState, action) {
    const snapshot = createSnapshot(undoRedoState.present, action);
    return {
        past: [...undoRedoState.past, snapshot],
        present: newGameState,
        future: [], // Clear future when new action is taken
        canUndo: true,
        canRedo: false,
    };
}
/**
 * Undoes the last action, restoring the previous game state
 */
export function undo(undoRedoState) {
    if (!undoRedoState.canUndo || undoRedoState.past.length === 0) {
        return undoRedoState;
    }
    const previousSnapshot = undoRedoState.past[undoRedoState.past.length - 1];
    const newPast = undoRedoState.past.slice(0, -1);
    return {
        past: newPast,
        present: previousSnapshot.gameState,
        future: [createSnapshot(undoRedoState.present), ...undoRedoState.future],
        canUndo: newPast.length > 0,
        canRedo: true,
    };
}
/**
 * Redoes the last undone action, restoring the next game state
 */
export function redo(undoRedoState) {
    if (!undoRedoState.canRedo || undoRedoState.future.length === 0) {
        return undoRedoState;
    }
    const nextSnapshot = undoRedoState.future[0];
    const newFuture = undoRedoState.future.slice(1);
    return {
        past: [...undoRedoState.past, createSnapshot(undoRedoState.present)],
        present: nextSnapshot.gameState,
        future: newFuture,
        canUndo: true,
        canRedo: newFuture.length > 0,
    };
}
/**
 * Checks if undo is available for the current game phase
 * Undo should only be available during active gameplay (not betting, settling, or completed)
 */
export function canUndoInPhase(gamePhase) {
    return gamePhase === 'playing';
}
/**
 * Checks if redo is available for the current game phase
 * Redo should only be available during active gameplay
 */
export function canRedoInPhase(gamePhase) {
    return gamePhase === 'playing';
}
