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

**ZenthCloud** is an open-source, self-hostable cloud platform for deploying and operating applications, databases and infrastructure. It combines a web control plane for applications, Docker Compose projects, servers and clusters with a catalogue of compute, storage, networking, platform, web and security services. Run the full stack on infrastructure you own, drive it from the **CLI** and **MCP** interfaces, or leverage [ZenthCloud Cloud](https://dash.zenthcloud.com) for a managed experience.

**Perfect for:** platform and DevOps teams, self-hosting enthusiasts, agencies running client infrastructure, and any team that wants a modern cloud experience without giving up control of the servers.

## Contents

- [ZenthCloud](#zenthcloud)
  - [Contents](#contents)
  - [Why ZenthCloud matters](#why-zenthcloud-matters)
  - [What you can do](#what-you-can-do)
    - [Deploy](#deploy)
    - [Operate](#operate)
    - [Automate](#automate)
    - [Scale](#scale)
  - [Quick start](#quick-start)
    - [Self-host with Docker Compose](#self-host-with-docker-compose)
  - [How ZenthCloud is built](#how-zenthcloud-is-built)
    - [Workspace layout](#workspace-layout)
    - [Core services](#core-services)
    - [Client applications](#client-applications)
    - [Shared packages](#shared-packages)
    - [Web properties](#web-properties)
    - [Infrastructure \& protocol packages](#infrastructure--protocol-packages)
  - [Development](#development)
    - [Root commands](#root-commands)
    - [Client application development](#client-application-development)
    - [Web properties](#web-properties-1)
    - [Native components](#native-components)
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
  - [Contributing](#contributing)
  - [Security](#security)
  - [License](#license)
  - [Note](#note)

## Why ZenthCloud matters

🎯 **You own the infrastructure** — ZenthCloud runs on your servers, your network and your database. Nothing is locked into a managed platform, and the source is yours to audit.

🚀 **Deploy anything, the way you want** — Ship from Git providers or container images using Docker, Nixpacks, Railpack or buildpacks, and target the local server, remote servers over SSH, or a Docker Swarm cluster.

📦 **Databases are first-class** — Provision and operate PostgreSQL, MySQL, MariaDB, MongoDB and Redis with scheduled backups, without wiring up separate tooling.

🔒 **Secure by default** — Route traffic through Traefik with managed domains and certificates, keep secrets in environment variables and vaults, restrict access with an organization and permission model, and build on the included PKI, WireGuard, QUIC/HTTP3 and proxy components.

🧩 **Automate everything** — Drive ZenthCloud from the API, CLI, MCP server or Terraform provider, so deployments fit into existing pipelines instead of replacing them.

🤝 **Open source and extensible** — The platform is Apache 2.0, self-hostable, and designed around reusable provider adapters, open protocols and one catalogue for the whole stack.

## What you can do

### Deploy

- Deploy applications from Git providers or container images using Docker, Nixpacks, Railpack, or buildpacks.
- Run Docker Compose projects and manage their services, configuration, logs and deployments.
- Provision compute instances, GPU instances, bare metal servers and private cloud capacity from the same catalogue.

### Operate

- Provision and operate PostgreSQL, MySQL, MariaDB, MongoDB and Redis databases, with scheduled backups.
- Route applications with Traefik, manage domains and certificates, and configure environment variables, volumes and resource limits.
- Monitor resource usage and logs, publish a public status page, and send deployment notifications to supported providers.

### Automate

- Automate operations with the ZenthCloud API, the `cf` command-line interface, the MCP server, the Terraform provider, or the tRPC/OpenAPI layer.

### Scale

- Deploy to the local server, independent remote servers over SSH, or a Docker Swarm cluster.
- Add object and block storage, managed Kubernetes, networking, web hosting and security services as the estate grows.

## Quick start

The easiest way to install ZenthCloud:

```bash
curl -sSL https://zenthcloud.com/install.sh | sh
```

On Windows, use the PowerShell installer:

```powershell
irm https://zenthcloud.com/install.ps1 | iex
```

After installation, open [http://localhost:3000](http://localhost:3000) to complete setup.

### Self-host with Docker Compose

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

Open [http://localhost:3000](http://localhost:3000) and complete the initial setup. The API listens on [http://localhost:4000](http://localhost:4000). Keep the `.env` file private and do not expose the dashboard publicly until you have configured authentication and HTTPS. For production installation, updates, networking and TLS guidance, follow the [installation documentation](https://docs.zenthcloud.com).

Useful Compose commands:

```bash
docker compose ps
docker compose logs -f
docker compose down
```

`docker compose down` preserves the named data volumes. Do not remove them if you need to keep your ZenthCloud database and configuration.

The root `Makefile` wraps the same stack and adds operations targets:

```bash
make install                  # create .env if missing and start the stack
make docker-up self           # start the self-hosted edition
make docker-up cloud          # start ZenthCloud Cloud
make docker-up console        # start ZenthCloud Console
make doctor                   # check installation health
make backup                   # dump the database into ./backups
```

## How ZenthCloud is built

ZenthCloud is a pnpm monorepo with a single root lockfile (`pnpm-lock.yaml`) and workspace definition (`pnpm-workspace.yaml`) spanning the platform services, shared packages and web properties. The Go services and native Rust crates are built with their own toolchains and are not part of the JavaScript dependency graph.

### Workspace layout

```text
zenthcloud/
├── apps/                       # Platform services and the web application
│   ├── zenthcloud/             # @zenthcloud/app — dashboard, API server and runtime
│   ├── api/                    # @zenthcloud/api — async/background work service (Inngest)
│   ├── schedules/              # @zenthcloud/schedules — scheduled jobs
│   ├── status/                 # @zenthcloud/status-app — public status page (Next.js)
│   └── monitoring/             # Go monitoring and metrics service
├── packages/                   # Shared libraries and infrastructure components
│   ├── server/                 # @zenthcloud/server — core server, deployment and platform logic
│   ├── status/                 # @zenthcloud/status — status page engine
│   ├── trpc-openapi/           # @zenthcloud/trpc-openapi — tRPC ↔ OpenAPI integration
│   ├── zenthd/                 # Tunnel client (Go)
│   ├── cli/                    # cf — command-line interface
│   ├── mcp/                    # Model Context Protocol server
│   ├── workerd/                # JavaScript / WebAssembly server runtime
│   ├── workers-rs/             # Rust bindings for the Workers environment
│   ├── capnweb/                # JavaScript-native RPC system
│   ├── quiche/                 # QUIC transport and HTTP/3
│   ├── boringtun/              # WireGuard implementation
│   ├── pingora/                # Programmable proxy framework
│   ├── cfssl/                  # PKI and TLS toolkit
│   ├── terraform/              # Terraform provider
│   ├── pint/                   # Prometheus rule linter
│   ├── foundations/            # Rust observability library
│   ├── speedtest/              # Network speed-test component
│   └── node/                   # Kumo component library
├── web/                        # Marketing website, docs and support (own Makefile, Dockerfiles, compose)
│   ├── apps/website/           # @zenthcloud/website
│   ├── apps/docs/              # @zenthcloud/docs
│   └── apps/support/           # @zenthcloud/support
├── docs/                       # Architecture and design notes
├── scripts/                    # Repository tooling (install, docs, worktrees, ports)
├── docker/                     # Deployment-tooling install helper
├── Dockerfile                  # Platform, dev and status targets
├── docker-compose.yml          # Self-hosted stack
├── install.sh / install.ps1    # Host installers
└── Makefile                    # install / dev / docker / operations targets
```

### Core services

| Path | Package | Role |
| --- | --- | --- |
| `apps/zenthcloud` | `@zenthcloud/app` | Main web dashboard, API server and application runtime |
| `apps/api` | `@zenthcloud/api` | Background and asynchronous work service (Inngest functions) |
| `apps/schedules` | `@zenthcloud/schedules` | Scheduled jobs and recurring tasks service |
| `apps/status` | `@zenthcloud/status-app` | Public status page (Next.js) rendering data from the status engine |
| `apps/monitoring` | — (Go) | Resource monitoring and metrics collection service |

### Client applications

| Path | Role |
| --- | --- |
| `apps/zenthcloud` | Web dashboard (Next.js) |
| `apps/status` | Public status page |

All client surfaces — Web, command-line and agent — share the same API contracts and consume the same backend services, ensuring consistent behavior across platforms.

### Shared packages

| Path | Package | Role |
| --- | --- | --- |
| `packages/server` | `@zenthcloud/server` | Core server logic, deployment, database and platform utilities |
| `packages/status` | `@zenthcloud/status` | Status page engine: domain model, state computation, persistence, public/admin/integration API, notification outbox |
| `packages/trpc-openapi` | `@zenthcloud/trpc-openapi` | tRPC ↔ OpenAPI integration utilities |
| `packages/cli` | `cf` | Agent-friendly command-line interface for the platform API |
| `packages/mcp` | `zenthcloud-mcp` | Token-efficient MCP server exposing the API through Code Mode |

### Web properties

| Path | Package | Role |
| --- | --- | --- |
| `web/apps/website` | `@zenthcloud/website` | Official marketing website and product catalogue |
| `web/apps/docs` | `@zenthcloud/docs` | Product documentation site (Fumadocs) |
| `web/apps/support` | `@zenthcloud/support` | Support and help site |

The `web/` directory is its own pnpm workspace root with a dedicated `Makefile`, `Dockerfile.website` / `Dockerfile.docs` / `Dockerfile.support` and `docker-compose.yml`, so the marketing site, documentation and support site can be built and deployed independently of the platform.

### Infrastructure & protocol packages

| Path | Language | Role |
| --- | --- | --- |
| `packages/zenthd` | Go | Tunnel client that connects origins to the network without opening inbound ports |
| `packages/workerd` | C++ / TypeScript | JavaScript / WebAssembly server runtime |
| `packages/workers-rs` | Rust | Ergonomic Rust bindings for the Workers environment |
| `packages/capnweb` | TypeScript | JavaScript-native object-capability RPC system |
| `packages/quiche` | Rust | QUIC transport and HTTP/3 implementation |
| `packages/boringtun` | Rust | Userspace WireGuard implementation |
| `packages/pingora` | Rust | Fast, programmable proxy framework |
| `packages/cfssl` | Go | PKI and TLS toolkit for signing, verifying and bundling certificates |
| `packages/pint` | Go | Prometheus rule linter |
| `packages/foundations` | Rust | Logging, tracing, metrics and production-service utilities |
| `packages/speedtest` | TypeScript | Network quality and speed-test measurement engine |
| `packages/node` | TypeScript | Kumo accessible component library |

The root `Dockerfile` has `platform`, `dev` and `status` targets. `platform` is the single production image per edition (`self`, `cloud`, `console`): it carries both the client and API runtimes, and `ZENTHCLOUD_ROLE` selects `client`, `api` or `migrate` at runtime. Production images run unprivileged and never carry build tooling. The root Compose stack runs PostgreSQL, Redis, a client container and an API container from the same image digest.

## Development

The monorepo uses **Node.js 24.4 or later in the 24.x line** and **pnpm 10.22 or later**. Install dependencies from the repository root:

```bash
pnpm install --frozen-lockfile
```

### Root commands

The root development commands include:

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Run the ZenthCloud web application |
| `pnpm build` | Build workspace packages |
| `pnpm test` | Run the application test suite |
| `pnpm typecheck` | Type-check workspace packages |
| `pnpm lint` | Run Biome checks |
| `pnpm web:dev` / `pnpm web:build` | Run or build the official website |
| `pnpm docs:dev` / `pnpm docs:build` | Run or build the documentation site |
| `pnpm server:dev` / `pnpm server:build` | Run or build the `@zenthcloud/server` package |
| `pnpm generate:openapi` | Regenerate the OpenAPI document |
| `pnpm changeset` | Add a changeset for a user-facing change |

### Client application development

Each client application has its own development workflow:

**Web Dashboard** (`apps/zenthcloud`):
```bash
cd apps/zenthcloud
pnpm dev
```

**Status Page** (`apps/status`):
```bash
cd apps/status
pnpm dev
```

The application requires PostgreSQL and its runtime environment configuration. For a ready-to-run local stack with PostgreSQL and Redis, use Docker Compose as described above. See `.env.example`, the [installation guide](https://docs.zenthcloud.com), and the package scripts for service-specific development commands.

### Web properties

The marketing site (`web/apps/website`), the documentation site (`web/apps/docs`) and the support site (`web/apps/support`) share a dedicated toolchain in `web/`:

```bash
make -C web dev web          # run the website
make -C web dev docs         # run the docs site
make -C web build web        # build the website
make -C web build docs       # build the docs site
```

The same targets are available from the repository root through `pnpm web:dev`, `pnpm docs:dev`, `pnpm web:build` and `pnpm docs:build`.

### Native components

The Go and Rust components are built with their own toolchains:

```bash
(cd apps/monitoring && go build ./...)      # monitoring service
(cd packages/zenthd && make zenthcloudd)    # tunnel client
(cd packages/quiche && cargo build)         # QUIC / HTTP/3 library
(cd packages/pingora && cargo build)        # proxy framework
```

See each package's `README.md` for its requirements, test commands and release process.

## FAQ

### Is ZenthCloud free?

Yes. The core platform is open source and licensed under Apache 2.0, and the self-hosted edition is free to run. Some separately published packages or vendored components may carry their own license terms; check the relevant package's license file before redistributing it. A commercial edition with additional features and premium support is maintained by [Sky Genesis Enterprise](https://skygenesisenterprise.com).

### Do I have to host it myself?

No. You can self-host with `make install` or Docker Compose, or use the hosted [ZenthCloud Cloud](https://dash.zenthcloud.com) if you'd rather not manage the control plane.

### What do I need to run it?

Node.js 24.4+ and pnpm 10.22+ for development, or just Docker Engine with the Compose plugin for the containerized stack. The application needs PostgreSQL, Redis and a filled-in `.env`.

### Where is the documentation?

The full product documentation lives at [docs.zenthcloud.com](https://docs.zenthcloud.com). Deployment and feature guides are linked throughout this README.

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
- CLI: See [`packages/cli`](packages/cli)
- MCP server: See [`packages/mcp`](packages/mcp)
- Terraform provider: See [`packages/terraform`](packages/terraform)
- Status page app: See [`apps/status`](apps/status)

### Community

- Bugs and feature requests: [GitHub Issues](https://github.com/skygenesisenterprise/zenthcloud/issues)
- Contribution guide: [`.github/CONTRIBUTING.md`](.github/CONTRIBUTING.md)
- Code of Conduct: [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md)

### Commercial

- Commercial edition and premium support: [Sky Genesis Enterprise](https://skygenesisenterprise.com)
- Licensing and legal: [legal@skygenesisenterprise.com](mailto:legal@skygenesisenterprise.com)

## Contributing

Contributions and suggestions are welcome. Please read the [Code of Conduct](CODE_OF_CONDUCT.md) before participating, then follow the [contribution guide](.github/CONTRIBUTING.md) for setup and review expectations.

- Pick the right [pull request template](.github/PULL_REQUEST_TEMPLATE) for your change.
- Keep PR titles in [Conventional Commits](https://www.conventionalcommits.org) format (`fix: …`, `feat: …`, `docs: …`).
- Add a changeset with `pnpm changeset` when your change is user-facing.
- Run `pnpm test`, `pnpm typecheck` and `pnpm lint` before opening a pull request.

## Security

Do not report security vulnerabilities in public issues. Follow the private reporting instructions in [SECURITY.md](SECURITY.md), or email **security@skygenesisenterprise.com**.

## License

The root project is licensed under the [Apache 2.0 License](LICENSE). Some separately published packages or included components may have their own license terms; check the relevant package's license file before redistributing it.

## Note

ZenthCloud is an open-source project maintained by [Sky Genesis Enterprise](https://skygenesisenterprise.com). Links to external services are provided for convenience and do not imply endorsement. Check each service's own terms before relying on it in production.
