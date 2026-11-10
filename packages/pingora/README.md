# ZenthCloud Pingora

[![crates.io](https://img.shields.io/crates/v/pingora.svg)](https://crates.io/crates/pingora)
[![docs.rs](https://docs.rs/pingora/badge.svg)](https://docs.rs/pingora)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)
[![Rust](https://img.shields.io/badge/Rust-1.85%2B-000000?logo=rust&logoColor=white)](https://rust-lang.org)

![Pingora banner image](./docs/assets/pingora_banner.png)

> A Rust framework for building fast, reliable and programmable networked systems.

**Pingora** is a Rust framework to [build fast, reliable and programmable networked systems](https://github.com/skygenesisenterprise/zenthcloud). It is battle tested, having served more than 40 million Internet requests per second for [more than a few years](https://github.com/skygenesisenterprise/zenthcloud).

**Perfect for:** teams that need a memory-safe alternative to C/C++ proxy services, performance-sensitive gateways, and networked systems that require extensive customization.

## Contents

- [ZenthCloud Pingora](#zenthcloud-pingora)
  - [Contents](#contents)
  - [Why Pingora matters](#why-pingora-matters)
  - [What you can do](#what-you-can-do)
  - [Quick start](#quick-start)
  - [How Pingora is built](#how-pingora-is-built)
    - [Crates](#crates)
  - [System requirements](#system-requirements)
    - [Systems](#systems)
    - [Rust version](#rust-version)
    - [Build requirements](#build-requirements)
  - [Development](#development)
  - [FAQ](#faq)
  - [Related resources](#related-resources)
  - [Contributing](#contributing)
  - [Security](#security)
  - [License](#license)
  - [Note](#note)

## Why Pingora matters

🎯 **Security** — Pingora is a more memory-safe alternative for services written in C/C++.

🚀 **Performance** — It is fast and efficient, and powers production traffic at very high scale.

📦 **Programmable** — The proxy framework APIs are highly customizable, so load balancing, routing and protocol behaviour can be tailored.

🔒 **Protocol coverage** — HTTP/1 and HTTP/2 end-to-end proxying, gRPC and WebSocket, TLS over OpenSSL, BoringSSL, s2n-tls or rustls (experimental).

🧩 **Operational features** — Graceful reload, customizable load balancing and failover strategies, and support for a variety of observability tools.

## What you can do

- Build HTTP/1 and HTTP/2 proxies.
- Proxy gRPC and WebSocket traffic.
- Terminate TLS with OpenSSL, BoringSSL, s2n-tls or rustls (experimental).
- Implement custom load balancing and failover strategies.
- Reload gracefully and integrate with observability tooling.
- Build custom HTTP servers and proxy logic on top of the framework.

## Quick start

See the [quick starting guide](./docs/quick_start.md) to see how easy it is to build a load balancer.

The [user guide](./docs/user_guide/index.md) covers how to configure and run Pingora servers, as well as how to build custom HTTP servers and proxy logic on top of Pingora's framework. API docs are also available for all the crates.

```bash
cargo build
cargo test
```

## How Pingora is built

Pingora is a Cargo workspace of crates, with the public `pingora` crate as the entry point and smaller crates for protocol, proxy, TLS, load balancing and caching concerns.

### Crates

| Crate | Role |
| --- | --- |
| `pingora` | Public-facing crate for building networked systems and proxies |
| `pingora-core` | Protocols, functionality and basic traits |
| `pingora-foundations` | Foundations telemetry integration for Pingora services |
| `pingora-proxy` | Logic and APIs for building HTTP proxies |
| `pingora-error` | Common error type across Pingora crates |
| `pingora-http` | HTTP header definitions and APIs |
| `pingora-openssl` & `pingora-boringssl` | SSL-related extensions and APIs |
| `pingora-ketama` | [Ketama](https://github.com/RJ/ketama) consistent hashing algorithm |
| `pingora-limits` | Efficient counting algorithms |
| `pingora-load-balancing` | Load balancing extensions for `pingora-proxy` |
| `pingora-memory-cache` | Async in-memory caching with a cache lock to prevent stampede |
| `pingora-s2n` | SSL extensions and APIs for s2n-tls |
| `pingora-timeout` | A more efficient async timer system |
| `tinyufo` | The caching algorithm behind `pingora-memory-cache` |

Pingora proxy integration with caching should be considered experimental, so caching-related APIs are currently highly volatile.

## System requirements

### Systems

Linux is the tier 1 environment and main focus. Most code is intended to compile for Unix environments, so developing with Pingora on macOS and other Unix-like systems should work, though some features may be missing. Windows support is preliminary and community best-effort only. Both x86_64 and aarch64 architectures are supported.

### Rust version

Pingora keeps a rolling MSRV policy of 6 months. PRs that upgrade the MSRV are accepted as long as the new Rust version is at least 6 months old. The current MSRV is 1.85. Not all crates enforce `rust-version`, because some can be used on lower versions.

### Build requirements

Some crates depend on additional tools and libraries:

- [Clang](https://clang.llvm.org/) (for BoringSSL).
- [Perl 5](https://www.perl.org/) (for OpenSSL).

## Development

```bash
cargo build
cargo test
```

For formatting and contribution expectations, see the [contribution guidelines](./.github/CONTRIBUTING.md).

## FAQ

### Is Pingora a finished proxy?

No. Pingora is a framework. You build your proxy or networked service on top of it, and some areas such as caching are still experimental.

### Which TLS backends are supported?

OpenSSL, BoringSSL, s2n-tls and rustls (experimental).

### Does it support Windows?

Only preliminarily, through community effort. Linux is the tier 1 environment.

### What is the MSRV?

Rust 1.85 at the time of writing, with a rolling 6-month policy.

## Related resources

- Quick start: [docs/quick_start.md](./docs/quick_start.md)
- User guide: [docs/user_guide/index.md](./docs/user_guide/index.md)
- TinyUfo: [`tinyufo/`](tinyufo/)
- Ketama: [github.com/RJ/ketama](https://github.com/RJ/ketama)
- ZenthCloud repository: [github.com/skygenesisenterprise/zenthcloud](https://github.com/skygenesisenterprise/zenthcloud)

## Contributing

Contributions and suggestions are welcome. Please see the [contribution guidelines](./.github/CONTRIBUTING.md).

## Security

Do not report security vulnerabilities in public issues. Follow the private reporting instructions in the repository [`SECURITY.md`](https://github.com/skygenesisenterprise/zenthcloud).

## License

This project is licensed under the [Apache License, Version 2.0](./LICENSE).

## Note

Pingora is an open-source project maintained by [Sky Genesis Enterprise](https://skygenesisenterprise.com). Links to external services are provided for convenience and do not imply endorsement.
