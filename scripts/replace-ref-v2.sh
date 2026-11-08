#!/bin/bash
set -e

REPO_ROOT="/home/liam/Bureau/enterprise/zenthcloud"
cd "$REPO_ROOT"

echo "Starting replacements..."
echo ""

# Step 1: Replace zenthcloud (case-insensitive) with zenthcloud
echo "=== Step 1: Replacing zenthcloud ==="
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.yaml" -o -name "*.yml" -o -name "*.txt" -o -name "*.html" -o -name "*.css" \) \
    ! -path "./node_modules/*" \
    ! -path "./.git/*" \
    ! -path "./.pnpm-store/*" \
    -exec grep -l "zenthcloud" {} + | while read -r file; do
    echo "  Replacing in: $file"
    sed -i 's/zenthcloud/zenthcloud/gi' "$file"
done
echo "Step 1 completed"
echo ""

# Step 2: Replace Astron Collection (with space) with Zenthcloud
echo "=== Step 2: Replacing Astron Collection ==="
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.yaml" -o -name "*.yml" -o -name "*.txt" -o -name "*.html" -o -name "*.css" \) \
    ! -path "./node_modules/*" \
    ! -path "./.git/*" \
    ! -path "./.pnpm-store/*" \
    -exec grep -l "Astron Collection" {} + | while read -r file; do
    echo "  Replacing in: $file"
    sed -i 's/Astron Collection/Zenthcloud/g' "$file"
done
echo "Step 2 completed"
echo ""

# Step 3: Replace zenthcloud (case-insensitive) with zenthcloud
echo "=== Step 3: Replacing zenthcloud ==="
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.yaml" -o -name "*.yml" -o -name "*.txt" -o -name "*.html" -o -name "*.css" \) \
    ! -path "./node_modules/*" \
    ! -path "./.git/*" \
    ! -path "./.pnpm-store/*" \
    -exec grep -l "zenthcloud" {} + | while read -r file; do
    echo "  Replacing in: $file"
    sed -i 's/zenthcloud/zenthcloud/gi' "$file"
done
echo "Step 3 completed"
echo ""

echo "All replacements completed!"
echo ""

# Count remaining references
REMAINING_ASTRON=$(find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.yaml" -o -name "*.yml" -o -name "*.txt" -o -name "*.html" -o -name "*.css" \) \
    ! -path "./node_modules/*" \
    ! -path "./.git/*" \
    ! -path "./.pnpm-store/*" \
    -exec grep -l "zenthcloud" {} + | wc -l)

REMAINING_NOTPLOY=$(find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.yaml" -o -name "*.yml" -o -name "*.txt" -o -name "*.html" -o -name "*.css" \) \
    ! -path "./node_modules/*" \
    ! -path "./.git/*" \
    ! -path "./.pnpm-store/*" \
    -exec grep -l "zenthcloud" {} + | wc -l)

echo "Remaining files with zenthcloud: $REMAINING_ASTRON"
echo "Remaining files with zenthcloud: $REMAINING_NOTPLOY"
