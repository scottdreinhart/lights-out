#!/bin/bash

# Fix missing commas in package.json files
# This script adds commas after property values that are followed by the next property on a new line

for file in apps/*/package.json; do
  if [ -f "$file" ]; then
    # Use sed to add commas where missing
    # Pattern: "property": "value" followed by newline then next property
    sed -i 's/"\([^"]*\)": "\([^"]*\)"\s*$/"\1": "\2",/g' "$file"
    # Remove trailing comma from last property before closing brace
    sed -i 's/,\s*}/}/g' "$file"
    echo "Fixed: $file"
  fi
done