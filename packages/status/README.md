# ZenthCloud Status

[![npm](https://img.shields.io/npm/v/@zenthcloud/status.svg?style=flat&color=brightgreen)](https://www.npmjs.com/package/@zenthcloud/status)
[![Node](https://img.shields.io/badge/Node-%3E%3D22.5.0-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Hono](https://img.shields.io/badge/Hono-HTTP-E36002)](https://hono.dev)
[![SQLite](https://img.shields.io/badge/SQLite-embedded-003B57?logo=sqlite&logoColor=white)](https://sqlite.org)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue)](./LICENSE)

> An independent status page platform engine for the ZenthCloud and SGE ecosystems.

**`@zenthcloud/status`** owns the domain model, state computation, durable persistence, public/admin/integration HTTP API, notification outbox and integration client of ZenthCloud Status. It is a library: the web interface lives in `apps/status` and consumes it.

The platform has no dependency on ZenthCloud Console and keeps serving the last known public state when the control plane, or its own storage, is down.

**Perfect for:** operators who need a status page that survives a control-plane outage, teams that want a status engine independent of their main application, and integrations that publish incidents and component state through a scoped API.

## Contents

- [ZenthCloud Status](#zenthcloud-status)
  - [Contents](#contents)
  - [Why ZenthCloud Status matters](#why-zenthcloud-status-matters)
  - [What you can do](#what-you-can-do)
  - [Quick start](#quick-start)
    - [Requirements](#requirements)
    - [Install and build](#install-and-build)
    - [Bootstrap a page and a token](#bootstrap-a-page-and-a-token)
    - [Mount the API](#mount-the-api)
    - [Start the background workers](#start-the-background-workers)
  - [Configuration](#configuration)
  - [HTTP API](#http-api)
    - [Health](#health)
    - [Public API](#public-api)
    - [Admin API](#admin-api)
    - [Integration API](#integration-api)
  - [How ZenthCloud Status is built](#how-zenthcloud-status-is-built)
    - [Status Core](#status-core)
    - [Status Operations](#status-operations)
    - [Status API](#status-api)
    - [Degradation to snapshot mode](#degradation-to-snapshot-mode)
  - [Operations](#operations)
    - [Backups and restore](#backups-and-restore)
    - [Notification outbox](#notification-outbox)
    - [Uptime sampler](#uptime-sampler)
  - [Development](#development)
  - [FAQ](#faq)
  - [Related resources](#related-resources)
  - [Contributing](#contributing)
  - [Security](#security)
  - [License](#license)
  - [Note](#note)

## Why ZenthCloud Status matters

🎯 **Failure-independent** — Its own SQLite database lives outside the control-plane database, so a control-plane outage cannot take the status page down.

🚀 **Survives storage failure** — When the database cannot be opened, it switches to snapshot mode and keeps serving the last known public state read-only.

📦 **Clear isolation boundary** — Only projected DTOs leave the public API; private components and unpublished drafts have no path there.

🔒 **Scoped, hashed tokens** — Bearer tokens use least-privilege scopes, secrets are hashed, and the plaintext value is shown exactly once.

🧩 **Machine-to-machine integrations** — Ingest monitoring events and component state without making anything public implicitly.

## What you can do

- Create status pages, components, incidents and maintenances.
- Compute the global status and per-component state.
- Record daily uptime and query uptime windows.
- Publish and unpublish content explicitly.
- Serve public JSON and an RSS feed per page.
- Manage tokens, audit entries and webhook subscriptions.
- Ingest monitoring events idempotently.
- Keep notifying subscribers after a restart, through a durable outbox.
- Back up the SQLite database without stopping the platform.

## Quick start

### Requirements

- Node.js `>=22.5.0` (uses the built-in `node:sqlite`)
- pnpm `>=10.22.0`

### Install and build

```bash
pnpm install
pnpm --filter @zenthcloud/status build
pnpm --filter @zenthcloud/status typecheck
```

### Bootstrap a page and a token

```bash
# Create the ZenthCloud page and its components from the shipped catalog.
pnpm --filter @zenthcloud/status seed -- --slug zenthcloud

# Create a token with least-privilege scopes. The value is printed once.
pnpm --filter @zenthcloud/status token:create -- --name "Console" --scopes write,publish,ingest
```

The seed is idempotent: an existing page or component is left untouched, so it is safe to re-run after an upgrade.

### Mount the API

`createStatusApi` returns a plain Hono app that any host can serve. The Next.js status application mounts it through a catch-all route.

```ts
import { createStatusPlatform } from "@zenthcloud/status";

const platform = createStatusPlatform();
// platform.api.fetch(request) — mount in the host of your choice.
```

Or build the API directly from a context:

```ts
import { createStatusContext } from "@zenthcloud/status";
import { createStatusApi } from "@zenthcloud/status/api";
import { loadConfig } from "@zenthcloud/status";

const config = loadConfig();
const ctx = createStatusContext({ config });
const api = createStatusApi(ctx);

const response = await api.fetch(new Request("http://localhost/healthz"));
```

### Start the background workers

```ts
const workers = platform.startWorkers();
// workers?.stop() on shutdown.
```

`startWorkers()` starts the notification outbox and the daily uptime sampler. It returns `null` in snapshot mode or when both intervals are `0`.

## Configuration

Configuration is read from the environment by `loadConfig()`. A misconfigured value fails fast with a clear message instead of silently degrading.

| Variable | Description | Default |
| --- | --- | --- |
| `STATUS_DATA_DIR` | Directory holding `status.db`, `snapshot.json` and `backups/`. | `./data` |
| `STATUS_PUBLIC_URL` | Canonical public origin, used for absolute links and the RSS feed. | `http://localhost:${PORT}` |
| `STATUS_CORS_ORIGINS` | Allowed CORS origins, `*` or a comma-separated list. | `*` |
| `STATUS_RATE_LIMIT_WINDOW_MS` | Rate limit window in milliseconds. | `60000` |
| `STATUS_RATE_LIMIT_PUBLIC_MAX` | Requests per window on the public API. | `240` |
| `STATUS_RATE_LIMIT_ADMIN_MAX` | Requests per window on admin and integration APIs. | `120` |
| `STATUS_MAX_BODY_BYTES` | Maximum accepted request body size. | `65536` |
| `STATUS_SECRET_KEY` | Master key used to derive webhook signing keys. Webhook delivery is disabled when unset. | — |
| `STATUS_OUTBOX_INTERVAL_MS` | Outbox worker interval. `0` disables it. | `15000` |
| `STATUS_UPTIME_INTERVAL_MS` | Daily uptime sampler interval. `0` disables it. | `300000` |
| `STATUS_OUTBOX_MAX_ATTEMPTS` | Delivery attempts before an entry is parked as `dead`. | `6` |
| `STATUS_BACKUP_RETENTION` | Number of backups to keep. | `14` |
| `STATUS_LOG_LEVEL` | `debug`, `info`, `warn` or `error`. | `info` |
| `PORT` | Port used to build the default public URL. | `3000` |

The database file is always `<STATUS_DATA_DIR>/status.db`, the snapshot is `<STATUS_DATA_DIR>/snapshot.json`, and backups live in `<STATUS_DATA_DIR>/backups/`.

## HTTP API

All routes are served by the Hono application. Every response carries an `x-request-id` header. The OpenAPI document is available at `/api/v1/openapi.json`.

### Health

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/healthz` | Process liveness. Works even when storage is broken. |
| `GET` | `/readyz` | Storage readiness, including the schema version. Returns `503` when storage fails. |

Neither endpoint discloses paths, dependency versions or infrastructure details.

### Public API

`/api/v1` is unauthenticated and read-only. Only projected DTOs leave this surface.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/pages` | List public pages. |
| `GET` | `/pages/:slug` | Get a public page. |
| `GET` | `/pages/:slug/status` | Get the computed global status. |
| `GET` | `/pages/:slug/components` | List public components. |
| `GET` | `/pages/:slug/uptime` | List uptime, optionally filtered by `componentId`. |
| `GET` | `/pages/:slug/incidents` | List incidents with `status`, `limit` and `cursor`. |
| `GET` | `/pages/:slug/incidents/:incidentId` | Get a public incident. |
| `GET` | `/pages/:slug/incidents/:incidentId/updates` | List public incident updates. |
| `GET` | `/pages/:slug/maintenances` | List maintenances with `status`, `limit` and `cursor`. |
| `GET` | `/pages/:slug/history` | List history with `from`, `to`, `componentId` and `state`. |
| `GET` | `/pages/:slug/feed.xml` | RSS feed for the page. |

### Admin API

`/api/v1/admin` requires a bearer token. Scopes follow least privilege:

- `read` — inspect internal state, timeline and audit entries.
- `write` — manage pages, components and unpublished drafts.
- `publish` — make content public or change published content.
- `tokens` — create and revoke credentials.
- `ingest` — submit monitoring events and component state.
- `admin` — grants every scope.

| Method | Path | Scope |
| --- | --- | --- |
| `GET` | `/pages` | `read` |
| `POST` | `/pages` | `write` |
| `GET` | `/pages/:ref` | `read` |
| `PATCH` | `/pages/:ref` | `write` |
| `GET` | `/pages/:ref/components` | `read` |
| `POST` | `/pages/:ref/components` | `write` |
| `PATCH` | `/components/:componentId` | `write` |
| `DELETE` | `/components/:componentId` | `write` |
| `GET` | `/pages/:ref/incidents` | `read` |
| `POST` | `/pages/:ref/incidents` | `write` (`publish` when published) |
| `GET` | `/incidents/:incidentId` | `read` |
| `GET` | `/incidents/:incidentId/timeline` | `read` |
| `PATCH` | `/incidents/:incidentId` | `write` |
| `POST` | `/incidents/:incidentId/state` | `publish` |
| `POST` | `/incidents/:incidentId/updates` | `publish` |
| `POST` | `/incidents/:incidentId/publish` | `publish` |
| `DELETE` | `/incidents/:incidentId` | `write` |
| `GET` | `/pages/:ref/maintenances` | `read` |
| `POST` | `/pages/:ref/maintenances` | `publish` |
| `PATCH` | `/maintenances/:maintenanceId` | `write` |
| `POST` | `/maintenances/:maintenanceId/state` | `publish` |
| `POST` | `/maintenances/:maintenanceId/publish` | `publish` |
| `DELETE` | `/maintenances/:maintenanceId` | `write` |
| `GET` | `/tokens` | `tokens` |
| `POST` | `/tokens` | `tokens` |
| `DELETE` | `/tokens/:tokenId` | `tokens` |
| `GET` | `/audit` | `read` |
| `GET` | `/webhooks` | `read` |
| `POST` | `/webhooks` | `write` |

Sensitive operations are audited, and publication POSTs honour the `Idempotency-Key` header so a network retry cannot duplicate a public incident.

### Integration API

`/api/v1/integration` is machine-to-machine and requires a token with the `ingest` scope. Publication remains an explicit decision: ingesting an event never makes anything public unless the target page opted into `autoIncident` **and** `autoPublish`.

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/events` | Ingest a monitoring event (`202`). |
| `POST` | `/pages/:slug/components/:componentId/state` | Set observed component state. |
| `GET` | `/pages/:slug/components/:componentId/state` | Read observed and last published state. |

```bash
curl -X POST "$STATUS_PUBLIC_URL/api/v1/integration/pages/zenthcloud/components/<componentId>/state" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "observedStatus": "operational" }'
```

## How ZenthCloud Status is built

The package is TypeScript with strict mode. It depends only on Hono and Zod at runtime and persists to SQLite through the built-in `node:sqlite`.

| Area | Location | Role |
| --- | --- | --- |
| Status Core | `src/core/` | Types, schemas, catalog, state engine, uptime and time helpers |
| Services | `src/services/` | Pages, components, incidents, maintenances, ingest, public projections, security, settings, outbox |
| Store | `src/store/` | SQLite access and migrations |
| API | `src/api/` | Hono app, public/admin/integration routes, health, OpenAPI, RSS, snapshot API |
| Operations | `src/operations/` | Outbox worker, uptime sampler, backups |
| Auth | `src/auth/` | Token generation, parsing and verification |
| Integration | `src/integration/` | `StatusPublisher` client |

### Status Core

`src/core/` defines the domain types and Zod contracts, the shipped catalog (`ZENTHCLOUD_STATUS_CATALOG`), the status engine, time helpers and uptime math. The engine computes the global status from component states and incident impact.

### Status Operations

`src/operations/` contains the durable outbox worker, the daily uptime sampler and backup creation. Delivery is resumable by construction: everything lives in the `notification_outbox` table, so a restart continues from pending entries.

### Status API

`src/api/` builds the Hono application. `createStatusApi(ctx)` wires middleware, rate limits, CORS, error handling and the three route groups. The API is testable without a browser or a running server, and the host mounts `api.fetch`.

### Degradation to snapshot mode

`createStatusPlatform()` catches storage failures. It then serves the last known public state from `snapshot.json` in read-only mode. Public pages stay up, while admin and integration APIs answer `503`.

## Operations

### Backups and restore

```bash
pnpm --filter @zenthcloud/status backup           # create a consistent backup
pnpm --filter @zenthcloud/status backup -- --list  # list backups, newest first
```

Restore is manual by design: stop the application, replace `<STATUS_DATA_DIR>/status.db` with the backup file, then restart. Retention keeps the last `STATUS_BACKUP_RETENTION` backups.

### Notification outbox

The outbox worker drains the notification queue on `STATUS_OUTBOX_INTERVAL_MS`. Entries are retried up to `STATUS_OUTBOX_MAX_ATTEMPTS` before being parked as `dead`. Webhook delivery requires `STATUS_SECRET_KEY`; without it, delivery is disabled and no secret is stored in the database.

### Uptime sampler

The sampler records daily uptime buckets on `STATUS_UPTIME_INTERVAL_MS`. When it is disabled, buckets only advance on mutations.

## Development

```bash
pnpm --filter @zenthcloud/status test          # vitest run
pnpm --filter @zenthcloud/status test:watch    # vitest
pnpm --filter @zenthcloud/status lint          # biome check
pnpm --filter @zenthcloud/status lint:fix      # biome check --write
pnpm --filter @zenthcloud/status generate:openapi
```

Tests cover the catalog, uptime helpers, token parsing and bearer authentication, plus public/admin isolation.

## FAQ

### Does the status page depend on ZenthCloud Console?

No. It runs independently and keeps serving the last known public state when the control plane is unavailable.

### Where is data stored?

In `<STATUS_DATA_DIR>/status.db`, a SQLite file opened with WAL mode, foreign keys and a busy timeout. The snapshot is `<STATUS_DATA_DIR>/snapshot.json`.

### What happens if the database fails?

The platform switches to snapshot mode: public pages are served read-only, while admin and integration APIs return `503`.

### How do I create the first token?

Run `token:create` with local access to the data directory. The plaintext value is printed once; only its hash is stored.

### How do I make an incident public?

Set `published`, or call the publish endpoint. Creating or ingesting content never publishes it implicitly unless the page opted into `autoIncident` and `autoPublish`.

### Can I use this from another service?

Yes. Use `createStatusPublisher` from `@zenthcloud/status/client`, or call the integration API with an `ingest` token.

## Related resources

- Web interface: [`apps/status`](apps/status)
- API surface: [`src/api`](src/api)
- Domain model: [`src/core`](src/core)
- Integration client: [`src/integration/client.ts`](src/integration/client.ts)
- OpenAPI document: `/api/v1/openapi.json`
- ZenthCloud repository: [github.com/skygenesisenterprise/zenthcloud](https://github.com/skygenesisenterprise/zenthcloud)

## Contributing

Contributions and suggestions are welcome. Read the repository [contribution guide](https://github.com/skygenesisenterprise/zenthcloud) before participating. Run the tests and lint before opening a pull request, and do not push directly to `main`.

## Security

Do not report security vulnerabilities in public issues. Follow the private reporting instructions in the repository [`SECURITY.md`](https://github.com/skygenesisenterprise/zenthcloud). Keep `STATUS_DATA_DIR` private, treat tokens as secrets, and store the plaintext value only in a secret manager.

## License

Distributed under the Apache License 2.0. See [LICENSE](./LICENSE) for more information.

## Note

ZenthCloud Status is an open-source project maintained by [Sky Genesis Enterprise](https://skygenesisenterprise.com). Links to external services are provided for convenience and do not imply endorsement.
