#!/bin/bash
# Governance Validation Script
# Validates all governance requirements across the 25 game projects
# Usage: bash .github/validate.sh

set -e

# ANSI color codes (standardized per SCRIPT-STANDARDS.md)
readonly CYAN='\033[96m'
readonly GREEN='\033[92m'
readonly RED='\033[91m'
readonly YELLOW='\033[93m'
readonly BLUE='\033[94m'
readonly WHITE='\033[97m'
readonly GRAY='\033[90m'
readonly MAGENTA='\033[95m'
readonly RESET='\033[0m'
readonly BOLD='\033[1m'

failed=0
passed=0

echo -e "${BLUE}═════════════════════════════════════${RESET}"
echo -e "${BLUE}🔍 Governance Validation Gate${RESET}"
echo -e "${BLUE}═════════════════════════════════════${RESET}"
echo ""

# Get list of all game projects
PROJECTS=(
  battleship bunco cee-lo checkers chicago cho-han connect-four
  farkle hangman liars-dice lights-out mancala memory-game mexico
  minesweeper monchola nim pig reversi rock-paper-scissors
  ship-captain-crew shut-the-box simon-says snake tictactoe
)

# 1. Check governance files deployed
echo -e "${CYAN}[1/4] 📁 Checking governance files...${RESET}"
for proj in "${PROJECTS[@]}"; do
  parent_dir=$(dirname "$(pwd)")
  proj_path="$parent_dir/$proj"
  
  if [ -d "$proj_path/.github/instructions" ]; then
    gov_files=$(ls "$proj_path/.github/instructions"/*.md 2>/dev/null | wc -l)
    if [ "$gov_files" -ge 5 ]; then
      echo -e "  ${GREEN}✅ $proj ($gov_files files)${RESET}"
      ((passed++))
    else
      echo -e "  ${RED}❌ $proj (only $gov_files files)${RESET}"
      ((failed++))
    fi
  else
    echo -e "  ${RED}❌ $proj (missing .github/instructions)${RESET}"
    ((failed++))
  fi
done

echo ""
echo -e "${CYAN}[2/4] 📋 Checking README Governance sections...${RESET}"
for proj in "${PROJECTS[@]}"; do
  parent_dir=$(dirname "$(pwd)")
  proj_path="$parent_dir/$proj"
  
  if [ -f "$proj_path/README.md" ]; then
    if grep -q "## Governance Adoption" "$proj_path/README.md"; then
      echo -e "  ${GREEN}✅ $proj${RESET}"
      ((passed++))
    else
      echo -e "  ${RED}❌ $proj (missing Governance Adoption section)${RESET}"
      ((failed++))
    fi
  fi
done

echo ""
echo -e "${CYAN}[3/4] 🔐 Checking ESLint Security Rules...${RESET}"
for proj in "${PROJECTS[@]}"; do
  parent_dir=$(dirname "$(pwd)")
  proj_path="$parent_dir/$proj"
  
  if [ -f "$proj_path/eslint.config.js" ]; then
    if grep -q "eslint-plugin-security\|security" "$proj_path/eslint.config.js"; then
      echo -e "  ${GREEN}✅ $proj${RESET}"
      ((passed++))
    else
      echo -e "  ${YELLOW}⚠️  $proj (security plugin not configured)${RESET}"
      ((failed++))
    fi
  fi
done

echo ""
echo -e "${CYAN}[4/4] 📦 Checking Governance Packages...${RESET}"
for proj in "${PROJECTS[@]}"; do
  parent_dir=$(dirname "$(pwd)")
  proj_path="$parent_dir/$proj"
  
  if [ -f "$proj_path/package.json" ]; then
    has_security=$(grep -c "eslint-plugin-security" "$proj_path/package.json" || echo 0)
    has_commitizen=$(grep -c "commitizen" "$proj_path/package.json" || echo 0)
    
    if [ "$has_security" -gt 0 ] && [ "$has_commitizen" -gt 0 ]; then
      echo -e "  ${GREEN}✅ $proj${RESET}"
      ((passed++))
    else
      echo -e "  ${RED}❌ $proj (missing governance packages)${RESET}"
      ((failed++))
    fi
  fi
done

echo ""
echo -e "${BLUE}═════════════════════════════════════${RESET}"
echo -e "${BLUE}📊 Validation Summary${RESET}"
echo -e "${BLUE}═════════════════════════════════════${RESET}"
echo -e "${CYAN}Checks Passed: ${GREEN}$passed${RESET}"
echo -e "${CYAN}Checks Failed: ${RED}$failed${RESET}"
echo ""

if [ "$failed" -eq 0 ]; then
  echo -e "${GREEN}${BOLD}✅ All governance checks passed!${RESET}"
  exit 0
else
  echo -e "${RED}${BOLD}❌ Governance validation failed!${RESET}"
  echo "Fix issues above and re-run validation."
  exit 1
fi
