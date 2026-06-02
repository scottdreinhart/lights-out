#!/usr/bin/env bash
# Quick sampled validation: Test pilot apps + sample of others
# Purpose: Get fast snapshot of workspace health

set +e

WORKSPACE_ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
cd "$WORKSPACE_ROOT"

# Pilot apps (already validated)
PILOT_APPS=("bingo-30" "checkers" "minesweeper")

# Sample of other apps for baseline
SAMPLE_APPS=("bingo" "battleship" "memory" "simon" "connect-four" "hangman" "snake" "beat-grid" "reversi" "dominoes")

ALL_APPS=("${PILOT_APPS[@]}" "${SAMPLE_APPS[@]}")

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Sampled Workspace Validation"
echo "Pilot apps: ${#PILOT_APPS[@]} | Sample apps: ${#SAMPLE_APPS[@]} | Total: ${#ALL_APPS[@]}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

REPORT_FILE="reports/workspace-validation-sample-$(date +%Y%m%d-%H%M%S).txt"
mkdir -p reports

{
  echo "Sampled Workspace Validation Report"
  echo "Date: $(date)"
  echo ""
  echo "LEGEND:"
  echo "  ✓ = PASS  |  ✗ = FAIL  |  ? = NOT RUN"
  echo ""
  echo "App                          | test:names | lint  | typecheck | test  | build"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
} > "$REPORT_FILE"

for APP in "${ALL_APPS[@]}"; do
  APP_FILTER="@games/$APP"
  MARKER=""
  
  if [[ " ${PILOT_APPS[@]} " =~ " ${APP} " ]]; then
    MARKER="[PILOT]"
  fi
  
  # Run gates
  pnpm --filter "$APP_FILTER" test:names > /dev/null 2>&1 && TN="✓" || TN="✗"
  pnpm --filter "$APP_FILTER" lint > /dev/null 2>&1 && L="✓" || L="✗"
  pnpm --filter "$APP_FILTER" typecheck > /dev/null 2>&1 && TC="✓" || TC="✗"
  pnpm --filter "$APP_FILTER" test > /dev/null 2>&1 && T="✓" || T="✗"
  pnpm --filter "$APP_FILTER" build > /dev/null 2>&1 && B="✓" || B="✗"
  
  # Print to terminal
  printf "%-28s | %-10s | %-5s | %-9s | %-5s | %-5s %s\n" \
    "$APP" "$TN" "$L" "$TC" "$T" "$B" "$MARKER"
  
  # Append to report
  printf "%-28s | %-10s | %-5s | %-9s | %-5s | %-5s %s\n" \
    "$APP" "$TN" "$L" "$TC" "$T" "$B" "$MARKER" >> "$REPORT_FILE"
done

echo ""
echo "Report saved to: $REPORT_FILE"
