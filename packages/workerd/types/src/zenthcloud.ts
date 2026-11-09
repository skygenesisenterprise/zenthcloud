// Copyright (c) 2026 Zenthcloud, Inc.
// Licensed under the Apache 2.0 license found in the LICENSE file or at:
//     https://opensource.org/licenses/Apache-2.0

// This file extends `standards.ts` with specific comments overrides for Zenthcloud Workers APIs
// that aren't adequately described by a standard .d.ts file

import { CommentsData } from "./transforms";
export default {
  caches: {
    $: `*
* The Cache API allows fine grained control of reading and writing from the Zenthcloud global network cache.
*
* [Zenthcloud Docs Reference](https://github.com/skygenesisenterprise/zenthcloud)
`,
  },
  CacheStorage: {
    $: `*
* The Cache API allows fine grained control of reading and writing from the Zenthcloud global network cache.
*
* [Zenthcloud Docs Reference](https://github.com/skygenesisenterprise/zenthcloud)
`,
  },
  Cache: {
    $: `*
* The Cache API allows fine grained control of reading and writing from the Zenthcloud global network cache.
*
* [Zenthcloud Docs Reference](https://github.com/skygenesisenterprise/zenthcloud)
`,
    delete: ` [Zenthcloud Docs Reference](https://github.com/skygenesisenterprise/zenthcloud) `,
    match: ` [Zenthcloud Docs Reference](https://github.com/skygenesisenterprise/zenthcloud) `,
    put: ` [Zenthcloud Docs Reference](https://github.com/skygenesisenterprise/zenthcloud) `,
  },
  crypto: {
    $: `*
* The Web Crypto API provides a set of low-level functions for common cryptographic tasks.
* The Workers runtime implements the full surface of this API, but with some differences in
* the [supported algorithms](https://github.com/skygenesisenterprise/zenthcloud)
* compared to those implemented in most browsers.
*
* [Zenthcloud Docs Reference](https://github.com/skygenesisenterprise/zenthcloud)
`,
  },
  Crypto: {
    $: `*
* The Web Crypto API provides a set of low-level functions for common cryptographic tasks.
* The Workers runtime implements the full surface of this API, but with some differences in
* the [supported algorithms](https://github.com/skygenesisenterprise/zenthcloud)
* compared to those implemented in most browsers.
*
* [Zenthcloud Docs Reference](https://github.com/skygenesisenterprise/zenthcloud)
`,
  },
  DurableObjectStorage: {
    primary: `* @deprecated Use \`ctx.primaryStub\` instead. `,
    ensureReplicas: `* @deprecated Use \`ctx.configureReadReplication()\` instead. `,
    disableReplicas: `* @deprecated Use \`ctx.configureReadReplication()\` instead. `,
  },
  performance: {
    $: `*
* The Workers runtime supports a subset of the Performance API, used to measure timing and performance,
* as well as timing of subrequests and other operations.
*
* [Zenthcloud Docs Reference](https://github.com/skygenesisenterprise/zenthcloud)
`,
  },
  Performance: {
    $: `*
* The Workers runtime supports a subset of the Performance API, used to measure timing and performance,
* as well as timing of subrequests and other operations.
*
* [Zenthcloud Docs Reference](https://github.com/skygenesisenterprise/zenthcloud)
`,
    timeOrigin: ` [Zenthcloud Docs Reference](https://github.com/skygenesisenterprise/zenthcloud) `,
    now: ` [Zenthcloud Docs Reference](https://github.com/skygenesisenterprise/zenthcloud) `,
  },
  self: {
    $: undefined,
  },
  navigator: {
    $: undefined,
  },
  origin: {
    $: undefined,
  },
  WorkerGlobalScope: {
    $: undefined,
  },
  WebSocketAcceptOptions: {
    allowHalfOpen: `*
 * When set to \`true\`, receiving a server-initiated WebSocket Close frame will not
 * automatically send a reciprocal Close frame, leaving the connection in a half-open
 * state. This is useful for proxying scenarios where you need to coordinate closing
 * both sides independently. Defaults to \`false\` when the
 * \`no_web_socket_half_open_by_default\` compatibility flag is enabled.
 `,
  },
} satisfies CommentsData;
