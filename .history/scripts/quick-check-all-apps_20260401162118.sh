#!/bin/bash
# Quick validation check for all apps (lint + format + typecheck only, no build)

set -e

PNPM="/mnt/c/Users/scott/AppData/Local/pnpm/pnpm"
APPS_DIR="/mnt/c/Users/scott/game-platform/apps"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Get list of all apps
apps=($(cd "$APPS_DIR" && ls -d */ | sed 's|/||g' | sort))

echo "🔄 Quick validation of ${#apps[@]} apps (check only, no build)..."
echo "Timestamp: $TIMESTAMP"
echo ""

passed=0
failed=0

for app in "${apps[@]}"; do
    echo -n "$app: "
    app_path="$APPS_DIR/$app"
    
    if [ ! -d "$app_path" ]; then
        echo "SKIP"
        continue
    fi
    
    # Run check (lint + format + typecheck), capture exit code
    if cd "$app_path" && "$PNPM" check > /tmp/check-$app.log 2>&1; then
        echo "✅"
        ((passed++))
    else
        echo "❌"
        ((failed++))
        # Show last few lines of error
        tail -5 /tmp/check-$app.log | sed 's/^/  /'
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Passed:  $passed/${#apps[@]}"
echo "❌ Failed:  $failed/${#apps[@]}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
