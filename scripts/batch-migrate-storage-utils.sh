#!/bin/bash
# Phase 2 Part 2: Batch Migrate storageService to @games/storage-utils
# Applies to 24 simple apps (not nim)

set -e

SIMPLE_APPS=(
  "battleship"
  "bunco"
  "cee-lo"
  "checkers"
  "chicago"
  "cho-han"
  "connect-four"
  "farkle"
  "hangman"
  "liars-dice"
  "lights-out"
  "mancala"
  "memory-game"
  "mexico"
  "minesweeper"
  "monchola"
  "pig"
  "reversi"
  "rock-paper-scissors"
  "ship-captain-crew"
  "shut-the-box"
  "simon-says"
  "snake"
  "tictactoe"
)

echo "=== Phase 2 Part 2: Batch Migrate storageService ==="
echo ""
echo "Target: ${#SIMPLE_APPS[@]} apps"
echo ""

MIGRATION_TEMPLATE='/**
 * Storage Service — Persistent state via localStorage
 * 
 * Re-exports generic utilities from @games/storage-utils for consistency.
 * Provides: load, save, remove — all with error handling and type safety.
 */

// Re-export shared utilities with familiar names
export { loadWithFallback as load, loadNullable } from '"'"'@games/storage-utils'"'"'
export { saveJson as save, removeKey as remove } from '"'"'@games/storage-utils'"'"'
'

for app in "${SIMPLE_APPS[@]}"; do
  STORAGE_FILE="apps/$app/src/app/storageService.ts"
  
  if [ -f "$STORAGE_FILE" ]; then
    echo "Migrating: $app"
    
    # Backup original (just in case)
    cp "$STORAGE_FILE" "$STORAGE_FILE.backup"
    
    # Write new version
    echo "$MIGRATION_TEMPLATE" > "$STORAGE_FILE"
    
    # Verify file was written
    if [ -f "$STORAGE_FILE" ]; then
      lines=$(wc -l < "$STORAGE_FILE")
      echo "  ✅ Created $lines-line re-export version"
    fi
  else
    echo "  ⚠️  NOT FOUND: $STORAGE_FILE (skipping)"
  fi
done

echo ""
echo "=== Migration Template Applied to All Simple Apps ==="
echo ""
echo "Next: Run global typecheck and lint to verify"
echo "  $ cd /path/to/game-platform"
echo "  $ pnpm typecheck"
echo "  $ pnpm lint"
