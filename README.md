# ZenthCloud

[![License: Apache 2.0](https://img.shields.io/github/license/skygenesisenterprise/zenthcloud)](LICENSE)
[![Node.js 24](https://img.shields.io/badge/Node.js-24-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![pnpm 12](https://img.shields.io/badge/pnpm-12-F69220?logo=pnpm&logoColor=white)](https://pnpm.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Go](https://img.shields.io/badge/Go-1.27-00ADD8?logo=go&logoColor=white)](https://go.dev)
[![Rust](https://img.shields.io/badge/Rust-stable-000000?logo=rust&logoColor=white)](https://rust-lang.org)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](.github/CONTRIBUTING.md)
[![Discord](https://img.shields.io/badge/Discord-join-5865F2?logo=discord&logoColor=white)](https://discord.gg/GUkDugVh34)

> Deploy, operate and secure cloud infrastructure you control.

**ZenthCloud** is an open-source, self-hostable cloud platform for deploying and operating applications, databases and infrastructure. It pairs a web control plane for applications, Docker Compose projects, servers and clusters with a catalogue of compute, storage, networking, platform, web and security services. Run the full stack on hardware you own, drive it from the **CLI** and **MCP** interfaces, or use [ZenthCloud Cloud](https://dash.zenthcloud.com) for a managed experience.

**Perfect for:** platform and DevOps teams, self-hosting enthusiasts, agencies running client infrastructure, and any team that wants a modern cloud experience without giving up control of the servers.

## Table of contents

- [ZenthCloud](#zenthcloud)
  - [Table of contents](#table-of-contents)
  - [Overview](#overview)
  - [Capabilities](#capabilities)
    - [Deploy](#deploy)
    - [Operate](#operate)
    - [Automate](#automate)
    - [Secure](#secure)
    - [Scale](#scale)
  - [Architecture](#architecture)
    - [Editions and runtime roles](#editions-and-runtime-roles)
    - [Runtime topology](#runtime-topology)
    - [Status as an independent product](#status-as-an-independent-product)
    - [Repository layout](#repository-layout)
  - [Applications](#applications)
  - [Core platform packages](#core-platform-packages)
  - [Client, automation and tooling](#client-automation-and-tooling)
  - [Runtimes, protocols and infrastructure components](#runtimes-protocols-and-infrastructure-components)
  - [Web properties](#web-properties)
  - [Quick start](#quick-start)
    - [Host installer](#host-installer)
    - [Docker Compose](#docker-compose)
    - [Make targets](#make-targets)
  - [Configuration](#configuration)
  - [Development](#development)
    - [Prerequisites](#prerequisites)
    - [Install and build](#install-and-build)
    - [Root commands](#root-commands)
    - [Platform applications](#platform-applications)
    - [Web properties](#web-properties-1)
    - [Native components](#native-components)
    - [Quality checks](#quality-checks)
  - [Contributing](#contributing)
  - [Security](#security)
  - [License](#license)
  - [FAQ](#faq)
    - [Is ZenthCloud free?](#is-zenthcloud-free)
    - [Do I have to host it myself?](#do-i-have-to-host-it-myself)
    - [What do I need to run it?](#what-do-i-need-to-run-it)
    - [Where is the documentation?](#where-is-the-documentation)
    - [Does ZenthCloud own all of its infrastructure?](#does-zenthcloud-own-all-of-its-infrastructure)
    - [How do I get help or report a bug?](#how-do-i-get-help-or-report-a-bug)
  - [Related resources](#related-resources)
    - [Official](#official)
    - [Community](#community)
    - [Commercial](#commercial)
  - [Acknowledgements](#acknowledgements)

## Overview

ZenthCloud is designed around a few principles:

- **You own the infrastructure.** The platform runs on your servers, your network and your database. Nothing is locked into a managed service, and the source is yours to audit.
- **One deployment engine.** Applications, Compose stacks, previews, rollbacks, servers and backups share the same services in `@zenthcloud/server`, so every host surface behaves consistently.
- **Databases are first-class.** PostgreSQL, MySQL, MariaDB, MongoDB and Redis are provisioned and operated with scheduled backups, without separate tooling.
- **Secure by default.** Traffic is routed through Traefik with managed domains and certificates, secrets live in environment variables and vaults, access follows an organization and permission model, and the platform ships PKI, WireGuard, QUIC/HTTP3 and proxy components.
- **Automation is a first-class interface.** The API, CLI, MCP server, Terraform provider and tRPC/OpenAPI layer expose the same resources, so deployments fit into existing pipelines instead of replacing them.
- **Open source and extensible.** The platform is Apache 2.0, self-hostable, and built around reusable provider adapters, open protocols and one catalogue for the whole stack.

## Capabilities

### Deploy

- Deploy applications from Git providers or container images using Docker, Nixpacks, Railpack or buildpacks.
- Run Docker Compose projects and manage their services, configuration, logs and deployments.
- Provision compute instances, GPU instances, bare metal servers and private cloud capacity from the same catalogue.
- Create preview deployments, roll back to a previous release, and manage environments, projects and quotas.

### Operate

- Provision and operate PostgreSQL, MySQL, MariaDB, MongoDB, Redis and LibSQL, with scheduled backups and restores.
- Route applications with Traefik, manage domains, DNS, redirects, ports and certificates, and configure environment variables, volumes and resource limits.
- Monitor resource usage and logs, inspect traffic analytics, publish a status page, and send deployment notifications to supported providers.

### Automate

- Drive the platform from the ZenthCloud API, the `cf` command-line interface, the MCP server, the Terraform provider, or the tRPC/OpenAPI layer.
- Integrate Git providers (GitHub, GitLab, Gitea, Bitbucket), OAuth sign-in (Google, GitHub, Discord) and webhooks.
- Build custom tooling against the generated OpenAPI document and the `@zenthcloud/forge` code-generation framework.

### Secure

- Authenticate with Better Auth, including two-factor authentication, SSO, SCIM and API keys.
- Restrict access with organizations, roles, permissions and audit events.
- Keep secrets in environment variables or Docker secrets, with `*_FILE` variants for production deployments.
- Use the included PKI, WireGuard, QUIC/HTTP3, TLS and proxy components to build private networking and edge services.

### Scale

- Deploy to the local server, independent remote servers over SSH, or a Docker Swarm cluster.
- Add object and block storage, managed Kubernetes, networking, web hosting and security services as the estate grows.
- Run the same platform image in self-hosted, cloud or console editions without rebuilding per service.

## Architecture

ZenthCloud is a pnpm workspace with a single root lockfile (`pnpm-lock.yaml`) and workspace definition (`pnpm-workspace.yaml`). JavaScript and TypeScript packages share one dependency graph. Go services and native Rust crates are built with their own toolchains and are not part of that graph.

```
                         ┌──────────────────────────────┐
                         │        zenthcloud-client     │
                         │  Next.js dashboard (SSR)     │
                         │  proxies /api/* to the API   │
                         └──────────────┬───────────────┘
                                        │
                         ┌──────────────▼───────────────┐
                         │          zenthcloud-api      │
                         │  tRPC / OpenAPI / auth / WS  │
                         │  BullMQ workers / migrations │
                         └───────┬──────────────┬───────┘
                                 │              │
                    ┌────────────▼───┐   ┌──────▼─────────┐
                    │   PostgreSQL   │   │     Redis      │
                    └────────────────┘   └────────────────┘

             Optional, independent:   zenthcloud-status (SQLite)
             Auxiliary services:      apps/api (Inngest), apps/schedules (BullMQ)
```

### Editions and runtime roles

ZenthCloud publishes one image per edition, not one image per service. The edition (`self`, `cloud`, `console`) is baked in as a default and can be overridden at runtime. The role is selected at runtime:

| Edition | Product | Image | Purpose |
| --- | --- | --- | --- |
| `self` | `self` | `zenthcloud` | Free, self-hosted platform |
| `cloud` | `cloud` | `zenthcloud-cloud` | Managed ZenthCloud Cloud |
| `console` | `console` | `zenthcloud-console` | Cloud-side fleet manager |

| `ZENTHCLOUD_ROLE` | Runs | Description |
| --- | --- | --- |
| `client` | `next start` (port 3000) | Dashboard, server-side rendering and `/api/*` proxy |
| `api` | `node dist/server.mjs` (port 4000) | tRPC/OpenAPI, Better Auth, WebSockets, workers and migrations |
| `migrate` | one-shot migration job | Applies database migrations, then exits |
| `status` | `next start` (port 4100) | Standalone status page, no PostgreSQL or Redis |

Client and API therefore always come from the same image digest and can never drift apart. Production images run unprivileged and never carry build tooling.

### Runtime topology

The root Compose stack starts:

| Service | Image | Exposed | Role |
| --- | --- | --- | --- |
| `postgres` | `postgres:16-alpine` | internal | Control-plane database |
| `redis` | `redis:7-alpine` | internal | Cache, BullMQ queues and coordination |
| `client` | ZenthCloud platform image | `3000` (and `80`) | Dashboard and `/api/*` proxy |
| `api` | ZenthCloud platform image | `4000` | API, authentication, WebSockets and migrations |

`COMPOSE_PROFILES=prod` runs the production services; `COMPOSE_PROFILES=dev` runs the same stack with hot-reloaded source from the `dev` build target.

### Status as an independent product

ZenthCloud Status is deliberately separate from the platform. `@zenthcloud/status` owns its own SQLite database, state computation, public/admin/integration API, notification outbox and uptime sampler. It keeps serving the last known public state when the control plane, or its own storage, is unavailable. It is built from the `status` target of the root Dockerfile and deployed as its own container and volume.

### Repository layout

```text
zenthcloud/
├── apps/
│   ├── zenthcloud/            # @zenthcloud/app — dashboard and main API runtime
│   ├── api/                   # @zenthcloud/api — async/background work (Inngest)
│   ├── schedules/             # @zenthcloud/schedules — scheduled jobs (BullMQ)
│   ├── status/                # @zenthcloud/status-app — public status page (Next.js)
│   └── monitoring/            # Go monitoring and metrics service
├── packages/
│   ├── server/                # @zenthcloud/server — deployment engine and schema
│   ├── status/                # @zenthcloud/status — status page engine
│   ├── trpc-openapi/          # @zenthcloud/trpc-openapi — tRPC ↔ OpenAPI
│   ├── forge/                 # @zenthcloud/forge — OpenAPI code generation
│   ├── cli/                   # cf — command-line interface
│   ├── mcp/                   # zenthcloud-mcp — Model Context Protocol server
│   ├── node/                  # @zenthcloud/react — Kumo component library
│   ├── speedtest/             # @zenthcloud/speedtest — connection measurement
│   ├── zenthd/                # Tunnel client (Go)
│   ├── workerd/               # JavaScript / WebAssembly server runtime (C++/TS)
│   ├── workers-rs/            # Rust bindings for the Workers environment
│   ├── capnweb/               # JavaScript-native RPC
│   ├── quiche/                # QUIC and HTTP/3 (Rust)
│   ├── boring/                # BoringSSL bindings (Rust)
│   ├── boringtun/             # WireGuard implementation (Rust)
│   ├── pingora/               # Programmable proxy framework (Rust)
│   ├── cfssl/                 # PKI and TLS toolkit (Go)
│   ├── circl/                 # Cryptographic library (Go)
│   ├── gokeyless/             # Keyless SSL server (Go)
│   ├── dns/                   # Authoritative DNS server
│   ├── dns-ansible/           # DNS Ansible role
│   ├── dns-builder/           # DNS package builder
│   ├── lightningstream/       # LMDB-to-object-storage sync (Go)
│   ├── lmdbnav/               # LMDB inspection TUI (Go)
│   ├── lol-html/              # Low-latency HTML rewriter (Rust)
│   ├── ebpf_exporter/         # Prometheus eBPF exporter (Go)
│   ├── pint/                  # Prometheus rule linter (Go)
│   ├── weakforced/            # Authentication and rate-limiting daemon
│   ├── wirefilter/            # Packet-filtering language (Rust)
│   ├── foundations/           # Rust observability library
│   ├── terraform/             # Terraform provider (Go)
│   ├── workers-sdk/           # Workers SDK and Wrangler
│   ├── workers-oauth-provider/ # OAuth provider for Workers
│   ├── vinext/                # Next.js on Vite for Workers
│   ├── containers/            # Container-enabled Durable Objects
│   ├── browser-run/           # Browser automation on Workers
│   ├── agents/                # Stateful agent framework
│   ├── golang/                # Go API SDK
│   └── sslconfig/             # TLS cipher and patch reference
├── web/                       # Marketing, docs and support (own workspace)
│   ├── apps/website/          # @zenthcloud/website
│   ├── apps/docs/             # @zenthcloud/docs
│   └── apps/support/          # @zenthcloud/support
├── docs/                      # Architecture and design notes
├── scripts/                   # Repository tooling (install, docs, worktrees)
├── docker/                    # Deployment-tooling install helper
├── Dockerfile                 # Platform (`platform`), `dev` and `status` targets
├── docker-compose.yml         # Self-hosted stack
├── install.sh / install.ps1   # Host installers
└── Makefile                   # install / dev / docker / operations targets
```

## Applications

| Path | Package | Stack | Role |
| --- | --- | --- | --- |
| `apps/zenthcloud` | `@zenthcloud/app` | Next.js 16, React 19, tRPC, Drizzle, Dockerode | Main dashboard. Hosts the tRPC/OpenAPI API server (`server/server.ts`), WebSocket endpoints, Better Auth and the deployment runtime. |
| `apps/api` | `@zenthcloud/api` | Hono, Inngest | Asynchronous and background work service. Queues deployments and long-running jobs through Inngest. |
| `apps/schedules` | `@zenthcloud/schedules` | Hono, BullMQ, Drizzle | Scheduled jobs and recurring tasks service. |
| `apps/status` | `@zenthcloud/status-app` | Next.js 16, `@zenthcloud/status` | Public status page. Mounts the status engine API through a catch-all route and renders pages, components, incidents and maintenance. |
| `apps/monitoring` | — | Go | Resource monitoring and metrics collection. Exposes server and container metrics with a configurable refresh rate and retention. |

`apps/api` and `apps/schedules` are auxiliary services. The default Compose stack runs the main API from the `@zenthcloud/app` image with `ZENTHCLOUD_ROLE=api`.

The dashboard covers applications, Compose projects, deployments, servers and Swarm, domains, certificates, databases (PostgreSQL, MySQL, MariaDB, MongoDB, Redis, LibSQL), object storage (R2), networking, observability, AI, security and organizational settings.

## Core platform packages

| Path | Package | Role |
| --- | --- | --- |
| `packages/server` | `@zenthcloud/server` | Shared deployment engine: applications, Compose stacks, deployments, previews, rollbacks, servers, projects, domains, certificates, databases, backups, monitoring, traffic analytics, gateway errors and the Drizzle schema. It is a library, not a listening service. |
| `packages/status` | `@zenthcloud/status` | Independent status platform engine: domain model, state computation, SQLite persistence, public/admin/integration HTTP API, notification outbox and integration client. |
| `packages/trpc-openapi` | `@zenthcloud/trpc-openapi` | Generates REST endpoints and an OpenAPI document from tRPC procedures, supporting incremental adoption and all OpenAPI versions. |
| `packages/forge` | `@zenthcloud/forge` | Schema-first OpenAPI tooling: resolves OpenAPI 3.x, applies JSONPath overlays, and generates typed SDKs, CLIs, runtime helpers and documentation. |

## Client, automation and tooling

| Path | Package / binary | Role |
| --- | --- | --- |
| `packages/cli` | `cf` | Agent-friendly command-line interface for the platform API, with discoverable commands and a JSON-first interface. |
| `packages/mcp` | `zenthcloud-mcp` | Token-efficient Model Context Protocol server. Exposes the whole API through Code Mode instead of registering thousands of tools. |
| `packages/terraform` | `terraform-provider-zenthcloud` | Terraform provider wrapping the ZenthCloud REST API for account- and zone-scoped resources. |
| `packages/node` | `@zenthcloud/react` (Kumo) | Accessible React component library and design system used by ZenthCloud surfaces. |
| `packages/speedtest` | `@zenthcloud/speedtest` | Browser-side measurement engine for download, upload, latency and packet loss against the edge network. |

All client surfaces — web, CLI, MCP and Terraform — consume the same API contracts and backend services, so behaviour stays consistent across platforms.

## Runtimes, protocols and infrastructure components

The packages below bring the runtimes, protocols and infrastructure the platform depends on into the monorepo so builds are hermetic and versions are pinned. They are integrated copies or adaptations of upstream open-source projects, renamed under the ZenthCloud namespace. Each retains its own license, test suite and release process; check the package's `README.md` and license before redistributing it.

| Path | Language | Role | Upstream basis |
| --- | --- | --- | --- |
| `packages/zenthd` | Go | Tunnel client that connects origins to the network without opening inbound ports | Cloudflare Tunnel client |
| `packages/workerd` | C++ / TypeScript | JavaScript / WebAssembly server runtime | Cloudflare Workers runtime |
| `packages/workers-rs` | Rust | Ergonomic Rust bindings (`worker`, `worker-sys`, `worker-macros`, `worker-build`) for the Workers environment | Cloudflare Workers Rust bindings |
| `packages/workers-sdk` | TypeScript | Workers SDK and Wrangler tooling | Cloudflare Workers SDK |
| `packages/workers-oauth-provider` | TypeScript | OAuth provider for Workers | Cloudflare OAuth provider |
| `packages/vinext` | TypeScript | Run Next.js applications on Vite, targeting Workers | Cloudflare vinext |
| `packages/containers` | TypeScript | Helper class for container-enabled Durable Objects | Cloudflare Containers |
| `packages/browser-run` | TypeScript | Puppeteer and Playwright ports for browser automation on Workers | Cloudflare Browser Run |
| `packages/agents` | TypeScript | Persistent, stateful execution environments for agentic workloads | Cloudflare Agents |
| `packages/capnweb` | TypeScript | JavaScript-native object-capability RPC with promise pipelining | Cap'n Web |
| `packages/quiche` | Rust | QUIC transport and HTTP/3 implementation | Cloudflare quiche |
| `packages/boring` | Rust | Safe bindings for BoringSSL with Tokio/Hyper adapters | BoringSSL bindings |
| `packages/boringtun` | Rust | Userspace WireGuard implementation | Cloudflare boringtun |
| `packages/pingora` | Rust | Fast, programmable proxy framework | Cloudflare Pingora |
| `packages/wirefilter` | Rust | Wireshark-like packet-filtering language and engine | Cloudflare wirefilter |
| `packages/cfssl` | Go | PKI and TLS toolkit for signing, verifying and bundling certificates | Cloudflare CFSSL |
| `packages/circl` | Go | Cryptographic library (ECC, hashing, signatures, HPKE, and more) | Cloudflare circl |
| `packages/gokeyless` | Go | Keyless SSL server for private-key operations | Cloudflare gokeyless |
| `packages/dns` | C++ / Go | Authoritative DNS server | PowerDNS |
| `packages/dns-ansible` | Ansible | Ansible role for deploying the authoritative DNS server | PowerDNS Ansible role |
| `packages/dns-builder` | Shell / Docker | Reusable distribution package builder for DNS | PowerDNS Builder |
| `packages/lightningstream` | Go | Replicates LMDB databases to object storage for cloud-native deployments | PowerDNS Lightning Stream |
| `packages/lmdbnav` | Go | Terminal UI to inspect LMDB database files | PowerDNS lmdbnav |
| `packages/lol-html` | Rust | Low-latency streaming HTML rewriter | Cloudflare lol-html |
| `packages/ebpf_exporter` | Go | Prometheus exporter for eBPF metrics | Cloudflare ebpf_exporter |
| `packages/pint` | Go | Prometheus rule linter | Cloudflare pint |
| `packages/weakforced` | C++ / Lua | Authentication and rate-limiting daemon | PowerDNS weakforced |
| `packages/foundations` | Rust | Logging, tracing, metrics and production-service utilities | Cloudflare Foundations |
| `packages/golang` | Go | Go SDK for the API surface | Cloudflare Go SDK |
| `packages/sslconfig` | Config / patches | Internet-facing TLS cipher configuration and OpenSSL/NGINX patch reference | Cloudflare sslconfig |

The root `Dockerfile` has three targets:

- `platform` — the single production image per edition, carrying both the client and API runtimes. The default target.
- `dev` — dependencies and sources for hot-reloaded Compose development.
- `status` — the standalone status page (Next.js app plus the status engine). It needs no PostgreSQL, Redis or workers; the whole product is one container and one volume.

## Web properties

| Path | Package | Role |
| --- | --- | --- |
| `web/apps/website` | `@zenthcloud/website` | Official marketing website and product catalogue |
| `web/apps/docs` | `@zenthcloud/docs` | Product documentation site (Fumadocs) |
| `web/apps/support` | `@zenthcloud/support` | Support and help site |

The `web/` directory is its own pnpm workspace root with a dedicated `Makefile`, `Dockerfile.website` / `Dockerfile.docs` / `Dockerfile.support` and `docker-compose.yml`, so the marketing site, documentation and support site can be built and deployed independently of the platform.

## Quick start

### Host installer

The fastest way to install ZenthCloud on a Linux host (native or WSL):

```bash
curl -sSL https://zenthcloud.com/install.sh | sh
```

On Windows Server, use the PowerShell installer:

```powershell
irm https://zenthcloud.com/install.ps1 | iex
```

After installation, open [http://localhost:3000](http://localhost:3000) to complete setup. The installer supports `self` (default), `cloud` and `console` products; `cloud` and `console` require a verifiable entitlement.

### Docker Compose

Requirements: Docker Engine with the Compose plugin.

```bash
git clone https://github.com/skygenesisenterprise/zenthcloud.git
cd zenthcloud
cp .env.example .env
```

Edit `.env` before starting the stack. Set unique values for `POSTGRES_PASSWORD`, `REDIS_PASSWORD` and `BETTER_AUTH_SECRET` (for example, generate each with `openssl rand -hex 32`), then start ZenthCloud:

```bash
docker compose up --build -d
docker compose logs -f client
```

Open [http://localhost:3000](http://localhost:3000) and complete the initial setup. The API listens on [http://localhost:4000](http://localhost:4000). The dashboard is also served at [http://dash.zenthcloud.localhost](http://dash.zenthcloud.localhost) because `*.localhost` names resolve to loopback without an `/etc/hosts` entry.

Keep the `.env` file private and do not expose the dashboard publicly until you have configured authentication and HTTPS. For production installation, updates, networking and TLS guidance, follow the [installation documentation](https://docs.zenthcloud.com).

Useful Compose commands:

```bash
docker compose ps
docker compose logs -f
docker compose down
```

`docker compose down` preserves the named data volumes. Do not remove them if you need to keep your ZenthCloud database and configuration.

### Make targets

The root `Makefile` wraps the same stack and adds operational targets. The product is selected by name: `self`, `cloud` or `console`.

```bash
make install                  # create .env if missing and start the stack
make docker-up self           # start the self-hosted edition
make docker-up cloud          # start ZenthCloud Cloud
make docker-up console        # start ZenthCloud Console
make docker-dev self          # start the same stack with hot reload
make docker-logs              # follow the logs
make docker-down              # stop the selected product (volumes preserved)
make migrate                  # apply database migrations once
make doctor                   # check installation health
make backup                   # dump the database into ./backups
make restore FILE=backups/zenthcloud-<date>.sql
make update                   # pull the latest revision and rebuild
```

The selected product is remembered in `.make-product`, so `make docker-down` stops exactly what was started last.

## Configuration

The root `.env.example` is the reference for the Compose stack. The most important variables are:

| Variable | Required | Description |
| --- | --- | --- |
| `POSTGRES_USER` / `POSTGRES_DB` | no | Database credentials. Default to `zenthcloud`. |
| `POSTGRES_PASSWORD` | yes | PostgreSQL password. |
| `REDIS_PASSWORD` | yes | Redis password. |
| `BETTER_AUTH_SECRET` | yes | Session signing secret (32-byte hex recommended). |
| `BETTER_AUTH_URL` | no | Public dashboard origin, used for sign-in. |
| `BETTER_AUTH_TRUSTED_ORIGINS` | no | Comma-separated origins allowed to send authenticated requests. |
| `NEXT_PUBLIC_API_URL` | no | Public API origin used by the browser (WebSocket and direct API calls). Baked into the bundle at build time. |
| `ZENTHCLOUD_PORT` / `ZENTHCLOUD_API_PORT` | no | Host ports for the dashboard (`3000`) and API (`4000`). |
| `ZENTHCLOUD_FLAVOR` / `ZENTHCLOUD_PRODUCT` / `IS_CLOUD` | derived | Edition selection. Derived from the Make product, or set explicitly when using Compose directly. |
| `OAUTH_GOOGLE_*`, `OAUTH_GITHUB_*`, `OAUTH_DISCORD_*` | no | Optional OAuth providers. Empty values disable the provider. |
| `DEV_POLLING` | no | Set to `true` on Docker Desktop so file watching works through bind mounts. |
| `TZ` | no | Container timezone. Defaults to `UTC`. |

`@zenthcloud/server` also accepts `DATABASE_URL` (which takes precedence over the `POSTGRES_*` variables), `POSTGRES_PASSWORD_FILE`, `BETTER_AUTH_SECRET_FILE`, `ENCRYPTION_KEY` / `ENCRYPTION_KEY_FILE`, `DOCKER_HOST`, `ZENTHCLOUD_CONFIG_PATH`, SMTP settings, Git provider settings, Traefik ports and traffic analytics settings. See [`packages/server/README.md`](packages/server/README.md) for the complete list.

The status engine is configured separately through its own environment variables and CLI (`pnpm --filter @zenthcloud/status seed|token:create|backup`). See [`packages/status/README.md`](packages/status/README.md).

## Development

### Prerequisites

- **Node.js 24.4 or later in the 24.x line** (`.nvmrc` pins `24.4.0`).
- **pnpm 10.22 or later.** The repository pins `pnpm@12.18.0` in `package.json`.
- **PostgreSQL** and **Redis** for the platform runtime.
- **Docker** for containerized development or deployment.
- **Go 1.27+** and **Rust (stable)** only when working on the native components.
- **Bun** is not used; all JavaScript tooling runs on Node.js and pnpm.

### Install and build

Install dependencies from the repository root:

```bash
pnpm install --frozen-lockfile
```

Build the JavaScript workspace:

```bash
pnpm build
```

### Root commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Run the ZenthCloud dashboard (`@zenthcloud/app`) |
| `pnpm build` | Build every workspace package |
| `pnpm build:app` | Build only the dashboard application |
| `pnpm start` | Start the built dashboard |
| `pnpm test` | Run the application test suite |
| `pnpm typecheck` | Type-check workspace packages |
| `pnpm lint` | Run Biome checks across the workspace |
| `pnpm server:dev` / `pnpm server:build` | Run or build `@zenthcloud/server` |
| `pnpm web:dev` / `pnpm web:build` | Run or build the marketing website |
| `pnpm docs:dev` / `pnpm docs:build` | Run or build the documentation site |
| `pnpm generate:openapi` | Regenerate `openapi.json` |
| `pnpm changeset` | Add a changeset for a user-facing change |

### Platform applications

**Dashboard and main API** (`apps/zenthcloud`):

```bash
pnpm --filter @zenthcloud/app dev          # dashboard on http://localhost:3000
pnpm --filter @zenthcloud/app dev:api      # API dev server (tsx watch)
pnpm --filter @zenthcloud/app migration:run
pnpm --filter @zenthcloud/app setup        # initial setup + migrations
```

The application requires PostgreSQL and a filled-in environment configuration. For a ready-to-run local stack with PostgreSQL and Redis, use Docker Compose as described above.

**Background work** (`apps/api`):

```bash
pnpm --filter @zenthcloud/api dev          # API on http://localhost:4000
pnpm --filter @zenthcloud/api dev:inngest  # Inngest dev server on :8288
```

The Inngest dev server syncs with `http://localhost:4000/api/inngest` and serves its dashboard at `http://localhost:8288`.

**Scheduled jobs** (`apps/schedules`):

```bash
pnpm --filter @zenthcloud/schedules dev    # service on http://localhost:4001
```

**Status page** (`apps/status`):

```bash
pnpm --filter @zenthcloud/status-app dev   # http://localhost:4100
pnpm --filter @zenthcloud/status seed -- --slug zenthcloud
pnpm --filter @zenthcloud/status token:create -- --name Console --scopes write,publish,ingest
```

**Monitoring** (`apps/monitoring`):

```bash
cd apps/monitoring
go mod download
go run main.go
```

### Web properties

The marketing site, documentation site and support site share a dedicated toolchain in `web/`:

```bash
make -C web dev website      # run the website
make -C web dev docs         # run the docs site
make -C web dev support      # run the support site
make -C web build website    # build the website
make -C web build docs       # build the docs site
make -C web build support    # build the support site
```

The same targets are available from the repository root through `pnpm web:dev`, `pnpm docs:dev`, `pnpm web:build` and `pnpm docs:build`.

### Native components

The Go and Rust components are built with their own toolchains:

```bash
(cd apps/monitoring && go build ./...)      # monitoring service
(cd packages/zenthd && make zenthcloudd)    # tunnel client
(cd packages/quiche && cargo build)         # QUIC / HTTP/3 library
(cd packages/pingora && cargo build)        # proxy framework
(cd packages/foundations && cargo build)    # observability library
```

See each package's `README.md` for its requirements, test commands and release process.

### Quality checks

Before opening a pull request, run:

```bash
pnpm test
pnpm typecheck
pnpm lint
```

For documentation specifically, the docs tooling can validate the specification, regions and links, and check coverage:

```bash
pnpm docs:check
pnpm docs:check:changed
pnpm docs:check:coverage
pnpm docs:check:links
pnpm docs:test
```

## Contributing

Contributions and suggestions are welcome. Please read the [Code of Conduct](CODE_OF_CONDUCT.md) before participating, then follow the [contribution guide](.github/CONTRIBUTING.md) for setup and review expectations.

- Pick the right [pull request template](.github/PULL_REQUEST_TEMPLATE) for your change.
- Keep PR titles in [Conventional Commits](https://www.conventionalcommits.org) format (`fix: …`, `feat: …`, `docs: …`).
- Add a changeset with `pnpm changeset` when your change is user-facing.
- Run `pnpm test`, `pnpm typecheck` and `pnpm lint` before opening a pull request.
- Do not push directly to `main`; all changes go through a pull request.

## Security

Do not report security vulnerabilities in public issues. Follow the private reporting instructions in [SECURITY.md](SECURITY.md), or email **security@skygenesisenterprise.com**.

Never commit secrets. Provide them through the environment or, preferably, through the `*_FILE` variants backed by Docker secrets.

## License

The root project is licensed under the [Apache 2.0 License](LICENSE). Packages and vendored components under `packages/` may carry their own license terms; check the relevant package's license file before redistributing it.

## FAQ

### Is ZenthCloud free?

Yes. The core platform is open source under Apache 2.0, and the self-hosted edition is free to run. Some separately published packages or vendored components may carry their own license terms; check the relevant package's license file before redistributing it. A commercial edition with additional features and premium support is maintained by [Sky Genesis Enterprise](https://skygenesisenterprise.com).

### Do I have to host it myself?

No. You can self-host with `make install` or Docker Compose, or use the hosted [ZenthCloud Cloud](https://dash.zenthcloud.com) if you would rather not manage the control plane.

### What do I need to run it?

Node.js 24.4+ and pnpm 10.22+ for development, or Docker Engine with the Compose plugin for the containerized stack. The platform needs PostgreSQL, Redis and a filled-in `.env`. The status page is independent and only needs its own SQLite data directory.

### Where is the documentation?

The full product documentation lives at [docs.zenthcloud.com](https://docs.zenthcloud.com). Package-level documentation is available in each package's `README.md`.

### Does ZenthCloud own all of its infrastructure?

No. ZenthCloud operates a hybrid model: owned infrastructure plus partner infrastructure. Products delivered on partner capacity are labelled **Partner service**, and the operating provider is named per product and region. Availability and prices are published only once they have been verified.

### How do I get help or report a bug?

Open a [GitHub issue](https://github.com/skygenesisenterprise/zenthcloud/issues) for bugs and feature requests, or use the support routes listed at [zenthcloud.com/resources/support](https://zenthcloud.com/resources/support). Never report a security vulnerability in a public issue — see [Security](#security).

## Related resources

### Official

- Product docs: [docs.zenthcloud.com](https://docs.zenthcloud.com)
- Website: [zenthcloud.com](https://zenthcloud.com)
- Status: [status.zenthcloud.com](https://status.zenthcloud.com)
- Console: [dash.zenthcloud.com](https://dash.zenthcloud.com)
- Blog: [blog.zenthcloud.com](https://blog.zenthcloud.com)
- Support: [zenthcloud.com/resources/support](https://zenthcloud.com/resources/support)
- CLI: [`packages/cli`](packages/cli)
- MCP server: [`packages/mcp`](packages/mcp)
- Terraform provider: [`packages/terraform`](packages/terraform)
- Status engine: [`packages/status`](packages/status)
- Status page app: [`apps/status`](apps/status)

### Community

- Bugs and feature requests: [GitHub Issues](https://github.com/skygenesisenterprise/zenthcloud/issues)
- Contribution guide: [`.github/CONTRIBUTING.md`](.github/CONTRIBUTING.md)
- Code of Conduct: [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md)

### Commercial

- Commercial edition and premium support: [Sky Genesis Enterprise](https://skygenesisenterprise.com)
- Licensing and legal: [legal@skygenesisenterprise.com](mailto:legal@skygenesisenterprise.com)

## Acknowledgements

ZenthCloud is maintained by [Sky Genesis Enterprise](https://skygenesisenterprise.com). It builds on open-source work from many projects, including Cloudflare (workerd, Workers SDK, Pingora, quiche, boringtun, CFSSL, circl, Cap'n Web and others) and PowerDNS (authoritative DNS, Lightning Stream, weakforced). Those components remain under their respective licenses; links to external projects and services are provided for convenience and do not imply endorsement.
