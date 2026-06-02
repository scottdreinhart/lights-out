#!/usr/bin/env bash
# Smart Accessibility Auditor
# Identifies which patterns each app is missing, enabling efficient batch remediation

WORKSPACE_ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
cd "$WORKSPACE_ROOT"

AUDIT_REPORT="reports/accessibility-audit-patterns-$(date +%Y%m%d-%H%M%S).txt"
mkdir -p reports

# Helper functions
has_dialog_semantic() {
  local app=$1
  grep -r "role=\"dialog\"\|<dialog" "apps/$app/src" 2>/dev/null | wc -l
}

has_aria_live() {
  local app=$1
  grep -r "aria-live" "apps/$app/src" 2>/dev/null | wc -l
}

has_reduced_motion() {
  local app=$1
  grep -r "prefers-reduced-motion" "apps/$app/src" 2>/dev/null | wc -l
}

has_css_animations() {
  local app=$1
  grep -r "transition\|animation\|transform" "apps/$app/src" --include="*.css" 2>/dev/null | wc -l
}

has_inline_overlays() {
  local app=$1
  # Check for div/span with onClick and aria-hidden
  grep -r "onClick.*aria-hidden\|aria-hidden.*onClick" "apps/$app/src" 2>/dev/null | wc -l
}

# Run audit
echo "Accessibility Pattern Audit" > "$AUDIT_REPORT"
echo "Generated: $(date)" >> "$AUDIT_REPORT"
echo "" >> "$AUDIT_REPORT"
echo "Legend:" >> "$AUDIT_REPORT"
echo "  Pattern 1 (Modals): Semantic dialog elements (role='dialog' or <dialog>)" >> "$AUDIT_REPORT"
echo "  Pattern 2 (Announcements): aria-live regions for state updates" >> "$AUDIT_REPORT"
echo "  Pattern 3 (Reduced Motion): @media (prefers-reduced-motion) blocks" >> "$AUDIT_REPORT"
echo "  Pattern 4 (Inline Overlays - ANTIPATTERN): Non-semantic overlays needing refactoring" >> "$AUDIT_REPORT"
echo "" >> "$AUDIT_REPORT"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Accessibility Pattern Audit - WP-04, WP-05, WP-06 Coverage"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

ALL_APPS=($(find apps -maxdepth 1 -mindepth 1 -type d | xargs -I {} basename {} | sort))

P1_GOOD=0
P1_NEED=0
P2_GOOD=0
P2_NEED=0
P3_GOOD=0
P3_NEED=0

for app in "${ALL_APPS[@]}"; do
  DIALOG_COUNT=$(has_dialog_semantic "$app")
  ARIA_LIVE_COUNT=$(has_aria_live "$app")
  REDUCED_MOTION_COUNT=$(has_reduced_motion "$app")
  INLINE_OVERLAYS=$(has_inline_overlays "$app")

  # Determine pattern status
  P1=$([ $DIALOG_COUNT -gt 0 ] && echo "✓" || echo "✗")
  P2=$([ $ARIA_LIVE_COUNT -gt 0 ] && echo "✓" || echo "✗")
  P3=$([ $REDUCED_MOTION_COUNT -gt 0 ] && echo "✓" || echo "✗")

  [ "$P1" = "✓" ] && ((P1_GOOD++)) || ((P1_NEED++))
  [ "$P2" = "✓" ] && ((P2_GOOD++)) || ((P2_NEED++))
  [ "$P3" = "✓" ] && ((P3_GOOD++)) || ((P3_NEED++))

  # Print to terminal (sample - show first 30)
  if [ ${#ALL_APPS[@]} -le 30 ]; then
    printf "%-25s | P1:%s P2:%s P3:%s | Inline:%d\n" "$app" "$P1" "$P2" "$P3" "$INLINE_OVERLAYS"
  fi

  # Write all to report
  echo "$app | P1:$P1 | P2:$P2 | P3:$P3 | Dialogs:$DIALOG_COUNT | AriaLive:$ARIA_LIVE_COUNT | ReducedMotion:$REDUCED_MOTION_COUNT | InlineOverlays:$INLINE_OVERLAYS" >> "$AUDIT_REPORT"
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Pattern Coverage Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
TOTAL=${#ALL_APPS[@]}
echo "Pattern 1 (Modals):        $P1_GOOD/$TOTAL apps compliant ($(( P1_GOOD * 100 / TOTAL ))%)"
echo "Pattern 2 (Announcements): $P2_GOOD/$TOTAL apps compliant ($(( P2_GOOD * 100 / TOTAL ))%)"
echo "Pattern 3 (Reduced Motion):$P3_GOOD/$TOTAL apps compliant ($(( P3_GOOD * 100 / TOTAL ))%)"
echo ""
echo "Apps needing WP-04 (Modals):         $P1_NEED"
echo "Apps needing WP-05 (Announcements):  $P2_NEED"
echo "Apps needing WP-06 (Reduced Motion): $P3_NEED"
echo ""
echo "Full report: $AUDIT_REPORT"
