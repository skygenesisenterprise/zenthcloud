# syntax=docker/dockerfile:1
#
# Guilderia — single canonical Dockerfile for the platform.
#
# Built from the repository root: the whole monorepo is one pnpm workspace with
# a single `pnpm-lock.yaml`, so only the root context is ever used.
#
#   docker build -t guilderia .                    # the platform image (default target)
#   docker build --target dev -t guilderia-dev .   # development image
#   docker build --target status -t guilderia-status .
#   docker buildx build --target platform .
#
# Stages / targets
#   base        Node + pnpm toolchain
#   dev         dependencies only, runs `next dev` or the backend dev server
#   builder     installs + compiles the app, deploys a pruned /prod/guilderia
#   status      standalone status page (separate product, not part of the stack)
#   platform    client AND api in one artifact — LAST => default target
#
# One image per edition, never one per service: `self`, `cloud` and `console` each
# publish a single image (.github/workflows/docker-publish.yml), and the role of a
# container is chosen at runtime rather than at build time:
#
#   GUILDERIA_ROLE=client   `next start`                    (port 3000)
#   GUILDERIA_ROLE=api      `node dist/server.mjs`          (port 4000)
#   GUILDERIA_ROLE=migrate  one-shot migrations, then exit
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
# `dev` Compose services synchronise apps/guilderia and packages over this stage's
# sources, so the dev servers always run the code on the host and hot-reload it.
# `GUILDERIA_ROLE` selects which one the entrypoint starts.
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
RUN pnpm --filter=./apps/guilderia run build

# Pruned production deployment: package.json + the node_modules subset the runtime
# needs, with the workspace packages resolved. Every runtime artifact copies from here.
RUN pnpm --filter=./apps/guilderia --prod deploy --legacy /prod/guilderia

# ---------------------------------------------------------------------------
# Guilderia Status — the standalone status page (apps/status + the
# packages/status engine). Deliberately independent from the platform: no
# PostgreSQL, no Redis, no workers. The engine owns a dedicated SQLite file under
# STATUS_DATA_DIR, so the whole product is one container and one volume.
#
#   docker build --target status -t guilderia-status .
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
RUN pnpm --filter=@guilderia/status run build
RUN pnpm --filter=@guilderia/status-app run build
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

ARG GUILDERIA_VERSION=dev
LABEL org.opencontainers.image.title="guilderia-status" \
      org.opencontainers.image.description="Guilderia Status — status page, incidents and uptime history" \
      org.opencontainers.image.source="https://github.com/skygenesisenterprise/guilderia" \
      org.opencontainers.image.version="${GUILDERIA_VERSION}" \
      org.opencontainers.image.licenses="Apache-2.0"

EXPOSE 4200

# The probe is role-aware (entrypoint.sh healthcheck reads GUILDERIA_ROLE).
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=5 \
  CMD ["/usr/local/bin/entrypoint.sh", "healthcheck"]

COPY --chmod=0755 entrypoint.sh /usr/local/bin/entrypoint.sh
ENV GUILDERIA_ROLE=status
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
# The edition is baked in as a default (`GUILDERIA_FLAVOR` /
# `GUILDERIA_PRODUCT`, the values docker-publish.yml passes) and can be
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
COPY --from=builder /prod/guilderia/package.json ./package.json
COPY --from=builder /prod/guilderia/node_modules ./node_modules
COPY --from=builder /prod/guilderia/drizzle ./drizzle
COPY --from=builder /usr/src/app/apps/guilderia/dist ./dist

# --- Frontend artifacts -----------------------------------------------------
COPY --from=builder /prod/guilderia/next.config.mjs ./next.config.mjs
COPY --from=builder /prod/guilderia/public ./public
COPY --from=builder /usr/src/app/apps/guilderia/.next ./.next

# Unprivileged runtime: neither role writes outside its temp directory.
RUN groupadd --system --gid 1001 guilderia \
    && useradd --system --uid 1001 --gid guilderia --home-dir /app guilderia \
    && chown -R guilderia:guilderia /app

ARG GUILDERIA_VERSION=dev
ARG GUILDERIA_FLAVOR=selfhosted
ARG GUILDERIA_PRODUCT=self
ENV GUILDERIA_FLAVOR=${GUILDERIA_FLAVOR}
ENV GUILDERIA_PRODUCT=${GUILDERIA_PRODUCT}
LABEL org.opencontainers.image.title="guilderia" \
      org.opencontainers.image.description="Guilderia platform — client and API in one image" \
      org.opencontainers.image.source="https://github.com/skygenesisenterprise/guilderia" \
      org.opencontainers.image.version="${GUILDERIA_VERSION}" \
      org.opencontainers.image.licenses="Apache-2.0"

# Both roles are served by this image; Compose publishes the one the service needs.
EXPOSE 3000 4000

# Role-aware probe: `client` checks `/`, `api` checks `/api/health`.
HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=5 \
  CMD ["/usr/local/bin/entrypoint.sh", "healthcheck"]

COPY --chmod=0755 entrypoint.sh /usr/local/bin/entrypoint.sh
# Default role; every Compose service states its own explicitly.
ENV GUILDERIA_ROLE=api

USER guilderia
ENTRYPOINT ["/usr/bin/tini", "--", "/usr/local/bin/entrypoint.sh"]
