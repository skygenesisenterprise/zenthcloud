# ZenthCloud Forge

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-OpenAPI%203.x-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-pnpm%20workspace-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)

> A schema-first OpenAPI code generation and surface tooling framework.

**Forge** is a plugin-based framework for resolving OpenAPI 3.x specifications, applying JSONPath-based overlays, and generating typed SDKs, CLI interfaces, runtime helpers and documentation.

**Perfect for:** teams that treat an OpenAPI document as the source of truth, maintain SDKs and CLIs across several languages, and want generation to be deterministic and reviewable.

## Contents

- [ZenthCloud Forge](#zenthcloud-forge)
  - [Contents](#contents)
  - [Why Forge matters](#why-forge-matters)
  - [What you can do](#what-you-can-do)
  - [Quick start](#quick-start)
  - [How Forge is built](#how-forge-is-built)
    - [Packages](#packages)
    - [RFCs](#rfcs)
  - [Development](#development)
  - [FAQ](#faq)
  - [Related resources](#related-resources)
  - [Contributing](#contributing)
  - [Security](#security)
  - [License](#license)
  - [Note](#note)

## Why Forge matters

🎯 **Schema-first** — OpenAPI is the input, not an afterthought. Resolution and overlays happen before any target is generated.

🚀 **Plugin-based** — Each output target is a plugin, so new surfaces do not require forking the core.

📦 **Deterministic output** — Generated artifacts are designed to be committed and reviewed.

🔒 **Overlay support** — JSONPath-based overlays let product-specific metadata live upstream without editing generated code.

🧩 **Multiple targets** — Generate typed SDKs, CLI interfaces, runtime helpers and documentation from one document.

## What you can do

- Resolve OpenAPI 3.x specifications, including `$ref` inlining.
- Apply JSONPath-based overlays to shape the document before generation.
- Generate typed SDKs, CLI interfaces, runtime helpers and documentation.
- Extend the pipeline with plugins for new output targets.
- Keep generated output deterministic and reviewable.

## Quick start

Forge is a pnpm workspace rooted at `packages/forge`.

```bash
pnpm install
pnpm test
```

Its first production output is the [`cf` CLI](../cli). The framework is still early, and additional targets (TypeScript, Go, Python, Terraform, and docs for each) will follow as Zenthcloud releases those targets for its own SDKs.

## How Forge is built

Forge is organized as a set of packages with a generic core and target-specific plugins.

### Packages

| Package | Role |
| --- | --- |
| `packages/astro-fern` | Generic Astro engine for rendering Fern-based API documentation |
| `packages/fern-forge` | `astro-fern` extension that validates and adapts Forge OpenAPI metadata |
| `packages/docs-site` | API documentation website consuming the two packages above |
| `packages/zenthcloud-terraform-docs` | Temporary generator for Terraform documentation data |

Generic packages must remain free of Zenthcloud-specific dependencies.

### RFCs

Design proposals and specifications live in [`rfcs/`](rfcs/). Read the relevant RFC before changing a public pipeline behaviour.

## Development

```bash
pnpm install
pnpm check        # lint and format checks
pnpm typecheck    # typecheck all packages
pnpm test         # run all unit tests
pnpm format       # rewrite formatting
pnpm --filter docs-site build
```

Formatting and linting use `oxfmt` and `oxlint`, configured at the root. TypeScript runs with strict settings across all packages.

## FAQ

### Is Forge stable?

It is still early. The first production output is the `cf` CLI, and other targets are added as Zenthcloud ships them.

### Can I add a target?

Yes. Targets are plugins. Keep generic packages free of Zenthcloud-specific dependencies, and propose significant changes through an RFC.

### Why commit generated output?

It keeps generation observable in review and makes the pipeline reproducible.

## Related resources

- RFCs: [`rfcs/`](rfcs/)
- `cf` CLI: [`packages/cli`](../cli)
- Forge CLI launch: [blog.zenthcloud.com](https://blog.zenthcloud.com/zenthcloud-cf-cli-launch)
- ZenthCloud repository: [github.com/skygenesisenterprise/zenthcloud](https://github.com/skygenesisenterprise/zenthcloud)

## Contributing

Contributions and suggestions are welcome. Read the repository [contribution guide](https://github.com/skygenesisenterprise/zenthcloud) before participating, and keep generic packages free of Zenthcloud-specific dependencies.

## Security

Do not report security vulnerabilities in public issues. Follow the private reporting instructions in the repository [`SECURITY.md`](https://github.com/skygenesisenterprise/zenthcloud).

## License

Apache-2.0 © zenthcloud, Inc. See the repository [LICENSE](https://github.com/skygenesisenterprise/zenthcloud) for details.

## Note

Forge is an open-source project maintained by [Sky Genesis Enterprise](https://skygenesisenterprise.com). Links to external services are provided for convenience and do not imply endorsement.
