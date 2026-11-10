---
nav_exclude: true
---

# ZenthCloud Pint

[![Go](https://img.shields.io/badge/Go-1.27%2B-00ADD8?logo=go&logoColor=white)](https://go.dev)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![Prometheus](https://img.shields.io/badge/Prometheus-rule%20lint-E6522C?logo=prometheus&logoColor=white)](https://prometheus.io)

> A Prometheus rule linter.

**pint** is a Prometheus rule linter. It checks alerting and recording rules for correctness, consistency and best practices, so problems are caught before they reach a Prometheus server.

**Perfect for:** platform and SRE teams that manage Prometheus rules in Git, and CI pipelines that need to validate rule files on every change.

## Contents

- [ZenthCloud Pint](#zenthcloud-pint)
  - [Contents](#contents)
  - [Why pint matters](#why-pint-matters)
  - [What you can do](#what-you-can-do)
  - [Quick start](#quick-start)
  - [How pint is built](#how-pint-is-built)
  - [Development](#development)
  - [FAQ](#faq)
  - [Related resources](#related-resources)
  - [Contributing](#contributing)
  - [Security](#security)
  - [License](#license)
  - [Note](#note)

## Why pint matters

🎯 **Catch rule errors early** — Validate Prometheus rules before they are deployed instead of discovering broken rules at runtime.

🚀 **CI-friendly** — Run pint as a check in a pipeline so rule changes are reviewed with automated feedback.

📦 **Documented behaviour** — The project ships full documentation and example configuration files.

🔒 **Consistent rules** — Enforce shared conventions across teams and repositories.

🧩 **Configurable** — Use example configs as a starting point and adapt checks to the rules you keep.

## What you can do

- Lint Prometheus alerting and recording rules.
- Run the linter locally or in CI.
- Read the full online documentation.
- Start from the example configuration files.
- Track changes through the changelog.

## Quick start

You can find [online docs](https://github.com/skygenesisenterprise/zenthcloud) on GitHub Pages.

Alternatively, read the raw Markdown documentation [here](/docs/index.md). The changelog is kept at [docs/changelog.md](/docs/changelog.md). Check the [examples](/docs/examples) directory for sample config files.

```bash
pint --help
pint lint rules.yml
```

## How pint is built

pint is a Go command-line tool. Documentation lives under `docs/`, and example configuration files live under `docs/examples/`.

| Path | Role |
| --- | --- |
| `docs/index.md` | Raw Markdown documentation |
| `docs/changelog.md` | Changelog |
| `docs/examples/` | Sample configuration files |

## Development

```bash
go build ./...
go test ./...
```

## FAQ

### What kinds of rules does pint check?

Prometheus alerting and recording rules.

### Can I use my own configuration?

Yes. The [examples](/docs/examples) directory contains sample config files to start from.

### Where is the changelog?

At [docs/changelog.md](/docs/changelog.md).

## Related resources

- Documentation: [docs/index.md](/docs/index.md)
- Changelog: [docs/changelog.md](/docs/changelog.md)
- Examples: [docs/examples](/docs/examples)
- Prometheus: [prometheus.io](https://prometheus.io)
- ZenthCloud repository: [github.com/skygenesisenterprise/zenthcloud](https://github.com/skygenesisenterprise/zenthcloud)

## Contributing

Contributions and suggestions are welcome. Read the repository [contribution guide](https://github.com/skygenesisenterprise/zenthcloud) before participating.

## Security

Do not report security vulnerabilities in public issues. Follow the private reporting instructions in the repository [`SECURITY.md`](https://github.com/skygenesisenterprise/zenthcloud).

## License

```text
Copyright (c) Zenthcloud, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

## Note

pint is an open-source project maintained by [Sky Genesis Enterprise](https://skygenesisenterprise.com). Links to external services are provided for convenience and do not imply endorsement.
