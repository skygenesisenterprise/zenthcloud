#!/usr/bin/env bash
#
# Zenthcloud container entrypoint — the single place that decides how a
# container starts. Every target of the root Dockerfile calls this script, and the
# role is selected by ZENTHCLOUD_ROLE (or by the first argument, which is how
# the one-shot `migrate` job asks for the migrations):
#
#   api       backend: wait for PostgreSQL, optionally migrate, exec dist/server.mjs
#   migrate   one-shot job: wait for PostgreSQL, apply the migrations, exit
#   client    frontend: exec `next start` (or `next dev` in development)
#   status    standalone status page (apps/status), independent from the stack
#   healthcheck  probe the container role and exit (used by Docker HEALTHCHECK)
#
# Flow of the backend roles:
#   1. resolve mode (development | production)
#   2. locate the app directory (production runs in /app, dev runs in the
#      monorepo workspace)
#   3. wait for PostgreSQL to accept connections
#   4. apply database migrations (always for `migrate`, opt-in for `api`)
#   5. exec the server
#
# Escape hatches:
#   ZENTHCLOUD_ROLE=api|client|migrate|status  select the role explicitly
#   ZENTHCLOUD_ROLE=healthcheck                the Docker health probe
#   ZENTHCLOUD_MODE=development                force dev mode
#   ZENTHCLOUD_SKIP_DB_WAIT=1                  skip the wait-for-postgres step
#   ZENTHCLOUD_SKIP_MIGRATIONS=1               skip migrations
#   ZENTHCLOUD_RUN_MIGRATIONS=1                migrate before starting the API
#   ZENTHCLOUD_COMMAND="<cmd>"                 run an arbitrary command instead
#   <entrypoint> shell                                drop into a bash shell
set -euo pipefail

ROLE="${1:-${ZENTHCLOUD_ROLE:-api}}"
case "$ROLE" in
api | client | migrate | status | healthcheck) ;;
*)
	ROLE="api"
	;;
esac

MODE="${ZENTHCLOUD_MODE:-${NODE_ENV:-production}}"
case "$MODE" in
dev | development) MODE="development" ;;
prod | production) MODE="production" ;;
*)
	MODE="production"
	;;
esac

log() { printf '[zenthcloud] %s\n' "$*"; }

# --- Healthcheck ------------------------------------------------------------
# One image serves every role, so the Docker HEALTHCHECK cannot hard-code a
# single path: it asks the entrypoint, which probes the *container* role
# (ZENTHCLOUD_ROLE) on its own port. Exits 0 when the app answers.
if [ "$ROLE" = "healthcheck" ]; then
	probe_role="${ZENTHCLOUD_ROLE:-api}"
	case "$probe_role" in
	client)
		# Probe the login page directly: `/` is a deliberate 307 to `/login`, so
		# probing it produced a `/ 307` + `/login 200` pair in the logs on every
		# healthcheck interval.
		probe="http://127.0.0.1:${PORT:-3000}/login"
		exec node -e "fetch(process.argv[1]).then((r) => process.exit(r.status < 500 ? 0 : 1)).catch(() => process.exit(1))" "$probe"
		;;
	status)
		probe="http://127.0.0.1:${PORT:-4200}/api/v1/pages"
		;;
	*)
		probe="http://127.0.0.1:${PORT:-4000}/api/health"
		;;
	esac
	exec node -e "fetch(process.argv[1]).then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))" "$probe"
fi

# --- Escape hatches --------------------------------------------------------
if [ "${2:-}" = "shell" ] || [ "${1:-}" = "shell" ]; then
	exec bash
fi
if [ -n "${ZENTHCLOUD_COMMAND:-}" ]; then
	log "running custom command: ${ZENTHCLOUD_COMMAND}"
	exec bash -lc "${ZENTHCLOUD_COMMAND}"
fi

# --- Status page application -----------------------------------------------
# `ZENTHCLOUD_ROLE=status` runs the standalone status page (apps/status)
# instead of the platform: no PostgreSQL, no Redis, no migrations. The engine keeps
# its state in a SQLite file under STATUS_DATA_DIR.
if [ "$ROLE" = "status" ]; then
	STATUS_CONTAINER_PORT="${PORT:-4200}"
	if [ "$MODE" = "development" ]; then
		log "role: status (development, port ${STATUS_CONTAINER_PORT})"
		[ -d ./apps/status ] && cd apps/status
		exec pnpm exec next dev -p "${STATUS_CONTAINER_PORT}"
	fi
	log "role: status (production, port ${STATUS_CONTAINER_PORT}, dir: $(pwd))"
	exec ./node_modules/.bin/next start -p "${STATUS_CONTAINER_PORT}" -H "${HOSTNAME:-0.0.0.0}"
