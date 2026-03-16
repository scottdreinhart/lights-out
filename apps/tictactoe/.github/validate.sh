#!/bin/bash
# Governance Validation Script
# Validates all governance requirements across the 25 game projects
# Usage: bash .github/validate.sh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

failed=0
passed=0

echo "======================================"
echo "🔍 Governance Validation Gate"
echo "======================================"
echo ""

# Get list of all game projects
PROJECTS=(
  battleship bunco cee-lo checkers chicago cho-han connect-four
  farkle hangman liars-dice lights-out mancala memory-game mexico
  minesweeper monchola nim pig reversi rock-paper-scissors
  ship-captain-crew shut-the-box simon-says snake tictactoe
)

# 1. Check governance files deployed
echo "📁 Checking governance files..."
for proj in "${PROJECTS[@]}"; do
  parent_dir=$(dirname "$(pwd)")
  proj_path="$parent_dir/$proj"
  
  if [ -d "$proj_path/.github/instructions" ]; then
    gov_files=$(ls "$proj_path/.github/instructions"/*.md 2>/dev/null | wc -l)
    if [ "$gov_files" -ge 5 ]; then
      echo "  ✅ $proj ($gov_files files)"
      ((passed++))
    else
      echo "  ❌ $proj (only $gov_files files)"
      ((failed++))
    fi
  else
    echo "  ❌ $proj (missing .github/instructions)"
    ((failed++))
  fi
done

echo ""
echo "📋 Checking README Governance sections..."
for proj in "${PROJECTS[@]}"; do
  parent_dir=$(dirname "$(pwd)")
  proj_path="$parent_dir/$proj"
  
  if [ -f "$proj_path/README.md" ]; then
    if grep -q "## Governance Adoption" "$proj_path/README.md"; then
      echo "  ✅ $proj"
      ((passed++))
    else
      echo "  ❌ $proj (missing Governance Adoption section)"
      ((failed++))
    fi
  fi
done

echo ""
echo "🔐 Checking ESLint Security Rules..."
for proj in "${PROJECTS[@]}"; do
  parent_dir=$(dirname "$(pwd)")
  proj_path="$parent_dir/$proj"
  
  if [ -f "$proj_path/eslint.config.js" ]; then
    if grep -q "eslint-plugin-security\|security" "$proj_path/eslint.config.js"; then
      echo "  ✅ $proj"
      ((passed++))
    else
      echo "  ⚠️  $proj (security plugin not configured)"
      ((failed++))
    fi
  fi
done

echo ""
echo "📦 Checking Governance Packages..."
for proj in "${PROJECTS[@]}"; do
  parent_dir=$(dirname "$(pwd)")
  proj_path="$parent_dir/$proj"
  
  if [ -f "$proj_path/package.json" ]; then
    has_security=$(grep -c "eslint-plugin-security" "$proj_path/package.json" || echo 0)
    has_commitizen=$(grep -c "commitizen" "$proj_path/package.json" || echo 0)
    
    if [ "$has_security" -gt 0 ] && [ "$has_commitizen" -gt 0 ]; then
      echo "  ✅ $proj"
      ((passed++))
    else
      echo "  ❌ $proj (missing governance packages)"
      ((failed++))
    fi
  fi
done

echo ""
echo "======================================"
echo "📊 Validation Summary"
echo "======================================"
echo -e "Checks Passed: ${GREEN}$passed${NC}"
echo -e "Checks Failed: ${RED}$failed${NC}"
echo ""

if [ "$failed" -eq 0 ]; then
  echo -e "${GREEN}✅ All governance checks passed!${NC}"
  exit 0
else
  echo -e "${RED}❌ Governance validation failed!${NC}"
  echo "Fix issues above and re-run validation."
  exit 1
fi
