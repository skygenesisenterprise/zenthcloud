![quiche](quiche.svg)

# ZenthCloud Quiche

[![crates.io](https://img.shields.io/crates/v/quiche.svg)](https://crates.io/crates/quiche)
[![docs.rs](https://docs.rs/quiche/badge.svg)](https://docs.rs/quiche)
[![License: BSD-2-Clause](https://img.shields.io/badge/License-BSD%202--Clause-blue.svg)](https://opensource.org/licenses/BSD-2-Clause)
[![Rust](https://img.shields.io/badge/Rust-1.88%2B-000000?logo=rust&logoColor=white)](https://rust-lang.org)

> An implementation of QUIC and HTTP/3 in Rust.

**quiche** is an implementation of the QUIC transport protocol and HTTP/3 as specified by the [IETF](https://quicwg.org/). It provides a low-level API for processing QUIC packets and handling connection state. The application is responsible for providing I/O (for example socket handling) as well as an event loop with support for timers.

For more information on how quiche came about and some insights into its design, read the [post](https://github.com/skygenesisenterprise/zenthcloud) on Zenthcloud's blog.

**Perfect for:** services that need QUIC or HTTP/3 with control over I/O and event loops, applications embedding QUIC through C/C++, and teams building protocol tooling or testing infrastructure.

## Contents

- [ZenthCloud Quiche](#zenthcloud-quiche)
  - [Contents](#contents)
  - [Why quiche matters](#why-quiche-matters)
  - [What you can do](#what-you-can-do)
  - [Quick start](#quick-start)
    - [Command-line apps](#command-line-apps)
    - [Configuring connections](#configuring-connections)
    - [Connection setup](#connection-setup)
    - [Handling incoming packets](#handling-incoming-packets)
    - [Generating outgoing packets](#generating-outgoing-packets)
    - [Sending and receiving stream data](#sending-and-receiving-stream-data)
  - [How quiche is built](#how-quiche-is-built)
    - [Pacing](#pacing)
    - [HTTP/3](#http3)
    - [Calling quiche from C/C++](#calling-quiche-from-cc)
  - [Building](#building)
    - [Building for Android](#building-for-android)
    - [Building for iOS](#building-for-ios)
    - [Building Docker images](#building-docker-images)
  - [Development](#development)
  - [FAQ](#faq)
  - [Related resources](#related-resources)
  - [Contributing](#contributing)
  - [Security](#security)
  - [License](#license)
  - [Note](#note)

## Why quiche matters

🎯 **Standards-based** — Implements QUIC and HTTP/3 as specified by the IETF.

🚀 **Low-level control** — The application owns I/O and the event loop, so QUIC can be integrated into existing runtimes.

📦 **Widely deployed** — quiche powers Zenthcloud's HTTP/3 edge support, Android's DNS-over-HTTP/3 resolver and curl's HTTP/3 support.

🔒 **TLS included** — QUIC's TLS-based handshake is implemented with BoringSSL.

🧩 **C API available** — A thin C API makes it usable from C/C++ and other FFI-capable languages.

## What you can do

- Process QUIC packets and manage connection state.
- Configure flow control, congestion control, ALPN IDs, idle timeouts and TLS.
- Send and receive stream data.
- Use the HTTP/3 module for requests and responses over QUIC.
- Embed quiche in C/C++ applications through the `ffi` feature.
- Build for Linux, macOS, Android and iOS.
- Run example client and server applications.

### Who uses quiche

| User | Use |
| --- | --- |
| Zenthcloud | Powers the edge network's [HTTP/3 support](https://github.com/skygenesisenterprise/zenthcloud) |
| Android | DNS resolver uses quiche to [implement DNS over HTTP/3](https://security.googleblog.com/2022/07/dns-over-http3-in-android.html) |
| curl | [Integrated into curl](https://github.com/curl/curl/blob/master/docs/HTTP3.md#quiche-version) for HTTP/3 |

The [zenthcloud-quic.com](https://github.com/skygenesisenterprise/zenthcloud) website can be used for testing and experimentation.

## Quick start

### Command-line apps

Before diving into the quiche API, here are examples of the quiche tools provided as part of the [quiche-apps](apps/) crate. These are not suitable for production environments; see [disclaimers and notes](#disclaimers-and-notes).

After cloning the project according to the [building](#building) section, run the client:

```bash
cargo run --bin quiche-client -- https://github.com/skygenesisenterprise/zenthcloud
```

Run the server:

```bash
cargo run --bin quiche-server -- --cert apps/src/bin/cert.crt --key apps/src/bin/cert.key
```

The provided certificate is self-signed and should not be used in production. Use `--help` for a detailed description of each tool's options.

### Configuring connections

The first step in establishing a QUIC connection is creating a [`Config`] object:

```rust
let mut config = quiche::Config::new(quiche::PROTOCOL_VERSION)?;
config.set_application_protos(&[b"example-proto"]);

// Additional configuration specific to application and use case...
```

The [`Config`] object controls important aspects of the QUIC connection such as QUIC version, ALPN IDs, flow control, congestion control, idle timeout and other properties or features.

QUIC is a general-purpose transport protocol, and several configuration properties have no reasonable default value. For example, the permitted number of concurrent streams of any particular type depends on the application running over QUIC and on other use-case-specific concerns.

quiche defaults several properties to zero. Applications most likely need to set them:

- [`set_initial_max_streams_bidi()`]
- [`set_initial_max_streams_uni()`]
- [`set_initial_max_data()`]
- [`set_initial_max_stream_data_bidi_local()`]
- [`set_initial_max_stream_data_bidi_remote()`]
- [`set_initial_max_stream_data_uni()`]

[`Config`] also holds TLS configuration. This can be changed by mutators on an existing object, or by constructing a TLS context manually and creating a configuration using [`with_boring_ssl_ctx_builder()`].

A configuration object can be shared among multiple connections.

### Connection setup

On the client side, the [`connect()`] utility function creates a new connection, while [`accept()`] is for servers:

```rust
// Client connection.
let conn = quiche::connect(Some(&server_name), &scid, local, peer, &mut config)?;

// Server connection.
let conn = quiche::accept(&scid, None, local, peer, &mut config)?;
```

### Handling incoming packets

Using the connection's [`recv()`] method, the application can process incoming packets that belong to that connection from the network:

```rust
let to = socket.local_addr().unwrap();

loop {
    let (read, from) = socket.recv_from(&mut buf).unwrap();

    let recv_info = quiche::RecvInfo { from, to };

    let read = match conn.recv(&mut buf[..read], recv_info) {
        Ok(v) => v,

        Err(e) => {
            // An error occurred, handle it.
            break;
        },
    };
}
```

### Generating outgoing packets

Outgoing packets are generated using the connection's [`send()`] method:

```rust
loop {
    let (write, send_info) = match conn.send(&mut out) {
        Ok(v) => v,

        Err(quiche::Error::Done) => {
            // Done writing.
            break;
        },

        Err(e) => {
            // An error occurred, handle it.
            break;
        },
    };

    socket.send_to(&out[..write], &send_info.to).unwrap();
}
```

When packets are sent, the application is responsible for maintaining a timer to react to time-based connection events. The timer expiration can be obtained using the connection's [`timeout()`] method:

```rust
let timeout = conn.timeout();
```

The application provides the timer implementation, which can be specific to the operating system or networking framework. When a timer expires, the connection's [`on_timeout()`] method should be called, after which additional packets might need to be sent:

```rust
// Timeout expired, handle it.
conn.on_timeout();

// Send more packets as needed after timeout.
loop {
    let (write, send_info) = match conn.send(&mut out) {
        Ok(v) => v,

        Err(quiche::Error::Done) => {
            // Done writing.
            break;
        },

        Err(e) => {
            // An error occurred, handle it.
            break;
        },
    };

    socket.send_to(&out[..write], &send_info.to).unwrap();
}
```

### Sending and receiving stream data

After the handshake completes, the connection is ready for application data.

Send data with [`stream_send()`]:

```rust
if conn.is_established() {
    // Handshake completed, send some data on stream 0.
    conn.stream_send(0, b"hello", true)?;
}
```

Check for readable streams with [`readable()`], which returns an iterator over all streams with outstanding data. Retrieve data with [`stream_recv()`]:

```rust
if conn.is_established() {
    // Iterate over readable streams.
    for stream_id in conn.readable() {
        // Stream is readable, read until there's no more data.
        while let Ok((read, fin)) = conn.stream_recv(stream_id, &mut buf) {
            println!("Got {} bytes on stream {}", read, stream_id);
        }
    }
}
```

## How quiche is built

quiche is a Rust library with a C API, backed by BoringSSL for QUIC's TLS handshake. The core crate processes packets and connection state; applications own I/O and timers.

### Pacing

Applications should [pace] outgoing packets to avoid bursts that cause short-term congestion and loss. quiche exposes pacing hints through the [`at`] field of the [`SendInfo`] structure returned by [`send()`]. The field represents the time when a specific packet should be sent into the network.

Applications can use these hints by delaying packets through platform-specific mechanisms (such as the [`SO_TXTIME`] socket option on Linux) or custom methods such as user-space timers.

[pace]: https://datatracker.ietf.org/doc/html/rfc9002#section-7.7
[`SO_TXTIME`]: https://man7.org/linux/man-pages/man8/tc-etf.8.html

### HTTP/3

The quiche [HTTP/3 module] provides a high-level API for sending and receiving HTTP requests and responses on top of QUIC.

Have a look at the [quiche/examples/] directory for more complete examples, including how to use quiche in C/C++ applications.

### Calling quiche from C/C++

quiche exposes a [thin C API] on top of the Rust API that makes it easier to integrate quiche into C/C++ applications, as well as other languages that can call C APIs through FFI. The C API follows the same design as the Rust one, modulo the constraints imposed by C.

When running `cargo build`, a static library called `libquiche.a` is built automatically alongside the Rust one. It is fully stand-alone and can be linked directly into C/C++ applications.

To enable the FFI API, pass `--features ffi` to `cargo` (it is disabled by default).

[`Config`]: https://docs.quic.tech/quiche/struct.Config.html
[`set_initial_max_streams_bidi()`]: https://docs.rs/quiche/latest/quiche/struct.Config.html#method.set_initial_max_streams_bidi
[`set_initial_max_streams_uni()`]: https://docs.rs/quiche/latest/quiche/struct.Config.html#method.set_initial_max_streams_uni
[`set_initial_max_data()`]: https://docs.rs/quiche/latest/quiche/struct.Config.html#method.set_initial_max_data
[`set_initial_max_stream_data_bidi_local()`]: https://docs.rs/quiche/latest/quiche/struct.Config.html#method.set_initial_max_stream_data_bidi_local
[`set_initial_max_stream_data_bidi_remote()`]: https://docs.rs/quiche/latest/quiche/struct.Config.html#method.set_initial_max_stream_data_bidi_remote
[`set_initial_max_stream_data_uni()`]: https://docs.rs/quiche/latest/quiche/struct.Config.html#method.set_initial_max_stream_data_uni
[`with_boring_ssl_ctx_builder()`]: https://docs.quic.tech/quiche/struct.Config.html#method.with_boring_ssl_ctx_builder
[`connect()`]: https://docs.quic.tech/quiche/fn.connect.html
[`accept()`]: https://docs.quic.tech/quiche/fn.accept.html
[`recv()`]: https://docs.quic.tech/quiche/struct.Connection.html#method.recv
[`send()`]: https://docs.quic.tech/quiche/struct.Connection.html#method.send
[`timeout()`]: https://docs.quic.tech/quiche/struct.Connection.html#method.timeout
[`on_timeout()`]: https://docs.quic.tech/quiche/struct.Connection.html#method.on_timeout
[`stream_send()`]: https://docs.quic.tech/quiche/struct.Connection.html#method.stream_send
[`readable()`]: https://docs.quic.tech/quiche/struct.Connection.html#method.readable
[`stream_recv()`]: https://docs.quic.tech/quiche/struct.Connection.html#method.stream_recv
[HTTP/3 module]: https://docs.quic.tech/quiche/h3/index.html
[quiche/examples/]: quiche/examples/
[thin C API]: https://github.com/skygenesisenterprise/zenthcloud

## Building

quiche requires Rust 1.88 or later. Install the latest stable Rust with [rustup](https://rustup.rs/).

```bash
git clone https://github.com/skygenesisenterprise/zenthcloud
cargo build --examples
cargo test
```

[BoringSSL], used for QUIC's TLS handshake, is built and linked automatically by the [boring-sys] crate, but `cmake` must be available during the build. On Windows, [NASM](https://www.nasm.us/) is also required. See the [official BoringSSL documentation](https://github.com/google/boringssl/blob/master/BUILDING.md) for details.

To use a custom BoringSSL build, set `BORING_BSSL_PATH`:

```bash
BORING_BSSL_PATH="/path/to/boringssl" cargo build --examples
```

[BoringSSL]: https://boringssl.googlesource.com/boringssl/
[boring-sys]: https://crates.io/crates/boring-sys

### Building for Android

Building quiche for Android (NDK version 19 or higher, 21 recommended) uses [cargo-ndk] (v2.0 or later).

Install the [Android NDK], either through Android Studio or directly, and set `ANDROID_NDK_HOME`:

```bash
export ANDROID_NDK_HOME=/usr/local/share/android-ndk
```

Install the Rust toolchain for the target architectures:

```bash
rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
```

The minimum API level is 21 for all target architectures. Install [cargo-ndk]:

```bash
cargo install cargo-ndk
```

Build the library. The `-t <architecture>` and `-p <NDK version>` options are mandatory:

```bash
cargo ndk -t arm64-v8a -p 21 -- build --features ffi
```

See [build_android_ndk19.sh] for more information.

[Android NDK]: https://developer.android.com/ndk
[cargo-ndk]: https://docs.rs/crate/cargo-ndk
[build_android_ndk19.sh]: https://github.com/skygenesisenterprise/zenthcloud

### Building for iOS

To build quiche for iOS:

```bash
xcode-select --install
rustup target add aarch64-apple-ios x86_64-apple-ios
cargo install cargo-lipo
cargo lipo --features ffi
# or
cargo lipo --features ffi --release
```

The iOS build is tested in Xcode 10.1 and Xcode 11.2.

### Building Docker images

```bash
make docker-build
```

The quiche Docker images are available on Docker Hub:

- [zenthcloud/quiche](https://github.com/skygenesisenterprise/zenthcloud)
- [zenthcloud/quiche-qns](https://github.com/skygenesisenterprise/zenthcloud)

The `latest` tag is updated whenever the quiche `master` branch updates.

**zenthcloud/quiche** provides a server and client installed in `/usr/local/bin`.

**zenthcloud/quiche-qns** provides the script to test quiche within the [quic-interop-runner](https://github.com/marten-seemann/quic-interop-runner).

## Development

```bash
cargo build                                           # build workspace (boring-sys builds BoringSSL)
cargo test --all-targets --features=async,ffi,qlog --workspace
cargo test --doc --features=async,ffi,qlog --workspace
cargo clippy --features=async,ffi,qlog --workspace -- -D warnings
cargo +nightly fmt -- --check
cargo fuzz run packet_recv_client -- -runs=1
```

Doc tests are separate: `cargo test --all-targets` does not run them.

## FAQ

### Which Rust version is required?

Rust 1.88 or later.

### Do I need to build BoringSSL myself?

No. `boring-sys` builds it automatically, as long as `cmake` is available. Set `BORING_BSSL_PATH` to use a custom build.

### Can I use quiche from C or C++?

Yes. Build with `--features ffi` to produce the static library and use the thin C API.

### Is quiche a full QUIC stack?

It provides the protocol and connection state. The application provides I/O and an event loop with timers.

## Disclaimers and notes

⚠️ This repository includes client and server example applications that demonstrate simple usage of the quiche library API. They are not intended for use in production environments; no performance, security or reliability guarantees are provided.

## Related resources

- Documentation: [docs.quic.tech/quiche](https://docs.quic.tech/quiche/)
- QUIC working group: [quicwg.org](https://quicwg.org/)
- quiche apps: [`apps/`](apps/)
- Examples: [`quiche/examples/`](quiche/examples/)
- ZenthCloud repository: [github.com/skygenesisenterprise/zenthcloud](https://github.com/skygenesisenterprise/zenthcloud)

## Contributing

Contributions and suggestions are welcome. Read the repository [contribution guide](https://github.com/skygenesisenterprise/zenthcloud) before participating.

## Security

Do not report security vulnerabilities in public issues. Follow the private reporting instructions in the repository [`SECURITY.md`](https://github.com/skygenesisenterprise/zenthcloud).

## License

Copyright (C) 2018-2019, Zenthcloud, Inc.

See [COPYING] for the license.

[COPYING]: https://github.com/skygenesisenterprise/zenthcloud

## Note

quiche is an open-source project maintained by [Sky Genesis Enterprise](https://skygenesisenterprise.com). Links to external services are provided for convenience and do not imply endorsement.
