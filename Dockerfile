# syntax=docker/dockerfile:1
#
# Zenthcloud — single canonical Dockerfile for the platform.
#
# Built from the repository root: the whole monorepo is one pnpm workspace with
# a single `pnpm-lock.yaml`, so only the root context is ever used.
#
#   docker build -t zenthcloud .                    # the platform image (default target)
#   docker build --target dev -t zenthcloud-dev .   # development image
#   docker build --target status -t zenthcloud-status .
#   docker buildx build --target platform .
#
# Stages / targets
#   base        Node + pnpm toolchain
#   dev         dependencies only, runs `next dev` or the backend dev server
#   builder     installs + compiles the app, deploys a pruned /prod/zenthcloud
#   status      standalone status page (separate product, not part of the stack)
#   platform    client AND api in one artifact — LAST => default target
#
# One image per edition, never one per service: `self`, `cloud` and `console` each
# publish a single image (.github/workflows/docker-publish.yml), and the role of a
# container is chosen at runtime rather than at build time:
#
#   ZENTHCLOUD_ROLE=client   `next start`                    (port 3000)
#   ZENTHCLOUD_ROLE=api      `node dist/server.mjs`          (port 4000)
#   ZENTHCLOUD_ROLE=migrate  one-shot migrations, then exit
#
# Client and API therefore always come from the same digest and can never drift
# apart. The production images never run as root, never carry build tooling, and
# never need the host Docker socket. All launch logic lives in entrypoint.sh.

# ---------------------------------------------------------------------------
# Toolchain
# ---------------------------------------------------------------------------
FROM node:24.4.0-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Compile native addons (node-pty, bcrypt, ssh2, cpu-features) against the
# headers already shipped in the Node image. Without this node-gyp downloads
# node-v24.4.0-headers.tar.gz from nodejs.org during pnpm install, which fails
# on networks that only allow the npm registry.
ENV npm_config_nodedir=/usr/local
# Matches the `packageManager` field of the root package.json and therefore the
# lockfile that `--frozen-lockfile` validates against.
ARG PNPM_VERSION=12.16.1
RUN npm install -g pnpm@${PNPM_VERSION}
# ca-certificates keeps outbound TLS verification working in the slim image.
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# ---------------------------------------------------------------------------
# Development image (dependencies + sources, never a production build). The
# `dev` Compose services synchronise apps/zenthcloud and packages over this stage's
# sources, so the dev servers always run the code on the host and hot-reload it.
# `ZENTHCLOUD_ROLE` selects which one the entrypoint starts.
# ---------------------------------------------------------------------------
FROM base AS dev
COPY . /usr/src/app
WORKDIR /usr/src/app

