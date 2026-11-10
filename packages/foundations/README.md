# ZenthCloud Foundations

[![crates.io](https://img.shields.io/crates/v/foundations.svg)](https://crates.io/crates/foundations)
[![docs.rs](https://docs.rs/foundations/badge.svg)](https://docs.rs/foundations)
[![License: BSD-3-Clause](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](LICENSE)
[![Rust](https://img.shields.io/badge/Rust-2021%20edition-000000?logo=rust&logoColor=white)](https://rust-lang.org)

> Production-grade building blocks for distributed Rust services.

**Foundations** is a modular Rust library designed to help scale programs for distributed, production-grade systems. It lets engineers concentrate on the core business logic of their services rather than the intricacies of production operation setups.

**Perfect for:** Rust services that need logging, tracing, metrics, memory profiling, sandboxing or configuration without assembling and maintaining a separate stack for each.

## Contents

- [ZenthCloud Foundations](#zenthcloud-foundations)
  - [Contents](#contents)
  - [Why Foundations matters](#why-foundations-matters)
  - [What you can do](#what-you-can-do)
  - [Quick start](#quick-start)
  - [How Foundations is built](#how-foundations-is-built)
    - [Crates](#crates)
  - [Development](#development)
  - [FAQ](#faq)
  - [Related resources](#related-resources)
  - [Contributing](#contributing)
  - [Security](#security)
  - [License](#license)
  - [Note](#note)

## Why Foundations matters

🎯 **Focus on business logic** — Production concerns are provided as reusable building blocks instead of being reimplemented in every service.

🚀 **Batteries included** — Logging, distributed tracing, metrics, memory profiling and configuration are designed to work together.

📦 **Operational defaults** — Includes a [jemalloc](https://github.com/jemalloc/jemalloc) allocator, [seccomp](https://en.wikipedia.org/wiki/Seccomp)-based syscall sandboxing, documented service configuration and a CLI helper for loading it.

🔒 **Production-minded** — The library targets distributed, long-running services where observability and resource control matter.

🧩 **Modular** — Use only the features a service needs through feature flags.

## What you can do

If you need any of these, Foundations is a tool of choice:

- Logging.
- Distributed tracing.
- Metrics.
- Memory profiling and a [jemalloc](https://github.com/jemalloc/jemalloc) allocator.
- Security features such as [seccomp](https://en.wikipedia.org/wiki/Seccomp)-based syscall sandboxing.
- Service configuration with documentation.
- A CLI helper that takes care of configuration loading.

## Quick start

Add the crate to your service and enable the features you need:

```toml
[dependencies]
foundations = { version = "...", features = ["..."] }
```

Then build and test:

```bash
cargo build
cargo nextest run
```

## How Foundations is built

Foundations is a Rust 2021 library with feature-gated modules. Public items are documented, and missing documentation is a warning.

### Crates

| Crate | Role |
| --- | --- |
| `foundations` | Logging, tracing, metrics, profiling, sandboxing, configuration and CLI helpers |
| `foundations-metrics` | Metrics primitives and integration |
| `foundations-metrics-registry` | Metrics registry |

Feature flags wrap platform-specific or optional code with `#[cfg(feature = "...")]`. The project avoids `openssl`/`openssl-sys` and uses `boring`, `ring` or `rustls` instead.

## Development

```bash
cargo build
cargo nextest run                              # all tests
cargo nextest run <test_name>                  # single test
cargo clippy --all-targets -- -D warnings -D unreachable_pub -D clippy::await_holding_lock -D clippy::clone_on_ref_ptr
cargo fmt --all
./scripts/lint-fix.sh
cargo hack check --feature-powerset --no-dev-deps --depth 1
```

## FAQ

### Which edition does Foundations use?

Rust 2021, with `rustfmt` defaults.

### Can I use only metrics or only tracing?

Yes. The library is modular and feature-gated; enable the features the service needs.

### Does it support alternative TLS stacks?

Yes. Use `boring`, `ring` or `rustls`. `openssl`/`openssl-sys` are deliberately excluded.

## Related resources

- API documentation: [docs.rs/foundations](https://docs.rs/foundations/)
- Examples: [github.com/skygenesisenterprise/zenthcloud](https://github.com/skygenesisenterprise/zenthcloud)
- jemalloc: [github.com/jemalloc/jemalloc](https://github.com/jemalloc/jemalloc)
- seccomp: [en.wikipedia.org/wiki/Seccomp](https://en.wikipedia.org/wiki/Seccomp)
- ZenthCloud repository: [github.com/skygenesisenterprise/zenthcloud](https://github.com/skygenesisenterprise/zenthcloud)

## Contributing

Contributions and suggestions are welcome. Read the repository [contribution guide](https://github.com/skygenesisenterprise/zenthcloud) before participating.

## Security

Do not report security vulnerabilities in public issues. Follow the private reporting instructions in the repository [`SECURITY.md`](https://github.com/skygenesisenterprise/zenthcloud).

## License

BSD-3 licensed. See the [LICENSE](LICENSE) file for details.

## Note

Foundations is an open-source project maintained by [Sky Genesis Enterprise](https://skygenesisenterprise.com). Links to external services are provided for convenience and do not imply endorsement.
