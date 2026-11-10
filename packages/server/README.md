# ZenthCloud Server

[![npm](https://img.shields.io/npm/v/@zenthcloud/server.svg?style=flat&color=brightgreen)](https://www.npmjs.com/package/@zenthcloud/server)
[![Node](https://img.shields.io/badge/Node-%5E24.4.0-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-required-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![License](https://img.shields.io/badge/License-see%20repository-lightgrey)](https://github.com/skygenesisenterprise/zenthcloud)

> The server engine behind ZenthCloud: deployment services, database schema, setup routines and runtime utilities.

**`@zenthcloud/server`** is the shared server package of the ZenthCloud platform. It contains the domain services that create and deploy applications and compose stacks, the Drizzle schema and connection, the Docker and Traefik integration, server setup routines, backup and restore helpers, monitoring, gateway error pages and the supporting utilities used by the API and dashboard applications.

**Perfect for:** contributors working on ZenthCloud's control plane, host applications that need to reuse the deployment engine, and operators who need to understand the configuration the server expects.

## Contents

- [ZenthCloud Server](#zenthcloud-server)
  - [Contents](#contents)
  - [Why ZenthCloud Server matters](#why-zenthcloud-server-matters)
  - [What you can do](#what-you-can-do)
  - [Quick start](#quick-start)
    - [Requirements](#requirements)
    - [Install and build](#install-and-build)
    - [Connecting to the database](#connecting-to-the-database)
    - [Using the package](#using-the-package)
  - [Configuration](#configuration)
    - [Database](#database)
    - [Authentication and encryption](#authentication-and-encryption)
    - [Product and entitlements](#product-and-entitlements)
    - [Docker](#docker)
    - [Paths](#paths)
    - [Other environment variables](#other-environment-variables)
  - [How ZenthCloud Server is built](#how-zenthcloud-server-is-built)
    - [Services](#services)
    - [Setup routines](#setup-routines)
    - [Deployment builders](#deployment-builders)
    - [Backups and volume backups](#backups-and-volume-backups)
    - [Monitoring and traffic](#monitoring-and-traffic)
    - [Gateway errors](#gateway-errors)
    - [Database export](#database-export)
  - [Development](#development)
  - [FAQ](#faq)
  - [Related resources](#related-resources)
  - [Contributing](#contributing)
  - [Security](#security)
  - [License](#license)
  - [Note](#note)

## Why ZenthCloud Server matters

🎯 **Single deployment engine** — Applications, compose stacks, previews, rollbacks, servers and backups all share one set of services.

🚀 **Docker and Traefik first** — Containers, Swarm, overlay networking, routing and certificates are managed through one client.

📦 **Typed database layer** — Drizzle ORM with a Postgres schema and a process-wide connection pool.

🔒 **Secrets handled safely** — Auth and encryption keys can come from environment variables or Docker secret files, and sensitive values are redacted from logs.

🧩 **Reusable by hosts** — The API, dashboard and scheduler applications mount the same services instead of duplicating deployment logic.

## What you can do

- Create and deploy applications, compose stacks, previews and rollbacks.
- Manage projects, environments, domains, certificates, redirects and ports.
- Provision servers over SSH and set up Docker, Swarm, Traefik, Nixpacks, Buildpacks and Railpack.
- Back up and restore databases and volumes.
- Monitor server health and collect traffic analytics.
- Serve branded gateway error pages with request IDs.
- Use Git providers such as GitHub, GitLab, Gitea and Bitbucket.
- Manage object storage, registries, LibSQL, MariaDB, MongoDB, MySQL, PostgreSQL and Redis services.

## Quick start

### Requirements

- Node.js `^24.4.0`
- pnpm `>=10.22.0`
- PostgreSQL for the control-plane database
- Docker, reachable through a local socket, `DOCKER_HOST` or a remote host

### Install and build

```bash
pnpm install
pnpm --filter @zenthcloud/server build
```

The package exports TypeScript sources during development and compiled output after `build`, which runs `tsc` and rewrites path aliases.

```bash
pnpm --filter @zenthcloud/server dev        # esbuild + declarations
pnpm --filter @zenthcloud/server typecheck  # tsc --noEmit
```

### Connecting to the database

The connection is created once per process and cached on `globalThis`, so bundlers that duplicate the module still share a single pool.

```ts
import { db, dbUrl } from "@zenthcloud/server/db";

const applications = await db.query.applications.findMany();
console.log(dbUrl);
```

Prefer `DATABASE_URL`, or point `POSTGRES_PASSWORD_FILE` at a Docker secret. Without either, the package falls back to legacy hardcoded credentials and prints a deprecation warning.

### Using the package

```ts
import { docker, paths } from "@zenthcloud/server/constants";
import { createApplication } from "@zenthcloud/server";

console.log(paths().APPLICATIONS_PATH);

const application = await createApplication({
  // fields defined by the Drizzle schema
  appName: "my-app",
  // ...
});

console.log(application.applicationId);
```

`@zenthcloud/server` is a library, not a listening server. The HTTP surface lives in the host applications: `apps/api` serves the programmatic API, and `apps/zenthcloud` and `apps/schedules` mount the same services.

## Configuration

### Database

| Variable | Description | Default |
| --- | --- | --- |
| `DATABASE_URL` | Full Postgres connection URL. Takes precedence over the `POSTGRES_*` variables. | — |
| `POSTGRES_PASSWORD_FILE` | Path to a file containing the Postgres password. Builds the URL with the variables below. | — |
| `POSTGRES_USER` | Postgres user. | `zenthcloud` |
| `POSTGRES_DB` | Postgres database. | `zenthcloud` |
| `POSTGRES_HOST` | Postgres host. | `zenthcloud-postgres` |
| `POSTGRES_PORT` | Postgres port. | `5432` |

### Authentication and encryption

| Variable | Description |
| --- | --- |
| `BETTER_AUTH_SECRET` | Secret used by Better Auth. |
| `BETTER_AUTH_SECRET_FILE` | File containing the auth secret, for Docker secret deployments. |
| `ENCRYPTION_KEY` | Key used to encrypt sensitive values. |
| `ENCRYPTION_KEY_FILE` | File containing the encryption key. |

### Product and entitlements

| Variable | Description |
| --- | --- |
| `IS_CLOUD` | Legacy cloud flavour hint. |
| `ZENTHCLOUD_FLAVOR` | Legacy flavour hint kept for compatibility with the capability model. |
| `ZENTHCLOUD_PRODUCT` | Product the instance was launched as: `self`, `cloud` or `console`. Takes precedence over the hints above, but is not an authorization. |
| `ZENTHCLOUD_ENTITLEMENT_PUBLIC_KEY` | Public key used to verify cloud/console entitlements. Empty by default, so protected products fail closed. |
| `ZENTHCLOUD_ENTITLEMENT_PUBLIC_KEY_FILE` | File containing the entitlement public key. |
| `ZENTHCLOUD_ALLOW_UNLICENSED_DEV` | Development-only escape hatch (`1`, `true` or `yes`). Ignored when `NODE_ENV=production`. |

### Docker

| Variable | Description |
| --- | --- |
| `DOCKER_HOST` | Docker socket or host. Used during automatic socket detection. |
| `ZENTHCLOUD_DOCKER_HOST` | Explicit remote Docker host. |
| `ZENTHCLOUD_DOCKER_PORT` | Remote Docker port. |
| `ZENTHCLOUD_DOCKER_API_VERSION` | Pin the Docker API version. |

Socket detection tries `DOCKER_HOST`, the Rancher Desktop socket and `/var/run/docker.sock`, then falls back to the default Docker configuration.

### Paths

`paths()` returns the directories used by the platform:

```ts
{
  BASE_PATH, MAIN_TRAEFIK_PATH, DYNAMIC_TRAEFIK_PATH, LOGS_PATH,
  APPLICATIONS_PATH, COMPOSE_PATH, SSH_PATH, CERTIFICATES_PATH,
  MONITORING_PATH, IDENTITY_PATH, ONION_PATH, REGISTRY_PATH,
  SCHEDULES_PATH, VOLUME_BACKUPS_PATH, VOLUME_BACKUP_LOCK_PATH, PATCH_REPOS_PATH
}
```

`ZENTHCLOUD_CONFIG_PATH` overrides the base directory. Otherwise production and server mode use `/etc/zenthcloud`, and development uses `.docker` under the current working directory.

### Other environment variables

| Variable | Description |
| --- | --- |
| `NODE_ENV` | Enables development behaviour and disables production-only guards. |
| `PORT` | Port used by host applications. |
| `REDIS_URL` | Redis connection used for caching. |
| `SMTP_SERVER`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_FROM_ADDRESS` | Outgoing email. |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_TOKEN` | GitHub integration. |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google sign-in. |
| `TRAEFIK_PORT`, `TRAEFIK_SSL_PORT`, `TRAEFIK_HTTP3_PORT`, `TRAEFIK_VERSION` | Traefik ports and image version. |
| `ZENTHCLOUD_DNS_HOST`, `ZENTHCLOUD_DNS_PORT`, `ZENTHCLOUD_DNS_SERVER`, `ZENTHCLOUD_DNS_UPSTREAM` | Internal DNS server. |
| `ZENTHCLOUD_TOR_IMAGE` | Image used for managed Tor Onion Services. |
| `ZENTHCLOUD_GATEWAY_ERRORS_SCRIPT_PATH` | Custom script injected into gateway error pages. |
| `ZENTHCLOUD_TEMPLATES_DIR` | Directory for deployment templates. |
| `OPENAPI_MAX_JSON_BODY_SIZE` | JSON body limit for the OpenAPI route. |
| `OPENAPI_MAX_UPLOAD_SIZE` | Upload limit for the OpenAPI route. |
| `TRAFFIC_TRAEFIK_LOG_PATH`, `TRAFFIC_AUDIENCE_INGEST`, `TRAFFIC_COLLECTOR_CRON`, `TRAFFIC_RETENTION_CRON` | Traffic analytics. |
| `COMMUNITY_SYNC_CRON`, `COMMUNITY_EVENT_RETENTION_DAYS` | Community synchronisation. |

## How ZenthCloud Server is built

The package is TypeScript with strict mode and exports subpaths for `./db`, `./constants` and `./setup/*`. The application, compose and server services orchestrate Docker, Traefik, Git providers and the database.

| Area | Location | Role |
| --- | --- | --- |
| Services | `src/services/` | Applications, compose, deployments, domains, servers, projects, databases, backups and more |
| Database | `src/db/` | Drizzle schema, validations and the cached Postgres client |
| Setup | `src/setup/` | Swarm, network, Traefik, monitoring, directories and server audit |
| Builders | `src/utils/builders/` | Nixpacks, Buildpacks, Railpack, Heroku, static, Dockerfile and compose builders |
| Docker | `src/utils/docker/` | Containers, compose files, domains, volumes and disk usage |
| Backups | `src/utils/backups/` | Postgres, MySQL, MariaDB, MongoDB, LibSQL, compose and web-server backups |
| Monitoring | `src/monitoring/` | Status, units and metrics utilities |
| Traffic | `src/utils/traffic/` | Parsing, aggregation, audience and collection jobs |
| Gateway errors | `src/gateway-errors/` | Branded error pages, registry, rendering and request IDs |
| Templates | `src/templates/` | Source and GitHub templates plus processors |

### Services

`src/services/` is the domain layer. It includes application and compose lifecycle, deployment and preview deployments, rollbacks, environments, projects and quotas, domains and certificates, Git providers, SSH keys, servers and server health, registries, object storage, managed databases, notifications, settings, security and audit events.

### Setup routines

`src/setup/` provisions a host. It initialises Docker Swarm, creates the `zenthcloud-network` overlay, prepares directories under the config path, writes the Traefik configuration and middlewares, starts the Traefik container, installs Nixpacks, Buildpacks and Railpack, configures monitoring and validates the server.

### Deployment builders

`src/utils/builders/` produces the build plan for each source type: Dockerfile, Nixpacks, Buildpacks, Railpack, Heroku, static and compose. The chosen builder is resolved from the application configuration and the repository contents.

### Backups and volume backups

`src/utils/backups/` and `src/services/backup.ts` implement consistent database dumps and restores. Volume backups live under `VOLUME_BACKUPS_PATH`, with a lock path used to prevent concurrent runs.

### Monitoring and traffic

`src/monitoring/` exposes server status, unit conversion and metrics helpers. `src/utils/traffic/` parses Traefik access logs, aggregates traffic, computes audience data and schedules collection and retention jobs.

### Gateway errors

`src/gateway-errors/` renders the error pages served by the edge, with a registry of error codes, request ID propagation and a configurable injection path for custom scripts.

### Database export

```bash
pnpm --filter @zenthcloud/server dbml:generate
pnpm --filter @zenthcloud/server generate:drizzle
```

The first command generates DBML from the Drizzle schema. The second regenerates the Better Auth Drizzle schema.

## Development

```bash
pnpm --filter @zenthcloud/server dev
pnpm --filter @zenthcloud/server build
pnpm --filter @zenthcloud/server typecheck
```

Use the workspace root scripts for linting and formatting. Run `typecheck` before opening a pull request.

## FAQ

### Is this a server I can start on its own?

No. It is the engine library. `apps/api`, `apps/zenthcloud` and `apps/schedules` are the hosts.

### Which database does it use?

PostgreSQL, through Drizzle ORM and the `postgres` driver. The connection pool is cached on `globalThis`.

### How should secrets be provided?

Use `BETTER_AUTH_SECRET` / `BETTER_AUTH_SECRET_FILE` and `ENCRYPTION_KEY` / `ENCRYPTION_KEY_FILE`. Prefer the `*_FILE` variants with Docker secrets in production.

### Why did it warn about legacy credentials?

`DATABASE_URL` and `POSTGRES_PASSWORD_FILE` are both unset, so the package fell back to hardcoded legacy credentials. Configure one of them.

### Do I need Docker?

Yes. Deployment, Swarm, Traefik and monitoring management all talk to the Docker API.

## Related resources

- API host: [`apps/api`](apps/api)
- Dashboard host: [`apps/zenthcloud`](apps/zenthcloud)
- Scheduler host: [`apps/schedules`](apps/schedules)
- Database schema: [`src/db/schema`](src/db/schema)
- ZenthCloud repository: [github.com/skygenesisenterprise/zenthcloud](https://github.com/skygenesisenterprise/zenthcloud)

## Contributing

Contributions and suggestions are welcome. Read the repository [contribution guide](https://github.com/skygenesisenterprise/zenthcloud) before participating. Do not push directly to `main`; all changes go through a pull request.

## Security

Do not report security vulnerabilities in public issues. Follow the private reporting instructions in the repository [`SECURITY.md`](https://github.com/skygenesisenterprise/zenthcloud). Never commit secrets; use the `*_FILE` variables with Docker secrets.

## License

See the repository [LICENSE](https://github.com/skygenesisenterprise/zenthcloud) for licensing terms.

## Note

ZenthCloud Server is an open-source project maintained by [Sky Genesis Enterprise](https://skygenesisenterprise.com). Links to external services are provided for convenience and do not imply endorsement.
