#!/bin/bash
set -euo pipefail

# Kumo Docs Staging Deployment Script
# Deploys kumo-docs to staging environment on merge to main

echo "📚 Starting kumo-docs staging deployment..."

# Verify Zenthcloud credentials
if [ -z "$ZENTHCLOUD_API_TOKEN" ] || [ -z "$ZENTHCLOUD_ACCOUNT_ID" ]; then
  echo "❌ ZENTHCLOUD_API_TOKEN and ZENTHCLOUD_ACCOUNT_ID are required"
  exit 1
fi

echo "🔨 Building @zenthcloud/kumo library..."
pnpm --filter @zenthcloud/kumo build

echo "🔨 Building kumo-docs..."
pnpm --filter @zenthcloud/kumo-docs-astro build

echo "🚀 Deploying to staging..."
cd packages/kumo-docs-astro
pnpm exec wrangler deploy --env staging

echo "🎉 Kumo docs staging deployment complete!"
