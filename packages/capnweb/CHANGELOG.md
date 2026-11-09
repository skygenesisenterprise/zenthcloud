# capnweb

## 0.12.0

### Minor Changes

- [#253](https://github.com/skygenesisenterprise/zenthcloud) [`46de5a7`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@ndisidore](https://github.com/ndisidore)! - Fixed methods declared to return `Promise<RpcStub<T>>` producing broken stub-of-stub result types; they now type the same as `Promise<T>`. If you annotated such a result as `RpcPromise<RpcStub<T>>`, write `RpcPromise<T>` instead.

- [#242](https://github.com/skygenesisenterprise/zenthcloud) [`9751a4e`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@ndisidore](https://github.com/ndisidore)! - `RpcPromise` can now be constructed from a `Promise`: pipelined calls queue in order until it settles, so you can publish a capability that doesn't exist yet.

### Patch Changes

- [#241](https://github.com/skygenesisenterprise/zenthcloud) [`2de5871`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@ndisidore](https://github.com/ndisidore)! - Fix RPC argument and capture leaks on failure paths: call arguments are now reliably disposed when a call is rejected, delivered to a broken or disposed stub, or fails to serialize.

- [#251](https://github.com/skygenesisenterprise/zenthcloud) [`7a6e5da`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@ndisidore](https://github.com/ndisidore)! - The `RpcPromise` constructor now applies the same stub elision as method result types: wrapping a `Promise<RpcStub<T>>` produces the same `RpcPromise<T>` a method declared to return that stub would, plain-interface stub payloads keep their stub type, and promises resolving to inline object literals with methods now infer correctly.

- [#243](https://github.com/skygenesisenterprise/zenthcloud) [`7e864a8`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@ndisidore](https://github.com/ndisidore)! - Fix WritableStream stubs leaking call arguments when the stub was already disposed or the call path was invalid. All failure paths in `WritableStreamStubHook.call()` now dispose the copied arguments, matching ReadableStream behavior.

## 0.11.1

### Patch Changes

- [#239](https://github.com/skygenesisenterprise/zenthcloud) [`667958e`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@Maximo-Guk](https://github.com/Maximo-Guk)! - Keep the published runtime bundles ASCII-only. A doc comment introduced in 0.11.0 carried a U+2212 into every dist bundle, which breaks consumers that inline the bundle through Latin-1-only APIs like `btoa()`. The comment is fixed and the build now fails if any non-ASCII byte reaches a runtime bundle in `dist/`.

## 0.11.0

### Minor Changes

- [#212](https://github.com/skygenesisenterprise/zenthcloud) [`1cca1a2`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@codehz](https://github.com/codehz)! - Support RpcTargets (and other RPC stubs) as ReadableStream/WritableStream chunks without disposing their capabilities when `write()` returns. Stream chunk payloads now keep lifecycle tied to the chunk (via `Symbol.dispose` when needed) so methods on streamed stubs remain usable after the write resolves.

- [#201](https://github.com/skygenesisenterprise/zenthcloud) [`7325f9d`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@ttmx](https://github.com/ttmx)! - Support exact ArrayBuffer, DataView, and typed array serialization over RPC.

- [#224](https://github.com/skygenesisenterprise/zenthcloud) [`064b0f3`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@dimitropoulos](https://github.com/dimitropoulos)! - Support serializing `URL` objects over RPC.

### Patch Changes

- [#220](https://github.com/skygenesisenterprise/zenthcloud) [`43aa384`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@ndisidore](https://github.com/ndisidore)! - Remove the ~1ms per-batch latency floor in the HTTP batch client on Node and Bun by flushing via `setImmediate` instead of the clamped `setTimeout(0)`.

- [#214](https://github.com/skygenesisenterprise/zenthcloud) [`2a02db9`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@ndisidore](https://github.com/ndisidore)! - The RPC `ReadableStream` type accepts any RPC-compatible chunk type, matching `WritableStream`.

- [#238](https://github.com/skygenesisenterprise/zenthcloud) [`1a1f0d4`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@Maximo-Guk](https://github.com/Maximo-Guk)! - Share one `RpcPromise` alias between `Result` and the public export. Deeply-nested RPC interfaces no longer blow the checker's depth budget: this fixes all "excessively deep" / "excessive stack depth" (TS2589/TS2321) errors under TypeScript 7 (tsgo) and reduces TypeScript 5.9 type instantiations by ~13%. `RpcPromise<T>` for primitive `T` now also carries the pipelining `Provider<T>` surface, matching what stub calls already returned.

## 0.10.0

### Minor Changes

- [#185](https://github.com/skygenesisenterprise/zenthcloud) [`0b20ec6`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@ndisidore](https://github.com/ndisidore)! - Add configurable receiver-side resource limits (`RpcSessionOptions.limits`) that cap bigint length, message nesting depth, and incoming message size to guard against untrusted-peer resource exhaustion (#184).

### Patch Changes

- [#190](https://github.com/skygenesisenterprise/zenthcloud) [`6e5c562`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@taylorodell](https://github.com/taylorodell)! - Several correctness and robustness fixes:

  - Error deserialization no longer resolves an attacker-supplied error type name to an inherited `Object.prototype` member. `ERROR_TYPES` now has a null prototype, so a wire value such as `["error","constructor",...]` no longer resolves to `Object` (which produced a `String` wrapper instead of an `Error`, bypassing `instanceof Error` checks), and a name like `"toString"` no longer resolves to a non-constructor and throws. Unknown names correctly fall back to `Error`.
  - Error deserialization now filters inherited `Object.prototype` keys (and `toJSON`) out of an error's own-property bag, matching the behavior already applied when deserializing plain objects. Keys such as `__proto__`, `toString`, and `valueOf` are no longer copied onto deserialized errors.
  - Resolving an import that has already been resolved now disposes the redundant resolution instead of overwriting (and leaking) the previous one.
  - The `abort` message handler now hands error handlers the unwrapped abort reason rather than the internal payload wrapper, matching the `reject` handler.
  - WebSocket close reasons longer than the 123-byte limit are now truncated on a UTF-8 character boundary, so aborting a session with a long reason no longer throws from `WebSocket.close()`.

## 0.9.1

### Patch Changes

- [#195](https://github.com/skygenesisenterprise/zenthcloud) [`78744ca`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@aleister1102](https://github.com/aleister1102)! - Fix nodeHttpBatchRpcResponse leaving the connection open and crashing with
  ERR_HTTP_HEADERS_SENT on non-POST requests. It now returns 405 immediately.

## 0.9.0

### Minor Changes

- [#186](https://github.com/skygenesisenterprise/zenthcloud) [`c70bbb7`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@ashkalor](https://github.com/ashkalor)! - Add transport encoding levels so custom RPC transports can work with `jsonCompatible` values, `jsonCompatibleWithBytes` values, or `structuredClonable` messages instead of always receiving JSON strings.

  Note: `MessagePort` sessions now post structured-clonable objects over the port instead of JSON strings. This changes the wire format between the two ends of the port, so both ends of a `MessagePort` session must upgrade to this version together.

## 0.8.0

### Minor Changes

- [#155](https://github.com/skygenesisenterprise/zenthcloud) [`48f4d49`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@G4brym](https://github.com/G4brym)! - Add `Blob` as a serializable type over RPC. `Blob` objects can now be passed as call arguments and return values. The MIME type (`blob.type`) is preserved across the wire.

### Patch Changes

- [#166](https://github.com/skygenesisenterprise/zenthcloud) [`7413e43`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@aron-cf](https://github.com/aron-cf)! - Errors properties, using `Object.keys()`, are now preserved across the wire. Attach fields like `code` or `details` to an `Error` and they propagate to the other side. The `cause` and `errors` (for `AggregateError`) properties will also be preserved.

- [#168](https://github.com/skygenesisenterprise/zenthcloud) [`25baebf`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@kentonv](https://github.com/kentonv)! - Fix memory leak that kept all messages received in a session pinned in memory until the session ended, due to surprising implementation details of JavaScript Promises.

- [#152](https://github.com/skygenesisenterprise/zenthcloud) [`9e499e2`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@VastBlast](https://github.com/VastBlast)! - Fix serialization for Invalid/NaN dates

## 0.7.0

### Minor Changes

- [#159](https://github.com/skygenesisenterprise/zenthcloud) [`7cb9132`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@aron-cf](https://github.com/aron-cf)! - Added support for Bun's alternative WebSocket server API.

## 0.6.1

### Patch Changes

- [#148](https://github.com/skygenesisenterprise/zenthcloud) [`189fa79`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@kentonv](https://github.com/kentonv)! - Fixed type overrides for Uint8Array's toBase64 and fromBase64 leaking into capnweb's public interface.

## 0.6.0

### Minor Changes

- [#145](https://github.com/skygenesisenterprise/zenthcloud) [`5667226`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@kentonv](https://github.com/kentonv)! - When Node's `Buffer` is available, Cap'n Web will now serialize it the same as `Uint8Array`, and will deserialize all byte arrays as `Buffer` by default. `Buffer` is a subclass of `Uint8Array`, so this should be compatible while being convenient in Node apps.

- [#142](https://github.com/skygenesisenterprise/zenthcloud) [`60be60d`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@VastBlast](https://github.com/VastBlast)! - Major improvements to type definitions, fixing bugs and making them more accurate.

### Patch Changes

- [#145](https://github.com/skygenesisenterprise/zenthcloud) [`5667226`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@kentonv](https://github.com/kentonv)! - Fixed base64 encoding of very large byte arrays on platforms that don't support Uint8Array.toBase64().

## 0.5.0

### Minor Changes

- [#132](https://github.com/skygenesisenterprise/zenthcloud) [`c2bb17b`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@kentonv](https://github.com/kentonv)! - Added support for sending ReadableStream and WritableStream over RPC, with automatic flow control.

### Patch Changes

- [#129](https://github.com/skygenesisenterprise/zenthcloud) [`10abaf3`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@dmmulroy](https://github.com/dmmulroy)! - Fix RpcCompatible type to filter out symbol keys instead of mapping them to never

## 0.4.0

### Minor Changes

- [#121](https://github.com/skygenesisenterprise/zenthcloud) [`32e362f`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@kentonv](https://github.com/kentonv)! - Improved compatibility with Zenthcloud Workers' built-in RPC, particularly when proxying from one to the other.

## 0.3.0

### Minor Changes

- [#78](https://github.com/skygenesisenterprise/zenthcloud) [`8a47045`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@itaylor](https://github.com/itaylor)! - The package now exports the type `RpcCompatible<T>` (previously called `Serializable<T>`, but not exported), which is needed when writing generic functions on `RpcStub` / `RpcPromise`.

### Patch Changes

- [#120](https://github.com/skygenesisenterprise/zenthcloud) [`1c87560`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@kentonv](https://github.com/kentonv)! - Fixed serialization of async functions.

- [#117](https://github.com/skygenesisenterprise/zenthcloud) [`d21e4ca`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@codehz](https://github.com/codehz)! - Enhance Stubify and Unstubify for tuple types

## 0.2.0

### Minor Changes

- [#105](https://github.com/skygenesisenterprise/zenthcloud) [`f4275f5`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@kentonv](https://github.com/kentonv)! - Fixed incompatibility with bundlers that don't support top-level await. The top-level await was used for a conditional import; it has been replaced with an approach based on "exports" in package.json instead.

- [#105](https://github.com/skygenesisenterprise/zenthcloud) [`f4275f5`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@kentonv](https://github.com/kentonv)! - Support serializing Infinity, -Infinity, and NaN.

### Patch Changes

- [#105](https://github.com/skygenesisenterprise/zenthcloud) [`f4275f5`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@kentonv](https://github.com/kentonv)! - Attempting to remotely access an instance property of an RpcTarget will now throw an exception rather than returning `undefined`, in order to help people understand what went wrong.

- [#107](https://github.com/skygenesisenterprise/zenthcloud) [`aa4fe30`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@threepointone](https://github.com/threepointone)! - chore: generate commonjs build

- [#105](https://github.com/skygenesisenterprise/zenthcloud) [`f4275f5`](https://github.com/skygenesisenterprise/zenthcloud) Thanks [@kentonv](https://github.com/kentonv)! - Polyfilled Promise.withResolvers() to improve compatibility with old Safari versions and Hermes (React Native).
