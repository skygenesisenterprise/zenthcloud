#!/bin/bash
set -e

# Optimized script to replace zenthcloud, zenthcloud references with zenthcloud

REPO_ROOT="/home/liam/Bureau/enterprise/zenthcloud"
cd "$REPO_ROOT"

echo "Starting replacements..."
echo ""

# Pattern for file types
FILE_PATTERN="\( -name \"*.ts\" -o -name \"*.tsx\" -o -name \"*.js\" -o -name \"*.jsx\" -o -name \"*.json\" -o -name \"*.md\" -o -name \"*.yaml\" -o -name \"*.yml\" -o -name \"*.txt\" -o -name \"*.html\" -o -name \"*.css\" \)"

# Exclusion patterns
EXCLUDE_PATTERN="! -path \"./node_modules/*\" ! -path \"./.git/*\" ! -path \"./.pnpm-store/*\" ! -path \"*/node_modules/*\""

# Step 1: Replace zenthcloud (case-insensitive) with zenthcloud
echo "=== Step 1: Replacing zenthcloud ==="
find . -type f \( $FILE_PATTERN \) $EXCLUDE_PATTERN -exec grep -l "zenthcloud" {} + | while read -r file; do
    sed -i 's/zenthcloud/zenthcloud/gi' "$file"
done
echo "Step 1 completed"
echo ""

# Step 2: Replace Astron Collection (with space) with Zenthcloud
echo "=== Step 2: Replacing Astron Collection ==="
find . -type f \( $FILE_PATTERN \) $EXCLUDE_PATTERN -exec grep -l "Astron Collection" {} + | while read -r file; do
    sed -i 's/Astron Collection/Zenthcloud/g' "$file"
done
echo "Step 2 completed"
echo ""

# Step 3: Replace zenthcloud (case-insensitive) with zenthcloud
echo "=== Step 3: Replacing zenthcloud ==="
find . -type f \( $FILE_PATTERN \) $EXCLUDE_PATTERN -exec grep -l "zenthcloud" {} + | while read -r file; do
    sed -i 's/zenthcloud/zenthcloud/gi' "$file"
done
echo "Step 3 completed"
echo ""

# Step 4: Replace Notploy (case-sensitive) with Zenthcloud
echo "=== Step 4: Replacing Notploy ==="
find . -type f \( $FILE_PATTERN \) $EXCLUDE_PATTERN -exec grep -l "Notploy" {} + | while read -r file; do
    sed -i 's/Notploy/Zenthcloud/g' "$file"
done
echo "Step 4 completed"
echo ""

echo "All replacements completed!"
echo ""
echo "Checking for remaining references..."
echo ""

# Check for remaining references
REMAINING_ASTRON=$(grep -r "zenthcloud" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.json" --include="*.md" --include="*.yaml" --include="*.yml" --include="*.txt" --include="*.html" --include="*.css" -l 2>/dev/null | grep -v node_modules | wc -l)
REMAINING_NOTPLOY=$(grep -r "zenthcloud" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.json" --include="*.md" --include="*.yaml" --include="*.yml" --include="*.txt" --include="*.html" --include="*.css" -l 2>/dev/null | grep -v node_modules | wc -l)

echo "Remaining files with zenthcloud: $REMAINING_ASTRON"
echo "Remaining files with zenthcloud: $REMAINING_NOTPLOY"
