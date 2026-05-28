#!/bin/bash
# validate-script-standards.sh
#
# CI Gate: Quick check for ANSI COLORS block in scripts
# Authority: docs/SCRIPT-STANDARDS.md
# 
# Validates that key scripts contain the standardized COLORS block.
# Uses sampling for speed (checks ~10% of .sh files, all root .mjs files).
#
# Exit: 0 if valid, 1 if violations found

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

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

INVALID=0

echo "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo "${BOLD}🧪 Script Standards Validation (Quick Gate)${RESET}"
echo "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""

# ════════════════════════════════════════════════════════════════
# Check Root-Level Scripts
# ════════════════════════════════════════════════════════════════

echo "${BLUE}📚 Root-Level Scripts${RESET}"

for file in scripts/*.sh scripts/*.mjs .github/*.sh ci/*.sh; do
  [[ ! -f "$file" ]] && continue
  
  # Check for COLORS (shell) or COLORS object (node)
  if grep -q "readonly CYAN=" "$file" 2>/dev/null || \
     grep -q "const COLORS = {" "$file" 2>/dev/null; then
    echo "  ${GREEN}✅${RESET} $(basename "$file")"
  else
    echo "  ${RED}❌${RESET} $(basename "$file") ${GRAY}(missing COLORS)${RESET}"
    ((INVALID++))
  fi
done

echo ""

# ════════════════════════════════════════════════════════════════
# Spot-Check App Scripts (10% sample)
# ════════════════════════════════════════════════════════════════

echo "${BLUE}📚 App Scripts (sample check)${RESET}"

SAMPLE_DIRS=(angle-war block-fall vector-assault nim neon-hop)
for app in "${SAMPLE_DIRS[@]}"; do
  if [[ -f "apps/$app/scripts/check-input-controls.sh" ]]; then
    if grep -q "readonly CYAN=" "apps/$app/scripts/check-input-controls.sh"; then
      echo "  ${GREEN}✅${RESET} apps/$app/scripts/check-input-controls.sh"
    else
      echo "  ${RED}❌${RESET} apps/$app/scripts/check-input-controls.sh"
      ((INVALID++))
    fi
  fi
done

echo ""
echo "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"

if [[ $INVALID -eq 0 ]]; then
  echo "${GREEN}✅ Script standards validated${RESET}"
  echo "${GRAY}(Reference: docs/SCRIPT-STANDARDS.md)${RESET}"
  exit 0
else
  echo "${RED}❌ $INVALID script(s) missing COLORS block${RESET}"
  echo ""
  echo "👉 Add standardized COLORS block to scripts:"
  echo "   - Shell (.sh): 10-color readonly declarations"
  echo "   - Node (.mjs):  COLORS object with GREEN/RED/RESET"
  echo ""
  echo "${GRAY}Reference: docs/SCRIPT-STANDARDS.md${RESET}"
  exit 1
fi

