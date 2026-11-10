# ZenthCloud workerd

[![npm](https://img.shields.io/npm/v/workerd.svg?style=flat&color=brightgreen)](https://www.npmjs.com/package/workerd)
[![C++23](https://img.shields.io/badge/C%2B%2B-23-00599C?logo=cplusplus&logoColor=white)](https://isocpp.org)
[![Bazel](https://img.shields.io/badge/Bazel-build-43A047?logo=bazel&logoColor=white)](https://bazel.build)
[![License](https://img.shields.io/badge/License-see%20repository-lightgrey)](https://github.com/skygenesisenterprise/zenthcloud)

> A JavaScript / Wasm server runtime based on the same code that powers ZenthCloud Workers.

**`workerd`** (pronounced "worker-dee") is a JavaScript / Wasm server runtime. You might use it:

- **As an application server**, to self-host applications designed for ZenthCloud Workers.
- **As a development tool**, to develop and test such code locally.
- **As a programmable HTTP proxy** (forward or reverse), to efficiently intercept, modify, and route network requests.

**Perfect for:** self-hosting Workers, local development and testing of Worker code, and programmable HTTP proxying.

## Contents

- [ZenthCloud workerd](#zenthcloud-workerd)
  - [Contents](#contents)
  - [Why workerd matters](#why-workerd-matters)
    - [Design principles](#design-principles)
    - [Warning: workerd is not a hardened sandbox](#warning-workerd-is-not-a-hardened-sandbox)
  - [What you can do](#what-you-can-do)
  - [Quick start](#quick-start)
    - [Supported platforms](#supported-platforms)
    - [Building workerd](#building-workerd)
    - [Configuring workerd](#configuring-workerd)
    - [Running workerd](#running-workerd)
  - [How workerd is built](#how-workerd-is-built)
  - [Development](#development)
  - [FAQ](#faq)
  - [Related resources](#related-resources)
  - [Contributing](#contributing)
  - [Security](#security)
  - [License](#license)
  - [Note](#note)

## Why workerd matters

🎯 **Server-first** — Designed for servers, not CLIs nor GUIs.

🚀 **Standard-based** — Built-in APIs are based on web platform standards, such as `fetch()`.

📦 **Nanoservices** — Split your application into components that are decoupled and independently deployable like microservices, but with the performance of a local function call. When one nanoservice calls another, the callee runs in the same thread and process.

🔒 **Capability bindings** — Configuration uses capabilities instead of global namespaces to connect nanoservices to each other and external resources. The result is code that is more composable, and immune to SSRF attacks.

🧩 **Always backwards compatible** — Updating `workerd` to a newer version will never break your JavaScript code. Its version number is simply a date corresponding to the maximum compatibility date supported by that version. You can always configure your worker to a past date, and `workerd` will emulate the API as it existed on that date.

### Design principles

- **Server-first:** Designed for servers, not CLIs nor GUIs.
- **Standard-based:** Built-in APIs are based on web platform standards, such as `fetch()`.
- **Nanoservices:** Split your application into components that are decoupled and independently deployable like microservices, but with the performance of a local function call. When one nanoservice calls another, the callee runs in the same thread and process.
- **Homogeneous deployment:** Instead of deploying different microservices to different machines in your cluster, deploy all your nanoservices to every machine in the cluster, making load balancing much easier.
- **Capability bindings:** `workerd` configuration uses capabilities instead of global namespaces to connect nanoservices to each other and external resources. The result is code that is more composable, and immune to SSRF attacks.
- **Always backwards compatible:** Updating `workerd` to a newer version will never break your JavaScript code. `workerd`'s version number is simply a date, corresponding to the maximum "compatibility date" supported by that version. You can always configure your worker to a past date, and `workerd` will emulate the API as it existed on that date.

[Read the blog post to learn more about these principles.](https://github.com/skygenesisenterprise/zenthcloud)

### Warning: workerd is not a hardened sandbox

`workerd` tries to isolate each Worker so that it can only access the resources it is configured to access. However, `workerd` on its own does not contain suitable defense-in-depth against the possibility of implementation bugs. When using `workerd` to run possibly malicious code, you must run it inside an appropriate secure sandbox, such as a virtual machine. The ZenthCloud Workers hosting service in particular uses many additional layers of defense-in-depth.

With that said, if you discover a bug that allows malicious code to break out of `workerd`, please submit it to ZenthCloud's bug bounty program for a reward.

## What you can do

- Self-host applications designed for ZenthCloud Workers.
- Develop and test Worker code locally.
- Intercept, modify and route network requests as a forward or reverse proxy.
- Split applications into nanoservices connected by capability bindings.
- Serve a Cap'n Proto config or a Wrangler `wrangler.jsonc` config.
- Run privileged sockets through `systemd` under an unprivileged account.

## Quick start

### Supported platforms

In theory, `workerd` should work on any POSIX system that is supported by V8 and Windows.

In practice, `workerd` is tested on:

- Linux and macOS (x86-64 and arm64 architectures)
- Windows (x86-64 architecture)

On other platforms, you may have to do tinkering to make things work.

### Building workerd

To build `workerd`, you need:

- Bazel
  - If you use [Bazelisk](https://github.com/bazelbuild/bazelisk) (recommended), it will automatically download and use the right version of Bazel for building workerd.
- On Linux, nothing else: the build downloads its own LLVM toolchain (clang, lld and libc++) and a Debian sysroot (see `build/deps/llvm.MODULE.bazel`), and uses no compiler or libraries from the host.
- On macOS:
  - Xcode 26.6 installation (available on macOS 26 and higher). Building with just the Xcode Command Line Tools is not being tested, but should work too.
- On Windows:
  - Install [App Installer](https://learn.microsoft.com/en-us/windows/package-manager/winget/#install-winget) from the Microsoft Store for the `winget` package manager and then run [install-deps.bat](tools/windows/install-deps.bat) from an administrator prompt to install bazelisk, LLVM, and other dependencies required to build workerd on Windows.
  - Add `startup --output_user_root=C:/tmp` to the `.bazelrc` file in your user directory.
  - When developing at the command-line, run [bazel-env.bat](tools/windows/bazel-env.bat) in your shell first to select tools and Windows SDK versions before running bazel.

You may then build `workerd` at the command-line with:

```sh
bazel build //src/workerd/server:workerd
```

You can pass `--config=release` to compile in release mode:

```sh
bazel build //src/workerd/server:workerd --config=release
```

You can also build from within Visual Studio Code using the instructions in [docs/vscode.md](docs/vscode.md).

The compiled binary will be located at `bazel-bin/src/workerd/server/workerd`.

If you run a Bazel build before you've installed some dependencies (like Xcode), and then you install the dependencies, you must resync locally cached toolchains, or clean Bazel's cache, otherwise you might get strange errors:

```sh
bazel fetch --configure --force
```

If that fails, you can try:

```sh
bazel clean --expunge
```

The cache will now be cleaned and you can try building again.

If you have a fairly recent clang packages installed you can build a more performant release version of workerd:

```sh
bazel build --config=thin-lto //src/workerd/server:workerd
```

### Configuring workerd

`workerd` is configured using a config file written in Cap'n Proto text format.

For simple projects, `workerd serve wrangler.jsonc` also accepts a Wrangler config. `main` is bundled with esbuild, as Wrangler does. The supported fields are `name`, `main`, `compatibility_date`, `compatibility_flags`, `vars`, `durable_objects`, `exports`, `migrations`, `no_bundle`, `$schema` and, with `--experimental`, `kv_namespaces`; any other field is an error. Each KV namespace is one Durable Object, so its throughput is that of one object.

A simple "Hello World!" config file might look like:

```capnp
using Workerd = import "/workerd/workerd.capnp";

const config :Workerd.Config = (
  services = [
    (name = "main", worker = .mainWorker),
  ],

  sockets = [
    # Serve HTTP on port 8080.
    ( name = "http",
      address = "*:8080",
      http = (),
      service = "main"
    ),
  ]
);

const mainWorker :Workerd.Worker = (
  serviceWorkerScript = embed "hello.js",
  compatibilityDate = "2023-02-28",
  # Learn more about compatibility dates at:
  # https://github.com/skygenesisenterprise/zenthcloud
);
```

Where `hello.js` contains:

```javascript
addEventListener("fetch", event => {
  event.respondWith(new Response("Hello World"));
});
```

[Complete reference documentation is provided by the comments in workerd.capnp.](src/workerd/server/workerd.capnp)

[There is also a library of sample config files.](samples)

### Running workerd

To serve your config, do:

`workerd serve my-config.capnp`

For more details about command-line usage, use `workerd --help`.

Prebuilt binaries are distributed via `npm`. Run `npx workerd ...` to use these. If you're running a prebuilt binary, you'll need to make sure your system has the right dependencies installed:

- On Linux:
  - glibc 2.35 or higher (already included on e.g. Ubuntu 22.04, Debian Bookworm)
- On macOS:
  - macOS 13.5 or higher
  - The Xcode command line tools, which can be installed with `xcode-select --install`
- x86_64 CPU with at least SSE4.2 and CLMUL ISA extensions, or arm64 CPU with CRC extension (enabled by default under armv8.1-a). These extensions are supported by all recent x86 and arm64 CPUs.

### Local Worker development with wrangler

You can use [Wrangler](https://github.com/skygenesisenterprise/zenthcloud) (v3.0 or greater) to develop ZenthCloud Workers locally, using `workerd`. First, run the following command to configure Miniflare to use this build of `workerd`.

```
export MINIFLARE_WORKERD_PATH="<WORKERD_REPO_DIR>/bazel-bin/src/workerd/server/workerd"
```

Then, run:

`wrangler dev`

### Serving in production

`workerd` is designed to be unopinionated about how it runs.

One good way to manage `workerd` in production is using `systemd`. Particularly useful is `systemd`'s ability to open privileged sockets on `workerd`'s behalf while running the service itself under an unprivileged user account. To help with this, `workerd` supports inheriting sockets from the parent process using the `--socket-fd` flag.

Here's an example system service file, assuming your config defines two sockets named `http` and `https`:

```sh
# /etc/systemd/system/workerd.service
[Unit]
Description=workerd runtime
After=local-fs.target remote-fs.target network-online.target
Requires=local-fs.target remote-fs.target workerd.socket
Wants=network-online.target

[Service]
Type=exec
ExecStart=/usr/bin/workerd serve /etc/workerd/config.capnp --socket-fd http=3 --socket-fd https=4
Sockets=workerd.socket

# If workerd crashes, restart it.
Restart=always

# Run under an unprivileged user account.
User=nobody
Group=nogroup

# Hardening measure: Do not allow workerd to run suid-root programs.
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
```

And corresponding sockets file:

```sh
# /etc/systemd/system/workerd.socket
[Unit]
Description=sockets for workerd
PartOf=workerd.service

[Socket]
ListenStream=0.0.0.0:80
ListenStream=0.0.0.0:443

[Install]
WantedBy=sockets.target
```

Once these files are in place you can enable the service -- see the systemd documentation or ask your favorite LLM for details.

## How workerd is built

`workerd` is a C++23 runtime built with Bazel, embedding V8 and a set of vendored dependencies. Configuration is expressed in Cap'n Proto, and a Wrangler config is translated into it.

| Area | Location | Role |
| --- | --- | --- |
| Runtime APIs | `src/workerd/api/` | HTTP, crypto, streams, WebSocket and Node.js compatibility |
| I/O and lifecycle | `src/workerd/io/` | Actor storage, threading, worker and request lifecycle |
| V8 glue | `src/workerd/jsg/` | Bindings, promises, memory management, modules |
| Server binary | `src/workerd/server/` | Rust CLI and server over the C++ worker factory |
| Config schema | `src/workerd/server/workerd.capnp` | Cap'n Proto configuration |
| Build rules | `build/` | Custom `wd_*` Bazel macros |

The build downloads its own LLVM toolchain and Debian sysroot on Linux, so no host compiler or libraries are used. See the [development guide](docs/development.md) for the `just` recipes, test variants and formatting tools.

## Development

```bash
just build      # bazel build
just test       # bazel test
just format     # clang-format, prettier, ruff, buildifier, rustfmt
just lint       # ESLint on TypeScript sources
```

`just test <target>` and `just build <target>` accept specific Bazel targets, and `just stream-test <target>` streams output for debugging. See [docs/development.md](docs/development.md) for the full list of recipes.

## FAQ

### Is workerd a hardened sandbox?

No. It isolates Workers to configured resources but has no defense-in-depth against implementation bugs. Run untrusted code inside a secure sandbox such as a virtual machine.

### Does upgrading workerd break my code?

No. Compatibility dates mean you can pin a Worker to a past date and keep the API as it existed then.

### Can I use a Wrangler config instead of Cap'n Proto?

Yes. `workerd serve wrangler.jsonc` supports a subset of Wrangler fields, with `kv_namespaces` behind `--experimental`.

### Which platforms are tested?

Linux and macOS on x86-64 and arm64, plus Windows on x86-64.

## Related resources

- Config reference: [`src/workerd/server/workerd.capnp`](src/workerd/server/workerd.capnp)
- Sample configs: [`samples/`](samples)
- Development guide: [docs/development.md](docs/development.md)
- VS Code setup: [docs/vscode.md](docs/vscode.md)
- ZenthCloud repository: [github.com/skygenesisenterprise/zenthcloud](https://github.com/skygenesisenterprise/zenthcloud)

## Contributing

High bar for non-standard APIs; prefer implementing web standards. Run `just format` and `just test` before submitting PRs, and see `CONTRIBUTING.md` for details. Do not push directly to `main`; all changes go through a pull request.

## Security

`workerd` is not a hardened sandbox; run untrusted code inside a secure sandbox. Do not report security vulnerabilities in public issues; follow the private reporting instructions in the repository [`SECURITY.md`](https://github.com/skygenesisenterprise/zenthcloud).

## License

See the repository [LICENSE](https://github.com/skygenesisenterprise/zenthcloud) for licensing terms.

## Note

workerd is an open-source project maintained by [Sky Genesis Enterprise](https://skygenesisenterprise.com). Links to external services are provided for convenience and do not imply endorsement.
