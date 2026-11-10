# ZenthCloud tRPC OpenAPI

[![npm](https://img.shields.io/npm/v/trpc-to-openapi.svg?style=flat&color=brightgreen)](https://www.npmjs.com/package/trpc-to-openapi)
[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](./LICENSE)
[![tRPC](https://img.shields.io/badge/tRPC-%5E11.1.0-2596BE)](https://trpc.io)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-all%20versions-6BA539)](https://swagger.io/specification/)

> [OpenAPI](https://swagger.io/specification/) support for [tRPC](https://trpc.io/).

**trpc-to-openapi** generates REST endpoints and an OpenAPI document from your tRPC procedures. It supports tRPC `^11.1.0`, all OpenAPI versions, and is designed for incremental adoption.

**Perfect for:** teams that already use tRPC and want REST or OpenAPI clients, incremental migrations from REST to tRPC, and projects that need an OpenAPI document without duplicating route definitions.

> **Note:** This project is a fork of a fork, with full credit to the original authors. The original author appears to have abandoned the project, so new features are planned here.

## Contents

- [ZenthCloud tRPC OpenAPI](#zenthcloud-trpc-openapi)
  - [Contents](#contents)
  - [Why ZenthCloud tRPC OpenAPI matters](#why-zenthcloud-trpc-openapi-matters)
  - [What you can do](#what-you-can-do)
    - [Customizations (Dokploy-style)](#customizations-dokploy-style)
  - [Quick start](#quick-start)
  - [Requirements](#requirements)
  - [How ZenthCloud tRPC OpenAPI is built](#how-zenthcloud-trpc-openapi-is-built)
    - [HTTP requests](#http-requests)
      - [Path parameters](#path-parameters)
      - [Query parameters](#query-parameters)
      - [Request body](#request-body)
      - [Custom headers](#custom-headers)
    - [HTTP responses](#http-responses)
    - [Authorization](#authorization)
  - [Examples](#examples)
    - [With Express](#with-express)
    - [With Next.js app router](#with-nextjs-app-router)
    - [With Next.js pages router](#with-nextjs-pages-router)
    - [With Fastify](#with-fastify)
  - [Types](#types)
    - [GenerateOpenApiDocumentOptions](#generateopenapidocumentoptions)
    - [OpenApiMeta](#openapimeta)
    - [CreateOpenApiNodeHttpHandlerOptions](#createopenapinodehttphandleroptions)
  - [Development](#development)
  - [FAQ](#faq)
  - [Related resources](#related-resources)
  - [Contributing](#contributing)
  - [Security](#security)
  - [License](#license)
  - [Note](#note)

## Why ZenthCloud tRPC OpenAPI matters

🎯 **One source of truth** — Define procedures once in tRPC and expose them as REST endpoints and OpenAPI operations.

🚀 **Incremental adoption** — Add OpenAPI metadata to the procedures you want to expose, without rewriting the router.

📦 **Framework adapters** — Supports Express, Next.js, Fastify, Nuxt and Node `http`.

🔒 **First-class authorization** — Protected endpoints use a security scheme, with `Bearer` authentication by default.

🧩 **Typed generation** — The generated document is aware of your Zod input and output schemas.

## What you can do

- Support tRPC `^11.1.0`.
- Expose easy REST endpoints for tRPC procedures.
- Adopt OpenAPI incrementally.
- Generate documents compatible with all OpenAPI versions.
- Use adapters for Express, Next.js, Fastify, Nuxt and Node `http`.
- Protect endpoints with OpenAPI security schemes.

### Customizations (Dokploy-style)

This fork adds the following behaviour, inspired by [Dokploy](https://github.com/Dokploy/dokploy):

1. **Optional input and output parameters are required by default** — In the generated OpenAPI document, optional input/output parameters are treated as required.
2. **`.meta` is optional for all procedures** — Procedures without `.meta({ openapi: ... })` are still exposed with default OpenAPI metadata (method from procedure type, path from procedure path, `enabled: true`, `protect: true`).
3. **Two flags on `meta.openapi`**:
   - **`override`** — When `true`, only the provided `openapi` object is used (no defaults merged).
   - **`additional`** — When `true`, defaults are applied first, then your `openapi` values are merged on top.

## Quick start

**1. Install `trpc-to-openapi`.**

```bash
# pnpm
pnpm add trpc-to-openapi
# npm
npm install trpc-to-openapi
# yarn
yarn add trpc-to-openapi
```

**2. Add `OpenApiMeta` to your tRPC instance.**

```typescript
import { initTRPC } from '@trpc/server';
import { OpenApiMeta } from 'trpc-to-openapi';

const t = initTRPC.meta<OpenApiMeta>().create(); /* 👈 */
```

**3. Enable `openapi` support for a procedure.**

```typescript
export const appRouter = t.router({
  sayHello: t.procedure
    .meta({ /* 👉 */ openapi: { method: 'GET', path: '/say-hello' } })
    .input(z.object({ name: z.string() }))
    .output(z.object({ greeting: z.string() }))
    .query(({ input }) => {
      return { greeting: `Hello ${input.name}!` };
    }),

  getStatus: t.procedure
    .meta({ /* 👉 */ openapi: { method: 'GET', path: '/status' } })
    .output(z.object({ status: z.string() }))
    .query(() => {
      return { status: 'healthy' };
    });
});
```

**4. Generate an OpenAPI document.**

```typescript
import { generateOpenApiDocument } from 'trpc-to-openapi';

import { appRouter } from '../appRouter';
import { UserSchema, ProductSchema } from '../schemas';

/* 👇 */
export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'tRPC OpenAPI',
  version: '1.0.0',
  baseUrl: 'http://localhost:3000',
  defs: {
    UserSchema,
    ProductSchema,
  },
});
```

**5. Add a `trpc-to-openapi` handler to your app.**

Adapters are currently available for [`Express`](http://expressjs.com/), [`Next.js`](https://nextjs.org/), [`Fastify`](https://www.fastify.io/), [`Nuxt`](https://nuxtjs.org/) and [`Node:HTTP`](https://nodejs.org/api/http.html).

[`Fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), [`Zenthcloud Workers`](https://github.com/skygenesisenterprise/zenthcloud) and more are planned; PRs are welcome. There is no support for AWS lambdas.

```typescript
import http from 'http';
import { createOpenApiHttpHandler } from 'trpc-to-openapi';

import { appRouter } from '../appRouter';

const server = http.createServer(createOpenApiHttpHandler({ router: appRouter })); /* 👈 */

server.listen(3000);
```

**6. Profit 🤑**

```typescript
// client.ts
const res = await fetch('http://localhost:3000/say-hello?name=OpenAPI', { method: 'GET' });
const body = await res.json(); /* { greeting: 'Hello OpenAPI!' } */

const statusRes = await fetch('http://localhost:3000/status', { method: 'GET' });
const statusBody = await statusRes.json(); /* { status: 'healthy' } */
```

## Requirements

Peer dependencies:

- [`tRPC`](https://github.com/trpc/trpc) Server v11 (`@trpc/server`) must be installed.
- [`Zod`](https://github.com/colinhacks/zod) v4 (`zod@^4.0.0`) must be installed.

For a procedure to support OpenAPI, the following _must_ be true:

- An `output` parser is present AND uses `Zod` validation.
- If an `input` parser is present, it must use `Zod` validation.
- Query `input` parsers (when present) extend `Object<{ [string]: String | Number | BigInt | Date }>` or `Void`.
- Mutation `input` parsers (when present) extend `Object<{ [string]: AnyType }>` or `Void`.
- `meta.openapi.method` is `GET`, `POST`, `PATCH`, `PUT` or `DELETE`.
- `meta.openapi.path` is a string starting with `/`.
- `meta.openapi.path` parameters (when present) exist in the `input` parser as `String | Number | BigInt | Date`.

Please note:

- Data [`transformers`](https://trpc.io/docs/data-transformers) (such as `superjson`) are ignored.
- Trailing slashes are ignored.
- Routing is case-insensitive.

## How ZenthCloud tRPC OpenAPI is built

The package generates an OpenAPI document from tRPC metadata and routes incoming HTTP requests back to the matching procedure through a framework adapter.

### HTTP requests

Procedures with a `GET`/`DELETE` method accept inputs via URL `query parameters`. Procedures with a `POST`/`PATCH`/`PUT` method accept inputs via the `request body` with an `application/json` content type.

#### Path parameters

A procedure can accept a set of inputs via URL path parameters. Add a path parameter to any OpenAPI procedure by using curly brackets around an input name as a path segment in the `meta.openapi.path` field.

#### Query parameters

Query and path parameter inputs are always accepted as a `string`. This library attempts to [coerce](https://github.com/colinhacks/zod#coercion-for-primitives) input values to the following primitive types out of the box: `number`, `boolean`, `bigint` and `date`. To support others such as `object`, `array`, etc., use [`z.preprocess()`](https://github.com/colinhacks/zod#preprocess).

```typescript
// Router
export const appRouter = t.router({
  sayHello: t.procedure
    .meta({ openapi: { method: 'GET', path: '/say-hello/{name}' /* 👈 */ } })
    .input(z.object({ name: z.string() /* 👈 */, greeting: z.string() }))
    .output(z.object({ greeting: z.string() }))
    .query(({ input }) => {
      return { greeting: `${input.greeting} ${input.name}!` };
    });
});

// Client
const res = await fetch('http://localhost:3000/say-hello/Lily?greeting=Hello' /* 👈 */, {
  method: 'GET',
});
const body = await res.json(); /* { greeting: 'Hello Lily!' } */
```

#### Request body

```typescript
// Router
export const appRouter = t.router({
  sayHello: t.procedure
    .meta({ openapi: { method: 'POST', path: '/say-hello/{name}' /* 👈 */ } })
    .input(z.object({ name: z.string() /* 👈 */, greeting: z.string() }))
    .output(z.object({ greeting: z.string() }))
    .mutation(({ input }) => {
      return { greeting: `${input.greeting} ${input.name}!` };
    });
});

// Client
const res = await fetch('http://localhost:3000/say-hello/Lily' /* 👈 */, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ greeting: 'Hello' }),
});
const body = await res.json(); /* { greeting: 'Hello Lily!' } */
```

#### Custom headers

Any custom headers can be specified in the `meta.openapi.requestHeaders` and `meta.openapi.responseHeaders` Zod object schema. These headers will not be validated. Consider using [Authorization](#authorization) for first-class OpenAPI auth/security support.

### HTTP responses

Status codes are `200` by default for successful requests. In the case of an error, the status code is derived from the thrown `TRPCError` or falls back to `500`.

You can modify the status code or headers for any response using the `responseMeta` function.

See [error status codes here](src/adapters/node-http/errors.ts).

### Authorization

To create protected endpoints, add `protect: true` to the `meta.openapi` object of each tRPC procedure. By default, you can then authenticate each request with the `createContext` function using the `Authorization` header with the `Bearer` scheme. If you wish to authenticate requests using different or additional methods (such as custom headers or cookies), this can be overwritten by specifying a `securitySchemes` object.

Explore a [complete example here](examples/with-nextjs/src/server/router.ts).

#### Server

```typescript
import { TRPCError, initTRPC } from '@trpc/server';
import { OpenApiMeta } from 'trpc-to-openapi';

type User = { id: string; name: string };

const users: User[] = [
  {
    id: 'usr_123',
    name: 'Lily',
  },
];

export type Context = { user: User | null };

export const createContext = async ({ req, res }): Promise<Context> => {
  let user: User | null = null;
  if (req.headers.authorization) {
    const userId = req.headers.authorization.split(' ')[1];
    user = users.find((_user) => _user.id === userId);
  }
  return { user };
};

const t = initTRPC.context<Context>().meta<OpenApiMeta>().create();

export const appRouter = t.router({
  sayHello: t.procedure
    .meta({ openapi: { method: 'GET', path: '/say-hello', protect: true /* 👈 */ } })
    .input(z.void()) // no input expected
    .output(z.object({ greeting: z.string() }))
    .query(({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ message: 'User not found', code: 'UNAUTHORIZED' });
      }
      return { greeting: `Hello ${ctx.user.name}!` };
    }),
});
```

#### Client

```typescript
const res = await fetch('http://localhost:3000/say-hello', {
  method: 'GET',
  headers: { Authorization: 'Bearer usr_123' } /* 👈 */,
});
const body = await res.json(); /* { greeting: 'Hello Lily!' } */
```

## Examples

_For advanced use-cases, please find examples in our [complete test suite](test)._

### With Express

Please see the [full example here](examples/with-express).

```typescript
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import express from 'express';
import { createOpenApiExpressMiddleware } from 'trpc-to-openapi';

import { appRouter } from '../appRouter';

const app = express();

app.use('/api/trpc', createExpressMiddleware({ router: appRouter }));
app.use('/api', createOpenApiExpressMiddleware({ router: appRouter })); /* 👈 */

app.listen(3000);
```

### With Next.js app router

Please see the [full example here](examples/with-nextjs-appdir).

```typescript
// src/app/[...trpc]/route.ts
import { appRouter } from '~/server/api/root';
import { createContext } from '~/server/api/trpc';
import { type NextRequest } from 'next/server';
import { createOpenApiFetchHandler } from 'trpc-to-openapi';

export const dynamic = 'force-dynamic';

const handler = (req: NextRequest) => {
  // Handle incoming OpenAPI requests
  return createOpenApiFetchHandler({
    endpoint: '/',
    router: appRouter,
    createContext: () => createContext(req),
    req,
  });
};

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
  handler as OPTIONS,
  handler as HEAD,
};
```

### With Next.js pages router

Please see the [full example here](examples/with-nextjs).

```typescript
// pages/api/[...trpc].ts
import { createOpenApiNextHandler } from 'trpc-to-openapi';

import { appRouter } from '../../server/appRouter';

export default createOpenApiNextHandler({ router: appRouter });
```

### With Fastify

Please see the [full example here](examples/with-fastify).

```typescript
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import Fastify from 'fastify';
import { fastifyTRPCOpenApiPlugin } from 'trpc-to-openapi';

import { appRouter } from './router';

const fastify = Fastify();

async function main() {
  await fastify.register(fastifyTRPCPlugin, { router: appRouter });
  await fastify.register(fastifyTRPCOpenApiPlugin, { router: appRouter }); /* 👈 */

  await fastify.listen({ port: 3000 });
}

main();
```

## Types

### GenerateOpenApiDocumentOptions

Please see the [full typings here](src/generator/index.ts).

| Property | Type | Description | Required |
| --- | --- | --- | --- |
| `title` | `string` | The title of the API. | `true` |
| `description` | `string` | A short description of the API. | `false` |
| `version` | `string` | The version of the OpenAPI document. | `true` |
| `baseUrl` | `string` | The base URL of the target server. | `true` |
| `docsUrl` | `string` | A URL to any external documentation. | `false` |
| `tags` | `string[]` | A list for ordering endpoint groups. | `false` |
| `securitySchemes` | `Record<string, SecuritySchemeObject>` | Defaults to `Authorization` header with `Bearer` scheme | `false` |
| `filter` | `(ctx: { metadata: { openapi: NonNullable<OpenApiMeta['openapi']> } & TMeta }) => boolean` | Optional filter function to include/exclude procedures from the generated OpenAPI document. | `false` |

### OpenApiMeta

Please see the [full typings here](src/types.ts).

| Property | Type | Description | Required | Default |
| --- | --- | --- | --- | --- |
| `enabled` | `boolean` | Exposes this procedure to `trpc-to-openapi` adapters and on the OpenAPI document. | `false` | `true` |
| `method` | `HttpMethod` | HTTP method this endpoint is exposed on. Value can be `GET`, `POST`, `PATCH`, `PUT` or `DELETE`. | `true` | `undefined` |
| `path` | `string` | Pathname this endpoint is exposed on. Value must start with `/`, specify path parameters using `{}`. | `true` | `undefined` |
| `protect` | `boolean` | Requires this endpoint to use a security scheme. | `false` | `true` |
| `summary` | `string` | A short summary of the endpoint included in the OpenAPI document. | `false` | `undefined` |
| `description` | `string` | A verbose description of the endpoint included in the OpenAPI document. | `false` | `undefined` |
| `tags` | `string[]` | A list of tags used for logical grouping of endpoints in the OpenAPI document. | `false` | `undefined` |
| `requestHeaders` | `AnyZodObject` | A Zod object schema describing any custom headers to add to the request for this endpoint in the OpenAPI document. | `false` | `undefined` |
| `responseHeaders` | `AnyZodObject` | A Zod object schema describing any custom headers to add to the response for this endpoint in the OpenAPI document. | `false` | `undefined` |
| `successDescription` | `string` | A string to use as the description for a successful response. | `false` | `'Successful response'` |
| `errorResponses` | `number[] \| { [key: number]: string }` | A list of error response codes or an object of response codes and their description to add to the responses for this endpoint. | `false` | `undefined` |
| `contentTypes` | `OpenApiContentType[]` | A set of content types specified as accepted in the OpenAPI document. | `false` | `['application/json']` |
| `deprecated` | `boolean` | Whether or not to mark an endpoint as deprecated | `false` | `false` |

### CreateOpenApiNodeHttpHandlerOptions

Please see the [full typings here](src/adapters/node-http/core.ts).

| Property | Type | Description | Required |
| --- | --- | --- | --- |
| `router` | `Router` | Your application tRPC router. | `true` |
| `createContext` | `Function` | Passes contextual (`ctx`) data to procedure resolvers. | `false` |
| `responseMeta` | `Function` | Returns any modifications to statusCode & headers. | `false` |
| `onError` | `Function` | Called if error occurs inside handler. | `false` |
| `maxBodySize` | `number` | Maximum request body size in bytes (default: 100kb). | `false` |

## Development

```bash
pnpm install
pnpm test
```

For advanced use-cases, find examples in the [complete test suite](test).

## FAQ

### Which tRPC and Zod versions are supported?

tRPC Server v11 and Zod v4 (`zod@^4.0.0`).

### Do procedures need `.meta`?

No. Procedures without `.meta({ openapi: ... })` are exposed with default OpenAPI metadata in this fork.

### How are query parameters typed?

Query and path inputs arrive as strings and are coerced to `number`, `boolean`, `bigint` or `date` out of the box. Use `z.preprocess()` for objects and arrays.

### Can I filter what appears in the document?

Yes. The `filter` option receives procedure metadata and returns whether to include the procedure.

## Related resources

- tRPC: [trpc.io](https://trpc.io/)
- OpenAPI specification: [swagger.io/specification](https://swagger.io/specification/)
- Zod: [github.com/colinhacks/zod](https://github.com/colinhacks/zod)
- Complete test suite: [`test/`](test)
- ZenthCloud repository: [github.com/skygenesisenterprise/zenthcloud](https://github.com/skygenesisenterprise/zenthcloud)

## Contributing

Contributions and suggestions are welcome. Read the repository [contribution guide](https://github.com/skygenesisenterprise/zenthcloud) before participating.

## Security

Do not report security vulnerabilities in public issues. Follow the private reporting instructions in the repository [`SECURITY.md`](https://github.com/skygenesisenterprise/zenthcloud).

## License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.

## Note

trpc-to-openapi is an open-source project maintained by [Sky Genesis Enterprise](https://skygenesisenterprise.com). Links to external services are provided for convenience and do not imply endorsement.
