#!/usr/bin/env bash
# App Classification Matrix for Accessibility Remediation Waves
# Maps 65 game apps to Pattern 1 (Modals), Pattern 2 (Announcements), Pattern 3 (Reduced Motion)

WORKSPACE_ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
cd "$WORKSPACE_ROOT"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "App Classification Matrix for Accessibility Remediation Waves"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# WP-04: Modal Audit Wave - Apps with settings, rules, menus, game-over dialogs
WP04_BINGO=(
  "bingo"
  "bingo-30"
  "bingo-80"
  "bingo-90"
  "bingo-blackout"
  "bingo-bonus"
  "bingo-pattern"
  "bingo-progressive"
  "bingo-rush"
  "bingo-survival"
  "pattern-bingo"
  "power-bingo"
  "speed-bingo"
)

WP04_BATTLE=(
  "battleship"
  "checkers"
  "connect-four"
  "reversi"
)

WP04=(
  "${WP04_BINGO[@]}"
  "${WP04_BATTLE[@]}"
  # Additional: dominoes, snakes-and-ladders, mancala (have boards + menus)
  "dominoes"
  "snakes-and-ladders"
)

# WP-05: Announcements Wave - Turn-based, state-heavy, score-tracking games
WP05_CARDGAMES=(
  "blackjack"
  "go-fish"
  "cee-lo"
)

WP05_DICEGAMES=(
  "farkle"
  "bunco"
  "chicago"
  "mexico"
  "pig"
  "ship-captain-crew"
  "shut-the-box"
  "liars-dice"
)

WP05=(
  "${WP05_CARDGAMES[@]}"
  "${WP05_DICEGAMES[@]}"
  # Additional: hangman (turn-based guessing), nim (turn-based), queens (puzzle)
  "hangman"
  "nim"
  "queens"
)

# WP-06: Reduced Motion Wave - All remaining apps (safe to apply @media blocks)
# Will be dynamically generated

WP04_COUNT=${#WP04[@]}
WP05_COUNT=${#WP05[@]}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "WP-04: Modal Audit Wave (Pattern 1 - Dialog Semantics & Keyboard)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Total apps: $WP04_COUNT"
echo ""
printf "%-35s | Category\n" "App"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

for app in "${WP04[@]}"; do
  if [[ " ${WP04_BINGO[@]} " =~ " ${app} " ]]; then
    printf "%-35s | Bingo Variant\n" "$app"
  else
    printf "%-35s | Battle/Board Game\n" "$app"
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "WP-05: Announcements Wave (Pattern 2 - aria-live Regions & State Tracking)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Total apps: $WP05_COUNT"
echo ""
printf "%-35s | Category\n" "App"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

for app in "${WP05[@]}"; do
  if [[ " ${WP05_CARDGAMES[@]} " =~ " ${app} " ]]; then
    printf "%-35s | Card Game\n" "$app"
  elif [[ " ${WP05_DICEGAMES[@]} " =~ " ${app} " ]]; then
    printf "%-35s | Dice Game\n" "$app"
  else
    printf "%-35s | Turn-based Game\n" "$app"
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "WP-06: Reduced Motion Wave (Pattern 3 - @media prefers-reduced-motion)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Covers all 65 apps; low risk (CSS-only), can be applied in parallel batches"
echo "Estimated: 15-20 min per app × 65 apps = ~18-22 hours total"
echo "Optimal: Batch in groups of 5-10 for concurrent processing"
echo ""

ALL_APPS=($(find apps -maxdepth 1 -mindepth 1 -type d | xargs -I {} basename {} | sort))
TOTAL=${#ALL_APPS[@]}

# Find apps not in WP04 or WP05
WP06=()
for app in "${ALL_APPS[@]}"; do
  if [[ ! " ${WP04[@]} " =~ " ${app} " ]] && [[ ! " ${WP05[@]} " =~ " ${app} " ]]; then
    WP06+=("$app")
  fi
done

WP06_COUNT=${#WP06[@]}
echo "WP-06 apps (remaining): $WP06_COUNT"
echo ""

# Save classification to file
CLASSIFICATION_FILE="reports/app-classification-waves-$(date +%Y%m%d-%H%M%S).txt"
mkdir -p reports
{
  echo "App Classification for Accessibility Remediation Waves"
  echo "Generated: $(date)"
  echo ""
  echo "=== WP-04: Modal Audit Wave (Pattern 1) ==="
  printf '%s\n' "${WP04[@]}"
  echo ""
  echo "=== WP-05: Announcements Wave (Pattern 2) ==="
  printf '%s\n' "${WP05[@]}"
  echo ""
  echo "=== WP-06: Reduced Motion Wave (Pattern 3) ==="
  printf '%s\n' "${WP06[@]}"
} > "$CLASSIFICATION_FILE"

echo "Classification saved to: $CLASSIFICATION_FILE"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Total apps in workspace: $TOTAL"
echo "WP-04 (Modals):         $WP04_COUNT apps"
echo "WP-05 (Announcements):  $WP05_COUNT apps"
echo "WP-06 (Reduced Motion): $WP06_COUNT apps"
echo "Classified:             $((WP04_COUNT + WP05_COUNT + WP06_COUNT))"
echo ""