# Build toolchain for the native modules installed by pnpm.
RUN apt-get update && apt-get install -y python3 make g++ git pkg-config libsecret-1-dev \
    && rm -rf /var/lib/apt/lists/*

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# All launch logic (wait for DB, optional migrations, server) lives in entrypoint.sh.
COPY --chmod=0755 entrypoint.sh /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# ---------------------------------------------------------------------------
# Builder (production artifacts, shared by every runtime artifact below)
# ---------------------------------------------------------------------------
FROM base AS builder
COPY . /usr/src/app
WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y python3 make g++ git pkg-config libsecret-1-dev \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Next.js otherwise phones home (telemetry) during the build; disabling it removes
# a network round-trip from every build without changing the produced artifacts.
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Server bundle (esbuild: dist/server.mjs, dist/migration.mjs, …) and Next build.
RUN pnpm --filter=./apps/zenthcloud run build

# Pruned production deployment: package.json + the node_modules subset the runtime
# needs, with the workspace packages resolved. Every runtime artifact copies from here.
RUN pnpm --filter=./apps/zenthcloud --prod deploy --legacy /prod/zenthcloud

# ---------------------------------------------------------------------------
# Zenthcloud Status — the standalone status page (apps/status + the
# packages/status engine). Deliberately independent from the platform: no
# PostgreSQL, no Redis, no workers. The engine owns a dedicated SQLite file under
# STATUS_DATA_DIR, so the whole product is one container and one volume.
#
#   docker build --target status -t zenthcloud-status .
#
# Kept before `platform` so `platform` stays the default target (the last stage).
# ---------------------------------------------------------------------------
FROM base AS status-builder
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Status engine bundle (seed CLI included) and the Next status app.
RUN pnpm --filter=@zenthcloud/status run build
RUN pnpm --filter=@zenthcloud/status-app run build
# Pruned production deployment of the status app.
RUN pnpm --filter=./apps/status --prod deploy --legacy /prod/status

FROM base AS status
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=4200
RUN apt-get update && apt-get install -y --no-install-recommends tini \
    && rm -rf /var/lib/apt/lists/*

COPY --from=status-builder /prod/status/package.json ./package.json
COPY --from=status-builder /prod/status/node_modules ./node_modules
COPY --from=status-builder /usr/src/app/apps/status/.next ./.next
COPY --from=status-builder /usr/src/app/apps/status/public ./public
COPY --from=status-builder /usr/src/app/apps/status/next.config.mjs ./next.config.mjs
# Seed CLI (bundled): resolves its dependencies from the node_modules above.
COPY --from=status-builder /usr/src/app/packages/status/dist ./engine-dist

ARG ZENTHCLOUD_VERSION=dev
LABEL org.opencontainers.image.title="zenthcloud-status" \
      org.opencontainers.image.description="Zenthcloud Status — status page, incidents and uptime history" \
      org.opencontainers.image.source="https://github.com/skygenesisenterprise/zenthcloud" \
      org.opencontainers.image.version="${ZENTHCLOUD_VERSION}" \
      org.opencontainers.image.licenses="Apache-2.0"

EXPOSE 4200

# The probe is role-aware (entrypoint.sh healthcheck reads ZENTHCLOUD_ROLE).
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=5 \
  CMD ["/usr/local/bin/entrypoint.sh", "healthcheck"]

COPY --chmod=0755 entrypoint.sh /usr/local/bin/entrypoint.sh
ENV ZENTHCLOUD_ROLE=status
ENTRYPOINT ["/usr/bin/tini", "--", "/usr/local/bin/entrypoint.sh"]

# ---------------------------------------------------------------------------
# Platform — the single image of an edition (`self`, `cloud`, `console`).
#
# It carries both runtimes, and nothing else:
#
#   client role   `.next`, `public`, `next.config.mjs`. `next start` serves the UI
#                 and rewrites `/api/*` to the API service (API_INTERNAL_URL).
#                 No DATABASE_URL, no REDIS_URL: it cannot do backend work.
#   api role      `dist/` (server + migration bundles) and `drizzle/`. tRPC and
#                 OpenAPI routes, better-auth, WebSockets, BullMQ workers and cron
#                 jobs. It is the only role that receives database and Redis
#                 credentials, and the only one that applies migrations.
#
# The edition is baked in as a default (`ZENTHCLOUD_FLAVOR` /
# `ZENTHCLOUD_PRODUCT`, the values docker-publish.yml passes) and can be
# overridden at runtime, which is what `make docker-up self|cloud|console` does.
# ---------------------------------------------------------------------------
FROM base AS platform
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Default port of the api role; the client role runs with PORT=3000 (Compose sets it).
ENV PORT=4000

RUN apt-get update && apt-get install -y --no-install-recommends tini \
    && rm -rf /var/lib/apt/lists/*

# --- Backend artifacts ------------------------------------------------------
COPY --from=builder /prod/zenthcloud/package.json ./package.json
COPY --from=builder /prod/zenthcloud/node_modules ./node_modules
COPY --from=builder /prod/zenthcloud/drizzle ./drizzle
COPY --from=builder /usr/src/app/apps/zenthcloud/dist ./dist

# --- Frontend artifacts -----------------------------------------------------
COPY --from=builder /prod/zenthcloud/next.config.mjs ./next.config.mjs
COPY --from=builder /prod/zenthcloud/public ./public
COPY --from=builder /usr/src/app/apps/zenthcloud/.next ./.next

# Unprivileged runtime: neither role writes outside its temp directory.
RUN groupadd --system --gid 1001 zenthcloud \
    && useradd --system --uid 1001 --gid zenthcloud --home-dir /app zenthcloud \
    && chown -R zenthcloud:zenthcloud /app

ARG ZENTHCLOUD_VERSION=dev
ARG ZENTHCLOUD_FLAVOR=selfhosted
ARG ZENTHCLOUD_PRODUCT=self
ENV ZENTHCLOUD_FLAVOR=${ZENTHCLOUD_FLAVOR}
ENV ZENTHCLOUD_PRODUCT=${ZENTHCLOUD_PRODUCT}
LABEL org.opencontainers.image.title="zenthcloud" \
      org.opencontainers.image.description="Zenthcloud platform — client and API in one image" \
      org.opencontainers.image.source="https://github.com/skygenesisenterprise/zenthcloud" \
      org.opencontainers.image.version="${ZENTHCLOUD_VERSION}" \
      org.opencontainers.image.licenses="Apache-2.0"

# Both roles are served by this image; Compose publishes the one the service needs.
EXPOSE 3000 4000

# Role-aware probe: `client` checks `/`, `api` checks `/api/health`.
HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=5 \
  CMD ["/usr/local/bin/entrypoint.sh", "healthcheck"]

COPY --chmod=0755 entrypoint.sh /usr/local/bin/entrypoint.sh
# Default role; every Compose service states its own explicitly.
ENV ZENTHCLOUD_ROLE=api

USER zenthcloud
ENTRYPOINT ["/usr/bin/tini", "--", "/usr/local/bin/entrypoint.sh"]
