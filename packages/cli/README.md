# ZenthCloud CLI

[![npm](https://img.shields.io/npm/v/cf.svg)](https://www.npmjs.com/package/cf)
[![Node.js](https://img.shields.io/badge/Node.js-supported%20majors-339933?logo=nodedotjs&logoColor=white)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-native-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)

> The agentic CLI for the entire Zenthcloud API.

**`cf`** is a command-line interface built for the next generation of software development. It exposes the whole Zenthcloud API through commands that both humans and agents can discover, drive and script.

**Perfect for:** developers working from a terminal, coding agents that need a predictable JSON interface, and teams that want one CLI for the whole platform.

## Contents

- [ZenthCloud CLI](#zenthcloud-cli)
  - [Contents](#contents)
  - [Why ZenthCloud CLI matters](#why-zenthcloud-cli-matters)
  - [What you can do](#what-you-can-do)
  - [Quick start](#quick-start)
  - [How ZenthCloud CLI is built](#how-zenthcloud-cli-is-built)
  - [Development](#development)
  - [FAQ](#faq)
  - [Related resources](#related-resources)
  - [Contributing](#contributing)
  - [Security](#security)
  - [License](#license)
  - [Note](#note)

## Why ZenthCloud CLI matters

🎯 **Built for agents** — Agents can find the command they need to do anything they want with bespoke search and steering.

🚀 **JSON first** — JSON is the default interface, pretty printed for humans and condensed for agents for maximum context savings.

📦 **TypeScript configuration** — `zenthcloud.config.ts` is the new configuration format for the whole of Zenthcloud, starting with Workers, bringing the safety and accuracy of TypeScript to you and your agent's language server protocol (LSP).

🧩 **Vite becomes default** — Vite brings the best local development server and a plugin suite for developers and framework authors.

## What you can do

- Discover commands with search and steering designed for agents.
- Work with JSON output that is readable for humans and compact for models.
- Configure Zenthcloud projects with `zenthcloud.config.ts`.
- Use Vite as the default local development server.
- Drive the same API from a terminal or from an agent without bespoke glue.

## Quick start

Install the open beta globally and run it from anywhere:

```bash
npm i -g cf
```

`cf` supports the latest minor release of each supported Node.js major version. See [package.json](package.json) for the supported versions.

## How ZenthCloud CLI is built

The CLI is a TypeScript package with a lazy command registry. Commands are either hand-written or generated from the OpenAPI specification through Forge.

| Area | Location | Role |
| --- | --- | --- |
| CLI entry and request runtime | `packages/cli/src/index.ts`, `src/api/`, `src/lib/` | Startup, API requests and shared helpers |
| Hand-written commands | `packages/cli/src/commands/` | Commands that need bespoke behaviour |
| Generated commands | `packages/cli/src/commands/_generated/` | Commands generated from OpenAPI |
| Generator plugin | `packages/cli/generator/` | Forge plugin and OpenAPI preparation |
| Tests | `packages/cli/src/__tests__/` | Unit and command tests |

Generated output is never edited by hand. Run `pnpm generate` to rebuild it from the pinned OpenAPI document and Forge plugin.

## Development

```bash
pnpm install           # install pinned dependencies
pnpm generate          # pinned OpenAPI + Forge plugin → tracked commands
pnpm build             # generation + packaging → dist/
pnpm dev               # source entry; no generation or bundling
pnpm check             # generation + builds + type checks + lint/format
pnpm --filter cf test  # run the CLI test suite
```

See the repository [AGENTS.md](AGENTS.md) and [architecture reference](docs/architecture.md) for the full command, generator and publishing conventions.

## FAQ

### Which Node.js versions are supported?

`cf` supports the latest minor release of each supported Node.js major version. See [package.json](package.json).

### Is the CLI tied to Workers?

No. `cf` covers the entire Zenthcloud API. Workers workflows are one part of it, alongside the rest of the platform.

### How do I find the right command?

Use the CLI's search and steering, then inspect a command with `--help` or `cf schema <command>` before running it.

## Related resources

- Package: [`packages/cli`](packages/cli)
- Architecture: [docs/architecture.md](docs/architecture.md)
- Design history: [docs/design-history.md](docs/design-history.md)
- Forge: [`packages/forge`](../forge)
- ZenthCloud repository: [github.com/skygenesisenterprise/zenthcloud](https://github.com/skygenesisenterprise/zenthcloud)

## Contributing

Contributions and suggestions are welcome. Read the repository [contribution guide](https://github.com/skygenesisenterprise/zenthcloud) before participating, and run the full `pnpm check` before pushing.

## Security

Do not report security vulnerabilities in public issues. Follow the private reporting instructions in the repository [`SECURITY.md`](https://github.com/skygenesisenterprise/zenthcloud).

## License

See the repository [LICENSE](https://github.com/skygenesisenterprise/zenthcloud) for licensing terms.

## Note

`cf` is an open-source project maintained by [Sky Genesis Enterprise](https://skygenesisenterprise.com). Links to external services are provided for convenience and do not imply endorsement.
