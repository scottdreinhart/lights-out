#!/bin/bash

# Game Platform - Browser Testing Script
# Tests each game app by building and running in dev mode

set -e

COLOR_RESET='\033[0m'
COLOR_GREEN='\033[0;32m'
COLOR_RED='\033[0;31m'
COLOR_YELLOW='\033[1;33m'
COLOR_BLUE='\033[0;34m'

cd /mnt/c/Users/scott/game-platform

echo -e "${COLOR_BLUE}🎮 Game Platform Browser Testing Script${COLOR_RESET}"
echo "==========================================="
echo ""

# Function to test a single app
test_app() {
  local app_name=$1
  local app_phase=$2
  
  echo -e "${COLOR_YELLOW}Testing: ${app_name}${COLOR_RESET}"
  echo "Phase: $app_phase"
  echo "-----------"
  
  # Try to build
  echo "📦 Building..."
  if timeout 90 pnpm --filter @games/$app_name build > /tmp/$app_name-build.log 2>&1; then
    echo -e "${COLOR_GREEN}✅ Build successful${COLOR_RESET}"
    
    # Show dev command
    echo ""
    echo -e "${COLOR_BLUE}📱 To test in browser, run:${COLOR_RESET}"
    echo -e "  ${COLOR_YELLOW}pnpm --filter @games/$app_name dev${COLOR_RESET}"
    echo ""
    echo "  Then open: ${COLOR_BLUE}http://localhost:5173${COLOR_RESET}"
    echo ""
  else
    echo -e "${COLOR_RED}❌ Build failed${COLOR_RESET}"
    echo "  Check: /tmp/$app_name-build.log"
    echo ""
  fi
}

# Phase 1: Verified Passing Apps
echo -e "${COLOR_GREEN}═══════════════════════════════════════${COLOR_RESET}"
echo -e "${COLOR_GREEN}PHASE 1: Verified Passing Apps (5)${COLOR_RESET}"
echo -e "${COLOR_GREEN}═══════════════════════════════════════${COLOR_RESET}"
echo ""

PHASE1_APPS=("checkers" "connect-four" "monchola" "reversi" "tictactoe")
for app in "${PHASE1_APPS[@]}"; do
  test_app "$app" "Phase 1"
done

echo ""
echo -e "${COLOR_BLUE}📊 Summary${COLOR_RESET}"
echo "==========================================="
echo "✅ Phase 1 testing complete!"
echo ""
echo "Next steps:"
echo "1. Pick an app from Phase 1 above"
echo "2. Run: pnpm --filter @games/[app-name] dev"
echo "3. Open: http://localhost:5173"
echo "4. Test UI, controls, and gameplay"
echo "5. Update BROWSER-TESTING-LOG.md with results"
echo ""
echo "To test Phase 2 (27 apps):"
echo "  bash /mnt/c/Users/scott/game-platform/scripts/test-phase-2.sh"
echo ""
