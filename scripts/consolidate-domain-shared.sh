#!/bin/bash

# Script to consolidate domain-shared package across all 25 apps

APPS=(
  battleship bunco cee-lo checkers chicago cho-han connect-four farkle hangman
  liars-dice lights-out mancala memory-game mexico minesweeper monchola nim pig
  reversi rock-paper-scissors ship-captain-crew shut-the-box simon-says snake tictactoe
)

ROOT_DIR="/mnt/c/Users/scott/lights-out"

for app in "${APPS[@]}"; do
  APP_DIR="$ROOT_DIR/apps/$app"
  PKG_JSON="$APP_DIR/package.json"
  DOMAIN_INDEX="$APP_DIR/src/domain/index.ts"
  RESPONSIVE="$APP_DIR/src/domain/responsive.ts"
  LAYERS="$APP_DIR/src/domain/layers.ts"
  
  echo "Processing: $app"
  
  # 1. Add @games/domain-shared to package.json (if not already present)
  if ! grep -q '"@games/domain-shared"' "$PKG_JSON"; then
    # Add after @games/app-hook-utils
    sed -i '/"@games\/app-hook-utils"/a\    "@games/domain-shared": "workspace:*",' "$PKG_JSON"
    echo "  ✓ Added @games/domain-shared to package.json"
  fi
  
  # 2. Backup old domain/index.ts
  if [ -f "$DOMAIN_INDEX" ]; then
    cp "$DOMAIN_INDEX" "$DOMAIN_INDEX.backup"
  fi
  
  # 3. Update domain/index.ts to re-export from @games/domain-shared
  # First, keep any local exports that aren't responsive or layers
  if grep -q "responsive\|layers" "$DOMAIN_INDEX"; then
    # Build new content with re-exports from @games/domain-shared
    cat > "$DOMAIN_INDEX" << 'EOF'
// Re-export shared domain constants from @games/domain-shared
export {
  RESPONSIVE_BREAKPOINTS,
  HEIGHT_THRESHOLDS,
  MEDIA_QUERIES,
  deriveBreakpointFlags,
  deriveDeviceCategory,
  deriveNavMode,
  deriveContentDensity,
  deriveDialogMode,
  deriveInteractionMode,
  deriveGridColumns,
  deriveResponsiveState,
  type BreakpointName,
  type NavMode,
  type ContentDensity,
  type DialogMode,
  type InteractionMode,
  type ResponsiveCapabilities,
  type ResponsiveState,
} from '@games/domain-shared'

export {
  LAYER_Z,
  getLayerStack,
  layerStackToCssVars,
  type LayerConfig,
  type LayerStack,
} from '@games/domain-shared'

// Local domain exports below
EOF
    
    # Extract non-responsive/layers exports from backup
    if [ -f "$DOMAIN_INDEX.backup" ]; then
      grep -v "responsive\|layers\|export {" "$DOMAIN_INDEX.backup" | grep -v "type " >> "$DOMAIN_INDEX" || true
    fi
    
    echo "  ✓ Updated domain/index.ts with re-exports"
  fi
  
  # 4. Delete local responsive.ts and layers.ts
  rm -f "$RESPONSIVE" "$LAYERS"
  if [ ! -f "$RESPONSIVE" ]; then
    echo "  ✓ Deleted responsive.ts"
  fi
  if [ ! -f "$LAYERS" ]; then
    echo "  ✓ Deleted layers.ts"
  fi
done

echo ""
echo "✅ All 25 apps updated to use @games/domain-shared"
