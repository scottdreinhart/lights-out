#!/bin/bash
PARENT="/mnt/c/Users/scott"
NIM="$PARENT/nim"

for game in connect-four rock-paper-scissors minesweeper; do
  echo "=== $game: tsconfig.json ==="
  if [ -f "$PARENT/$game/tsconfig.json" ]; then
    diff "$PARENT/$game/tsconfig.json" "$NIM/tsconfig.json" || true
  else
    echo "MISSING"
  fi

  echo ""
  echo "=== $game: vite.config.js ==="
  if [ -f "$PARENT/$game/vite.config.js" ]; then
    diff "$PARENT/$game/vite.config.js" "$NIM/vite.config.js" || true
  else
    echo "MISSING"
  fi

  echo ""
  echo "=== $game: pnpm-workspace.yaml ==="
  if [ -f "$PARENT/$game/pnpm-workspace.yaml" ]; then
    diff "$PARENT/$game/pnpm-workspace.yaml" "$NIM/pnpm-workspace.yaml" || true
  else
    echo "MISSING"
  fi

  echo ""
  echo "=== $game: capacitor.config.ts ==="
  if [ -f "$PARENT/$game/capacitor.config.ts" ]; then
    diff "$PARENT/$game/capacitor.config.ts" "$NIM/capacitor.config.ts" || true
  else
    echo "MISSING"
  fi
  echo ""
  echo "---"
done

echo ""
echo "=== shut-the-box: vite.config.js ==="
if [ -f "$PARENT/shut-the-box/vite.config.js" ]; then
  diff "$PARENT/shut-the-box/vite.config.js" "$NIM/vite.config.js" || true
else
  echo "MISSING"
fi

echo ""
echo "=== tictactoe: barrel check ==="
for dir in domain app ui ui/atoms ui/molecules ui/organisms ui/utils; do
  if [ -f "$PARENT/tictactoe/src/$dir/index.ts" ]; then
    echo "  src/$dir/index.ts: EXISTS"
  elif [ -f "$PARENT/tictactoe/src/$dir/index.tsx" ]; then
    echo "  src/$dir/index.tsx: EXISTS"
  else
    echo "  src/$dir/index.ts: MISSING"
  fi
done
