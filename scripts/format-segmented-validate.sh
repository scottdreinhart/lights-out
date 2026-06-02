#!/usr/bin/env bash
#
# Format Segmented Validation (Bash version)
# 
# Breaks down Prettier format validation into isolated tiers
# to identify which specific formatting rules are blocking gates.
#
# Usage: bash scripts/format-segmented-validate.sh [app-name]
# Example: bash scripts/format-segmented-validate.sh nim
#          bash scripts/format-segmented-validate.sh blackjack

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

set +e  # Don't exit on first failure; continue through all tiers

APP_NAME="${1:-nim}"
APP_FILTER="@games/$APP_NAME"
APP_DIR="apps/$APP_NAME"

if [[ ! -d "$APP_DIR" ]]; then
  echo "❌ App directory not found: $APP_DIR"
  exit 1
fi

echo ""
echo "📋 Segmented Format Validation Report"
echo "📦 App: $APP_FILTER ($APP_DIR)"
echo "🕐 Started: $(date -u +'%Y-%m-%dT%H:%M:%SZ')"
echo ""

cd "$APP_DIR"

# Define format tiers
declare -a TIERS=(
  "Tier 1: Syntax Validity|prettier --parser babel --write --dry-run src/"
  "Tier 2: Line Endings|prettier --end-of-line lf --check src/"
  "Tier 3: Indentation (2 spaces)|prettier --tab-width 2 --check src/"
  "Tier 4: Line Length (100 chars)|prettier --print-width 100 --check src/"
  "Tier 5: Quote/Semicolon Rules|prettier --single-quote false --semi true --check src/"
  "Tier 6: Arrow Function Format|prettier --arrow-parens always --check src/"
  "Tier 7: Full Config Compliance|prettier --check src/"
)

PASS_COUNT=0
FAIL_COUNT=0

# Run each tier
for tier_spec in "${TIERS[@]}"; do
  IFS='|' read -r tier_name tier_cmd <<< "$tier_spec"
  
  printf "⏳ %-45s " "$tier_name"
  
  # Run the command and capture exit code
  if output=$(pnpm exec $tier_cmd 2>&1); then
    echo "✅ PASS"
    ((PASS_COUNT++))
  else
    echo "❌ FAIL"
    ((FAIL_COUNT++))
    
    # Extract file count from output
    file_count=$(echo "$output" | grep -oP '\d+(?=\s+file)' | head -1 || echo "?")
    echo "   📊 Files affected: $file_count"
    
    # Show first error line (if any)
    first_error=$(echo "$output" | grep -E "^src/" | head -1 || echo "")
    if [[ -n "$first_error" ]]; then
      echo "   Error: $first_error"
    fi
  fi
done

# Summary
echo ""
echo "════════════════════════════════════════════════════════════════════════"
echo "📊 Summary Report"
echo "════════════════════════════════════════════════════════════════════════"
echo ""
echo "✅ PASS: $PASS_COUNT/${#TIERS[@]}"
echo "❌ FAIL: $FAIL_COUNT/${#TIERS[@]}"
echo ""

if [[ $FAIL_COUNT -eq 0 ]]; then
  echo "🎉 All format validation tiers PASSED!"
  exit 0
else
  echo "⚠️  Some format tiers FAILED."
  echo ""
  echo "💡 To auto-fix all formatting issues:"
  echo "   cd $APP_DIR && pnpm exec prettier --write src/"
  echo ""
  exit 1
fi
