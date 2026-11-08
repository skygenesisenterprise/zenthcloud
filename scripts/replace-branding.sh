#!/bin/bash

# Script to replace zenthcloud, discord, and zenthcloud references with zenthcloud

set -euo pipefail

REPO_ROOT="/home/liam/Bureau/enterprise/zenthcloud"
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

# Replace zenthcloud with zenthcloud
replace_in_files "zenthcloud" "zenthcloud"
replace_in_files "ZENTHCLOUD" "ZENTHCLOUD"
replace_in_files "astronCollection" "zenthcloud"

# Replace zenthcloud with zenthcloud
replace_in_files "zenthcloud" "zenthcloud"
replace_in_files "Notploy" "Zenthcloud"
replace_in_files "NOTPLOY" "ZENTHCLOUD"

# Replace discord references (but be careful with URLs)
# We'll handle URLs separately

# Replace discord webhook URLs with zenthcloud equivalents
replace_in_files "discord.gg/GUkDugVh34" "zenthcloud.com/community"
replace_in_files "discord.com/api/webhooks" "zenthcloud.com/api/webhooks"

# Replace discord notification type with zenthcloud
replace_in_files 'notificationType: z.literal("discord")' 'notificationType: z.literal("zenthcloud")'
replace_in_files 'type: z.literal("discord")' 'type: z.literal("zenthcloud")'

# Replace discord table references
replace_in_files 'discord: true,' 'zenthcloud: true,'
replace_in_files 'discordId' 'zenthcloudId'

# Replace package names
replace_in_files "@zenthcloud/server" "@zenthcloud/server"
replace_in_files "@zenthcloud/status" "@zenthcloud/status"

# Replace directory names in comments
replace_in_files "apps/astron" "apps/zenthcloud"

# Replace in Docker image names
replace_in_files "skygenesisenterprise/zenthcloud" "skygenesisenterprise/zenthcloud"

echo ""
echo "Replacement complete!"
echo "Please review the changes and test the application."
