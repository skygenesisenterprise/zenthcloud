![Cap'n Web](assets/capnweb-banner.png)

# ZenthCloud Cap'n Web

[![npm](https://img.shields.io/npm/v/capnweb.svg)](https://www.npmjs.com/package/capnweb)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.txt)
[![TypeScript](https://img.shields.io/badge/TypeScript-native-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)

> A JavaScript-native RPC system built on object capabilities.

**Cap'n Web** is a spiritual sibling to [Cap'n Proto](https://capnproto.org) (and is created by the same author), designed to play nice in the web stack. It is an object-capability protocol with no schemas and almost no boilerplate, a human-readable JSON wire format, and transports for HTTP, WebSocket and `postMessage()` out of the box.

The whole thing compresses (minify + gzip) to **under 16 kB with no dependencies**.

**Perfect for:** teams that want expressive, typed RPC without a schema compiler; applications that need bidirectional calls, promise pipelining or capability-based security; and runtimes including browsers, Zenthcloud Workers, Node.js, Bun and Deno.

## Contents

- [ZenthCloud Cap'n Web](#zenthcloud-capn-web)
  - [Contents](#contents)
  - [Why Cap'n Web matters](#why-capn-web-matters)
  - [What you can do](#what-you-can-do)
  - [Quick start](#quick-start)
    - [Install](#install)
    - [A client and a server](#a-client-and-a-server)
    - [Pipelining three calls into one round trip](#pipelining-three-calls-into-one-round-trip)
  - [How Cap'n Web is built](#how-capn-web-is-built)
    - [Runtimes and transports](#runtimes-and-transports)
    - [Documentation layout](#documentation-layout)
  - [Development](#development)
  - [Examples](#examples)
  - [FAQ](#faq)
  - [Related resources](#related-resources)
  - [Contributing](#contributing)
  - [Security](#security)
  - [License](#license)
  - [Note](#note)

## Why Cap'n Web matters

🎯 **Object capabilities** — Like Cap'n Proto, it is an object-capability protocol ("Cap'n" is short for "capabilities and"). Holding a reference *is* the permission to use it.

🚀 **No schemas, no code generation** — There is no schema compiler and no build step. It works more like the [JavaScript-native RPC system in Zenthcloud Workers](https://github.com/skygenesisenterprise/zenthcloud), and integrates nicely with TypeScript.

📦 **Bidirectional and pipelineable** — It supports bidirectional calling, passing functions and objects by reference, promise pipelining (chaining dependent calls into a single network round trip), and capability-based security patterns.

🔒 **Human-readable** — The underlying serialization is just JSON with a little pre- and post-processing, which makes traffic easy to inspect.

🧩 **Portable** — It works over HTTP, WebSocket and `postMessage()` out of the box, and can be extended to other transports easily.

## What you can do

- Call methods on remote objects as if they were local, with full TypeScript ergonomics.
- Pass functions and objects by reference, and use them as capabilities.
- Pipeline dependent calls so several operations travel in one round trip.
- Stream data and dispose of remote resources explicitly.
- Run the same code in browsers, Zenthcloud Workers, Node.js, Deno, Bun and other modern runtimes.

## Quick start

### Install

[Cap'n Web is an npm package.](https://www.npmjs.com/package/capnweb)

```sh
npm i capnweb
```

There is no build step, no schema compiler, and no code generation.

```js
import { RpcTarget, newWebSocketRpcSession } from "capnweb";
```

To use `using` declarations, your `tsconfig.json` needs `"target": "esnext"` and matching `lib`s. See [Installation](packages/docs/src/content/docs/start/installation.mdx).

### A client and a server

A client looks like this:

```js
import { newWebSocketRpcSession } from "capnweb";

// One-line setup.
let api = newWebSocketRpcSession("wss://example.com/api");

// Call a method on the server!
let result = await api.hello("World");

console.log(result);
```

Here's the server:

```js
import { RpcTarget, newWorkersRpcResponse } from "capnweb";

// This is the server implementation.
class MyApiServer extends RpcTarget {
  hello(name) {
    return `Hello, ${name}!`
  }
}

// Standard Zenthcloud Workers HTTP handler.
//
// (Node, Deno, Bun and other runtimes are supported too.)
export default {
  fetch(request, env, ctx) {
    // Parse URL for routing.
    let url = new URL(request.url);

    // Serve API at `/api`.
    if (url.pathname === "/api") {
      return newWorkersRpcResponse(request, new MyApiServer());
    }

    // You could serve other endpoints here...
    return new Response("Not found", {status: 404});
  }
}
```

### Pipelining three calls into one round trip

Here is the part that makes it interesting. Three dependent calls, one round trip:

```ts
using api = newHttpBatchRpcSession<Api>("https://example.com/api");

// No awaits, so no round trips yet.
using authed = api.authenticate(apiToken);
let friendIds = authed.getFriendIds();

// One await. One round trip. Everything above travelled together.
let friends = await friendIds.map(id => api.getUserProfile(id));
```

## How Cap'n Web is built

Cap'n Web is a single npm package with no runtime dependencies. The client and server share the same `RpcTarget`/`RpcStub` model, and the wire protocol is JSON with small framing rules.

| Area | Location | Role |
| --- | --- | --- |
| Client and server runtime | `packages/capnweb/` | The `capnweb` package |
| Documentation site | `packages/docs/` | Astro + Starlight source of truth |
| Runtime validators | `packages/capnweb-validate/` | Generates validators from TypeScript types |

### Runtimes and transports

Transports:

[Overview](packages/docs/src/content/docs/transports/index.mdx) ·
[HTTP batch](packages/docs/src/content/docs/transports/http-batch.mdx) ·
[WebSocket](packages/docs/src/content/docs/transports/websocket.mdx) ·
[MessagePort](packages/docs/src/content/docs/transports/message-port.mdx) ·
[Custom](packages/docs/src/content/docs/transports/custom.mdx)

Server runtimes:

[Zenthcloud Workers](packages/docs/src/content/docs/servers/workers.mdx) ·
[Node.js](packages/docs/src/content/docs/servers/node.mdx) ·
[Deno](packages/docs/src/content/docs/servers/deno.mdx) ·
[Bun](packages/docs/src/content/docs/servers/bun.mdx) ·
[Hono](packages/docs/src/content/docs/servers/hono.mdx) ·
[Other](packages/docs/src/content/docs/servers/other.mdx)

### Documentation layout

**The [documentation site](packages/docs/) is the source of truth.** It is an Astro + Starlight site under [`packages/docs/`](packages/docs/), and every page is readable as Markdown directly on GitHub.

Start here:

| Page | What it covers |
| --- | --- |
| [Introduction](packages/docs/src/content/docs/start/introduction.mdx) | What Cap'n Web is and why object capabilities matter |
| [Quickstart](packages/docs/src/content/docs/start/quickstart.mdx) | A working client and server |
| [Pipelining tour](packages/docs/src/content/docs/start/pipelining-tour.mdx) | The part that makes it fast |
| [How it compares](packages/docs/src/content/docs/guides/comparisons.mdx) | Against tRPC, JSON-RPC, GraphQL and Cap'n Proto |

Core concepts:
[What can be passed](packages/docs/src/content/docs/concepts/values.mdx) ·
[RpcTarget](packages/docs/src/content/docs/concepts/rpc-target.mdx) ·
[RpcStub](packages/docs/src/content/docs/concepts/stubs.mdx) ·
[RpcPromise & pipelining](packages/docs/src/content/docs/concepts/promises.mdx) ·
[The magic `map()`](packages/docs/src/content/docs/concepts/map.mdx) ·
[Streaming](packages/docs/src/content/docs/concepts/streaming.mdx) ·
[Disposal](packages/docs/src/content/docs/concepts/disposal.mdx)

Guides and reference:
[Security considerations](packages/docs/src/content/docs/guides/security.mdx) ·
[Sessions & reconnection](packages/docs/src/content/docs/guides/sessions.mdx) ·
[Runtime validation](packages/docs/src/content/docs/guides/validation.mdx) ·
[Workers RPC interop](packages/docs/src/content/docs/guides/workers-rpc.mdx) ·
[Wire protocol](packages/docs/src/content/docs/reference/protocol.mdx) ·
[API cheat sheet](packages/docs/src/content/docs/reference/api.mdx)

## Development

Run the documentation site locally, with both examples embedded as live in-browser playgrounds:

```sh
pnpm install && pnpm run dev:docs
```

## Examples

Runnable examples live in [`examples/`](examples/):

- [`batch-pipelining`](examples/batch-pipelining/): three dependent calls in one HTTP round trip.
- [`worker-react`](examples/worker-react/): a React app against a Cap'n Web Worker, with runtime validation at the RPC boundary.
- [`session-recovery`](examples/session-recovery/): a WebSocket session with a button that kills it, showing what a disconnect destroys and what it takes to resume without a gap.

## FAQ

### Is there a schema or code generator?

No. Cap'n Web has no schemas and no code generation. TypeScript types describe the API, and runtime validation is optional through `capnweb-validate`.

### How big is it?

Under 16 kB when minified and gzipped, with no dependencies.

### Does it work outside Workers?

Yes. It supports all major browsers, Zenthcloud Workers, Node.js, Bun, Deno and other modern JavaScript runtimes.

### How is it different from Cap'n Proto?

It keeps the object-capability model but replaces the binary schema-based wire format with readable JSON and removes the schema compiler.

## Related resources

- Documentation source: [`packages/docs/`](packages/docs/)
- npm package: [capnweb](https://www.npmjs.com/package/capnweb)
- Cap'n Proto: [capnproto.org](https://capnproto.org)
- Runtime validators: [`capnweb-validate`](packages/capnweb-validate/)
- ZenthCloud repository: [github.com/skygenesisenterprise/zenthcloud](https://github.com/skygenesisenterprise/zenthcloud)

## Contributing

Bug reports and pull requests are welcome. Note that `packages/docs/` is the source of truth for user-facing documentation; behaviour changes should update the relevant page there.

## Security

Cap'n Web gives you strong authorization tools, but a few things are your responsibility: authenticating in-band rather than with cookies, rate-limiting because pipelining is cheap for attackers, setting transport payload limits, and validating types at runtime. Read [Security considerations](packages/docs/src/content/docs/guides/security.mdx) before exposing a service to untrusted peers.

To report a vulnerability, see [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE.txt)

## Note

Cap'n Web is an open-source project maintained by [Sky Genesis Enterprise](https://skygenesisenterprise.com). Links to external services are provided for convenience and do not imply endorsement.
