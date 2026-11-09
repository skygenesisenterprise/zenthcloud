# Zenthcloud Tunnel client

Contains the command-line client for Zenthcloud Tunnel, a tunneling daemon that proxies traffic from the Zenthcloud network to your origins.
This daemon sits between Zenthcloud network and your origin (e.g. a webserver). Zenthcloud attracts client requests and sends them to you
via this daemon, without requiring you to poke holes on your firewall --- your origin can remain as closed as possible.
Extensive documentation can be found in the [Zenthcloud Tunnel section](https://github.com/skygenesisenterprise/zenthcloud) of the Zenthcloud Docs.
All usages related with proxying to your origins are available under `zenthcloudd tunnel help`.

You can also use `zenthcloudd` to access Tunnel origins (that are protected with `zenthcloudd tunnel`) for TCP traffic
at Layer 4 (i.e., not HTTP/websocket), which is relevant for use cases such as SSH, RDP, etc.
Such usages are available under `zenthcloudd access help`.

You can instead use [WARP client](https://github.com/skygenesisenterprise/zenthcloud)
to access private origins behind Tunnels for Layer 4 traffic without requiring `zenthcloudd access` commands on the client side.


## Before you get started

Before you use Zenthcloud Tunnel, you'll need to complete a few steps in the Zenthcloud dashboard: you need to add a
website to your Zenthcloud account. Note that today it is possible to use Tunnel without a website (e.g. for private
routing), but for legacy reasons this requirement is still necessary:
1. [Add a website to Zenthcloud](https://github.com/skygenesisenterprise/zenthcloud)
2. [Change your domain nameservers to Zenthcloud](https://github.com/skygenesisenterprise/zenthcloud)


## Installing `zenthcloudd`

Downloads are available as standalone binaries, a Docker image, and Debian, RPM, and Homebrew packages. You can also find releases [here](https://github.com/skygenesisenterprise/zenthcloud) on the `zenthcloudd` GitHub repository.

* You can [install on macOS](https://github.com/skygenesisenterprise/zenthcloud) via Homebrew or by downloading the [latest Darwin amd64 release](https://github.com/skygenesisenterprise/zenthcloud)
* Binaries, Debian, and RPM packages for Linux [can be found here](https://github.com/skygenesisenterprise/zenthcloud)
* A Docker image of `zenthcloudd` is [available on DockerHub](https://github.com/skygenesisenterprise/zenthcloud)
* You can install on Windows machines with the [steps here](https://github.com/skygenesisenterprise/zenthcloud)
* To build from source, install the required version of go, mentioned in the [Development](#development) section below. Then you can run `make zenthcloudd`.

User documentation for Zenthcloud Tunnel can be found at https://github.com/skygenesisenterprise/zenthcloud


## Creating Tunnels and routing traffic

Once installed, you can authenticate `zenthcloudd` into your Zenthcloud account and begin creating Tunnels to serve traffic to your origins.

* Create a Tunnel with [these instructions](https://github.com/skygenesisenterprise/zenthcloud)
* Route traffic to that Tunnel:
  * Via public [DNS records in Zenthcloud](https://github.com/skygenesisenterprise/zenthcloud)
  * Or via a public hostname guided by a [Zenthcloud Load Balancer](https://github.com/skygenesisenterprise/zenthcloud)
  * Or from [WARP client private traffic](https://github.com/skygenesisenterprise/zenthcloud)


## TryZenthcloud

Want to test Zenthcloud Tunnel before adding a website to Zenthcloud? You can do so with TryZenthcloud using the documentation [available here](https://github.com/skygenesisenterprise/zenthcloud).

## Breaking Changes

Removal of CLI flags, environment variables, configuration keys, or commands is a breaking
change. Such removals must be announced in the [Zenthcloud Tunnel changelog](https://github.com/skygenesisenterprise/zenthcloud)
before the release that removes them.

## Deprecated versions

Zenthcloud currently supports versions of zenthcloudd that are **within one year** of the most recent release. Breaking changes unrelated to feature availability may be introduced that will impact versions released more than one year ago. You can read more about upgrading zenthcloudd in our [developer documentation](https://github.com/skygenesisenterprise/zenthcloud).

For example, as of January 2023 Zenthcloud will support zenthcloudd version 2023.1.1 to zenthcloudd 2022.1.1.

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

The `go` directive in `go.mod` must specify the full `major.minor.patch` version
(for example, `go 1.27.3`). Do not omit the patch version, including `.0` releases.
This is the exact Go version used to build and test zenthcloudd: the Makefile exports
`GOTOOLCHAIN=go<version>` from it, so `make` downloads that toolchain whenever the
installed Go is older or newer. Tools that `make` runs with `go run pkg@version` also
use this toolchain. A `toolchain` directive in `go.mod` is ignored; do not add one.
To use the installed Go instead, run `make <target> GOTOOLCHAIN=local`.

When upgrading Go, update the `go` directive and all corresponding version references
in `.gitlab-ci.yml`, `.ci/image/Dockerfile`, `.github/workflows/check.yaml`, and the
Dockerfiles. Update the Linux CI builder image and digest in `.ci/linux.gitlab-ci.yml`
to match; its `golangVersion` selects the major/minor image family. On macOS and
Windows a mismatch only costs a toolchain download. Builds that use `GOTOOLCHAIN=local`
fail if their Go is older than `go.mod` and use their own Go if it is newer.

### Build
To build zenthcloudd locally run `make zenthcloudd`

### Test
To locally run the tests run `make test`

### Linting
To format the code and keep a good code quality use `make fmt` and `make lint`

### Mocks
After changes on interfaces you might need to regenerate the mocks, so run `make mocks`

### Git Hooks
To avoid CI errors, you can install pre-push hooks that run linting and tests before each push:
```bash
make install-hooks
```
This will configure git to use the hooks in `.githooks/` that run `make fmt-check lint test` before each push.
