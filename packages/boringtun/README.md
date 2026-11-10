![boringtun logo banner](./banner.png)

# ZenthCloud BoringTun

[![crates.io](https://img.shields.io/crates/v/boringtun.svg)](https://crates.io/crates/boringtun)
[![crates.io](https://img.shields.io/crates/v/boringtun-cli.svg)](https://crates.io/crates/boringtun-cli)
[![License: BSD-3-Clause](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![Rust](https://img.shields.io/badge/Rust-stable-000000?logo=rust&logoColor=white)](https://rust-lang.org)

> A fast, portable implementation of the WireGuard® protocol.

**BoringTun** is an implementation of the [WireGuard<sup>®</sup>](https://www.wireguard.com/) protocol designed for portability and speed. It is successfully deployed on millions of [iOS](https://apps.apple.com/us/app/1-1-1-1-faster-internet/id1423538627) and [Android](https://github.com/skygenesisenterprise/zenthcloud) consumer devices as well as thousands of Zenthcloud Linux servers.

**Perfect for:** client applications that need WireGuard in userspace, platforms that cannot run the kernel module, and services that embed the protocol through a Rust, C or JNI API.

> **Warning:** BoringTun is currently undergoing a restructuring. Do not rely on or link to the `master` branch right now. Use the published crates.io releases instead.

## Contents

- [ZenthCloud BoringTun](#zenthcloud-boringtun)
  - [Contents](#contents)
  - [Why BoringTun matters](#why-boringtun-matters)
  - [What you can do](#what-you-can-do)
    - [Use the library](#use-the-library)
    - [Run the userspace daemon](#run-the-userspace-daemon)
  - [Quick start](#quick-start)
    - [Install](#install)
    - [Build](#build)
    - [Run a tunnel](#run-a-tunnel)
  - [How BoringTun is built](#how-boringtun-is-built)
    - [Supported platforms](#supported-platforms)
    - [Linux](#linux)
    - [macOS](#macos)
    - [Bindings](#bindings)
  - [Development](#development)
  - [FAQ](#faq)
  - [Related resources](#related-resources)
  - [Contributing](#contributing)
  - [Security](#security)
  - [License](#license)
  - [Note](#note)

## Why BoringTun matters

🎯 **Portable by design** — The protocol is implemented in Rust and can be embedded anywhere a Rust or C ABI is available, including iOS and Android.

🚀 **Fast** — The library implements the WireGuard protocol without the network or tunnel stacks, so each platform can use its own idiomatic I/O and event loop.

🔒 **Userspace WireGuard** — `boringtun-cli` provides a [userspace WireGuard](https://www.wireguard.com/xplatform/) implementation for Linux and macOS, with no kernel module required.

🧩 **Composable** — Use the library on its own, drive it through the C ABI or JNI bindings, or run the ready-made daemon.

## What you can do

### Use the library

The `boringtun` library implements the underlying WireGuard protocol, without the network or tunnel stacks. Those can be implemented in a platform-idiomatic way, which makes the crate suitable for fast and efficient client apps on desktop, mobile and embedded targets.

### Run the userspace daemon

The `boringtun-cli` executable is a userspace WireGuard implementation for Linux and macOS. Once started, the tunnel is configured with the standard [`wg`](https://git.zx2c4.com/WireGuard/about/src/tools/man/wg.8) tool, or any other WireGuard-compatible tool.

## Quick start

### Install

```bash
cargo install boringtun-cli
```

### Build

```bash
# Library only
cargo build --lib --no-default-features --release [--target $(TARGET_TRIPLE)]

# Executable
cargo build --bin boringtun-cli --release [--target $(TARGET_TRIPLE)]
```

By default the executable is placed in `./target/release`. Copy it to a desired location manually, or install it with `cargo install --bin boringtun --path .`.

### Run a tunnel

As per the specification, start a tunnel with:

```bash
boringtun-cli [-f/--foreground] INTERFACE-NAME
```

The tunnel can then be configured with `wg`, as a regular WireGuard tunnel, or any other tool.

It is also possible to use it with `wg-quick` by setting the environment variable `WG_QUICK_USERSPACE_IMPLEMENTATION` to `boringtun`:

```bash
sudo WG_QUICK_USERSPACE_IMPLEMENTATION=boringtun-cli WG_SUDO=1 wg-quick up CONFIGURATION
```

## How BoringTun is built

The project consists of two parts:

| Component | Role |
| --- | --- |
| `boringtun-cli` | Userspace WireGuard executable for Linux and macOS |
| `boringtun` | Library implementing the WireGuard protocol for fast client apps, including iOS and Android |

The library implements the protocol without the network or tunnel stacks, which are left to the platform. The daemon provides the Linux and macOS runtime around it.

### Supported platforms

| Target triple | Binary | Library |
| --- | :---: | :---: |
| `x86_64-unknown-linux-gnu` | ✓ | ✓ |
| `aarch64-unknown-linux-gnu` | ✓ | ✓ |
| `armv7-unknown-linux-gnueabihf` | ✓ | ✓ |
| `x86_64-apple-darwin` | ✓ | ✓ |
| `x86_64-pc-windows-msvc` | | ✓ |
| `aarch64-apple-ios` | | ✓ |
| `armv7-apple-ios` | | ✓ |
| `armv7s-apple-ios` | | ✓ |
| `aarch64-linux-android` | | ✓ |
| `arm-linux-androideabi` | | ✓ |

<sub>Other platforms may be added in the future.</sub>

### Linux

`x86-64`, `aarch64` and `armv7` architectures are supported. The behaviour should be identical to that of [wireguard-go](https://git.zx2c4.com/wireguard-go/about/), with one difference: `boringtun` drops privileges when started. When privileges are dropped it is not possible to set `fwmark`. If `fwmark` is required, such as when using `wg-quick`, run with `--disable-drop-privileges` or set the environment variable `WG_SUDO=1`.

Give the executable the `CAP_NET_ADMIN` capability instead of running it as root:

```bash
sudo setcap cap_net_admin+epi boringtun
```

### macOS

The behaviour is similar to [wireguard-go](https://git.zx2c4.com/wireguard-go/about/). The interface name must be `utun[0-9]+` for an explicit interface name, or `utun` to have the kernel select the lowest available. If you choose `utun` as the interface name and the environment variable `WG_TUN_NAME_FILE` is defined, the actual name chosen by the kernel is written to the file specified by that variable.

### Bindings

**C ABI** — The library exposes a set of C ABI bindings defined in the `wireguard_ffi.h` header file. They can be used with C/C++, Swift (using a bridging header) or C# (using `DLLImport` with `CallingConvention` set to `Cdecl`).

**JNI** — The library exposes Java Native Interface bindings defined in `src/jni.rs`.

## Development

Testing has a few requirements:

- `sudo`: required to create tunnels. When you run `cargo test` you will be prompted for your password.
- Docker: install it from [docker.com](https://www.docker.com/get-started). On Ubuntu/Debian, `apt-get install docker.io` is enough.

```bash
cargo build --bin boringtun-cli --release
cargo test
```

## FAQ

### Do I need the kernel module?

No. BoringTun is a userspace implementation. On Linux it needs `CAP_NET_ADMIN`, and on macOS it uses a `utun` interface.

### Why does `fwmark` fail after startup?

BoringTun drops privileges after start. Use `--disable-drop-privileges` or `WG_SUDO=1` when `fwmark` is required.

### Can I use it on mobile?

Yes. The library target supports iOS and Android, and the C ABI and JNI bindings are provided for integration.

## Related resources

- Crates.io: [`boringtun`](https://crates.io/crates/boringtun) and [`boringtun-cli`](https://crates.io/crates/boringtun-cli)
- WireGuard: [wireguard.com](https://www.wireguard.com/)
- Userspace WireGuard: [xplatform](https://www.wireguard.com/xplatform/)
- `wg` tool: [wg(8)](https://git.zx2c4.com/WireGuard/about/src/tools/man/wg.8)
- `wg-quick`: [wg-quick(8)](https://git.zx2c4.com/WireGuard/about/src/tools/man/wg-quick.8)
- ZenthCloud repository: [github.com/skygenesisenterprise/zenthcloud](https://github.com/skygenesisenterprise/zenthcloud)

## Contributing

Contributions and suggestions are welcome. Read the repository [contribution guide](https://github.com/skygenesisenterprise/zenthcloud) before participating.

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the 3-Clause BSD License, shall be licensed as above, without any additional terms or conditions.

## Security

Do not report security vulnerabilities in public issues. Follow the private reporting instructions in the repository [`SECURITY.md`](https://github.com/skygenesisenterprise/zenthcloud).

## License

The project is licensed under the [3-Clause BSD License](https://opensource.org/licenses/BSD-3-Clause).

## Note

BoringTun is an open-source project maintained by [Sky Genesis Enterprise](https://skygenesisenterprise.com). Links to external services are provided for convenience and do not imply endorsement.

<sub><sub><sub><sub>WireGuard is a registered trademark of Jason A. Donenfeld. BoringTun is not sponsored or endorsed by Jason A. Donenfeld.</sub></sub></sub></sub>
