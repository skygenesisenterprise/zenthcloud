#!/bin/bash
set -e

# Script to replace guilderia, guilderia, and discord references with guilderia

REPO_ROOT="/home/liam/Bureau/enterprise/guilderia"
cd "$REPO_ROOT"

echo "Starting replacements..."
echo ""

# Function to replace in files
replace_in_files() {
    local pattern=$1
    local replacement=$2
    local file_pattern=$3
    local description=$4
    
    echo "Replacing: $description"
    echo "Pattern: $pattern -> $replacement"
    
    # Find all files matching the pattern, excluding node_modules and .git
    find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.yaml" -o -name "*.yml" -o -name "*.txt" -o -name "*.html" -o -name "*.css" \) \
        ! -path "./node_modules/*" \
        ! -path "./.git/*" \
        ! -path "./.pnpm-store/*" \
        ! -path "*/node_modules/*" \
        -exec grep -l "$pattern" {} + | while read -r file; do
        echo "  Processing: $file"
        sed -i "s/$pattern/$replacement/g" "$file"
    done
    
    echo "Completed: $description"
    echo ""
}

# Step 1: Replace guilderia (case-insensitive)
echo "=== Step 1: Replacing guilderia ==="
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.yaml" -o -name "*.yml" -o -name "*.txt" -o -name "*.html" -o -name "*.css" \) \
    ! -path "./node_modules/*" \
    ! -path "./.git/*" \
    ! -path "./.pnpm-store/*" \
    -exec grep -l "guilderia" {} + | while read -r file; do
    echo "  Processing: $file"
    sed -i 's/guilderia/guilderia/gi' "$file"
done

echo "Step 1 completed"
echo ""

# Step 2: Replace Astron Collection (with space)
echo "=== Step 2: Replacing Astron Collection ==="
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.yaml" -o -name "*.yml" -o -name "*.txt" -o -name "*.html" -o -name "*.css" \) \
    ! -path "./node_modules/*" \
    ! -path "./.git/*" \
    ! -path "./.pnpm-store/*" \
    -exec grep -l "Astron Collection" {} + | while read -r file; do
    echo "  Processing: $file"
    sed -i 's/Astron Collection/Guilderia/g' "$file"
done

echo "Step 2 completed"
echo ""

# Step 3: Replace guilderia (case-insensitive)
echo "=== Step 3: Replacing guilderia ==="
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.yaml" -o -name="*.yml" -o -name "*.txt" -o -name "*.html" -o -name "*.css" \) \
    ! -path "./node_modules/*" \
    ! -path "./.git/*" \
    ! -path "./.pnpm-store/*" \
    -exec grep -l "guilderia" {} + | while read -r file; do
    echo "  Processing: $file"
    sed -i 's/guilderia/guilderia/gi' "$file"
done

echo "Step 3 completed"
echo ""

# Step 4: Replace Notploy (with capital N)
echo "=== Step 4: Replacing Notploy ==="
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.yaml" -o -name "*.yml" -o -name "*.txt" -o -name "*.html" -o -name "*.css" \) \
    ! -path "./node_modules/*" \
    ! -path "./.git/*" \
    ! -path "./.pnpm-store/*" \
    -exec grep -l "Notploy" {} + | while read -r file; do
    echo "  Processing: $file"
    sed -i 's/Notploy/Guilderia/g' "$file"
done

echo "Step 4 completed"
echo ""

echo "All replacements completed!"
echo ""
echo "Files modified can be checked with: git status"