fi

# --- Frontend ---------------------------------------------------------------
# The client serves the Next.js UI and proxies `/api/*` to the API through its
# rewrites (API_INTERNAL_URL). It never waits for PostgreSQL, never migrates and
# never starts a worker: it holds no database or Redis credentials at all.
if [ "$ROLE" = "client" ]; then
	CLIENT_CONTAINER_PORT="${PORT:-3000}"
	CLIENT_BIND_HOST="${HOST:-${HOSTNAME:-0.0.0.0}}"
	if [ "$MODE" = "development" ]; then
		log "role: client (development, port ${CLIENT_CONTAINER_PORT})"
		[ -d ./apps/zenthcloud ] && cd apps/zenthcloud
		# Turbopack is the dev bundler (Next 16 default): a route compiles in about a
		# second instead of the ~7s webpack needs for the same page. The webpack
		# configuration is only exported for `next build --webpack`.
		exec pnpm exec next dev -p "${CLIENT_CONTAINER_PORT}" -H "${CLIENT_BIND_HOST}"
	fi
	log "role: client (production, port ${CLIENT_CONTAINER_PORT}, dir: $(pwd))"
	exec ./node_modules/.bin/next start -p "${CLIENT_CONTAINER_PORT}" -H "${CLIENT_BIND_HOST}"
fi

# --- Locate the backend application ----------------------------------------
if [ -n "${ZENTHCLOUD_APP_DIR:-}" ]; then
	cd "${ZENTHCLOUD_APP_DIR}"
elif [ ! -f "./dist/server.mjs" ] && [ -f "./apps/zenthcloud/package.json" ]; then
	# Dev image: we are at the monorepo root, the app lives in apps/zenthcloud.
	cd apps/zenthcloud
fi

if [ "$MODE" = "development" ]; then
	log "role: ${ROLE} (development, app dir: $(pwd))"
	RUNNER=(pnpm exec tsx -r dotenv/config)
	SCRIPT_DIR="."
	SCRIPT_EXT="ts"
	# `tsx watch` reloads the API in place when a source file changes, including
	# `packages/server`, which is imported from source in development. The Compose
	# `sync` action therefore does not need to restart the container.
	SERVER_CMD=(pnpm dev:api)
else
	log "role: ${ROLE} (production, app dir: $(pwd))"
	RUNNER=(node -r dotenv/config)
	SCRIPT_DIR="dist"
	SCRIPT_EXT="mjs"
	SERVER_CMD=(node -r dotenv/config dist/server.mjs)
fi

# --- Wait for PostgreSQL ---------------------------------------------------
if [ "${ZENTHCLOUD_SKIP_DB_WAIT:-0}" != "1" ]; then
	if [ -f "${SCRIPT_DIR}/wait-for-postgres.${SCRIPT_EXT}" ]; then
		log "waiting for the database to accept connections..."
		"${RUNNER[@]}" "${SCRIPT_DIR}/wait-for-postgres.${SCRIPT_EXT}"
	else
		log "wait-for-postgres script not found, skipping"
	fi
else
	log "database wait disabled (ZENTHCLOUD_SKIP_DB_WAIT=1)"
fi

# --- Migrations ------------------------------------------------------------
# Only the `migrate` job and an explicitly opted-in API run them: two API
# replicas must never race on the same schema.
RUN_MIGRATIONS="0"
if [ "$ROLE" = "migrate" ] || [ "${ZENTHCLOUD_RUN_MIGRATIONS:-0}" = "1" ]; then
	RUN_MIGRATIONS="1"
fi

if [ "$RUN_MIGRATIONS" = "1" ] && [ "${ZENTHCLOUD_SKIP_MIGRATIONS:-0}" != "1" ]; then
	if [ -f "${SCRIPT_DIR}/migration.${SCRIPT_EXT}" ]; then
		log "applying database migrations..."
		"${RUNNER[@]}" "${SCRIPT_DIR}/migration.${SCRIPT_EXT}"
	else
		log "migration script not found, skipping"
	fi
fi

# The one-shot job is done: a zero exit is what lets the API start.
if [ "$ROLE" = "migrate" ]; then
	log "migrations applied, exiting"
	exit 0
fi

# --- Start -----------------------------------------------------------------
log "starting Zenthcloud (${ROLE})..."
exec "${SERVER_CMD[@]}"
