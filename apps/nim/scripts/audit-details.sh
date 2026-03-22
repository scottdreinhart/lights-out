#!/bin/bash
# Detailed diff check for structurally important config files
BASE="/mnt/c/Users/scott"
REF="$BASE/nim"

echo "=== capacitor.config.ts — expected to differ per game (appId/appName) ==="
echo "Checking if structure is consistent (ignoring appId/appName)..."
echo ""

for game in tictactoe shut-the-box mancala connect-four simon-says lights-out hangman memory-game 2048 reversi checkers battleship snake monchola rock-paper-scissors minesweeper; do
  if [ -f "$BASE/$game/capacitor.config.ts" ]; then
    # Check line count matches
    REF_LINES=$(wc -l < "$REF/capacitor.config.ts")
    GAME_LINES=$(wc -l < "$BASE/$game/capacitor.config.ts")
    if [ "$REF_LINES" != "$GAME_LINES" ]; then
      echo "STRUCT_DIFF $game: $GAME_LINES lines vs nim's $REF_LINES lines"
    fi
  fi
done

echo ""
echo "=== tictactoe: barrel index files check ==="
echo "Checking what tictactoe uses instead of barrel index.ts files..."
for d in src/domain src/app src/ui src/ui/atoms src/ui/molecules src/ui/organisms src/ui/utils; do
  if [ -d "$BASE/tictactoe/$d" ]; then
    echo "  $d/: $(ls $BASE/tictactoe/$d/ 2>/dev/null)"
  else
    echo "  $d/: MISSING DIR"
  fi
done

echo ""
echo "=== tictactoe vs nim: tsconfig.json diff ==="
diff "$REF/tsconfig.json" "$BASE/tictactoe/tsconfig.json" 2>/dev/null || echo "(no file)"

echo ""
echo "=== tictactoe vs nim: vite.config.js diff ==="
diff "$REF/vite.config.js" "$BASE/tictactoe/vite.config.js" 2>/dev/null || echo "(no file)"

echo ""
echo "=== shut-the-box vs nim: tsconfig.json diff ==="
diff "$REF/tsconfig.json" "$BASE/shut-the-box/tsconfig.json" 2>/dev/null || echo "(no file)"

echo ""
echo "=== shut-the-box vs nim: vite.config.js diff ==="
diff "$REF/vite.config.js" "$BASE/shut-the-box/vite.config.js" 2>/dev/null || echo "(no file)"

echo ""
echo "=== connect-four vs nim: tsconfig.json diff ==="
diff "$REF/tsconfig.json" "$BASE/connect-four/tsconfig.json" 2>/dev/null || echo "(no file)"

echo ""
echo "=== connect-four vs nim: vite.config.js diff ==="
diff "$REF/vite.config.js" "$BASE/connect-four/vite.config.js" 2>/dev/null || echo "(no file)"

echo ""
echo "=== rock-paper-scissors vs nim: vite.config.js diff ==="
diff "$REF/vite.config.js" "$BASE/rock-paper-scissors/vite.config.js" 2>/dev/null || echo "(no file)"

echo ""
echo "=== minesweeper vs nim: pnpm-workspace.yaml diff ==="
diff "$REF/pnpm-workspace.yaml" "$BASE/minesweeper/pnpm-workspace.yaml" 2>/dev/null || echo "(no file)"

echo ""
echo "=== DONE ==="
