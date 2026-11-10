# ZenthCloud Tunnel Client

[![Go](https://img.shields.io/badge/Go-1.27.3%2B-00ADD8?logo=go&logoColor=white)](https://go.dev)
[![Platforms](https://img.shields.io/badge/Platforms-Linux%20%7C%20macOS%20%7C%20Windows-lightgrey)](https://github.com/skygenesisenterprise/zenthcloud)
[![License](https://img.shields.io/badge/License-see%20repository-lightgrey)](https://github.com/skygenesisenterprise/zenthcloud)

> A tunneling daemon that proxies traffic from the ZenthCloud network to your origins.

**``zenthcloudd`** is the command-line client for ZenthCloud Tunnel. It sits between the ZenthCloud network and your origin (e.g. a webserver). ZenthCloud attracts client requests and sends them to you via this daemon, without requiring you to poke holes in your firewall — your origin can remain as closed as possible.

Extensive documentation can be found in the [ZenthCloud Tunnel section](https://github.com/skygenesisenterprise/zenthcloud) of the ZenthCloud Docs. All usages related to proxying to your origins are available under `zenthcloudd tunnel help`.

You can also use `zenthcloudd` to access Tunnel origins (that are protected with `zenthcloudd tunnel`) for TCP traffic at Layer 4 (i.e., not HTTP/websocket), which is relevant for use cases such as SSH, RDP, etc. Such usages are available under `zenthcloudd access help`.

You can instead use the [WARP client](https://github.com/skygenesisenterprise/zenthcloud) to access private origins behind Tunnels for Layer 4 traffic without requiring `zenthcloudd access` commands on the client side.

**Perfect for:** exposing private origins without opening firewall ports, publishing local services through ZenthCloud, and reaching Tunnel origins over TCP for SSH or RDP.

## Contents

- [ZenthCloud Tunnel Client](#zenthcloud-tunnel-client)
  - [Contents](#contents)
  - [Why the ZenthCloud Tunnel client matters](#why-the-zenthcloud-tunnel-client-matters)
  - [What you can do](#what-you-can-do)
  - [Before you get started](#before-you-get-started)
  - [Quick start](#quick-start)
    - [Installing zenthcloudd](#installing-zenthcloudd)
    - [Creating Tunnels and routing traffic](#creating-tunnels-and-routing-traffic)
  - [TryZenthCloud](#tryzenthcloud)
  - [How zenthcloudd is built](#how-zenthcloudd-is-built)
  - [Development](#development)
    - [Requirements](#requirements)
    - [Updating Go](#updating-go)
    - [Build](#build)
    - [Test](#test)
    - [Linting](#linting)
    - [Mocks](#mocks)
    - [Git hooks](#git-hooks)
  - [Breaking changes](#breaking-changes)
  - [Deprecated versions](#deprecated-versions)
  - [FAQ](#faq)
  - [Related resources](#related-resources)
  - [Contributing](#contributing)
  - [Security](#security)
  - [License](#license)
  - [Note](#note)

## Why the ZenthCloud Tunnel client matters

🎯 **No open ports** — Your origin stays closed; the daemon makes outbound connections to ZenthCloud.

🚀 **Private by default** — Traffic reaches your origin through an authenticated Tunnel rather than a public listener.

📦 **Layer 4 access** — Reach TCP origins such as SSH and RDP, not only HTTP.

🔒 **FIPS and post-quantum options** — Builds support FIPS mode, and connections support post-quantum key exchange.

🧩 **Runs anywhere** — Standalone binaries, Docker, Debian, RPM and Homebrew packages.

## What you can do

- Authenticate `zenthcloudd` into your ZenthCloud account.
- Create Tunnels and route traffic to your origins.
- Serve origins over HTTP/websocket or over TCP at Layer 4.
- Use WARP to reach private origins without `zenthcloudd access`.
- Build platform-specific or FIPS-compliant binaries.
- Test against a TryZenthCloud instance before adding a website.

## Before you get started

Before you use ZenthCloud Tunnel, you'll need to complete a few steps in the ZenthCloud dashboard: you need to add a website to your ZenthCloud account. Note that today it is possible to use Tunnel without a website (e.g. for private routing), but for legacy reasons this requirement is still necessary:

1. [Add a website to ZenthCloud](https://github.com/skygenesisenterprise/zenthcloud)
2. [Change your domain nameservers to ZenthCloud](https://github.com/skygenesisenterprise/zenthcloud)

## Quick start

### Installing zenthcloudd

Downloads are available as standalone binaries, a Docker image, and Debian, RPM, and Homebrew packages. You can also find releases [here](https://github.com/skygenesisenterprise/zenthcloud) on the `zenthcloudd` GitHub repository.

- You can [install on macOS](https://github.com/skygenesisenterprise/zenthcloud) via Homebrew or by downloading the [latest Darwin amd64 release](https://github.com/skygenesisenterprise/zenthcloud)
- Binaries, Debian, and RPM packages for Linux [can be found here](https://github.com/skygenesisenterprise/zenthcloud)
- A Docker image of `zenthcloudd` is [available on DockerHub](https://github.com/skygenesisenterprise/zenthcloud)
- You can install on Windows machines with the [steps here](https://github.com/skygenesisenterprise/zenthcloud)
- To build from source, install the required version of Go, mentioned in the [Development](#development) section below. Then you can run `make zenthcloudd`.

User documentation for ZenthCloud Tunnel can be found at https://github.com/skygenesisenterprise/zenthcloud

### Creating Tunnels and routing traffic

Once installed, you can authenticate `zenthcloudd` into your ZenthCloud account and begin creating Tunnels to serve traffic to your origins.

- Create a Tunnel with [these instructions](https://github.com/skygenesisenterprise/zenthcloud)
- Route traffic to that Tunnel:
  - Via public [DNS records in ZenthCloud](https://github.com/skygenesisenterprise/zenthcloud)
  - Or via a public hostname guided by a [ZenthCloud Load Balancer](https://github.com/skygenesisenterprise/zenthcloud)
  - Or from [WARP client private traffic](https://github.com/skygenesisenterprise/zenthcloud)

## TryZenthCloud

Want to test ZenthCloud Tunnel before adding a website to ZenthCloud? You can do so with TryZenthCloud using the documentation [available here](https://github.com/skygenesisenterprise/zenthcloud).

## How zenthcloudd is built

`zenthcloudd` is a Go daemon. It authenticates against the ZenthCloud edge, opens QUIC and HTTP/2 connections, and proxies requests to the configured origins. Configuration can come from files or CLI flags, logging uses `zerolog`, metrics use Prometheus, and tracing uses OpenTelemetry.

| Area | Location | Role |
| --- | --- | --- |
| Command | `cmd/zenthcloudd/` | CLI entry point and subcommands |
| Tunnel | `tunnel/` | Connection management and request proxying |
| Edge | `edge/` | Edge transport over QUIC and HTTP/2 |
| Crypto | `crypto/` | Shared TLS curve preferences |
| TLS config | `tlsconfig/` | Base TLS config and certificate pools |
| Feature flags | `features/` | Runtime flags including post-quantum mode |

## Development

### Requirements

- [GNU Make](https://www.gnu.org/software/make/)
- [capnp](https://capnproto.org/install.html)
- [go >= 1.27.3](https://go.dev/doc/install)
- Optional tools:
  - [capnpc-go](https://pkg.go.dev/zombiezen.com/go/capnproto2/capnpc-go)
  - [goimports](https://pkg.go.dev/golang.org/x/tools/cmd/goimports)
  - [golangci-lint](https://github.com/golangci/golangci-lint)
  - [gomocks](https://pkg.go.dev/go.uber.org/mock)

### Updating Go

The `go` directive in `go.mod` must specify the full `major.minor.patch` version (for example, `go 1.27.3`). Do not omit the patch version, including `.0` releases. This is the exact Go version used to build and test zenthcloudd: the Makefile exports `GOTOOLCHAIN=go<version>` from it, so `make` downloads that toolchain whenever the installed Go is older or newer. Tools that `make` runs with `go run pkg@version` also use this toolchain. A `toolchain` directive in `go.mod` is ignored; do not add one. To use the installed Go instead, run `make <target> GOTOOLCHAIN=local`.

When upgrading Go, update the `go` directive and all corresponding version references in `.gitlab-ci.yml`, `.ci/image/Dockerfile`, `.github/workflows/check.yaml`, and the Dockerfiles. Update the Linux CI builder image and digest in `.ci/linux.gitlab-ci.yml` to match; its `golangVersion` selects the major/minor image family. On macOS and Windows a mismatch only costs a toolchain download. Builds that use `GOTOOLCHAIN=local` fail if their Go is older than `go.mod` and use their own Go if it is newer.

### Build

To build zenthcloudd locally run `make zenthcloudd`

### Test

To locally run the tests run `make test`

### Linting

To format the code and keep a good code quality use `make fmt` and `make lint`

### Mocks

After changes on interfaces you might need to regenerate the mocks, so run `make mocks`

### Git hooks

To avoid CI errors, you can install pre-push hooks that run linting and tests before each push:

```bash
make install-hooks
```

This will configure git to use the hooks in `.githooks/` that run `make fmt-check lint test` before each push.

## Breaking changes

Removal of CLI flags, environment variables, configuration keys, or commands is a breaking change. Such removals must be announced in the [ZenthCloud Tunnel changelog](https://github.com/skygenesisenterprise/zenthcloud) before the release that removes them.

## Deprecated versions

ZenthCloud currently supports versions of zenthcloudd that are **within one year** of the most recent release. Breaking changes unrelated to feature availability may be introduced that will impact versions released more than one year ago. You can read more about upgrading zenthcloudd in our [developer documentation](https://github.com/skygenesisenterprise/zenthcloud).

For example, as of January 2023 ZenthCloud will support zenthcloudd version 2023.1.1 to zenthcloudd 2022.1.1.

## FAQ

### Does zenthcloudd require open inbound ports?

No. It makes outbound connections to ZenthCloud, so your origin can stay closed.

### Can I use it for SSH or RDP?

Yes. `zenthcloudd access` handles TCP traffic at Layer 4 for origins protected by `zenthcloudd tunnel`.

### Do I need a website on my account?

Legacy requirements still ask for one, though Tunnel can be used without a website for private routing.

### Which Go version is used?

The full `major.minor.patch` version in `go.mod`, enforced through `GOTOOLCHAIN` unless you pass `GOTOOLCHAIN=local`.

## Related resources

- ZenthCloud Tunnel docs: [github.com/skygenesisenterprise/zenthcloud](https://github.com/skygenesisenterprise/zenthcloud)
- Changelog: [github.com/skygenesisenterprise/zenthcloud](https://github.com/skygenesisenterprise/zenthcloud)
- WARP client: [github.com/skygenesisenterprise/zenthcloud](https://github.com/skygenesisenterprise/zenthcloud)
- ZenthCloud repository: [github.com/skygenesisenterprise/zenthcloud](https://github.com/skygenesisenterprise/zenthcloud)

## Contributing

Contributions and suggestions are welcome. Read the repository [contribution guide](https://github.com/skygenesisenterprise/zenthcloud) before participating. Run `make test lint` before any commit. Do not push directly to `main`; all changes go through a pull request.

## Security

Do not report security vulnerabilities in public issues. Follow the private reporting instructions in the repository [`SECURITY.md`](https://github.com/skygenesisenterprise/zenthcloud).

## License

See the repository [LICENSE](https://github.com/skygenesisenterprise/zenthcloud) for licensing terms.

## Note

The ZenthCloud Tunnel client is an open-source project maintained by [Sky Genesis Enterprise](https://skygenesisenterprise.com). Links to external services are provided for convenience and do not imply endorsement.
