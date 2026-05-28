#!/usr/bin/env bash
# check-input-controls.sh
#
# Validates input-controls governance (see .github/instructions/08-input-controls.instructions.md):
#   1. No raw document/window key listeners in src/ui/ (must go through useKeyboardControls)
#   2. useKeyboardControls must not be re-implemented inside src/ui/ (belongs in src/app/)
#
# Usage: bash check-input-controls.sh
#
# Exit codes:
#   0 = All checks passed
#   1 = Violations found

set -euo pipefail

# ANSI color codes (standardized per SCRIPT-STANDARDS.md)
readonly CYAN='\033[96m'
readonly GREEN='\033[92m'
readonly RED='\033[91m'
readonly YELLOW='\033[93m'
readonly BLUE='\033[94m'
readonly RESET='\033[0m'
readonly BOLD='\033[1m'

VIOLATIONS=0
SRC_UI="src/ui"

if [[ ! -d "$SRC_UI" ]]; then
  echo -e "${YELLOW}⚠️  src/ui/ not found — skipping input controls check.${RESET}"
  exit 0
fi

echo -e "${CYAN}[1/2] 🔍 Checking for raw key listeners in $SRC_UI/ ...${RESET}"

while IFS= read -r -d '' file; do
  matches=$(grep -nP "(?:document|window)\.addEventListener\s*\(\s*['\"]key" "$file" 2>/dev/null || true)
  if [[ -n "$matches" ]]; then
    echo -e "  ${RED}❌ $file${RESET}"
    echo "$matches" | sed "s/^/        /"
    VIOLATIONS=$((VIOLATIONS + 1))
  fi
done < <(find "$SRC_UI" -type f \( -name "*.ts" -o -name "*.tsx" \) -print0)

if [ $VIOLATIONS -eq 0 ]; then
  echo -e "  ${GREEN}✅ No raw key listeners found${RESET}"
fi

echo ""
echo -e "${CYAN}[2/2] 🔍 Checking for useKeyboardControls re-definition in $SRC_UI/ ...${RESET}"

while IFS= read -r -d '' file; do
  matches=$(grep -nP "(?:export\s+(?:default\s+)?(?:function|const)|^function|^const)\s+useKeyboardControls\b" "$file" 2>/dev/null || true)
  if [[ -n "$matches" ]]; then
    echo -e "  ${RED}❌ $file — useKeyboardControls must live in src/app/, not src/ui/${RESET}"
    VIOLATIONS=$((VIOLATIONS + 1))
  fi
done < <(find "$SRC_UI" -type f \( -name "*.ts" -o -name "*.tsx" \) -print0)

if [ $VIOLATIONS -eq 0 ]; then
  echo -e "  ${GREEN}✅ No useKeyboardControls re-definitions found${RESET}"
fi

echo ""
echo -e "${BLUE}${BOLD}─────────────────────────────────────────${RESET}"

if [[ $VIOLATIONS -gt 0 ]]; then
  echo -e "${RED}${BOLD}❌ Input controls check FAILED: $VIOLATIONS violation(s).${RESET}"
  echo "📖 Governance: .github/instructions/08-input-controls.instructions.md"
  exit 1
else
  echo -e "${GREEN}${BOLD}✅ Input controls check passed (0 violations).${RESET}"
fi
