<div align="center">

# ZenthCloud

**A sovereign, open-source and ethical cloud platform built for transparency, control, and modular infrastructure.**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Go](https://img.shields.io/badge/Go-1.25+-00ADD8?logo=go&logoColor=white)](https://go.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](.github/CONTRIBUTING.md)
[![Contributors](https://img.shields.io/github/contributors/skygenesisenterprise/zenthcloud.svg)](https://github.com/skygenesisenterprise/zenthcloud/graphs/contributors)

</div>

---

This repository contains **ZenthCloud**, a complete cloud platform: the web frontend (Next.js), the backend API (Go), the data schema definitions, the deployment infrastructure (Docker, Kubernetes, monitoring), and the embedded system administration console (Aether Vault).

ZenthCloud combines proven concepts from modern platforms (strong authentication, content publishing, subscriptions, monitoring) into a single monorepo. Its design emphasizes **sovereignty** (self-hosting), **transparency** (open source, auditability), and **ethics** (no vendor lock-in), in that order of priority.

For more information about ZenthCloud, including downloads, documentation, and deployment guides, check out the official website [zenthcloud.com](https://zenthcloud.com) or the repository documentation.

## Table of Contents

- [Community](#community)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Compilation & Build](#compilation--build)
- [Quick Start](#quick-start)
- [Deployment](#deployment)
- [Tools](#tools)
- [Contributors](#contributors)
- [Contributing](#contributing)
- [License](#license)

## Community

ZenthCloud is developed and maintained by [Sky Genesis Enterprise](https://skygenesisenterprise.com). The community is the best place to ask questions and discuss the project:

- **GitHub Issues** — the best place to report bugs and request features.
- **GitHub Discussions** — a place to discuss the project, ask questions, and share ideas.
- **Support** — see [SUPPORT.md](.github/SUPPORT.md) for the official support channels.
- **Email** — [contact@skygenesisenterprise.com](mailto:contact@skygenesisenterprise.com) for general inquiries, and [security@zenthcloud.com](mailto:security@zenthcloud.com) for security issues (see [SECURITY.md](SECURITY.md)).
- **Stack Overflow** — for programming-related questions, general topics about Next.js, Go and Prisma can be asked on Stack Overflow.
- **GitHub Wiki** — misc user-contributed content.

## Features

### Authentication & Identity

- Registration, sign in and sign out (email + password)
- Email verification and password reset (hashed tokens with rotation)
- **MFA (TOTP)** with recovery codes
- **OAuth 2.0** (linked external accounts, callback flows)
- **CLI auth** — terminal-based authentication
- Sessions with **refresh token family** (rotation, revocation, reuse detection)
- Authentication rate limiting (Redis)
- Authentication audit event log
- **RBAC** — system roles (superadmin, admin, etc.) and permissions
- **Workspaces** with members, roles, and **SSO** configuration (SAML/OIDC)

### Publishing Platform (News)

- Articles (draft, writing, review, scheduled, published, archived)
- Types: article, announcement, technical note, dossier, communique, analysis
- Hierarchical categories, authors, dossiers, comments (moderation)
- Newsletter (subscribers, statuses), breaking news ticker
- SEO: titles, descriptions, keywords, OG/Twitter cards, sitemap
- Views, bookmarks, reading time, premium articles
- Multilingual (fr, be_fr, be_nl, ch_fr) via `next-intl`

### Subscriptions & Billing

- Subscription plans (price, period, currency, features)
- Subscriptions with statuses (active, trialing, past due, canceled, expired)
- Transactions and billing information

### Notifications & Realtime

- Notifications (article, bookmark, system, account) with templates
- Granular notification preferences
- Realtime presence and event bus (Redis + WebSocket)

### Administration & Platform

- Site settings (name, SMTP, maintenance mode, registration, comments, ...)
- System settings (key/value JSON)
- API keys, webhooks, audit logs
- Per-path SEO meta

### Monetization & Social networks

- Ad campaigns and placements (banner, sidebar, native, in-article, video, popup)
- Social accounts and automated publications (Twitter, Facebook, Instagram, LinkedIn, YouTube, Twitch, Discord)

### Status & Observability

- Status page: services, incidents (investigating, identified, monitoring, resolved)
- Monitoring: Prometheus, Grafana, Loki, Promtail

## Tech Stack

### Frontend — `apps/`

| Technology | Role |
| --- | --- |
| **Next.js 16** (App Router) | React framework — server rendering, static and API routes |
| **React 19** | UI library |
| **TypeScript** (strict) | Typed language |
| **Tailwind CSS 4** + `cn()` | Styles and utilities |
| **Radix UI** + shadcn/ui | Accessible components |
| **next-intl** | Internationalization (fr, be_fr, be_nl, ch_fr) |
| **Zustand, framer-motion, recharts, vaul, sonner** | State, animations, charts, modals, toasts |

Frontend sections (route groups): `(public)` — multilingual showcase site (blog, solutions, private/public cloud, bare-metal, telecom, web hosting, changelog, legal, PGP, company), `(auth)` — sign in, MFA, email verification, CLI auth, `(console)` — user dashboard, `(manager)` — management platform, `(order)` — checkout flow, `(docs)` — documentation, `(health)` — status.

### Backend — `server/`

| Technology | Role |
| --- | --- |
| **Go 1.25+** | Backend language |
| **Gin** | HTTP framework / routing |
| **GORM** | ORM — **sole schema owner** (AutoMigrate) |
| **Prisma** (reference schema) | Data model definition + migrations |
| **PostgreSQL** | Relational database |
| **Redis** | Cache, sessions, rate limiting, event bus, presence |
| **RabbitMQ** | Message queue |
| **Meilisearch** | Full-text search |
| **JWT + golang-jwt** | Access tokens and refresh tokens |
| **pquerna/otp** | TOTP MFA |

### Infra & DevOps

- **Docker** / **docker-compose** — dev and production (multi-stage image)
- **Kubernetes** — manifests (`infrastructure/k8s/`)
- **NGINX** — reverse proxy (`infrastructure/web/`)
- **Prometheus + Grafana + Loki + Promtail** — monitoring (`infrastructure/monitoring/`)
- **GitHub Actions** — CI/CD (lint, CodeQL, dependencies, builds, releases)

## Compilation & Build

### Prerequisites

To compile and run ZenthCloud from source, you will need:

- **Node.js** >= 18.0.0 (recommended: the version in `.nvmrc`)
- **pnpm** >= 8.0.0 (package manager — `packageManager: pnpm@8.15.0`)
- **Go** >= 1.25 for the backend
- **PostgreSQL** and **Redis** (or Docker to run them)
- **Make** (for the Makefile targets)
- **Git** to clone the repository

> **Windows note:** the project is developed and tested on Linux. Cygwin and similar POSIX runtime environments are not officially supported.

### Supported platforms

| Operating System | Architectures |
| --- | --- |
| Linux (most distributions) | x86_64, arm64 |
| macOS | x86_64, Apple Silicon (ARM64) |
| Windows (WSL2 recommended) | x86_64 |

More platforms are likely to work, but they are not tested regularly and may be less stable than the ones listed above.

### Build steps

First, get ZenthCloud from GitHub:

```bash
git clone https://github.com/skygenesisenterprise/zenthcloud.git
cd zenthcloud
```

Then install dependencies and start development:

```bash
# Install dependencies (pnpm monorepo)
pnpm install

# Copy and configure the environment
cp .env.example .env.local

# Run the frontend (Next.js :3000) and the backend (Go :8080) in parallel
pnpm dev
```

Build commands:

```bash
pnpm build           # Production build of all workspaces
pnpm build:frontend  # Next.js build only
pnpm build:backend   # Go build only
pnpm typecheck       # TypeScript check (strict) on all workspaces
pnpm lint            # ESLint on all workspaces
pnpm test            # Tests on all workspaces
```

To start production after building:

```bash
pnpm start
```

## Quick Start

### Local development (docker-compose)

```bash
# Start the full development environment (dev profile)
make dev-up

# Services: frontend (:3000), Go API (:8080), PostgreSQL (:5432),
#            Redis (:6379), RabbitMQ (:5672/:15672), Meilisearch (:7700),
#            pgAdmin, NGINX (:80)
```

| Service | Port | Description |
| --- | --- | --- |
| Frontend (Next.js) | 3000 | Web application |
| API (Go/Gin) | 8080 | REST API `/api/v1` |
| PostgreSQL | 5432 | Database |
| Redis | 6379 | Cache & sessions |
| RabbitMQ | 5672 / 15672 | Message queue / management |
| Meilisearch | 7700 | Full-text search |
| pgAdmin | — | PostgreSQL administration (dev) |
| NGINX | 80 | Reverse proxy (dev) |

### Database

The schema is defined in two complementary places:

- **`server/prisma/schema.prisma`** — the reference for the data model (tables, enums, relations)
- **GORM `AutoMigrate`** (in `server/main.go`) — the effective schema owner at startup

```bash
pnpm db:generate   # Generate the Prisma client
pnpm db:migrate    # Apply Prisma migrations
pnpm db:seed       # Seed the database
pnpm db:studio     # Open Prisma Studio
```

> **Warning:** in docker-compose, `PRISMA_SCHEMA_DEPLOY=false`: GORM is the sole schema owner. Do not re-enable automatic Prisma deployment (`db push`) in production without manual verification — it can recreate columns and wipe data.

### Environment

Copy `.env.example` to `.env.local` and fill in: `DATABASE_URL`, `SECRET_KEY`, `DOMAIN_HOST`, `REDIS_*`, `JWT_SECRET`, `CORS_ALLOWED_ORIGINS`, etc. Each workspace exposes its own variables (see `server/prisma/.env.example` and `apps/`).

## Deployment

### Docker

```bash
# Development image
make build-dev
make dev-up

# Production image (static frontend export + Go binary)
make build-prod
make prod-up

# Production — official image
docker build -t skygenesisenterprise/zenthcloud:latest .
docker compose up -d
```

The `Dockerfile` is multi-stage and accepts the `NODE_ENV` and `BUILD_STATIC` arguments. The backend runs in `api` mode (REST API) or `server` mode.

### Kubernetes

Manifests are provided in `infrastructure/k8s/` (namespace, configmap, secret, deployment, service, ingress).

### Full infrastructure

See [infrastructure/README.md](infrastructure/README.md) for: Docker, Kubernetes, Redis configurations (dev/test/prod), the monitoring stack (Prometheus, Grafana, Loki, Promtail), the NGINX reverse proxy, and automation.

## Tools

The monorepo ships with several built-in tools:

- **Root Makefile** — targets `dev-up`, `dev-down`, `prod-up`, `build`, `clean`, `prune`, etc. Run `make help` for the full list.
- **`cmd/` — Aether Vault** — an appliance-style system console (OPNsense-style) for server administration: interactive menu, systemd management, network, security, maintenance, SSH and Vault integration. See [cmd/README.md](cmd/README.md).
- **`scripts/`** — utilities (e.g. `wait-for-db.sh`).
- **`infrastructure/Makefile`** — targets for Redis, monitoring, Kubernetes, and Docker.
- **Changesets** — version management and releases (`pnpm changeset`, `pnpm release`).
- **Husky + lint-staged + commitlint** — git hooks: ESLint/Prettier on commit, conventional commit messages (see `.commitlintrc`).
- **CLI** — a CLI is available via the `package/cli` workspace (`pnpm cli`).

## Contributors

This project exists thanks to all the people who contribute.

[![Contributors](https://img.shields.io/github/contributors/skygenesisenterprise/zenthcloud.svg)](https://github.com/skygenesisenterprise/zenthcloud/graphs/contributors)

## Contributing

See the [detailed contributing guidelines](.github/CONTRIBUTING.md) and the [Governance.md](Governance.md) for the full governance model.

All contributions are welcome regardless of how small or large they are — everything from spelling fixes to new features. Before you start contributing, familiarize yourself with the repository structure:

```
├── apps/                          # Next.js frontend (App Router)
│   ├── app/                       # Routes: (public), (auth), (console), (manager), (order), (docs), (health)
│   ├── components/                # React components (ui/, public/, ...)
│   ├── i18n/                      # next-intl configuration
│   ├── messages/                  # Translation files (fr.json, ...)
│   └── package.json               # Frontend workspace
├── server/                        # Go backend
│   ├── main.go                    # Entry point: config, DB, Redis, routes
│   ├── prisma/                    # Prisma reference schema + migrations
│   └── src/
│       ├── config/                # Configuration (env, validation)
│       ├── routes/                # API routes (auth, articles, categories, admin, ...)
│       ├── services/              # Business logic (auth, MFA, OAuth, presence, ...)
│       ├── middleware/            # RequestID, CORS, logging, recovery
│       ├── models/                # GORM models
│       ├── interfaces/            # Interfaces
│       └── utils/                 # Utilities
├── packages/                      # Shared workspaces (package, package/cli)
├── tools/                         # Development tools
├── utils/                         # Utilities
├── example/                       # Example pages
├── cmd/                           # Aether Vault — system console (Go/Cobra)
├── infrastructure/                # Docker, Kubernetes, Redis, monitoring, NGINX
│   ├── k8s/                       # Kubernetes manifests
│   ├── redis/                     # Redis configurations (dev/test/prod)
│   ├── monitoring/                # Prometheus, Grafana, Loki, Promtail
│   ├── docker/                    # Compose, pgAdmin, scripts
│   └── web/                       # NGINX
├── scripts/                       # Utility scripts
├── docker/                        # Docker resources
├── .github/                       # CI/CD workflows, issue templates, CONTRIBUTING
├── entrypoint.sh                  # Unified container entry point
├── Dockerfile                     # Multi-stage build
└── docker-compose.yml             # Orchestration (dev + prod)
```

### Contribution process

1. **Fork** the repository and create a `feature/my-feature` or `fix/my-bug` branch.
2. Install dependencies (`pnpm install`) and run `pnpm dev`.
3. Implement your change following the code conventions:
   - Strict TypeScript, import React via `import * as React from "react"`
   - `@/*` aliases for internal imports
   - PascalCase components, kebab-case files
   - Next.js App Router conventions, Tailwind CSS with `cn()`
4. Add tests where applicable, then verify: `pnpm typecheck && pnpm lint && pnpm test`.
5. Submit a **pull request** using the [PR template](.github/PULL_REQUEST_TEMPLATE.md).

Integration tests should go in the corresponding `tests/` directories. CI verifies that all tests pass before accepting a pull request.

If you are looking for ways to contribute, check out our [issue tracker](https://github.com/skygenesisenterprise/zenthcloud/issues) — issues labeled `good first issue` are a good starting point.

If you have any questions, feel free to open a GitHub discussion or contact us by email.

## License

The project is licensed under the **Apache 2.0 License** — see the [LICENSE](LICENSE) file for details. As a result, you may use any compatible license for your own programs developed with ZenthCloud. You are explicitly permitted to develop commercial applications based on ZenthCloud.

Copyright © Sky Genesis Enterprise. All rights reserved.
