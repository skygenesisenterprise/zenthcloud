#!/bin/bash

# Script to replace guilderia, discord, and guilderia references with guilderia

set -euo pipefail

REPO_ROOT="/home/liam/Bureau/enterprise/guilderia"
cd "$REPO_ROOT"

# Files to exclude
exclude_patterns=(
    "./node_modules/*"
    "./.pnpm/*"
    "./.next/*"
    "./dist/*"
    "./.git/*"
    "*/.next/*"
    "*/dist/*"
    "*/node_modules/*"
)

# Build find command with exclusions
find_cmd="find . -type f \("
for pattern in "${exclude_patterns[@]}"; do
    find_cmd+=" !-path '$pattern'"
done
find_cmd+=" \)"

# Function to replace in files
replace_in_files() {
    local pattern="$1"
    local replacement="$2"
    
    echo "Replacing '$pattern' with '$replacement'..."
    
    # Find files containing the pattern
    files=$(eval "$find_cmd" -exec grep -l "$pattern" {} \; 2>/dev/null | grep -v ".sh$" || true)
    
    if [ -z "$files" ]; then
        echo "No files found with pattern: $pattern"
        return
    fi
    
    echo "Found $(echo "$files" | wc -l) files with pattern: $pattern"
    
    # Replace in each file
    while IFS= read -r file; do
        if [ -f "$file" ]; then
            # Use sed to replace, handling special characters
            sed -i "s|$pattern|$replacement|g" "$file"
            echo "  Replaced in: $file"
        fi
    done <<< "$files"
}

# Replace guilderia with guilderia
replace_in_files "guilderia" "guilderia"
replace_in_files "GUILDERIA" "GUILDERIA"
replace_in_files "astronCollection" "guilderia"

# Replace guilderia with guilderia
replace_in_files "guilderia" "guilderia"
replace_in_files "Notploy" "Guilderia"
replace_in_files "NOTPLOY" "GUILDERIA"

# Replace discord references (but be careful with URLs)
# We'll handle URLs separately

# Replace discord webhook URLs with guilderia equivalents
replace_in_files "discord.gg/GUkDugVh34" "guilderia.com/community"
replace_in_files "discord.com/api/webhooks" "guilderia.com/api/webhooks"

# Replace discord notification type with guilderia
replace_in_files 'notificationType: z.literal("discord")' 'notificationType: z.literal("guilderia")'
replace_in_files 'type: z.literal("discord")' 'type: z.literal("guilderia")'

# Replace discord table references
replace_in_files 'discord: true,' 'guilderia: true,'
replace_in_files 'discordId' 'guilderiaId'

# Replace package names
replace_in_files "@guilderia/server" "@guilderia/server"
replace_in_files "@guilderia/status" "@guilderia/status"

# Replace directory names in comments
replace_in_files "apps/astron" "apps/guilderia"

# Replace in Docker image names
replace_in_files "skygenesisenterprise/guilderia" "skygenesisenterprise/guilderia"

echo ""
echo "Replacement complete!"
echo "Please review the changes and test the application."
