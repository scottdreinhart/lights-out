#!/usr/bin/env bash
# Checkers App Preflight Validation
#
# Runs all quality gates in sequence for @games/checkers:
# 1. lint:type:all (lint rules + type checking)
# 2. test:names (test naming convention validation)
# 3. lint (ESLint style check)
# 4. format:check (Prettier formatting check)
# 5. typecheck (TypeScript compilation)
# 6. build (Vite build)
# 7. validate (full gate)
#
# Usage: bash scripts/checkers-preflight-validate.sh

set +e

# ANSI color codes (standardized per SCRIPT-STANDARDS.md)
readonly CYAN='\033[96m'
readonly GREEN='\033[92m'
readonly RED='\033[91m'
readonly YELLOW='\033[93m'
readonly BLUE='\033[94m'
readonly WHITE='\033[97m'
readonly GRAY='\033[90m'
readonly RESET='\033[0m'
readonly BOLD='\033[1m'

cd /mnt/d/src/game-platform || exit 2

echo -e "${BLUE}${BOLD}═════════════════════════════════════════${RESET}"
echo -e "${BLUE}🧪 Checkers Preflight Validation${RESET}"
echo -e "${BLUE}${BOLD}═════════════════════════════════════════${RESET}"
echo ""

echo -e "${CYAN}[1/7] 🔍 lint:type:all${RESET}"
pnpm --filter @games/checkers lint:type:all
s1=$?
[ $s1 -eq 0 ] && echo -e "${GREEN}✅ PASSED${RESET}" || echo -e "${RED}❌ FAILED${RESET}"

echo ""
echo -e "${CYAN}[2/7] 📋 test:names${RESET}"
pnpm --filter @games/checkers test:names
s2=$?
[ $s2 -eq 0 ] && echo -e "${GREEN}✅ PASSED${RESET}" || echo -e "${RED}❌ FAILED${RESET}"

echo ""
echo -e "${CYAN}[3/7] 🔧 lint${RESET}"
pnpm --filter @games/checkers lint
s3=$?
[ $s3 -eq 0 ] && echo -e "${GREEN}✅ PASSED${RESET}" || echo -e "${RED}❌ FAILED${RESET}"

echo ""
echo -e "${CYAN}[4/7] 💾 format:check${RESET}"
pnpm --filter @games/checkers format:check
s4=$?
[ $s4 -eq 0 ] && echo -e "${GREEN}✅ PASSED${RESET}" || echo -e "${RED}❌ FAILED${RESET}"

echo ""
echo -e "${CYAN}[5/7] 📝 typecheck${RESET}"
pnpm --filter @games/checkers typecheck
s5=$?
[ $s5 -eq 0 ] && echo -e "${GREEN}✅ PASSED${RESET}" || echo -e "${RED}❌ FAILED${RESET}"

echo ""
echo -e "${CYAN}[6/7] 🏗️ build${RESET}"
pnpm --filter @games/checkers build
s6=$?
[ $s6 -eq 0 ] && echo -e "${GREEN}✅ PASSED${RESET}" || echo -e "${RED}❌ FAILED${RESET}"

echo ""
echo -e "${CYAN}[7/7] ✨ validate${RESET}"
pnpm --filter @games/checkers validate
s7=$?
[ $s7 -eq 0 ] && echo -e "${GREEN}✅ PASSED${RESET}" || echo -e "${RED}❌ FAILED${RESET}"

echo ""
echo -e "${BLUE}${BOLD}─────────────────────────────────────────${RESET}"
echo -e "${BLUE}📊 Summary${RESET}"
echo -e "${BLUE}${BOLD}─────────────────────────────────────────${RESET}"

results=($s1 $s2 $s3 $s4 $s5 $s6 $s7)
passed=0
failed=0

for code in "${results[@]}"; do
  [ $code -eq 0 ] && ((passed++)) || ((failed++))
done

echo -e "${CYAN}├─ Total:  7${RESET}"
echo -e "${GREEN}├─ Passed: $passed${RESET}"
echo -e "${RED}└─ Failed: $failed${RESET}"
echo ""

if [ $failed -eq 0 ]; then
  echo -e "${GREEN}${BOLD}✅ All validation steps passed!${RESET}"
  exit 0
else
  echo -e "${RED}${BOLD}❌ Some validation steps failed${RESET}"
  echo "Review output above for details."
  exit 1
fi
exit 0
