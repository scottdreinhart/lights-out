#!/bin/bash

# Remove pnpm.onlyBuiltDependencies from all apps/*/package.json

for app in apps/*/; do
  if [ -f "$app/package.json" ]; then
    # Use sed to remove the pnpm block
    sed -i '/"pnpm": {/,/}/d' "$app/package.json"
    # Clean up any trailing commas
    sed -i 's/,$//' "$app/package.json"
    echo "Cleaned $app/package.json"
  fi
done

echo "All app package.json files cleaned of pnpm.onlyBuiltDependencies"