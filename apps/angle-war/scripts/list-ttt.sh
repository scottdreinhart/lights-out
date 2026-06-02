#!/bin/bash
# List TTT Source Structure
#
# Displays file structure for TTT reference implementation to ensure consistency
# with game app structures.
#
# Usage: bash scripts/list-ttt.sh

# ANSI color codes (standardized per SCRIPT-STANDARDS.md)
readonly CYAN='\033[96m'
readonly GREEN='\033[92m'
readonly BLUE='\033[94m'
readonly RESET='\033[0m'
readonly BOLD='\033[1m'

BASE="/mnt/c/Users/scott/tictactoe/src"

echo -e "${BLUE}${BOLD}TTT Source Structure${RESET}"
echo -e "${CYAN}═══════════════════════════════════${RESET}"
echo ""

for dir in domain app ui ui/atoms ui/molecules ui/organisms ui/utils; do
  echo -e "${CYAN}📁 $dir${RESET}"
  if [ -d "$BASE/$dir" ]; then
    ls "$BASE/$dir/" 2>/dev/null | grep -E '\.(ts|tsx)$' | grep -v '\.test\.' | grep -v '\.module\.' | sort | sed 's/^/   /'
  else
    echo "   (not found)"
  fi
done

echo ""
echo -e "${GREEN}✅ Directory listing complete${RESET}"
