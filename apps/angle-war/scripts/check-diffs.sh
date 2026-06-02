#!/bin/bash
# Check Configuration Diffs
#
# Compares configuration files (tsconfig.json, vite.config.js, etc.) 
# with reference implementation to identify divergences.
#
# Usage: bash scripts/check-diffs.sh
#
# Compares:
# - tsconfig.json
# - vite.config.js
# - pnpm-workspace.yaml
# - capacitor.config.ts

# ANSI color codes (standardized per SCRIPT-STANDARDS.md)
readonly CYAN='\033[96m'
readonly GREEN='\033[92m'
readonly RED='\033[91m'
readonly YELLOW='\033[93m'
readonly BLUE='\033[94m'
readonly RESET='\033[0m'
readonly BOLD='\033[1m'

PARENT="/mnt/c/Users/scott"
NIM="$PARENT/nim"

echo -e "${BLUE}${BOLD}Configuration Diff Checker${RESET}"
echo -e "${CYAN}═════════════════════════════════════${RESET}"
echo ""

for game in connect-four rock-paper-scissors minesweeper; do
  echo -e "${CYAN}🔍 Checking: $game${RESET}"
  
  echo -e "${CYAN}├─ tsconfig.json${RESET}"
  if [ -f "$PARENT/$game/tsconfig.json" ]; then
    if diff "$PARENT/$game/tsconfig.json" "$NIM/tsconfig.json" > /dev/null 2>&1; then
      echo -e "${GREEN}│  ✅ Match${RESET}"
    else
      echo -e "${YELLOW}│  ⚠️  Differences found:${RESET}"
      diff "$PARENT/$game/tsconfig.json" "$NIM/tsconfig.json" || true
    fi
  else
    echo -e "${RED}│  ❌ MISSING${RESET}"
  fi

  echo -e "${CYAN}├─ vite.config.js${RESET}"
  if [ -f "$PARENT/$game/vite.config.js" ]; then
    if diff "$PARENT/$game/vite.config.js" "$NIM/vite.config.js" > /dev/null 2>&1; then
      echo -e "${GREEN}│  ✅ Match${RESET}"
    else
      echo -e "${YELLOW}│  ⚠️  Differences found:${RESET}"
      diff "$PARENT/$game/vite.config.js" "$NIM/vite.config.js" || true
    fi
  else
    echo -e "${RED}│  ❌ MISSING${RESET}"
  fi

  echo -e "${CYAN}├─ pnpm-workspace.yaml${RESET}"
  if [ -f "$PARENT/$game/pnpm-workspace.yaml" ]; then
    if diff "$PARENT/$game/pnpm-workspace.yaml" "$NIM/pnpm-workspace.yaml" > /dev/null 2>&1; then
      echo -e "${GREEN}│  ✅ Match${RESET}"
    else
      echo -e "${YELLOW}│  ⚠️  Differences found:${RESET}"
      diff "$PARENT/$game/pnpm-workspace.yaml" "$NIM/pnpm-workspace.yaml" || true
    fi
  else
    echo -e "${RED}│  ❌ MISSING${RESET}"
  fi

  echo -e "${CYAN}└─ capacitor.config.ts${RESET}"
  if [ -f "$PARENT/$game/capacitor.config.ts" ]; then
    if diff "$PARENT/$game/capacitor.config.ts" "$NIM/capacitor.config.ts" > /dev/null 2>&1; then
      echo -e "${GREEN}   ✅ Match${RESET}"
    else
      echo -e "${YELLOW}   ⚠️  Differences found:${RESET}"
      diff "$PARENT/$game/capacitor.config.ts" "$NIM/capacitor.config.ts" || true
    fi
  else
    echo -e "${RED}   ❌ MISSING${RESET}"
  fi
  echo ""
done

echo -e "${BLUE}${BOLD}Diff check complete${RESET}"
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
