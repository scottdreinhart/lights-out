#!/bin/bash
# Audit all game repos for proper scaffolding
# Checks: existence, key config files, src structure, package.json identity

GAMES=(
  tictactoe shut-the-box mancala connect-four simon-says lights-out nim
  hangman memory-game 2048 reversi checkers battleship snake monchola
  rock-paper-scissors minesweeper pig farkle cee-lo ship-captain-crew
  liars-dice bunco mexico cho-han chicago
)

BASE="/mnt/c/Users/scott"

REQUIRED_FILES=(
  "package.json"
  "tsconfig.json"
  "vite.config.js"
  "eslint.config.js"
  "index.html"
  "AGENTS.md"
  "LICENSE"
  "capacitor.config.ts"
  "pnpm-workspace.yaml"
  ".gitignore"
  ".prettierrc"
  ".npmrc"
  ".nvmrc"
  ".env.nocache"
  ".gitattributes"
)

REQUIRED_DIRS=(
  "src"
  "src/domain"
  "src/app"
  "src/ui"
  "src/ui/atoms"
  "src/ui/molecules"
  "src/ui/organisms"
  "src/ui/utils"
  "src/themes"
  "src/wasm"
  "src/workers"
  "assembly"
  "electron"
  "public"
  "scripts"
)

REQUIRED_SRC_FILES=(
  "src/index.tsx"
  "src/styles.css"
  "src/vite-env.d.ts"
  "src/domain/index.ts"
  "src/app/index.ts"
  "src/ui/index.ts"
  "src/ui/atoms/index.ts"
  "src/ui/atoms/ErrorBoundary.tsx"
  "src/ui/molecules/index.ts"
  "src/ui/organisms/index.ts"
  "src/ui/organisms/App.tsx"
  "src/ui/utils/index.ts"
  "src/ui/utils/cssModules.ts"
  "src/ui/ui-constants.ts"
  "src/app/haptics.ts"
  "src/app/sounds.ts"
  "src/app/storageService.ts"
  "src/app/ThemeContext.tsx"
  "src/app/SoundContext.tsx"
  "src/app/useTheme.ts"
  "src/app/useSoundEffects.ts"
  "src/wasm/ai-wasm.ts"
  "src/workers/ai.worker.ts"
)

echo "============================="
echo "  GAME PORTFOLIO AUDIT"
echo "============================="
echo ""

TOTAL=0
PASS=0
FAIL=0
MISSING_REPOS=()

for game in "${GAMES[@]}"; do
  TOTAL=$((TOTAL + 1))
  DIR="$BASE/$game"
  ISSUES=()

  if [ ! -d "$DIR" ]; then
    MISSING_REPOS+=("$game")
    FAIL=$((FAIL + 1))
    echo "FAIL  $game — directory does not exist at $DIR"
    continue
  fi

  # Check required config files
  for f in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$DIR/$f" ]; then
      ISSUES+=("missing config: $f")
    fi
  done

  # Check required directories
  for d in "${REQUIRED_DIRS[@]}"; do
    if [ ! -d "$DIR/$d" ]; then
      ISSUES+=("missing dir: $d/")
    fi
  done

  # Check required source files
  for sf in "${REQUIRED_SRC_FILES[@]}"; do
    if [ ! -f "$DIR/$sf" ]; then
      ISSUES+=("missing src: $sf")
    fi
  done

  # Check package.json has a name field
  if [ -f "$DIR/package.json" ]; then
    PKG_NAME=$(grep -o '"name"[[:space:]]*:[[:space:]]*"[^"]*"' "$DIR/package.json" | head -1 | sed 's/.*: *"//;s/"//')
    if [ -z "$PKG_NAME" ]; then
      ISSUES+=("package.json missing name field")
    fi
  fi

  # Check git initialized
  if [ ! -d "$DIR/.git" ]; then
    ISSUES+=("no .git directory (not initialized)")
  fi

  # Check git remote
  if [ -d "$DIR/.git" ]; then
    REMOTE=$(cd "$DIR" && git remote get-url origin 2>/dev/null)
    if [ -z "$REMOTE" ]; then
      ISSUES+=("no git remote 'origin' configured")
    fi
  fi

  if [ ${#ISSUES[@]} -eq 0 ]; then
    PASS=$((PASS + 1))
    echo "OK    $game"
  else
    FAIL=$((FAIL + 1))
    echo "FAIL  $game"
    for issue in "${ISSUES[@]}"; do
      echo "        - $issue"
    done
  fi
done

echo ""
echo "============================="
echo "  SUMMARY"
echo "============================="
echo "Total repos checked: $TOTAL"
echo "Passed: $PASS"
echo "Failed: $FAIL"

if [ ${#MISSING_REPOS[@]} -gt 0 ]; then
  echo ""
  echo "Missing repos (no directory):"
  for r in "${MISSING_REPOS[@]}"; do
    echo "  - $r"
  done
fi

echo ""
echo "============================="
echo "  CONFIG CONSISTENCY CHECK"
echo "============================="

# Compare key config files against nim (reference)
REF="$BASE/nim"
CONFIG_FILES=("tsconfig.json" "vite.config.js" "eslint.config.js" ".prettierrc" ".npmrc" ".nvmrc" "capacitor.config.ts" "pnpm-workspace.yaml" ".gitattributes")

for game in "${GAMES[@]}"; do
  if [ "$game" = "nim" ]; then continue; fi
  DIR="$BASE/$game"
  if [ ! -d "$DIR" ]; then continue; fi

  DIFFS=()
  for cf in "${CONFIG_FILES[@]}"; do
    if [ -f "$REF/$cf" ] && [ -f "$DIR/$cf" ]; then
      if ! diff -q "$REF/$cf" "$DIR/$cf" > /dev/null 2>&1; then
        DIFFS+=("$cf differs from nim reference")
      fi
    fi
  done

  if [ ${#DIFFS[@]} -eq 0 ]; then
    echo "MATCH $game"
  else
    echo "DIFF  $game"
    for d in "${DIFFS[@]}"; do
      echo "        - $d"
    done
  fi
done

echo ""
echo "=== AUDIT COMPLETE ==="
